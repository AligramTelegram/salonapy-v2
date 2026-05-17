import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addDays } from 'date-fns'

export const dynamic = 'force-dynamic'

const PRODUCT_TO_PLAN: Record<string, 'BASLANGIC' | 'PROFESYONEL' | 'ISLETME'> = {
  hemensalon_starter_monthly:      'BASLANGIC',
  hemensalon_professional_monthly: 'PROFESYONEL',
  hemensalon_business_monthly:     'ISLETME',
}

const ACTIVE_EVENT_TYPES = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'PRODUCT_CHANGE',
  'UNCANCELLATION',
])

const EXPIRE_EVENT_TYPES = new Set([
  'EXPIRATION',
  'CANCELLATION',
])

export async function POST(request: NextRequest) {
  // RevenueCat webhook secret doğrulama (zorunlu)
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET
  const authHeader = request.headers.get('authorization')
  if (!secret || authHeader !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const event = body?.event
  if (!event) return NextResponse.json({ ok: true })

  const {
    type,
    app_user_id,       // Supabase user ID
    product_id,
    expiration_at_ms,
  } = event

  if (!app_user_id || !product_id) return NextResponse.json({ ok: true })

  // Kullanıcıyı bul (supabaseId üzerinden)
  const user = await prisma.user.findFirst({
    where: { supabaseId: app_user_id },
    select: { tenantId: true },
  })
  if (!user) {
    console.warn(`[RC webhook] User not found: ${app_user_id}`)
    return NextResponse.json({ ok: true })
  }

  const plan = PRODUCT_TO_PLAN[product_id]
  if (!plan) {
    console.warn(`[RC webhook] Unknown product: ${product_id}`)
    return NextResponse.json({ ok: true })
  }

  if (ACTIVE_EVENT_TYPES.has(type)) {
    const planEndsAt = expiration_at_ms
      ? new Date(expiration_at_ms)
      : addDays(new Date(), 30)

    await prisma.$transaction([
      prisma.tenant.update({
        where: { id: user.tenantId },
        data: {
          plan,
          planEndsAt,
          isActive: true,
        },
      }),
      prisma.subscription.upsert({
        where: { tenantId: user.tenantId },
        create: {
          tenantId: user.tenantId,
          plan,
          amount: 0,
          currency: 'TRY',
          paymentProvider: 'revenuecat',
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: planEndsAt,
          autoRenew: true,
        },
        update: {
          plan,
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: planEndsAt,
          autoRenew: true,
        },
      }),
    ])

    console.log(`[RC webhook] ${type} → tenant ${user.tenantId} plan=${plan} endsAt=${planEndsAt.toISOString()}`)
  } else if (EXPIRE_EVENT_TYPES.has(type)) {
    await prisma.subscription.updateMany({
      where: { tenantId: user.tenantId },
      data: { status: 'CANCELLED', autoRenew: false },
    })
    console.log(`[RC webhook] ${type} → tenant ${user.tenantId} subscription cancelled`)
  }

  return NextResponse.json({ ok: true })
}
