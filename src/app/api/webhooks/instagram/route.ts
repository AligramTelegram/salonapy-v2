import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendInstagramDM } from '@/lib/ai/platform-sender'
import { handleIncomingMessage } from '@/lib/ai/conversation-helper'

export const dynamic = 'force-dynamic'

// Meta webhook doğrulama
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const setting = await prisma.siteSetting.findUnique({ where: { key: 'instagram_verify_token' } })
  const verifyToken = setting?.value || process.env.INSTAGRAM_VERIFY_TOKEN

  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

export async function POST(req: NextRequest) {
  let body: InstagramWebhookBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  processWebhook(body).catch(err =>
    console.error('[IG Webhook] Processing error:', err)
  )

  return NextResponse.json({ status: 'ok' })
}

async function processWebhook(body: InstagramWebhookBody) {
  for (const entry of body.entry ?? []) {
    for (const msg of entry.messaging ?? []) {
      // Bot kendi mesajını ignore et
      if (msg.message?.is_echo) continue
      const text = msg.message?.text
      if (!text) continue

      const igUserId = msg.sender?.id          // Mesajı gönderen kullanıcı
      const recipientId = msg.recipient?.id    // İşletmenin IG account ID

      if (!igUserId || !recipientId) continue

      const integration = await prisma.integration.findFirst({
        where: { platform: 'INSTAGRAM', instagramAccountId: recipientId },
        include: { tenant: { select: { id: true, name: true, instagramAIEnabled: true } } },
      })
      if (!integration?.tenant?.instagramAIEnabled) continue

      const creds = integration.credentials as Record<string, string>
      const accessToken = creds?.accessToken
      if (!accessToken) continue

      console.log(`[IG] ${igUserId}: ${text}`)

      try {
        const reply = await handleIncomingMessage({
          tenantId: integration.tenant.id,
          tenantName: integration.tenant.name,
          platform: 'INSTAGRAM',
          platformUserId: igUserId,
          messageText: text,
        })
        await sendInstagramDM(recipientId, accessToken, igUserId, reply)
      } catch (err) {
        console.error('[IG] Agent/send error:', err)
      }
    }
  }
}

// ─── Instagram webhook tipler ─────────────────────────────────────────────────
interface InstagramWebhookBody {
  entry?: Array<{
    messaging?: Array<{
      sender?: { id: string }
      recipient?: { id: string }
      message?: { text?: string; is_echo?: boolean }
    }>
  }>
}
