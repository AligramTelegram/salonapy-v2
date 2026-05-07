import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getTenantIdFromRequest } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

const UpdateSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  unit: z.string().optional(),
  minQuantity: z.number().optional(),
  costPrice: z.number().optional().nullable(),
  sellPrice: z.number().optional().nullable(),
  isActive: z.boolean().optional(),
})

const MovementSchema = z.object({
  type: z.enum(['GIRIS', 'CIKIS']),
  quantity: z.number().positive(),
  note: z.string().optional(),
})

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const body = await request.json()
  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })

  const product = await prisma.product.updateMany({
    where: { id: params.id, tenantId },
    data: parsed.data,
  })
  if (product.count === 0) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  return NextResponse.json(await prisma.product.findUnique({ where: { id: params.id } }))
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  await prisma.product.updateMany({ where: { id: params.id, tenantId }, data: { isActive: false } })
  return new NextResponse(null, { status: 204 })
}

// PATCH = stok hareketi (GIRIS/CIKIS)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const body = await request.json()
  const parsed = MovementSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })

  const { type, quantity, note } = parsed.data

  const [, product] = await prisma.$transaction([
    prisma.stockMovement.create({ data: { productId: params.id, tenantId, type, quantity, note } }),
    prisma.product.update({
      where: { id: params.id },
      data: { quantity: { increment: type === 'GIRIS' ? quantity : -quantity } },
    }),
  ])
  return NextResponse.json(product)
}
