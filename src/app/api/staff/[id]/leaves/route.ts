import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const CreateLeaveSchema = z.object({
  type: z.enum(['IZIN', 'TATIL', 'HASTALIK', 'DIGER']),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const staff = await prisma.staff.findFirst({ where: { id: params.id, tenantId } })
  if (!staff) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const leaves = await prisma.leave.findMany({
    where: { staffId: params.id, tenantId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(leaves)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const staff = await prisma.staff.findFirst({ where: { id: params.id, tenantId } })
  if (!staff) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const body = await request.json()
  const parsed = CreateLeaveSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const leave = await prisma.leave.create({
    data: {
      tenantId,
      staffId: params.id,
      type: parsed.data.type,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
      reason: parsed.data.reason,
    },
  })

  return NextResponse.json(leave, { status: 201 })
}
