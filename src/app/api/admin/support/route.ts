import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/support — tüm ticketları listeler
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') // OPEN | IN_PROGRESS | CLOSED | all
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = 20

  const where = status && status !== 'all' ? { status } : {}

  const [tickets, total, openCount] = await Promise.all([
    prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        subject: true,
        message: true,
        status: true,
        priority: true,
        adminReply: true,
        repliedAt: true,
        createdAt: true,
        tenant: { select: { id: true, name: true, slug: true, plan: true, email: true } },
      },
    }),
    prisma.supportTicket.count({ where }),
    prisma.supportTicket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
  ])

  return NextResponse.json({ tickets, total, openCount, page, totalPages: Math.ceil(total / limit) })
}
