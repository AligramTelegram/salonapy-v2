import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; noteId: string } }
) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const existing = await prisma.customerNote.findFirst({
    where: { id: params.noteId, customerId: params.id, tenantId },
  })
  if (!existing) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  await prisma.customerNote.delete({ where: { id: params.noteId } })
  return NextResponse.json({ success: true })
}
