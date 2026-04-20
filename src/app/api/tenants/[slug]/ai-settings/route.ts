import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function verifyOwner(slug: string, supabaseId: string) {
  const user = await prisma.user.findFirst({
    where: { supabaseId, tenant: { slug } },
    select: { tenantId: true },
  })
  return user?.tenantId ?? null
}

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const tenantId = await verifyOwner(params.slug, user.id)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const settings = await prisma.aISettings.findUnique({ where: { tenantId } })
  return NextResponse.json(settings ?? {
    enabled: true,
    whatsappAutoReply: true,
    whatsappAutoBook: false,
    whatsappPrompt: '',
    instagramAutoReply: true,
    instagramAutoBook: false,
    instagramPrompt: '',
    workingHoursStart: '09:00',
    workingHoursEnd: '18:00',
    outOfHoursMessage: '',
  })
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const tenantId = await verifyOwner(params.slug, user.id)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const body = await req.json()
  const allowed = [
    'enabled', 'whatsappAutoReply', 'whatsappAutoBook', 'whatsappPrompt',
    'instagramAutoReply', 'instagramAutoBook', 'instagramPrompt',
    'workingHoursStart', 'workingHoursEnd', 'outOfHoursMessage',
  ]
  const data = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)))

  const settings = await prisma.aISettings.upsert({
    where: { tenantId },
    create: { tenantId, ...data },
    update: data,
  })
  return NextResponse.json(settings)
}
