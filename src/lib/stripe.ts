import Stripe from 'stripe'

// ─── Stripe client (lazy singleton) ───────────────────────────────────────────

let _stripe: Stripe | null = null

function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-02-25.clover',
    })
  }
  return _stripe
}

export const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY

// ─── Price ID resolution ───────────────────────────────────────────────────────

const PRICE_ENV_MAP: Record<string, Record<string, string>> = {
  BASLANGIC:   { EUR: 'STRIPE_PRICE_BASIC_EUR',    USD: 'STRIPE_PRICE_BASIC_USD' },
  PROFESYONEL: { EUR: 'STRIPE_PRICE_PRO_EUR',      USD: 'STRIPE_PRICE_PRO_USD' },
  ISLETME:     { EUR: 'STRIPE_PRICE_BUSINESS_EUR', USD: 'STRIPE_PRICE_BUSINESS_USD' },
}

export function getStripePriceId(plan: string, currency: 'EUR' | 'USD'): string | null {
  const envKey = PRICE_ENV_MAP[plan]?.[currency]
  if (!envKey) return null
  return process.env[envKey] ?? null
}

// ─── Types ─────────────────────────────────────────────────────────────────────

export type StripeCheckoutParams = {
  tenantId: string
  tenantSlug: string
  plan: string
  email: string
  currency: 'EUR' | 'USD'
  amount: number // for reference only, actual price comes from Stripe price
}

export type StripeCheckoutResult = {
  url: string
  sessionId: string
  mockMode: boolean
}

// ─── Create Checkout Session ───────────────────────────────────────────────────

export async function createCheckoutSession(
  params: StripeCheckoutParams
): Promise<StripeCheckoutResult> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const successUrl = `${appUrl}/odeme-basarili?plan=${params.plan}&slug=${params.tenantSlug}&provider=stripe`
  const cancelUrl = `${appUrl}/fiyatlar`

  // Mock mode
  const stripe = getStripe()
  if (!stripe) {
    const mockSessionId = `mock_cs_${Date.now()}`
    const mockUrl = `${appUrl}/odeme-basarili?plan=${params.plan}&slug=${params.tenantSlug}&provider=stripe&mock=1`
    console.log(
      `[STRIPE MOCK] Checkout: ${params.plan} ${params.amount} ${params.currency}`
    )
    return { url: mockUrl, sessionId: mockSessionId, mockMode: true }
  }

  const priceId = getStripePriceId(params.plan, params.currency)
  if (!priceId) {
    throw new Error(
      `Stripe price ID not configured for plan=${params.plan} currency=${params.currency}. ` +
        `Set STRIPE_PRICE_${params.plan === 'BASLANGIC' ? 'BASIC' : params.plan === 'PROFESYONEL' ? 'PRO' : 'BUSINESS'}_${params.currency} env var.`
    )
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: params.email || undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      tenantId: params.tenantId,
      plan: params.plan,
    },
    subscription_data: {
      metadata: {
        tenantId: params.tenantId,
        plan: params.plan,
      },
    },
    allow_promotion_codes: true,
  })

  return { url: session.url!, sessionId: session.id, mockMode: false }
}

// ─── Create Customer Portal Session ───────────────────────────────────────────

export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<{ url: string }> {
  const stripe = getStripe()
  if (!stripe) {
    console.log(`[STRIPE MOCK] Portal session for customer ${customerId}`)
    return { url: returnUrl }
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
  return { url: session.url }
}

// ─── Webhook event construction ────────────────────────────────────────────────

export function constructWebhookEvent(
  rawBody: string,
  signature: string
): Stripe.Event | null {
  const stripe = getStripe()
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return null

  try {
    return stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('[Stripe] Webhook signature verification failed:', err)
    return null
  }
}

// ─── Retrieve subscription ────────────────────────────────────────────────────

export async function retrieveStripeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  const stripe = getStripe()
  if (!stripe) return null
  try {
    return await stripe.subscriptions.retrieve(subscriptionId)
  } catch {
    return null
  }
}
