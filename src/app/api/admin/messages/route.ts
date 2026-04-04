import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/messages?page=1&unread=true
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const unreadOnly = searchParams.get('unread') === 'true'
    const pageSize = 20

    const where = unreadOnly ? { isRead: false } : {}

    const [messages, total, unreadCount] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ])

    return NextResponse.json({ messages, total, unreadCount, page, pageSize })
  } catch (err) {
    console.error('[GET /api/admin/messages]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
