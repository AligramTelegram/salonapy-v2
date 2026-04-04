import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { retrieveCheckoutForm, parseConversationId } from '@/lib/iyzico'
import { getPlanPricesMulti } from '@/lib/plans'
import { addDays } from 'date-fns'
import { sendPaymentSuccessEmail } from '@/lib/resend'

export const dynamic = 'force-dynamic'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// İyzico POSTs the token here after payment.
// Also handles GET for mock mode.
export async function POST(request: NextRequest) {
  return handleCallback(request)
}

export async function GET(request: NextRequest) {
  return handleCallback(request)
}

async function handleCallback(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl
  const isMock = searchParams.get('mock') === '1'

  let token: string | null = null
  let conversationId: string | null = null

  if (isMock) {
    // Mock mode: params in query string
    token = searchParams.get('token')
    conversationId = searchParams.get('cid') ?? ''
  } else {
    // Real mode: token in POST form body
    try {
      const text = await request.text()
      const params = new URLSearchParams(text)
      token = params.get('token') ?? searchParams.get('token')
    } catch {
      token = searchParams.get('token')
    }
  }

  if (!token) {
    return NextResponse.redirect(`${APP_URL}/odeme-basarisiz?reason=no-token`)
  }

  // Retrieve payment result from İyzico (or mock)
  let paymentResult: Awaited<ReturnType<typeof retrieveCheckoutForm>>
  if (isMock) {
    paymentResult = { status: 'success', paymentStatus: 'SUCCESS', conversationId: conversationId ?? '' }
  } else {
    paymentResult = await retrieveCheckoutForm(token)
  }

  if (paymentResult.status !== 'success' || paymentResult.paymentStatus !== 'SUCCESS') {
    console.error('[Callback] Payment failed:', paymentResult.errorMessage)
    return NextResponse.redirect(
      `${APP_URL}/odeme-basarisiz?reason=${encodeURIComponent(paymentResult.errorMessage ?? 'payment-failed')}`
    )
  }

  // Parse tenant + plan from conversationId
  const cid = paymentResult.conversationId ?? conversationId ?? ''
  const parsed = parseConversationId(cid)
  if (!parsed) {
    console.error('[Callback] Could not parse conversationId:', cid)
    return NextResponse.redirect(`${APP_URL}/odeme-basarisiz?reason=invalid-conversation`)
  }

  const { tenantId, plan } = parsed
  const planKey = plan as 'BASLANGIC' | 'PROFESYONEL' | 'ISLETME'

  // Find tenant
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { id: true, slug: true, name: true, email: true, country: true, currency: true, subscription: { select: { id: true } } },
  })
  if (!tenant) {
    console.error('[Callback] Tenant not found:', tenantId)
    return NextResponse.redirect(`${APP_URL}/odeme-basarisiz?reason=tenant-not-found`)
  }

  const planPrices = await getPlanPricesMulti()
  const amount = planPrices[planKey]?.[tenant.currency] ?? planPrices[planKey]?.TRY ?? 450
  const now = new Date()
  const endDate = addDays(now, 30)

  // Update tenant + subscription in a transaction
  await prisma.$transaction([
    // Update tenant plan
    prisma.tenant.update({
      where: { id: tenantId },
      data: {
        plan: planKey,
        planStartedAt: now,
        planEndsAt: endDate,
      },
    }),
    // Upsert subscription
    tenant.subscription?.id
      ? prisma.subscription.update({
          where: { id: tenant.subscription.id },
          data: {
            plan: planKey,
            amount,
            currency: tenant.currency,
            paymentProvider: 'iyzico',
            paymentId: paymentResult.paymentId,
            status: 'ACTIVE',
            startDate: now,
            endDate,
            autoRenew: true,
            updatedAt: now,
          },
        })
      : prisma.subscription.create({
          data: {
            tenantId,
            plan: planKey,
            amount,
            currency: tenant.currency,
            paymentProvider: 'iyzico',
            paymentId: paymentResult.paymentId,
            status: 'ACTIVE',
            startDate: now,
            endDate,
            autoRenew: true,
          },
        }),
    // Record subscription expense
    prisma.transaction.create({
      data: {
        tenantId,
        type: 'GIDER',
        amount,
        category: 'Abonelik',
        description: `Salonapy ${planKey} plan - aylık abonelik`,
        date: now,
      },
    }),
  ])

  console.log(`[Callback] ✓ Abonelik aktif: tenant=${tenantId} plan=${planKey}`)

  // Send payment success email to owner (fire-and-forget)
  const ownerUser = await prisma.user.findFirst({
    where: { tenantId, role: 'OWNER' },
    select: { name: true, email: true },
  })
  const ownerEmail = tenant.email ?? ownerUser?.email
  if (ownerEmail) {
    sendPaymentSuccessEmail({
      to: ownerEmail,
      ownerName: ownerUser?.name ?? 'Müşterimiz',
      tenantName: tenant.name ?? '',
      plan: planKey,
      amount,
      currency: tenant.currency,
      slug: tenant.slug,
    }).catch((err) => console.error('[iyzico callback] Payment success email failed:', err))
  }

  return NextResponse.redirect(
    `${APP_URL}/odeme-basarili?plan=${planKey}&slug=${tenant.slug}`
  )
}
