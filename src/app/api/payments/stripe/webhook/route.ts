import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { constructWebhookEvent } from '@/lib/stripe'
import { addDays } from 'date-fns'
import type Stripe from 'stripe'
import { sendPaymentSuccessEmail, sendPaymentFailedEmail } from '@/lib/resend'

export const dynamic = 'force-dynamic'

// POST /api/payments/stripe/webhook
export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature') ?? ''

  const event = constructWebhookEvent(rawBody, signature)

  // If webhook secret is not configured, just ack (dev/test convenience)
  if (!event) {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.warn('[Stripe webhook] STRIPE_WEBHOOK_SECRET not set — skipping verification')
      return NextResponse.json({ received: true })
    }
    return NextResponse.json({ error: 'Geçersiz imza' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoiceSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoiceFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`[Stripe webhook] Unhandled event: ${event.type}`)
    }
  } catch (err) {
    console.error(`[Stripe webhook] Error handling ${event.type}:`, err)
    return NextResponse.json({ error: 'Webhook işleme hatası' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const tenantId = session.metadata?.tenantId
  const plan = session.metadata?.plan
  if (!tenantId || !plan) {
    console.warn('[Stripe] checkout.session.completed missing metadata')
    return
  }

  const customerId =
    typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null
  const subscriptionId =
    typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id ?? null

  const now = new Date()
  const endDate = addDays(now, 30)

  // Resolve plan enum safely
  const validPlans = ['BASLANGIC', 'PROFESYONEL', 'ISLETME'] as const
  type PlanEnum = (typeof validPlans)[number]
  const planEnum = validPlans.includes(plan as PlanEnum) ? (plan as PlanEnum) : 'BASLANGIC'

  // Determine currency from subscription amount
  const amount = (session.amount_total ?? 0) / 100
  const currency = (session.currency?.toUpperCase() ?? 'EUR') as string

  await prisma.$transaction([
    // Update tenant plan
    prisma.tenant.update({
      where: { id: tenantId },
      data: {
        plan: planEnum,
        planStartedAt: now,
        planEndsAt: endDate,
      },
    }),
    // Upsert subscription
    prisma.subscription.upsert({
      where: { tenantId },
      create: {
        tenantId,
        plan: planEnum,
        amount,
        currency,
        paymentProvider: 'stripe',
        paymentId: customerId ?? subscriptionId,   // customerId for portal lookups
        status: 'ACTIVE',
        startDate: now,
        endDate,
        autoRenew: true,
      },
      update: {
        plan: planEnum,
        amount,
        currency,
        paymentProvider: 'stripe',
        paymentId: customerId ?? subscriptionId,
        status: 'ACTIVE',
        startDate: now,
        endDate,
        autoRenew: true,
      },
    }),
  ])

  console.log(`[Stripe] Subscription activated: tenant=${tenantId} plan=${plan}`)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const tenantId = subscription.metadata?.tenantId
  if (!tenantId) {
    console.warn('[Stripe] subscription.updated missing tenantId metadata')
    return
  }

  const stripeStatus = subscription.status // 'active' | 'past_due' | 'canceled' | ...
  const status =
    stripeStatus === 'active'
      ? 'ACTIVE'
      : stripeStatus === 'canceled'
        ? 'CANCELLED'
        : stripeStatus === 'past_due'
          ? 'PAST_DUE'
          : 'ACTIVE'

  // In Stripe SDK v20, current_period_end is on SubscriptionItem
  const itemPeriodEnd = subscription.items?.data?.[0]?.current_period_end
  const periodEnd = itemPeriodEnd
    ? new Date(itemPeriodEnd * 1000)
    : addDays(new Date(), 30)

  await prisma.subscription.updateMany({
    where: { tenantId },
    data: {
      status,
      endDate: periodEnd,
      autoRenew: !subscription.cancel_at_period_end,
    },
  })

  // Also sync tenant planEndsAt
  await prisma.tenant.update({
    where: { id: tenantId },
    data: { planEndsAt: periodEnd },
  })

  console.log(`[Stripe] Subscription updated: tenant=${tenantId} status=${status}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const tenantId = subscription.metadata?.tenantId
  if (!tenantId) {
    console.warn('[Stripe] subscription.deleted missing tenantId metadata')
    return
  }

  await prisma.subscription.updateMany({
    where: { tenantId },
    data: { status: 'CANCELLED', autoRenew: false },
  })

  console.log(`[Stripe] Subscription cancelled: tenant=${tenantId}`)
}

async function handleInvoiceSucceeded(invoice: Stripe.Invoice) {
  // Stripe SDK v20: subscription moved to invoice.parent.subscription_details.subscription
  const parentSub = invoice.parent?.subscription_details?.subscription
  if (!parentSub) return

  const subscriptionId = typeof parentSub === 'string' ? parentSub : parentSub.id
  const customerId =
    typeof invoice.customer === 'string'
      ? invoice.customer
      : (invoice.customer as Stripe.Customer | null)?.id ?? ''

  // Find tenant via subscription (paymentId stores customerId or subscriptionId)
  const sub = await prisma.subscription.findFirst({
    where: {
      paymentProvider: 'stripe',
      paymentId: customerId,
    },
    select: { tenantId: true, plan: true },
  })
  if (!sub) return

  const amount = (invoice.amount_paid ?? 0) / 100
  const currency = invoice.currency?.toUpperCase() ?? 'EUR'

  await prisma.transaction.create({
    data: {
      tenantId: sub.tenantId,
      type: 'GIDER',
      amount,
      category: 'Abonelik',
      description: `Hemensalon ${sub.plan} plan - aylık abonelik`,
      date: new Date((invoice.created ?? Date.now() / 1000) * 1000),
    },
  })

  // Extend subscription end date on renewal
  if (invoice.billing_reason === 'subscription_cycle' && invoice.lines?.data?.[0]?.period?.end) {
    const newEnd = new Date(invoice.lines.data[0].period.end * 1000)
    await prisma.subscription.updateMany({
      where: { tenantId: sub.tenantId, paymentProvider: 'stripe' },
      data: { endDate: newEnd, status: 'ACTIVE' },
    })
  }

  console.log(`[Stripe] Invoice paid: tenant=${sub.tenantId} amount=${amount} ${currency}`)

  // Send payment success email to owner
  const tenantData = await prisma.tenant.findUnique({
    where: { id: sub.tenantId },
    select: {
      name: true,
      slug: true,
      email: true,
      users: { where: { role: 'OWNER' }, select: { name: true, email: true }, take: 1 },
    },
  })
  const owner = tenantData?.users[0]
  const ownerEmail = tenantData?.email ?? owner?.email
  if (ownerEmail && tenantData) {
    sendPaymentSuccessEmail({
      to: ownerEmail,
      ownerName: owner?.name ?? 'Müşterimiz',
      tenantName: tenantData.name,
      plan: sub.plan,
      amount,
      currency,
      slug: tenantData.slug,
    }).catch((err) => console.error('[Stripe webhook] Payment success email failed:', err))
  }
}

async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  console.warn('[Stripe] Invoice payment failed:', {
    invoiceId: invoice.id,
    customer: invoice.customer,
    amount: invoice.amount_due,
    currency: invoice.currency,
  })

  // Find tenant by Stripe customer ID
  const customerId =
    typeof invoice.customer === 'string' ? invoice.customer : (invoice.customer as Stripe.Customer)?.id ?? ''
  if (!customerId) return

  const sub = await prisma.subscription.findFirst({
    where: { paymentProvider: 'stripe', paymentId: customerId },
    select: { tenantId: true, plan: true },
  })
  if (!sub) return

  const tenantData = await prisma.tenant.findUnique({
    where: { id: sub.tenantId },
    select: {
      name: true,
      slug: true,
      email: true,
      users: { where: { role: 'OWNER' }, select: { name: true, email: true }, take: 1 },
    },
  })
  const owner = tenantData?.users[0]
  const ownerEmail = tenantData?.email ?? owner?.email
  if (ownerEmail && tenantData) {
    sendPaymentFailedEmail({
      to: ownerEmail,
      ownerName: owner?.name ?? 'Müşterimiz',
      tenantName: tenantData.name,
      reason: invoice.last_finalization_error?.message,
      slug: tenantData.slug,
    }).catch((err) => console.error('[Stripe webhook] Payment failed email error:', err))
  }
}
