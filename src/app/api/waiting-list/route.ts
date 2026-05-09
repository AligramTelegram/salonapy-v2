import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const CreateWaitingSchema = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  serviceId: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const list = await prisma.waitingList.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(list)
}

export async function POST(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const body = await request.json()
  const parsed = CreateWaitingSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const entry = await prisma.waitingList.create({
    data: { tenantId, ...parsed.data },
  })

  return NextResponse.json(entry, { status: 201 })
}
