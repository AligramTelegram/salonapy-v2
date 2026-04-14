import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/admin/support/[id] — cevap yaz ve/veya status güncelle
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { adminReply, status } = await req.json()

    const data: Record<string, unknown> = {}
    if (status && ['OPEN', 'IN_PROGRESS', 'CLOSED'].includes(status)) data.status = status
    if (adminReply !== undefined) {
      data.adminReply = adminReply?.trim() || null
      data.repliedAt = adminReply?.trim() ? new Date() : null
      if (adminReply?.trim() && !data.status) data.status = 'CLOSED'
    }

    const ticket = await prisma.supportTicket.update({
      where: { id: params.id },
      data,
      include: { tenant: { select: { name: true, email: true } } },
    })

    return NextResponse.json(ticket)
  } catch (err) {
    console.error('[PATCH /api/admin/support/[id]]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// DELETE /api/admin/support/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.supportTicket.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/admin/support/[id]]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
