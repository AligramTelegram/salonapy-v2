import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const CreatePromotionSchema = z.object({
  code: z.string().min(1),
  discountType: z.enum(['PERCENT', 'FIXED']),
  discountValue: z.number().positive(),
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean().optional(),
  description: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const promotions = await prisma.promotion.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(promotions)
}

export async function POST(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const body = await request.json()
  const parsed = CreatePromotionSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const promotion = await prisma.promotion.create({
    data: {
      tenantId,
      code: parsed.data.code,
      discountType: parsed.data.discountType,
      discountValue: parsed.data.discountValue,
      maxUses: parsed.data.maxUses,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
      isActive: parsed.data.isActive ?? true,
      description: parsed.data.description,
    },
  })

  return NextResponse.json(promotion, { status: 201 })
}
