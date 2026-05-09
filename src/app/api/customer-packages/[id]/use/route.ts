import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const pkg = await prisma.customerPackage.findFirst({
    where: { id: params.id, tenantId },
  })
  if (!pkg) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  if (!pkg.isActive || pkg.remainingSessions <= 0) {
    return NextResponse.json({ error: 'Pakette seans kalmadı' }, { status: 400 })
  }

  const newRemaining = pkg.remainingSessions - 1
  const updated = await prisma.customerPackage.update({
    where: { id: params.id },
    data: {
      usedSessions: pkg.usedSessions + 1,
      remainingSessions: newRemaining,
      isActive: newRemaining > 0,
    },
  })

  return NextResponse.json(updated)
}
