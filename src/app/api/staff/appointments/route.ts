import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, parseISO } from 'date-fns'
import { z } from 'zod'
import { getAuthenticatedStaffFromRequest } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

const CreateSchema = z.object({
  customerId: z.string().min(1),
  serviceId: z.string().min(1),
  date: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  price: z.number().min(0),
  notes: z.string().optional(),
})

// GET /api/staff/appointments?date=2025-03-27
// GET /api/staff/appointments?from=2025-03-01&to=2025-03-31
// GET /api/staff/appointments?customerId=xxx
export async function GET(request: NextRequest) {
  try {
    const staff = await getAuthenticatedStaffFromRequest(request)
    if (!staff) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const { searchParams } = request.nextUrl
    const dateParam = searchParams.get('date')
    const fromParam = searchParams.get('from')
    const toParam = searchParams.get('to')
    const customerIdParam = searchParams.get('customerId')

    const where: Record<string, unknown> = {
      tenantId: staff.tenantId,
      staffId: staff.id,
    }

    if (dateParam) {
      const day = parseISO(dateParam)
      where.date = { gte: startOfDay(day), lte: endOfDay(day) }
    } else if (fromParam && toParam) {
      where.date = { gte: parseISO(fromParam), lte: parseISO(toParam) }
    }

    if (customerIdParam) {
      where.customerId = customerIdParam
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        service: { select: { id: true, name: true, duration: true, color: true } },
        customer: { select: { id: true, name: true, phone: true } },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    })

    return NextResponse.json(appointments)
  } catch (err) {
    console.error('[GET /api/staff/appointments]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// POST /api/staff/appointments — staff creates appointment for themselves
export async function POST(request: NextRequest) {
  try {
    const staff = await getAuthenticatedStaffFromRequest(request)
    if (!staff) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
    }

    const parsed = CreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
    }

    const { customerId, serviceId, date, startTime, endTime, price, notes } = parsed.data

    const [customer, service] = await Promise.all([
      prisma.customer.findFirst({ where: { id: customerId, tenantId: staff.tenantId } }),
      prisma.service.findFirst({ where: { id: serviceId, tenantId: staff.tenantId } }),
    ])

    if (!customer) return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 })
    if (!service) return NextResponse.json({ error: 'Hizmet bulunamadı' }, { status: 404 })

    const appointment = await prisma.appointment.create({
      data: {
        tenantId: staff.tenantId,
        staffId: staff.id,
        customerId,
        serviceId,
        date: parseISO(date),
        startTime,
        endTime,
        price,
        notes,
        status: 'BEKLIYOR',
      },
      include: {
        service: { select: { id: true, name: true, duration: true, color: true } },
        customer: { select: { id: true, name: true, phone: true } },
      },
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (err) {
    console.error('[POST /api/staff/appointments]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
