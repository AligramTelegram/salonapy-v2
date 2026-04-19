import crypto from 'crypto'

const BASE_URL = process.env.SHOPINEXT_ENV === 'test'
  ? 'https://apidev.shopinext.com'
  : 'https://api.shopinext.com'

const CLIENT_ID = process.env.SHOPINEXT_CLIENT_ID ?? ''
const CLIENT_SECRET = process.env.SHOPINEXT_CLIENT_SECRET ?? ''

export const isShopinextConfigured = !!(CLIENT_ID && CLIENT_SECRET)

// In-memory token cache (instance lifetime)
let cachedToken: { access_token: string; expires_at: number } | null = null

async function getAccessToken(): Promise<string> {
  const now = Date.now()

  if (cachedToken && cachedToken.expires_at > now + 60_000) {
    return cachedToken.access_token
  }

  const res = await fetch(`${BASE_URL}/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Domain': getDomain() },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
  })

  const data = await res.json()
  console.log('[Shopinext] authenticate raw response:', JSON.stringify(data))

  // status: 1 veya "1" veya true olabilir
  const isOk = data.status == 1 || data.status === true || data.access_token
  if (!res.ok || !isOk) {
    throw new Error(`Shopinext auth failed: ${JSON.stringify(data)}`)
  }

  // access_token_validity: "2025-04-17 00:00:00"
  const expiresAt = data.access_token_validity
    ? new Date(data.access_token_validity).getTime()
    : now + 55 * 60 * 1000 // fallback: 55 min

  cachedToken = { access_token: data.access_token, expires_at: expiresAt }
  return data.access_token
}

function getDomain(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? 'https://hemensalon.com'
  try {
    return new URL(url).hostname
  } catch {
    return 'hemensalon.com'
  }
}

// conversationId formatı: "tenantId|plan|timestamp"
export function buildOrderId(tenantId: string, plan: string): string {
  return `${tenantId}|${plan}|${Date.now()}`
}

export function parseOrderId(orderId: string): { tenantId: string; plan: string } | null {
  const parts = orderId.split('|')
  if (parts.length < 2) return null
  return { tenantId: parts[0], plan: parts[1] }
}

export type ShopinextPaymentResult = {
  status: 'success' | 'failure'
  paymentId?: string
  redirectUrl?: string
  errorMessage?: string
}

export type ShopinextPaymentDetail = {
  status: 'success' | 'failure'
  paymentStatus?: string // 'successful' | 'unsuccessful' | 'processing' | etc.
  amount?: number
  currency?: string
  merchantOrderId?: string
  errorMessage?: string
}

export async function createPayment(params: {
  tenantId: string
  tenantName: string
  email: string
  phone: string
  plan: string
  amount: number
  currency: string
  ownerName?: string | null
  ownerEmail?: string | null
  ownerIdNumber?: string | null
  ownerAddress?: string | null
  ownerCity?: string | null
  taxNumber?: string | null
  taxOffice?: string | null
}): Promise<ShopinextPaymentResult> {
  const merchantOrderId = buildOrderId(params.tenantId, params.plan)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://hemensalon.com'
  const callbackUrl = `${appUrl}/api/payments/shopinext/callback`
  const successUrl = `${appUrl}/api/payments/shopinext/callback?status=success&oid=${encodeURIComponent(merchantOrderId)}`
  const failUrl = `${appUrl}/odeme-basarisiz?reason=Ödeme+başarısız`

  // Mock mod
  if (!isShopinextConfigured) {
    const mockPaymentId = `MOCK-${Date.now()}`
    const mockUrl = `${callbackUrl}?mock=1&payment_id=${mockPaymentId}&oid=${encodeURIComponent(merchantOrderId)}&status=successful`
    console.log(`[SHOPINEXT MOCK] Payment: ${params.plan} ${params.amount} ${params.currency}`)
    return { status: 'success', paymentId: mockPaymentId, redirectUrl: mockUrl }
  }

  const fullName = params.ownerName?.trim() || params.tenantName.trim()
  const nameParts = fullName.split(/\s+/)
  const firstname = nameParts[0] || 'İşletme'
  const surname = nameParts.slice(1).join(' ') || 'Sahibi'
  const email = params.ownerEmail?.trim() || params.email || `tenant-${params.tenantId}@hemensalon.com`

  const body = {
    firstname,
    surname,
    email,
    amount: params.amount,
    currency: params.currency,
    max_installment: 1,
    merchant_order_id: merchantOrderId,
    identity_number: params.ownerIdNumber?.trim() || '11111111111',
    company: params.tenantName,
    tax_office: params.taxOffice?.trim() || '',
    tax_number: params.taxNumber?.trim() || '',
    is_digital: 1,
    order_products: [
      {
        name: `Hemensalon ${params.plan} Plan (Aylık)`,
        quantity: 1,
        price: params.amount,
        total: params.amount,
      },
    ],
    billing_info: {
      billing_firstname: firstname,
      billing_surname: surname,
      billing_address: params.ownerAddress?.trim() || 'Türkiye',
      billing_city: params.ownerCity?.trim() || 'İstanbul',
      billing_country: 'TR',
      billing_phone: params.phone || '',
      billing_email: email,
    },
    shipping_info: {
      shipping_firstname: firstname,
      shipping_surname: surname,
      shipping_address: params.ownerAddress?.trim() || 'Türkiye',
      shipping_city: params.ownerCity?.trim() || 'İstanbul',
      shipping_country: 'TR',
      shipping_phone: params.phone || '',
      shipping_email: email,
    },
    success_url: successUrl,
    fail_url: failUrl,
    callback_url: callbackUrl,
    language: 'TR',
  }

  try {
    const token = await getAccessToken()
    const res = await fetch(`${BASE_URL}/createPayment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Domain': getDomain(),
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    console.log('[Shopinext] createPayment response:', data?.status, data?.payment_id)

    console.log('[Shopinext] createPayment raw response:', JSON.stringify(data))
    const payOk = data.status == 1 || data.status === true || data.redirect_url
    if (!res.ok || !payOk || !data.redirect_url) {
      return { status: 'failure', errorMessage: data.message ?? JSON.stringify(data) }
    }

    return { status: 'success', paymentId: data.payment_id, redirectUrl: data.redirect_url }
  } catch (err) {
    console.error('[Shopinext] createPayment error:', err)
    return { status: 'failure', errorMessage: (err as Error).message }
  }
}

