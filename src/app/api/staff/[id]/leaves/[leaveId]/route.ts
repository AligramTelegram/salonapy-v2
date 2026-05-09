import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; leaveId: string } }
) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const existing = await prisma.leave.findFirst({
    where: { id: params.leaveId, staffId: params.id, tenantId },
  })
  if (!existing) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  await prisma.leave.delete({ where: { id: params.leaveId } })
  return NextResponse.json({ success: true })
}
