import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantId } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

// GET /api/customers/[id]/packages
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const customer = await prisma.customer.findFirst({ where: { id: params.id, tenantId } })
  if (!customer) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const packages = await prisma.customerPackage.findMany({
    where: { customerId: params.id, tenantId },
    include: {
      package: {
        include: { service: { select: { id: true, name: true, color: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(packages)
}
