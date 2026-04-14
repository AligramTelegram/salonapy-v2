import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutForm, isIyzicoConfigured } from '@/lib/iyzico'

export const dynamic = 'force-dynamic'

const SMS_PACKS = [
  { amount: 100,  price: 120 },
  { amount: 250,  price: 300 },
  { amount: 500,  price: 600 },
  { amount: 1000, price: 1200 },
]

// POST /api/payments/sms-checkout
// Body: { amount: number, tenantSlug: string }
export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const { amount, tenantSlug } = body as { amount: number; tenantSlug: string }

  const pack = SMS_PACKS.find((p) => p.amount === amount)
  if (!pack) return NextResponse.json({ error: 'Geçersiz paket' }, { status: 400 })

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: {
      tenant: {
        select: {
          id: true, slug: true, name: true, email: true, phone: true,
          ownerName: true, ownerPhone: true, ownerEmail: true,
          ownerIdNumber: true, ownerAddress: true, ownerCity: true,
        },
      },
    },
  })
  if (!dbUser || dbUser.tenant.slug !== tenantSlug) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const { tenant } = dbUser

  // conversationId: "tenantId|SMS_100|timestamp" formatı
  const result = await createCheckoutForm({
    tenantId: tenant.id,
    tenantName: tenant.name,
    email: tenant.email ?? '',
    phone: tenant.phone ?? '',
    plan: `SMS_${pack.amount}`,
    amount: pack.price,
    currency: 'TRY',
    ownerName: tenant.ownerName,
    ownerPhone: tenant.ownerPhone,
    ownerEmail: tenant.ownerEmail,
    ownerIdNumber: tenant.ownerIdNumber,
    ownerAddress: tenant.ownerAddress,
    ownerCity: tenant.ownerCity,
  })

  if (result.status !== 'success' || !result.paymentPageUrl) {
    console.error('[SMS Checkout] İyzico error:', result.errorMessage)
    return NextResponse.json(
      { error: result.errorMessage ?? 'Ödeme sayfası oluşturulamadı' },
      { status: 502 }
    )
  }

  return NextResponse.json({
    paymentPageUrl: result.paymentPageUrl,
    token: result.token,
    mockMode: !isIyzicoConfigured,
  })
}
