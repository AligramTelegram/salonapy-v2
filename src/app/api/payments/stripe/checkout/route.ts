import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { createCheckoutSession, isStripeConfigured } from '@/lib/stripe'
import { getPlanPrice } from '@/lib/utils/pricing'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const CheckoutSchema = z.object({
  plan: z.enum(['BASLANGIC', 'PROFESYONEL', 'ISLETME']),
  tenantSlug: z.string().min(1),
})

// POST /api/payments/stripe/checkout
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
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
    select: { id: true, name: true, email: true, country: true },
  })
  if (!tenant) return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 404 })

  const { amount, currency } = getPlanPrice(plan, tenant.country)

  // Stripe only handles EUR / USD — TR customers should use İyzico
  if (currency === 'TRY') {
    return NextResponse.json(
      { error: 'Türkiye için İyzico ödeme yöntemini kullanın' },
      { status: 400 }
    )
  }

  let result: { url: string; sessionId: string; mockMode: boolean }
  try {
    result = await createCheckoutSession({
      tenantId: tenant.id,
      tenantSlug,
      plan,
      email: tenant.email ?? '',
      currency: currency as 'EUR' | 'USD',
      amount,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe checkout oluşturulamadı'
    console.error('[Stripe checkout]', err)
    return NextResponse.json({ error: message }, { status: 502 })
  }

  return NextResponse.json({
    url: result.url,
    sessionId: result.sessionId,
    mockMode: !isStripeConfigured,
  })
}
