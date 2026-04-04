import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseConversationId } from '@/lib/iyzico'

export const dynamic = 'force-dynamic'

// POST /api/payments/iyzico/webhook — İyzico event notifications
export async function POST(request: NextRequest) {
  // Optional secret key verification — set IYZICO_WEBHOOK_SECRET in env
  const webhookSecret = process.env.IYZICO_WEBHOOK_SECRET
  if (webhookSecret) {
    const incoming = request.headers.get('x-iyzico-signature') ?? request.headers.get('authorization')
    if (!incoming || incoming !== webhookSecret) {
      console.warn('[IyzicoWebhook] Unauthorized webhook attempt')
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
    }
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    // Try URL-encoded body
    const text = await request.text().catch(() => '')
    const params = new URLSearchParams(text)
    body = Object.fromEntries(params.entries())
  }

  const payload = body as Record<string, unknown>
  const eventType = payload.eventType as string
  const status = payload.status as string

  console.log(`[IyzicoWebhook] Event: ${eventType} | Status: ${status}`)

  // Handle subscription events
  if (eventType === 'SUBSCRIPTION_RENEWED' && status === 'SUCCESS') {
    const subscriptionReferenceCode = payload.subscriptionReferenceCode as string
    const conversationId = (payload.conversationId ?? payload.itemId) as string

    if (conversationId) {
      const parsed = parseConversationId(conversationId)
      if (parsed) {
        const { tenantId, plan } = parsed
        const now = new Date()
        try {
          await prisma.$transaction([
            prisma.subscription.updateMany({
              where: { tenantId },
              data: { status: 'ACTIVE', updatedAt: now },
            }),
            prisma.tenant.update({
              where: { id: tenantId },
              data: { planEndsAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) },
            }),
          ])
          console.log(`[IyzicoWebhook] Renewed: ${tenantId} ${plan}`)
        } catch (err) {
          console.error('[IyzicoWebhook] Renew update error:', err)
        }
        void subscriptionReferenceCode
      }
    }
  }

  if (eventType === 'SUBSCRIPTION_CANCELED' || eventType === 'SUBSCRIPTION_CANCELLED') {
    const conversationId = payload.conversationId as string
    if (conversationId) {
      const parsed = parseConversationId(conversationId)
      if (parsed) {
        await prisma.subscription.updateMany({
          where: { tenantId: parsed.tenantId },
          data: { status: 'CANCELLED', autoRenew: false },
        }).catch(console.error)
        console.log(`[IyzicoWebhook] Cancelled: ${parsed.tenantId}`)
      }
    }
  }

  // İyzico requires 200 OK
  return NextResponse.json({ received: true })
}
