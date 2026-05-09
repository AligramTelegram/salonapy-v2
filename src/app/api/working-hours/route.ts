import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const WorkingHourSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  isOpen: z.boolean(),
  openTime: z.string(),
  closeTime: z.string(),
})

export async function GET(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const hours = await prisma.tenantWorkingHours.findMany({
    where: { tenantId },
    orderBy: { dayOfWeek: 'asc' },
  })

  return NextResponse.json(hours)
}

export async function PUT(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const body = await request.json()
  const parsed = z.array(WorkingHourSchema).safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const results = await Promise.all(
    parsed.data.map((wh) =>
      prisma.tenantWorkingHours.upsert({
        where: { tenantId_dayOfWeek: { tenantId, dayOfWeek: wh.dayOfWeek } },
        update: { isOpen: wh.isOpen, openTime: wh.openTime, closeTime: wh.closeTime },
        create: { tenantId, dayOfWeek: wh.dayOfWeek, isOpen: wh.isOpen, openTime: wh.openTime, closeTime: wh.closeTime },
      })
    )
  )

  return NextResponse.json(results)
}
