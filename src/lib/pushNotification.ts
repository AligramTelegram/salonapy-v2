// Expo Push Notification sender — uses Expo's push API (no SDK needed server-side)

interface PushMessage {
  to: string
  title: string
  body: string
  data?: Record<string, unknown>
}

export async function sendPushNotification(messages: PushMessage[]): Promise<void> {
  if (!messages.length) return
  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'Accept-Encoding': 'gzip, deflate' },
      body: JSON.stringify(messages),
    })
  } catch (e) {
    console.error('[push] Failed to send notification:', e)
  }
}

export async function sendPushToTenant(tenantId: string, title: string, body: string, data?: Record<string, unknown>): Promise<void> {
  const { prisma } = await import('./prisma')
  const users = await prisma.user.findMany({
    where: { tenantId, pushToken: { not: null } },
    select: { pushToken: true },
  })
  const messages = users
    .filter(u => u.pushToken?.startsWith('ExponentPushToken'))
    .map(u => ({ to: u.pushToken!, title, body, data: data ?? {} }))
  await sendPushNotification(messages)
}
