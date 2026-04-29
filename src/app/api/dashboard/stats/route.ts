import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns'

export const dynamic = 'force-dynamic'

function decodeJwtSub(token: string): string | null {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
    return payload?.sub ?? null
  } catch { return null }
}

async function getTenantId(request: NextRequest): Promise<string | null> {
  const mobileToken = request.headers.get('x-mobile-token')
  if (mobileToken) {
    const sub = decodeJwtSub(mobileToken)
    if (!sub) return null
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: sub },
      select: { tenantId: true },
    })
    return dbUser?.tenantId ?? null
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { tenantId: true },
  })
  return dbUser?.tenantId ?? null
}

export async function GET(request: NextRequest) {
  try {
    const tenantId = await getTenantId(request)
    if (!tenantId) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    const now = new Date()
    const todayStart = startOfDay(now)
    const todayEnd = endOfDay(now)
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    const [
      todayCount,
      monthCount,
      monthRevenue,
      monthExpense,
      customersCount,
      tenant,
      recentAppointments,
    ] = await Promise.all([
      prisma.appointment.count({
        where: { tenantId, date: { gte: todayStart, lte: todayEnd }, status: { not: 'IPTAL' } },
      }),
      prisma.appointment.count({
        where: { tenantId, date: { gte: monthStart, lte: monthEnd }, status: { not: 'IPTAL' } },
      }),
      prisma.transaction.aggregate({
        where: { tenantId, type: 'GELIR', date: { gte: monthStart, lte: monthEnd } },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { tenantId, type: 'GIDER', date: { gte: monthStart, lte: monthEnd } },
        _sum: { amount: true },
      }),
      prisma.customer.count({ where: { tenantId } }),
      prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { waUsed: true, plan: true },
      }),
      prisma.appointment.findMany({
        where: { tenantId },
        include: { customer: true, service: true, staff: true },
        orderBy: { updatedAt: 'desc' },
        take: 6,
      }),
    ])

    const WA_LIMITS: Record<string, number> = {
      BASLANGIC: 200, PROFESYONEL: 600, ISLETME: 1500,
    }
    const waLimit = WA_LIMITS[tenant?.plan ?? 'BASLANGIC'] ?? 200
    const revenue = monthRevenue._sum.amount ?? 0
    const expense = monthExpense._sum.amount ?? 0

    return NextResponse.json({
      today: todayCount,
      month: monthCount,
      revenue,
      expense,
      netProfit: revenue - expense,
      customersCount,
      waUsed: tenant?.waUsed ?? 0,
      waLimit,
      recentAppointments: recentAppointments.map(apt => ({
        id: apt.id,
        status: apt.status,
        startTime: apt.startTime,
        endTime: apt.endTime,
        price: apt.price,
        updatedAt: apt.updatedAt.toISOString(),
        customer: { name: apt.customer.name },
        service: { name: apt.service.name, color: apt.service.color },
        staff: apt.staff ? { name: apt.staff.name } : null,
      })),
    })
  } catch (error) {
    console.error('[dashboard/stats]', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
