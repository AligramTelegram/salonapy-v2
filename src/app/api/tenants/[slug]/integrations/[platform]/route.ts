import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const ALLOWED_PLATFORMS = ['WHATSAPP', 'INSTAGRAM']

async function verifyOwner(slug: string, supabaseId: string) {
  const user = await prisma.user.findFirst({
    where: { supabaseId, tenant: { slug } },
    select: { tenantId: true },
  })
  return user?.tenantId ?? null
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string; platform: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const platform = params.platform.toUpperCase()
  if (!ALLOWED_PLATFORMS.includes(platform)) {
    return NextResponse.json({ error: 'Geçersiz platform' }, { status: 400 })
  }

  const tenantId = await verifyOwner(params.slug, user.id)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const integration = await prisma.integration.findUnique({
    where: { tenantId_platform: { tenantId, platform } },
  })

  // Token'ı maskele
  if (integration?.credentials) {
    const creds = integration.credentials as Record<string, string>
    const masked: Record<string, string> = {}
    for (const [k, v] of Object.entries(creds)) {
      masked[k] = v ? v.slice(0, 6) + '••••••••••••' : ''
    }
    return NextResponse.json({ ...integration, credentials: masked })
  }

  return NextResponse.json(integration ?? { status: 'NOT_CONNECTED' })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string; platform: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const platform = params.platform.toUpperCase()
  if (!ALLOWED_PLATFORMS.includes(platform)) {
    return NextResponse.json({ error: 'Geçersiz platform' }, { status: 400 })
  }

  const tenantId = await verifyOwner(params.slug, user.id)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const body = await req.json()

  // Mevcut credentials ile merge et (boş değerleri overwrite etme)
  const existing = await prisma.integration.findUnique({
    where: { tenantId_platform: { tenantId, platform } },
  })
  const existingCreds = (existing?.credentials as Record<string, string>) ?? {}
  const newCreds = (body.credentials as Record<string, string>) ?? {}
  const mergedCreds: Record<string, string> = { ...existingCreds }
  for (const [k, v] of Object.entries(newCreds)) {
    if (v && !v.includes('••••')) mergedCreds[k] = v  // maskeli değeri kaydetme
  }

  const phoneNumberId = body.phoneNumberId ?? existing?.phoneNumberId ?? null
  const instagramAccountId = body.instagramAccountId ?? existing?.instagramAccountId ?? null
  const status = Object.keys(mergedCreds).length > 0 ? 'ACTIVE' : 'PENDING'
  console.log(`[Integration PATCH] platform=${platform} tenantId=${tenantId} instagramAccountId=${instagramAccountId} credKeys=${Object.keys(mergedCreds).join(',')}`)

  const integration = await prisma.integration.upsert({
    where: { tenantId_platform: { tenantId, platform } },
    create: {
      tenantId,
      platform,
      credentials: mergedCreds,
      phoneNumberId,
      instagramAccountId,
      status,
    },
    update: {
      credentials: mergedCreds,
      phoneNumberId,
      instagramAccountId,
      status,
      errorMessage: null,
    },
  })

  // Credentials kaydedilince AI'ı otomatik aktif et
  if (Object.keys(mergedCreds).length > 0) {
    if (platform === 'INSTAGRAM') {
      await prisma.tenant.update({ where: { id: tenantId }, data: { instagramAIEnabled: true } })
    } else if (platform === 'WHATSAPP') {
      await prisma.tenant.update({ where: { id: tenantId }, data: { whatsappAIEnabled: true } })
    }
  }

  return NextResponse.json({ ...integration, credentials: {} })
}
