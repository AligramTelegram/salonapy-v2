import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { subMonths, startOfMonth, format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { verifyAdminSecret } from '@/lib/admin-auth'
import { getPlanPricesTRY } from '@/lib/plans'

export const dynamic = 'force-dynamic'

// GET /api/admin/stats
export async function GET(request: NextRequest) {
  const authError = await verifyAdminSecret(request)
  if (authError) return authError

  try {
    const [allTenants, waData, recentTenants, subscriptions] = await Promise.all([
      prisma.tenant.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          plan: true,
          isActive: true,
          waUsed: true,
          createdAt: true,
        },
      }),
      prisma.tenant.aggregate({ _sum: { waUsed: true } }),
      prisma.tenant.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          plan: true,
          isActive: true,
          createdAt: true,
          _count: { select: { appointments: true, customers: true } },
        },
      }),
      prisma.subscription.findMany({
        where: {
          status: 'ACTIVE',
        },
        select: { amount: true, startDate: true },
      }),
    ])

    const planPrices = await getPlanPricesTRY()

    const totalTenants = allTenants.length
    const activeTenants = allTenants.filter((t) => t.isActive).length
    const mrr = allTenants
      .filter((t) => t.isActive)
      .reduce((sum, t) => sum + (planPrices[t.plan] ?? 0), 0)
    const waUsedTotal = waData._sum.waUsed ?? 0

    // 6-month trend from subscriptions (plan satışları)
    const months = Array.from({ length: 6 }, (_, i) => subMonths(startOfMonth(new Date()), 5 - i))
    const mrrTrend = months.map((month) => {
      const key = format(month, 'yyyy-MM')
      const revenue = subscriptions
        .filter((s) => format(new Date(s.startDate), 'yyyy-MM') === key)
        .reduce((sum, s) => sum + s.amount, 0)
      return {
        month: format(month, 'MMM yy', { locale: tr }),
        revenue,
      }
    })

    // Toplam SaaS geliri (tüm zamanlar, aktif abonelikler)
    const totalSaasRevenue = subscriptions.reduce((sum, s) => sum + s.amount, 0)

    return NextResponse.json({
      totalTenants,
      activeTenants,
      mrr,
      waUsedTotal,
      recentTenants,
      mrrTrend,
      totalSaasRevenue,
    })
  } catch (err) {
    console.error('[GET /api/admin/stats]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
