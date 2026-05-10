import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const UpdateStaffSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  title: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
  serviceIds: z.array(z.string()).optional(),
  workHours: z
    .array(
      z.object({
        dayOfWeek: z.number().int().min(0).max(6),
        startTime: z.string(),
        endTime: z.string(),
        isWorking: z.boolean(),
      })
    )
    .optional(),
})

// GET /api/staff/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { getTenantIdFromRequest } = await import('@/lib/getTenantId')
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const staff = await prisma.staff.findFirst({
    where: { id: params.id, tenantId },
    include: {
      services: { select: { id: true, name: true, color: true } },
      workHours: { orderBy: { dayOfWeek: 'asc' } },
    },
  })

  if (!staff) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [appointments, monthAppointments] = await Promise.all([
    prisma.appointment.findMany({
      where: { staffId: params.id, tenantId },
      select: {
        id: true, date: true, startTime: true, endTime: true,
        status: true, price: true, paid: true, notes: true,
        customer: { select: { id: true, name: true, phone: true } },
        service: { select: { id: true, name: true, color: true, duration: true } },
      },
      orderBy: { date: 'desc' },
      take: 50,
    }),
    prisma.appointment.findMany({
      where: { staffId: params.id, tenantId, date: { gte: monthStart } },
      select: { price: true, status: true },
    }),
  ])

  const monthStats = {
    count: monthAppointments.length,
    completedCount: monthAppointments.filter((a) => a.status === 'TAMAMLANDI').length,
    revenue: monthAppointments
      .filter((a) => a.status === 'TAMAMLANDI')
      .reduce((sum, a) => sum + a.price, 0),
  }

  return NextResponse.json({ ...staff, appointments, monthStats })
}

// PUT /api/staff/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { getTenantIdFromRequest } = await import('@/lib/getTenantId')
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const existing = await prisma.staff.findFirst({ where: { id: params.id, tenantId } })
  if (!existing) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const parsed = UpdateStaffSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { serviceIds, workHours, ...fields } = parsed.data

  const staff = await prisma.staff.update({
    where: { id: params.id },
    data: {
      ...fields,
      ...(serviceIds !== undefined
        ? { services: { set: serviceIds.map((id) => ({ id })) } }
        : {}),
      ...(workHours !== undefined
        ? {
            workHours: {
              deleteMany: {},
              create: workHours.map((wh) => ({
                dayOfWeek: wh.dayOfWeek,
                startTime: wh.startTime,
                endTime: wh.endTime,
                isWorking: wh.isWorking,
              })),
            },
          }
        : {}),
    },
    include: {
      services: { select: { id: true, name: true, color: true } },
      workHours: { orderBy: { dayOfWeek: 'asc' } },
    },
  })

  return NextResponse.json(staff)
}

// DELETE /api/staff/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { getTenantIdFromRequest } = await import('@/lib/getTenantId')
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const existing = await prisma.staff.findFirst({ where: { id: params.id, tenantId } })
  if (!existing) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  // Supabase Auth kullanıcısını sil
  if (existing.supabaseId) {
    const adminSupabase = createAdminClient()
    await adminSupabase.auth.admin.deleteUser(existing.supabaseId)
  }

  await prisma.staff.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}
