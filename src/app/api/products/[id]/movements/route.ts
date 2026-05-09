import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const product = await prisma.product.findFirst({ where: { id: params.id, tenantId } })
  if (!product) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const movements = await prisma.stockMovement.findMany({
    where: { productId: params.id, tenantId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(movements)
}
