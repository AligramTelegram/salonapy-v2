// eslint-disable-next-line @typescript-eslint/no-require-imports
const IyzipayLib = require('iyzipay')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iyzipay: any = process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY
  ? new IyzipayLib({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: process.env.IYZICO_BASE_URL || 'https://sandbox.iyzipay.com',
    })
  : null

export type IyzicoCheckoutResult = {
  status: 'success' | 'failure'
  paymentPageUrl?: string
  token?: string
  checkoutFormContent?: string
  errorMessage?: string
  errorCode?: string
}

export type IyzicoPaymentResult = {
  status: 'success' | 'failure'
  paymentStatus?: string   // 'SUCCESS' | 'FAILURE'
  price?: string
  paidPrice?: string
  currency?: string
  conversationId?: string  // contains tenantId|plan|timestamp
  paymentId?: string
  errorMessage?: string
  errorCode?: string
}

/**
 * conversationId format: "${tenantId}|${plan}|${timestamp}"
 * Parse it back with parseConversationId()
 */
export function buildConversationId(tenantId: string, plan: string): string {
  return `${tenantId}|${plan}|${Date.now()}`
}

export function parseConversationId(conversationId: string): { tenantId: string; plan: string } | null {
  const parts = conversationId.split('|')
  if (parts.length < 2) return null
  return { tenantId: parts[0], plan: parts[1] }
}

/**
 * Create İyzico Checkout Form.
 * Returns paymentPageUrl to redirect the user to.
 * Falls back to mock mode if IYZICO_API_KEY is not set.
 */
export async function createCheckoutForm(params: {
  tenantId: string
  tenantName: string
  email: string
  phone: string
  plan: string
  amount: number
  currency: string
  // İşletme sahibi bilgileri (fatura / alıcı)
  ownerName?: string | null
  ownerPhone?: string | null
  ownerEmail?: string | null
  ownerIdNumber?: string | null
  ownerAddress?: string | null
  ownerCity?: string | null
}): Promise<IyzicoCheckoutResult> {
  const conversationId = buildConversationId(params.tenantId, params.plan)
  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/iyzico/callback`

  // Mock mode
  if (!iyzipay) {
    const mockToken = `mock-${Date.now()}`
    const mockUrl = `${callbackUrl}?mock=1&cid=${encodeURIComponent(conversationId)}&token=${mockToken}`
    console.log(`[IYZICO MOCK] Checkout: ${params.plan} ${params.amount} ${params.currency}`)
    return { status: 'success', token: mockToken, paymentPageUrl: mockUrl }
  }

  const amountStr = params.amount.toFixed(2)

  // Alıcı: owner bilgileri varsa öncelikli kullan, yoksa işletme bilgileriyle fallback
  const buyerFullName = params.ownerName?.trim() || params.tenantName.trim()
  const nameParts = buyerFullName.split(/\s+/)
  const buyerName = nameParts[0] || 'İşletme'
  const buyerSurname = nameParts.slice(1).join(' ') || 'Sahibi'

  const buyerEmail = params.ownerEmail?.trim() || params.email || `tenant-${params.tenantId}@hemensalon.com`
  const rawPhone = (params.ownerPhone || params.phone || '').replace(/\D/g, '')
  const formattedPhone = rawPhone.startsWith('0') ? '+90' + rawPhone.slice(1) : rawPhone ? '+' + rawPhone : '+905551234567'

  const identityNumber = params.ownerIdNumber?.trim() || '74300864791'
  const billingAddress = params.ownerAddress?.trim() || 'Türkiye'
  const billingCity = params.ownerCity?.trim() || 'Istanbul'
  const contactName = buyerFullName || params.tenantName

  const request = {
    locale: 'tr',
    conversationId,
    price: amountStr,
    paidPrice: amountStr,
    currency: params.currency,
    basketId: conversationId,
    paymentGroup: 'SUBSCRIPTION',
    callbackUrl,
    buyer: {
      id: params.tenantId,
      name: buyerName,
      surname: buyerSurname,
      email: buyerEmail,
      identityNumber,
      registrationAddress: billingAddress,
      ip: '85.34.78.112',
      city: billingCity,
      country: 'Turkey',
      gsmNumber: formattedPhone,
    },
    shippingAddress: {
      contactName,
      city: billingCity,
      country: 'Turkey',
      address: billingAddress,
      zipCode: '34000',
    },
    billingAddress: {
      contactName,
      city: billingCity,
      country: 'Turkey',
      address: billingAddress,
      zipCode: '34000',
    },
    basketItems: [
      {
        id: `HEMENSALON_${params.plan}`,
        name: `Hemensalon ${params.plan} Plan (Aylık)`,
        category1: 'Yazılım',
        itemType: 'VIRTUAL',
        price: amountStr,
      },
    ],
  }

  return new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iyzipay.checkoutFormInitialize.create(request, (err: Error, result: any) => {
      if (err) {
        console.error('[Iyzico] Checkout form error:', err)
        resolve({ status: 'failure', errorMessage: err.message })
        return
      }
      console.log('[Iyzico] Checkout result:', result?.status)
      resolve(result as IyzicoCheckoutResult)
    })
  })
}

/**
 * Retrieve payment result after callback.
 * Falls back to mock success if not configured.
 */
export async function retrieveCheckoutForm(token: string): Promise<IyzicoPaymentResult> {
  if (!iyzipay) {
    return { status: 'success', paymentStatus: 'SUCCESS' }
  }

  return new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iyzipay.checkoutForm.retrieve({ locale: 'tr', token }, (err: Error, result: any) => {
      if (err) {
        console.error('[Iyzico] Retrieve error:', err)
        resolve({ status: 'failure', errorMessage: err.message })
        return
      }
      resolve(result as IyzicoPaymentResult)
    })
  })
}

/**
 * Cancel subscription via İyzico (for recurring subscriptions).
 * For manual monthly subscriptions, only DB update is needed.
 */
export async function cancelIyzicoSubscription(
  subscriptionReferenceCode: string
): Promise<{ success: boolean; error?: string }> {
  if (!iyzipay) {
    console.log(`[IYZICO MOCK] Abonelik iptal: ${subscriptionReferenceCode}`)
    return { success: true }
  }

  return new Promise((resolve) => {
    iyzipay.subscriptionCancel.update(
      { subscriptionReferenceCode },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err: Error, result: any) => {
        if (err || result?.status !== 'success') {
          resolve({ success: false, error: err?.message ?? result?.errorMessage })
          return
        }
        resolve({ success: true })
      }
    )
  })
}

export const isIyzicoConfigured = !!(process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY)
