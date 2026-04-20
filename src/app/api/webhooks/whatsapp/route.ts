import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { prisma } from '@/lib/prisma'
import { sendWhatsApp } from '@/lib/ai/platform-sender'
import { handleIncomingMessage } from '@/lib/ai/conversation-helper'

export const dynamic = 'force-dynamic'

// Meta webhook doğrulama
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const setting = await prisma.siteSetting.findUnique({ where: { key: 'whatsapp_verify_token' } })
  const verifyToken = setting?.value || process.env.WHATSAPP_VERIFY_TOKEN

  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

// Gelen mesaj
export async function POST(req: NextRequest) {
  let body: WhatsAppWebhookBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  // Mesajları işle (async, 200 hemen dön)
  waitUntil(processWebhook(body).catch(err =>
    console.error('[WA Webhook] Processing error:', err)
  ))

  return NextResponse.json({ status: 'ok' })
}

async function processWebhook(body: WhatsAppWebhookBody) {
  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value
      if (!value?.messages?.length) continue

      const phoneNumberId = value.metadata?.phone_number_id
      if (!phoneNumberId) continue

      // Integration kaydından tenant bul
      const integration = await prisma.integration.findFirst({
        where: { platform: 'WHATSAPP', phoneNumberId },
        include: { tenant: { select: { id: true, name: true, whatsappAIEnabled: true } } },
      })
      if (!integration?.tenant?.whatsappAIEnabled) continue

      const creds = integration.credentials as Record<string, string>
      const accessToken = creds?.accessToken
      if (!accessToken) continue

      for (const msg of value.messages) {
        if (msg.type !== 'text') continue
        const from = msg.from  // +90xxxxxxxxxx
        const text = msg.text?.body
        if (!text) continue

        console.log(`[WA] ${from}: ${text}`)

        try {
          const reply = await handleIncomingMessage({
            tenantId: integration.tenant.id,
            tenantName: integration.tenant.name,
            platform: 'WHATSAPP',
            platformUserId: from,
            messageText: text,
          })
          await sendWhatsApp(phoneNumberId, accessToken, from, reply)
        } catch (err) {
          console.error('[WA] Agent/send error:', err)
        }
      }
    }
  }
}

// ─── WhatsApp webhook tipler ──────────────────────────────────────────────────
interface WhatsAppWebhookBody {
  entry?: Array<{
    changes?: Array<{
      value?: {
        metadata?: { phone_number_id?: string }
        messages?: Array<{
          type: string
          from: string
          text?: { body: string }
        }>
      }
    }>
  }>
}
