import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getTenantId } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

const UpdateTransactionSchema = z.object({
  type: z.enum(['GELIR', 'GIDER']).optional(),
  amount: z.number().positive().optional(),
  category: z.string().min(1).optional(),
  description: z.string().optional(),
  date: z.string().optional(),
})

// PUT /api/transactions/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const existing = await prisma.transaction.findFirst({
    where: { id: params.id, tenantId },
  })
  if (!existing) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const parsed = UpdateTransactionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { date, ...rest } = parsed.data

  const transaction = await prisma.transaction.update({
    where: { id: params.id },
    data: {
      ...rest,
      ...(date ? { date: new Date(date) } : {}),
    },
  })

  return NextResponse.json(transaction)
}

// DELETE /api/transactions/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const existing = await prisma.transaction.findFirst({
    where: { id: params.id, tenantId },
  })
  if (!existing) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  await prisma.transaction.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
