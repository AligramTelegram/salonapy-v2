import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { startOfDay, endOfDay, parseISO, parse, startOfMonth, addMonths } from 'date-fns'
import { addReminderJob } from '@/lib/queue'
import { sendAppointmentConfirmation } from '@/lib/resend'
import { getTenantId } from '@/lib/getTenantId'
import { getLimit } from '@/lib/plan-features'

export const dynamic = 'force-dynamic'

const CreateSchema = z.object({
  customerId: z.string().min(1),
  serviceId: z.string().min(1),
  staffId: z.string().min(1),
  date: z.string().min(1),      // "2025-03-26"
  startTime: z.string().min(1), // "14:30"
  endTime: z.string().min(1),   // "15:30"
  price: z.number().nonnegative(),
  notes: z.string().max(1000).optional(),
  customerPackageId: z.string().optional().nullable(),
})

// GET /api/appointments?date=2025-03-26&status=BEKLIYOR
export async function GET(request: NextRequest) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { searchParams } = request.nextUrl
  const dateParam = searchParams.get('date')
  const statusParam = searchParams.get('status')
  const fromParam = searchParams.get('from')
  const toParam = searchParams.get('to')

  const where: Record<string, unknown> = { tenantId }

  if (dateParam) {
    const day = parseISO(dateParam)
    where.date = { gte: startOfDay(day), lte: endOfDay(day) }
  } else if (fromParam && toParam) {
    where.date = { gte: parseISO(fromParam), lte: parseISO(toParam) }
  }

  if (statusParam) {
    where.status = statusParam
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      staff: { select: { id: true, name: true, color: true, avatarUrl: true } },
      service: { select: { id: true, name: true, duration: true, color: true } },
      customer: { select: { id: true, name: true, phone: true } },
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  })

  return NextResponse.json(appointments)
}

// POST /api/appointments
export async function POST(request: NextRequest) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

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

  const { customerId, serviceId, staffId, date, startTime, endTime, price, notes, customerPackageId } = parsed.data

  // ── Aylık randevu limiti kontrolü ──────────────────────────────────────────
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { plan: true, appointmentsUsed: true, appointmentsResetAt: true },
  })

  if (tenant) {
    const now = new Date()
    const maxAppointments = getLimit(tenant.plan, 'maxAppointmentsPerMonth')

    // Ay geçtiyse sıfırla (lazy reset)
    let appointmentsUsed = tenant.appointmentsUsed
    if (now >= tenant.appointmentsResetAt) {
      const nextReset = startOfMonth(addMonths(now, 1))
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { appointmentsUsed: 0, appointmentsResetAt: nextReset },
      })
      appointmentsUsed = 0
    }

    if (maxAppointments !== Number.MAX_SAFE_INTEGER && appointmentsUsed >= maxAppointments) {
      const resetAt = now >= tenant.appointmentsResetAt
        ? startOfMonth(addMonths(now, 1))
        : tenant.appointmentsResetAt
      return NextResponse.json(
        {
          error: 'Aylık randevu limitinize ulaştınız.',
          code: 'APPOINTMENT_LIMIT_REACHED',
          limit: maxAppointments,
          used: appointmentsUsed,
          resetAt: resetAt.toISOString(),
          plan: tenant.plan,
        },
        { status: 403 }
      )
    }
  }
  // ──────────────────────────────────────────────────────────────────────────

  // Date-only değeri timezone kaymasından korumak için local 12:00 noon kullan
  const normalizedDate = parse(date, 'yyyy-MM-dd', new Date())
  normalizedDate.setHours(12, 0, 0, 0)

  // Tenant izolasyonu: gelen ID'ler bu tenant'a ait mi?
  const [customer, service, staff] = await Promise.all([
    prisma.customer.findFirst({ where: { id: customerId, tenantId } }),
    prisma.service.findFirst({ where: { id: serviceId, tenantId } }),
    prisma.staff.findFirst({ where: { id: staffId, tenantId } }),
  ])

  if (!customer) return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 })
  if (!service) return NextResponse.json({ error: 'Hizmet bulunamadı' }, { status: 404 })
  if (!staff) return NextResponse.json({ error: 'Personel bulunamadı' }, { status: 404 })

  // Paket veya normal randevu için fiyat doğrulaması
  if (customerPackageId) {
    const cp = await prisma.customerPackage.findFirst({
      where: { id: customerPackageId, customerId, tenantId, isActive: true },
    })
    if (!cp) return NextResponse.json({ error: 'Geçersiz paket' }, { status: 400 })
    if (cp.remainingSessions <= 0) return NextResponse.json({ error: 'Pakette seans kalmadı' }, { status: 400 })
  } else if (price <= 0) {
    return NextResponse.json({ error: 'Geçerli bir fiyat girin' }, { status: 400 })
  }

  // Create appointment (package session will be deducted only on status change)
  const appointment = await prisma.appointment.create({
    data: {
      tenantId,
      customerId,
      serviceId,
      staffId,
      date: normalizedDate,
      startTime,
      endTime,
      price,
      notes,
      status: 'BEKLIYOR',
      ...(customerPackageId
        ? { customerPackageId, usedPackageSession: false }
        : {}),
    },
    include: {
      staff: { select: { id: true, name: true, color: true } },
      service: { select: { id: true, name: true, duration: true } },
      customer: { select: { id: true, name: true, phone: true } },
    },
  })

  // Aylık randevu sayacını artır
  await prisma.tenant.update({
    where: { id: tenantId },
    data: { appointmentsUsed: { increment: 1 } },
  })

  // Send appointment confirmation email to customer (if email exists)
  if (customer.email) {
    const tenantForEmail = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true, phone: true, email: true },
    })
    sendAppointmentConfirmation({
      customerName: customer.name,
      customerEmail: customer.email,
      serviceName: service.name,
      staffName: staff.name,
      date: normalizedDate,
      startTime,
      endTime,
      tenantName: tenantForEmail?.name ?? '',
      tenantPhone: tenantForEmail?.phone ?? undefined,
      tenantEmail: tenantForEmail?.email ?? undefined,
    }).catch((err) => console.error('[appointments] Confirmation email failed:', err))
  }

  // Randevu zamanını hesapla ve hatırlatma job'larını kuyruğa ekle
  const [apptHours, apptMinutes] = startTime.split(':').map(Number)
  const appointmentDateTime = new Date(normalizedDate)
  appointmentDateTime.setHours(apptHours, apptMinutes, 0, 0)

  const now = Date.now()
  const apptTime = appointmentDateTime.getTime()
  const delay24h = apptTime - 24 * 60 * 60 * 1000 - now
  const delay1h = apptTime - 60 * 60 * 1000 - now

  const jobData = {
    appointmentId: appointment.id,
    tenantId,
    customerPhone: customer.phone,
  }

  if (delay24h > 0) {
    await addReminderJob({ ...jobData, type: 'reminder-24h' }, delay24h)
  }
  if (delay1h > 0) {
    await addReminderJob({ ...jobData, type: 'reminder-1h' }, delay1h)
  }

  return NextResponse.json(appointment, { status: 201 })
}
