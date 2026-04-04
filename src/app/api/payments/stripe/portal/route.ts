import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { createPortalSession, isStripeConfigured } from '@/lib/stripe'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const PortalSchema = z.object({
  tenantSlug: z.string().min(1),
})

// POST /api/payments/stripe/portal
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

  const parsed = PortalSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { tenantSlug } = parsed.data

  const tenant = await prisma.tenant.findFirst({
    where: { slug: tenantSlug, id: dbUser.tenantId },
    select: { id: true },
  })
  if (!tenant) return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 404 })

  // Retrieve Stripe customer ID stored in subscription.paymentId
  const subscription = await prisma.subscription.findUnique({
    where: { tenantId: tenant.id },
    select: { paymentId: true, paymentProvider: true },
  })

  if (!subscription || subscription.paymentProvider !== 'stripe' || !subscription.paymentId) {
    return NextResponse.json(
      { error: 'Stripe aboneliği bulunamadı. Türkiye müşterileri için İyzico kullanılır.' },
      { status: 400 }
    )
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const returnUrl = `${appUrl}/b/${tenantSlug}/ayarlar`

  try {
    const { url } = await createPortalSession(subscription.paymentId, returnUrl)
    return NextResponse.json({ url, mockMode: !isStripeConfigured })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Portal oturumu oluşturulamadı'
    console.error('[Stripe portal]', err)
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
