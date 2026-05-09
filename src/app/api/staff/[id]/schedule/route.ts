import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const ScheduleSchema = z.object({
  workDays: z.array(z.number().int().min(0).max(6)),
  startTime: z.string(),
  endTime: z.string(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const staff = await prisma.staff.findFirst({ where: { id: params.id, tenantId } })
  if (!staff) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const body = await request.json()
  const parsed = ScheduleSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const { workDays, startTime, endTime } = parsed.data

  await prisma.staffWorkHours.deleteMany({ where: { staffId: params.id } })

  const created = await prisma.staffWorkHours.createMany({
    data: workDays.map((day) => ({
      staffId: params.id,
      dayOfWeek: day,
      startTime,
      endTime,
      isWorking: true,
    })),
  })

  return NextResponse.json({ updated: created.count })
}
