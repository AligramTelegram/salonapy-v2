export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { getPlanPricesTRY } from '@/lib/plans'
import { startOfMonth, endOfMonth, addDays, format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { CreditCard, TrendingUp, Building2, ChevronRight, LayoutTemplate } from 'lucide-react'
import { PlanEditor } from '@/components/admin/PlanEditor'

const PLAN_LABELS: Record<string, string> = {
  BASLANGIC: 'Başlangıç',
  PROFESYONEL: 'Profesyonel',
  ISLETME: 'İşletme',
}
const PLAN_COLORS: Record<string, string> = {
  BASLANGIC: 'bg-blue-100 text-blue-700',
  PROFESYONEL: 'bg-purple-100 text-purple-700',
  ISLETME: 'bg-amber-100 text-amber-700',
}

async function getSubscriptionData() {
  const today = new Date()
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)
  const next30Days = addDays(today, 30)

  const [activeTenants, planGroups, newSubscriptions, upcomingRenewals] = await Promise.all([
    prisma.tenant.findMany({
      where: { isActive: true },
      select: { plan: true },
    }),
    prisma.tenant.groupBy({
      by: ['plan'],
      where: { isActive: true },
      _count: { _all: true },
    }),
    prisma.subscription.count({
      where: { createdAt: { gte: monthStart, lte: monthEnd } },
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
  for (const g of planGroups) {
    planDistribution[g.plan] = g._count._all
  }

  return { mrr, newSubscriptions, planDistribution, upcomingRenewals, total: activeTenants.length, planPrices }
}

export default async function AboneliklerPage() {
  const { mrr, newSubscriptions, planDistribution, upcomingRenewals, total, planPrices } =
    await getSubscriptionData()

  const maxPlanCount = Math.max(...Object.values(planDistribution), 1)

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Abonelikler</h1>
        <p className="text-sm text-gray-500 mt-0.5">{total} aktif işletme</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center mb-3">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <p className="text-xs font-semibold text-gray-500">Tahmini MRR</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">₺{mrr.toLocaleString('tr-TR')}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">tüm aktif planlar</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center mb-3">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <p className="text-xs font-semibold text-gray-500">Bu Ay Yeni</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{newSubscriptions}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">yeni abonelik kaydı</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center mb-3">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <p className="text-xs font-semibold text-gray-500">Yaklaşan Yenileme</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{upcomingRenewals.length}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">30 gün içinde</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Plan distribution */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Plan Dağılımı</h2>
          <div className="space-y-4">
            {Object.entries(planDistribution).map(([plan, count]) => (
              <div key={plan}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${PLAN_COLORS[plan]}`}>
                    {PLAN_LABELS[plan]}
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">{count}</span>
                    <span className="text-gray-400 ml-1">işletme</span>
                    <span className="text-gray-300 mx-1">·</span>
                    <span className="text-gray-500 text-xs">
                      ₺{((planPrices[plan] ?? 0) * count).toLocaleString('tr-TR')}/ay
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      plan === 'BASLANGIC' ? 'bg-blue-400' :
                      plan === 'PROFESYONEL' ? 'bg-purple-500' : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.round((count / maxPlanCount) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-600">Toplam MRR Hedefi</span>
              <span className="font-bold text-emerald-600">₺{mrr.toLocaleString('tr-TR')}/ay</span>
            </div>
          </div>
        </div>

        {/* Upcoming renewals */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Yaklaşan Yenilemeler</h2>
          {upcomingRenewals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CreditCard className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">30 gün içinde yenilenecek plan yok</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {upcomingRenewals.map((t) => (
                <div key={t.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <Building2 className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{t.name}</p>
                      <p className="text-[11px] text-gray-400">
                        {t.planEndsAt
                          ? format(new Date(t.planEndsAt), 'd MMM yyyy', { locale: tr })
                          : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PLAN_COLORS[t.plan]}`}>
                      {PLAN_LABELS[t.plan]}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      ₺{(t.subscription?.amount ?? planPrices[t.plan] ?? 0).toLocaleString('tr-TR')}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Plan İçerik Editörü */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <LayoutTemplate className="h-4 w-4 text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900">Plan İçerikleri</h2>
          <span className="text-xs text-gray-400">— vitrin sitesinde görünen bilgiler</span>
        </div>
        <PlanEditor />
      </div>
    </div>
  )
}
