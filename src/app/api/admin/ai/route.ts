import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/ai?view=overview|conversations|messages&tenantId=...&conversationId=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const view = searchParams.get('view') ?? 'overview'

  if (view === 'overview') {
    const [tenants, totalConversations, totalMessages] = await Promise.all([
      prisma.tenant.findMany({
        where: {
          OR: [{ whatsappAIEnabled: true }, { instagramAIEnabled: true }],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          whatsappAIEnabled: true,
          whatsappMessagesUsed: true,
          whatsappMessagesLimit: true,
          instagramAIEnabled: true,
          instagramMessagesUsed: true,
          instagramMessagesLimit: true,
          integrations: {
            select: { platform: true, status: true, phoneNumberId: true, instagramAccountId: true },
          },
          _count: { select: { conversations: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.conversation.count(),
      prisma.message.count(),
    ])

    return NextResponse.json({ tenants, totalConversations, totalMessages })
  }

  if (view === 'conversations') {
    const tenantId = searchParams.get('tenantId')
    const platform = searchParams.get('platform')
    const page = parseInt(searchParams.get('page') ?? '1')
    const pageSize = 20

    const where = {
      ...(tenantId ? { tenantId } : {}),
      ...(platform ? { platform } : {}),
    }

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        orderBy: { lastMessageAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          tenant: { select: { name: true, slug: true } },
          _count: { select: { messages: true } },
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
      }),
      prisma.conversation.count({ where }),
    ])

    return NextResponse.json({ conversations, total, page, pageSize })
  }

  if (view === 'messages') {
    const conversationId = searchParams.get('conversationId')
    if (!conversationId) return NextResponse.json({ error: 'conversationId gerekli' }, { status: 400 })

    const [conversation, messages] = await Promise.all([
      prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { tenant: { select: { name: true, slug: true } } },
      }),
      prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
      }),
    ])

    return NextResponse.json({ conversation, messages })
  }

  return NextResponse.json({ error: 'Geçersiz view' }, { status: 400 })
}
