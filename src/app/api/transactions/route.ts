import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getTenantId } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

const CreateTransactionSchema = z.object({
  type: z.enum(['GELIR', 'GIDER']),
  amount: z.number().positive('Tutar sıfırdan büyük olmalı'),
  category: z.string().min(1, 'Kategori zorunlu'),
  description: z.string().optional(),
  date: z.string(), // ISO date string
})

// GET /api/transactions?period=month|quarter|year
export async function GET(request: NextRequest) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { searchParams } = request.nextUrl
  const period = searchParams.get('period') ?? 'month'

  const now = new Date()
  let from: Date

  if (period === 'quarter') {
    from = new Date(now.getFullYear(), now.getMonth() - 2, 1)
  } else if (period === 'year') {
    from = new Date(now.getFullYear(), 0, 1)
  } else {
    // month (default)
    from = new Date(now.getFullYear(), now.getMonth(), 1)
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      tenantId,
      date: { gte: from },
    },
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(transactions)
}

// POST /api/transactions
export async function POST(request: NextRequest) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const parsed = CreateTransactionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const transaction = await prisma.transaction.create({
    data: {
      tenantId,
      type: parsed.data.type,
      amount: parsed.data.amount,
      category: parsed.data.category,
      description: parsed.data.description,
      date: new Date(parsed.data.date),
    },
  })

  return NextResponse.json(transaction, { status: 201 })
}
