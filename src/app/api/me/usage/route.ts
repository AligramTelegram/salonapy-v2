import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'
import { PLAN_FEATURES, getEffectivePlan } from '@/lib/plan-features'
import { startOfMonth } from 'date-fns'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { plan: true, subscription: { select: { status: true } } },
  })
  if (!tenant) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const effectivePlan = getEffectivePlan(tenant.plan, tenant.subscription?.status)
  const limits = PLAN_FEATURES[effectivePlan]

  const monthStart = startOfMonth(new Date())

  const [appointmentsThisMonth, staffCount, customerCount, serviceCount] = await Promise.all([
    prisma.appointment.count({
      where: { tenantId, createdAt: { gte: monthStart } },
    }),
    prisma.staff.count({
      where: { tenantId, isActive: true },
    }),
    prisma.customer.count({
      where: { tenantId },
    }),
    prisma.service.count({
      where: { tenantId, isActive: true },
    }),
  ])

  const maxAppts = limits.maxAppointmentsPerMonth === Infinity ? null : limits.maxAppointmentsPerMonth
  const maxStaff = limits.maxStaff === Infinity ? null : limits.maxStaff
  const maxCustomers = limits.maxCustomers === Infinity ? null : limits.maxCustomers
  const maxServices = limits.maxServices === Infinity ? null : limits.maxServices

  return NextResponse.json({
    plan,
    appointmentsThisMonth,
    maxAppointmentsPerMonth: maxAppts,
    staffCount,
    maxStaff,
    customerCount,
    maxCustomers,
    serviceCount,
    maxServices,
    pct: {
      appointments: maxAppts ? Math.round((appointmentsThisMonth / maxAppts) * 100) : 0,
      staff:        maxStaff ? Math.round((staffCount / maxStaff) * 100) : 0,
      customers:    maxCustomers ? Math.round((customerCount / maxCustomers) * 100) : 0,
      services:     maxServices ? Math.round((serviceCount / maxServices) * 100) : 0,
    },
  })
}
