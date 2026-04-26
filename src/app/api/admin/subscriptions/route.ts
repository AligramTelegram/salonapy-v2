import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth, addDays } from 'date-fns'
import { verifyAdminSecret } from '@/lib/admin-auth'
import { getPlanPricesTRY } from '@/lib/plans'

export const dynamic = 'force-dynamic'

// GET /api/admin/subscriptions
export async function GET(request: NextRequest) {
  const authError = await verifyAdminSecret(request)
  if (authError) return authError

  try {
    const today = new Date()
    const monthStart = startOfMonth(today)
    const monthEnd = endOfMonth(today)
    const next30Days = addDays(today, 30)

    const [activeTenants, newSubscriptions, planCounts, upcomingRenewals] = await Promise.all([
      prisma.tenant.findMany({
        where: { isActive: true },
        select: { id: true, plan: true },
      }),
      prisma.subscription.count({
        where: { createdAt: { gte: monthStart, lte: monthEnd } },
      }),
      prisma.tenant.groupBy({
        by: ['plan'],
        where: { isActive: true },
        _count: { _all: true },
      }),
      prisma.tenant.findMany({
        where: {
          isActive: true,
          planEndsAt: { gte: today, lte: next30Days },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          plan: true,
          planEndsAt: true,
          subscription: { select: { amount: true, autoRenew: true } },
        },
        orderBy: { planEndsAt: 'asc' },
      }),
    ])

    const planPrices = await getPlanPricesTRY()
    const mrr = activeTenants.reduce((sum, t) => sum + (planPrices[t.plan] ?? 0), 0)

    const planDistribution: Record<string, number> = {
      BASLANGIC: 0,
      PROFESYONEL: 0,
      ISLETME: 0,
    }
    for (const group of planCounts) {
      planDistribution[group.plan] = group._count._all
    }

    return NextResponse.json({
      mrr,
      newThisMonth: newSubscriptions,
      planDistribution,
      upcomingRenewals,
    })
  } catch (err) {
    console.error('[GET /api/admin/subscriptions]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
