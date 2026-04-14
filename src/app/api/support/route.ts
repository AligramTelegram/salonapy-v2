import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantId } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

// GET /api/support — işletmenin kendi ticketlarını listeler
export async function GET() {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  try {
    const tickets = await prisma.supportTicket.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        subject: true,
        message: true,
        status: true,
        priority: true,
        adminReply: true,
        repliedAt: true,
        createdAt: true,
      },
    })

    return NextResponse.json(tickets)
  } catch (err) {
    console.error('[GET /api/support]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// POST /api/support — yeni ticket oluştur
export async function POST(req: NextRequest) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  try {
    const { subject, message, priority } = await req.json()
    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Konu ve mesaj zorunludur' }, { status: 400 })
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        tenantId,
        subject: subject.trim(),
        message: message.trim(),
        priority: ['LOW', 'NORMAL', 'HIGH'].includes(priority) ? priority : 'NORMAL',
      },
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (err) {
    console.error('[POST /api/support]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
