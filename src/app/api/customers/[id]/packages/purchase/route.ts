import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getTenantId } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

const PurchaseSchema = z.object({
  packageId: z.string().min(1),
})

// POST /api/customers/[id]/packages/purchase
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const customer = await prisma.customer.findFirst({ where: { id: params.id, tenantId } })
  if (!customer) return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const parsed = PurchaseSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const packageData = await prisma.package.findFirst({
    where: { id: parsed.data.packageId, tenantId, isActive: true },
  })
  if (!packageData) return NextResponse.json({ error: 'Paket bulunamadı' }, { status: 404 })

  const expiryDate = packageData.validDays
    ? new Date(Date.now() + packageData.validDays * 24 * 60 * 60 * 1000)
    : null

  // Paket satışı, gelir transaction ve müşteri harcama güncellemesi tek transactionda
  const [customerPackage] = await prisma.$transaction([
    prisma.customerPackage.create({
      data: {
        tenantId,
        customerId: params.id,
        packageId: parsed.data.packageId,
        totalSessions: packageData.sessions,
        remainingSessions: packageData.sessions,
        expiryDate,
      },
      include: {
        package: {
          include: { service: { select: { id: true, name: true, color: true } } },
        },
      },
    }),
    prisma.transaction.create({
      data: {
        tenantId,
        type: 'GELIR',
        amount: packageData.price,
        category: 'Paket Satışı',
        description: `${packageData.name} — ${customer.name}`,
        date: new Date(),
      },
    }),
    prisma.customer.update({
      where: { id: params.id },
      data: {
        totalSpent: { increment: packageData.price },
      },
    }),
  ])

  return NextResponse.json(customerPackage, { status: 201 })
}
