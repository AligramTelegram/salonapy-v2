import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getTenantIdFromRequest } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const CreateSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  unit: z.string().optional(),
  quantity: z.number().optional(),
  minQuantity: z.number().optional(),
  costPrice: z.number().optional().nullable(),
  sellPrice: z.number().optional().nullable(),
})

export async function GET(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const products = await prisma.product.findMany({
    where: { tenantId, isActive: true },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const body = await request.json()
  const parsed = CreateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })

  const { name, category, unit = 'adet', quantity = 0, minQuantity = 5, costPrice, sellPrice } = parsed.data
  const product = await prisma.product.create({
    data: { tenantId, name, category, unit, quantity, minQuantity, costPrice, sellPrice },
  })
  return NextResponse.json(product, { status: 201 })
}
