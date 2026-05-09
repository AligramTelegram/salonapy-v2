import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const UpdatePromotionSchema = z.object({
  code: z.string().min(1).optional(),
  discountType: z.enum(['PERCENT', 'FIXED']).optional(),
  discountValue: z.number().positive().optional(),
  maxUses: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  description: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const existing = await prisma.promotion.findFirst({ where: { id: params.id, tenantId } })
  if (!existing) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const body = await request.json()
  const parsed = UpdatePromotionSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const { expiresAt, ...rest } = parsed.data
  const promotion = await prisma.promotion.update({
    where: { id: params.id },
    data: {
      ...rest,
      ...(expiresAt !== undefined ? { expiresAt: expiresAt ? new Date(expiresAt) : null } : {}),
    },
  })

  return NextResponse.json(promotion)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const existing = await prisma.promotion.findFirst({ where: { id: params.id, tenantId } })
  if (!existing) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  await prisma.promotion.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
