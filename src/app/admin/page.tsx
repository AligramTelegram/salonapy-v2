export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { getPlanPricesTRY } from '@/lib/plans'
import { subMonths, startOfMonth, format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Building2, TrendingUp, DollarSign, MessageCircle, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { AdminRevenueChart } from '@/components/admin/AdminRevenueChart'

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

async function getAdminStats() {
  const sixMonthsAgo = subMonths(startOfMonth(new Date()), 5)

  const [allTenants, waAgg, recentTenants, transactions] = await Promise.all([
    prisma.tenant.findMany({ select: { id: true, plan: true, isActive: true, waUsed: true } }),
    prisma.tenant.aggregate({ _sum: { waUsed: true } }),
    prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true, name: true, slug: true, plan: true, isActive: true, createdAt: true,
        _count: { select: { appointments: true, customers: true } },
      },
    }),
    prisma.transaction.findMany({
      where: { type: 'GELIR', date: { gte: sixMonthsAgo } },
      select: { amount: true, date: true },
    }),
  ])

  const totalTenants = allTenants.length
  const activeTenants = allTenants.filter((t) => t.isActive).length
  const planPrices = await getPlanPricesTRY()
  const mrr = allTenants.filter((t) => t.isActive).reduce((s, t) => s + (planPrices[t.plan] ?? 0), 0)
  const waUsedTotal = waAgg._sum.waUsed ?? 0

  const months = Array.from({ length: 6 }, (_, i) => subMonths(startOfMonth(new Date()), 5 - i))
  const mrrTrend = months.map((month) => {
    const key = format(month, 'yyyy-MM')
    const revenue = transactions
      .filter((t) => format(new Date(t.date), 'yyyy-MM') === key)
      .reduce((sum, t) => sum + t.amount, 0)
    return { month: format(month, 'MMM yy', { locale: tr }), revenue }
  })

  return { totalTenants, activeTenants, mrr, waUsedTotal, recentTenants, mrrTrend }
}

export default async function AdminDashboardPage() {
  const { totalTenants, activeTenants, mrr, waUsedTotal, recentTenants, mrrTrend } =
    await getAdminStats()

  const stats = [
    {
      label: 'Toplam İşletme',
      value: totalTenants.toString(),
      sub: `${activeTenants} aktif`,
      icon: Building2,
      bg: 'bg-blue-500',
    },
    {
      label: 'Aktif Abonelikler',
      value: activeTenants.toString(),
      sub: `${totalTenants - activeTenants} pasif`,
      icon: TrendingUp,
      bg: 'bg-purple-500',
    },
    {
      label: 'Tahmini MRR',
      value: `₺${mrr.toLocaleString('tr-TR')}`,
      sub: 'hedef aylık gelir',
      icon: DollarSign,
      bg: 'bg-emerald-500',
    },
    {
      label: 'WA Kullanımı',
      value: waUsedTotal.toLocaleString('tr-TR'),
      sub: 'bu ay gönderilen',
      icon: MessageCircle,
      bg: 'bg-orange-500',
    },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {format(new Date(), 'd MMMM yyyy', { locale: tr })} — Sistem özeti
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs font-semibold text-gray-500 truncate">{s.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5 truncate">{s.value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Gelir Trendi</h2>
              <p className="text-xs text-gray-400 mt-0.5">Son 6 ay işlem gelirleri</p>
            </div>
          </div>
          <AdminRevenueChart data={mrrTrend} />
        </div>

        {/* Recent tenants */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Son İşletmeler</h2>
            <Link
              href="/admin/isletmeler"
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-0.5"
            >
              Tümü <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentTenants.map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <Building2 className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{t.name}</p>
                  <p className="text-[11px] text-gray-400">
                    {t._count.appointments} randevu · {t._count.customers} müşteri
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    PLAN_COLORS[t.plan] ?? 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {PLAN_LABELS[t.plan]}
                </span>
              </div>
            ))}
            {recentTenants.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">İşletme bulunamadı</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
