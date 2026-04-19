import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPayment, parseOrderId, verifyWebhookHash } from '@/lib/shopinext'

async function processPayment(
  req: NextRequest,
  paymentId: string,
  merchantOrderId: string | null,
  skipHashCheck = false,
  receivedHash?: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin

  // Hash doğrulaması (mock ve test ortamında atla)
  if (!skipHashCheck && receivedHash) {
    if (!verifyWebhookHash(paymentId, receivedHash)) {
      console.error('[Shopinext Callback] Hash doğrulama başarısız')
      return new Response('INVALID_HASH', { status: 400 })
    }
  }

  // Ödeme detaylarını Shopinext'ten doğrula
  const detail = await getPayment(paymentId)
  console.log('[Shopinext Callback] Payment detail:', detail)

  if (detail.status !== 'success' || detail.paymentStatus !== 'successful') {
    const reason = detail.errorMessage ?? detail.paymentStatus ?? 'Ödeme başarısız'
    console.error('[Shopinext Callback] Ödeme başarısız:', reason)
    return NextResponse.redirect(
      `${baseUrl}/odeme-basarisiz?reason=${encodeURIComponent(reason)}`
    )
  }

  // merchant_order_id'den tenantId ve plan'ı çöz
  const rawOrderId = detail.merchantOrderId ?? merchantOrderId
  const parsed = rawOrderId ? parseOrderId(rawOrderId) : null

  if (!parsed) {
    console.error('[Shopinext Callback] Order ID parse edilemedi:', rawOrderId)
    return NextResponse.redirect(`${baseUrl}/odeme-basarisiz?reason=İşlem+verisi+bulunamadı`)
  }

  const { tenantId, plan } = parsed

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { id: true, slug: true },
  })

  if (!tenant) {
    console.error('[Shopinext Callback] Tenant bulunamadı:', tenantId)
    return NextResponse.redirect(`${baseUrl}/odeme-basarisiz?reason=İşletme+bulunamadı`)
  }

  const now = new Date()
  const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const amount = detail.amount ?? 0
  const currency = detail.currency ?? 'TRY'

  try {
    await prisma.$transaction([
      prisma.tenant.update({
        where: { id: tenantId },
        data: {
          plan: plan as 'BASLANGIC' | 'PROFESYONEL' | 'ISLETME',
          planStartedAt: now,
          planEndsAt: endDate,
          smsUsed: 0,
          smsResetAt: now,
        },
      }),
      prisma.subscription.upsert({
        where: { tenantId },
        create: {
          tenantId,
          plan: plan as 'BASLANGIC' | 'PROFESYONEL' | 'ISLETME',
          amount,
          currency,
          paymentProvider: 'shopinext',
          paymentId,
          status: 'ACTIVE',
          startDate: now,
          endDate,
          autoRenew: true,
        },
        update: {
          plan: plan as 'BASLANGIC' | 'PROFESYONEL' | 'ISLETME',
          amount,
          currency,
          paymentProvider: 'shopinext',
          paymentId,
          status: 'ACTIVE',
          startDate: now,
          endDate,
          autoRenew: true,
        },
      }),
    ])

    console.log('[Shopinext Callback] DB güncellendi:', tenantId, plan)
  } catch (err) {
    console.error('[Shopinext Callback] DB hatası:', err)
    return NextResponse.redirect(`${baseUrl}/odeme-basarisiz?reason=Veritabanı+hatası`)
  }

  return NextResponse.redirect(`${baseUrl}/b/${tenant.slug}?upgrade_success=true`)
}

// POST — Shopinext webhook (callback_url)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { payment_id, status, hash } = body

    console.log('[Shopinext Callback POST] payload:', { payment_id, status })

    if (!payment_id) {
      return new Response('MISSING_PAYMENT_ID', { status: 400 })
    }

    // Webhook sadece bildirim amaçlı — "OK" dön, işlemi arka planda yap
    // status === 'successful' olanları işle
    if (status !== 'successful') {
      console.log('[Shopinext Callback POST] İşlem başarısız, atlanıyor:', status)
      return new Response('OK')
    }

    await processPayment(req, payment_id, null, false, hash)
    return new Response('OK')
  } catch (err) {
    console.error('[Shopinext Callback POST] Error:', err)
    return new Response('OK') // Shopinext tekrar denemesini engellemek için 200 dön
  }
}

// GET — success_url redirect (kullanıcı ödeme sonrası yönlendirme)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const paymentId = searchParams.get('payment_id')
  const orderId = searchParams.get('oid')
  const mock = searchParams.get('mock') === '1'

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin

  if (!paymentId) {
    return NextResponse.redirect(`${baseUrl}/odeme-basarisiz?reason=Ödeme+ID+bulunamadı`)
  }

  return processPayment(req, paymentId, orderId ? decodeURIComponent(orderId) : null, mock)
}
