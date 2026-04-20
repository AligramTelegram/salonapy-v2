import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { createCheckoutForm } from '@/lib/iyzico'
import { AI_PACKAGES, type AIPackageKey } from '@/lib/ai-packages'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { tenantId: true },
  })
  if (!dbUser) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 403 })

  let body: { packageKey?: string; tenantSlug?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const { packageKey, tenantSlug } = body
  if (!packageKey || !tenantSlug) {
    return NextResponse.json({ error: 'packageKey ve tenantSlug zorunlu' }, { status: 422 })
  }

  const pkg = AI_PACKAGES[packageKey as AIPackageKey]
  if (!pkg) {
    return NextResponse.json({ error: 'Geçersiz paket' }, { status: 400 })
  }

  const tenant = await prisma.tenant.findFirst({
    where: { slug: tenantSlug, id: dbUser.tenantId },
    select: {
      id: true, name: true, email: true, phone: true,
      ownerName: true, ownerPhone: true, ownerEmail: true,
      ownerIdNumber: true, ownerAddress: true, ownerCity: true,
    },
  })
  if (!tenant) return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 404 })

  const forwarded = req.headers.get('x-forwarded-for')
  const buyerIp = forwarded ? forwarded.split(',')[0].trim() : '85.34.78.112'

  const result = await createCheckoutForm({
    tenantId: tenant.id,
    tenantName: tenant.name,
    email: tenant.email ?? '',
    phone: tenant.phone ?? '',
    plan: pkg.id,   // AI_WHATSAPP | AI_INSTAGRAM | AI_COMBO
    amount: pkg.price,
    currency: 'TRY',
    ownerName: tenant.ownerName,
    ownerPhone: tenant.ownerPhone,
    ownerEmail: tenant.ownerEmail,
    ownerIdNumber: tenant.ownerIdNumber,
    ownerAddress: tenant.ownerAddress,
    ownerCity: tenant.ownerCity,
    buyerIp,
  })

  if (result.status !== 'success' || !result.paymentPageUrl) {
    console.error('[AI Purchase] İyzico error:', result.errorMessage)
    return NextResponse.json(
      { error: result.errorMessage ?? 'Ödeme sayfası oluşturulamadı' },
      { status: 502 }
    )
  }

  return NextResponse.json({ paymentPageUrl: result.paymentPageUrl })
}
