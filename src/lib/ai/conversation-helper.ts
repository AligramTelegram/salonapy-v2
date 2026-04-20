import { prisma } from '@/lib/prisma'
import { runBookingAgent, type AgentContext } from './booking-agent'

/** Platform kullanıcısı için Conversation kaydını bul veya oluştur */
export async function getOrCreateConversation(
  tenantId: string,
  platform: string,
  platformUserId: string
) {
  return prisma.conversation.upsert({
    where: { tenantId_platform_platformUserId: { tenantId, platform, platformUserId } },
    create: { tenantId, platform, platformUserId },
    update: {},
  })
}

/** Integration + AISettings yükle, agent'ı çalıştır */
export async function handleIncomingMessage(opts: {
  tenantId: string
  tenantName: string
  platform: 'WHATSAPP' | 'INSTAGRAM'
  platformUserId: string
  messageText: string
}) {
  const { tenantId, tenantName, platform, platformUserId, messageText } = opts

  const [aiSettings, conversation] = await Promise.all([
    prisma.aISettings.findUnique({ where: { tenantId } }),
    getOrCreateConversation(tenantId, platform, platformUserId),
  ])

  const ctx: AgentContext = {
    tenantId,
    tenantName,
    conversationId: conversation.id,
    systemPrompt: platform === 'WHATSAPP'
      ? aiSettings?.whatsappPrompt
      : aiSettings?.instagramPrompt,
    workingHoursStart: aiSettings?.workingHoursStart ?? undefined,
    workingHoursEnd: aiSettings?.workingHoursEnd ?? undefined,
    outOfHoursMessage: aiSettings?.outOfHoursMessage,
  }

  return runBookingAgent(ctx, messageText)
}
