import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { createPayment, isShopinextConfigured } from '@/lib/shopinext'
import { getPlanPrice } from '@/lib/utils/pricing'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const CheckoutSchema = z.object({
  plan: z.enum(['BASLANGIC', 'PROFESYONEL', 'ISLETME']),
  tenantSlug: z.string().min(1),
})

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { tenantId: true },
  })
  if (!dbUser) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 403 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const parsed = CheckoutSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { plan, tenantSlug } = parsed.data

  const tenant = await prisma.tenant.findFirst({
    where: { slug: tenantSlug, id: dbUser.tenantId },
    select: {
      id: true, name: true, email: true, phone: true, country: true,
      ownerName: true, ownerPhone: true, ownerEmail: true,
      ownerIdNumber: true, ownerAddress: true, ownerCity: true,
      taxNumber: true, taxOffice: true,
    },
  })
  if (!tenant) return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 404 })

  const { amount, currency } = getPlanPrice(plan)

  const result = await createPayment({
    tenantId: tenant.id,
    tenantName: tenant.name,
    email: tenant.email ?? '',
    phone: tenant.phone ?? '',
    plan,
    amount,
    currency,
    ownerName: tenant.ownerName,
    ownerEmail: tenant.ownerEmail,
    ownerIdNumber: tenant.ownerIdNumber,
    ownerAddress: tenant.ownerAddress,
    ownerCity: tenant.ownerCity,
    taxNumber: tenant.taxNumber,
    taxOffice: tenant.taxOffice,
  })

  if (result.status !== 'success' || !result.redirectUrl) {
    console.error('[Shopinext Checkout] Error:', result.errorMessage)
    return NextResponse.json(
      { error: result.errorMessage ?? 'Ödeme sayfası oluşturulamadı' },
      { status: 502 }
    )
  }

  return NextResponse.json({
    paymentPageUrl: result.redirectUrl,
    paymentId: result.paymentId,
    mockMode: !isShopinextConfigured,
  })
}