export async function getPayment(paymentId: string): Promise<ShopinextPaymentDetail> {
  if (!isShopinextConfigured) {
    return { status: 'success', paymentStatus: 'successful' }
  }

  try {
    const token = await getAccessToken()
    const res = await fetch(`${BASE_URL}/getPayment?payment_id=${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Domain': getDomain(),
      },
    })

    const data = await res.json()
    console.log('[Shopinext] getPayment response:', data)

    console.log('[Shopinext] getPayment raw response:', JSON.stringify(data))
    const detailOk = data.status == 1 || data.status === true
    if (!res.ok || !detailOk) {
      return { status: 'failure', errorMessage: data.message ?? JSON.stringify(data) }
    }

    return {
      status: 'success',
      paymentStatus: data.payment_status ?? data.status_text,
      amount: data.amount,
      currency: data.currency,
      merchantOrderId: data.merchant_order_id,
    }
  } catch (err) {
    console.error('[Shopinext] getPayment error:', err)
    return { status: 'failure', errorMessage: (err as Error).message }
  }
}

// Webhook hash doğrulaması: sha256(client_id + client_secret + payment_id)
export function verifyWebhookHash(paymentId: string, receivedHash: string): boolean {
  const expected = crypto
    .createHash('sha256')
    .update(CLIENT_ID + CLIENT_SECRET + paymentId)
    .digest('hex')
  return expected === receivedHash
}
