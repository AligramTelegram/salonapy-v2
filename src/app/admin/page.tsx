export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { getPlanPricesTRY } from '@/lib/plans'
import { subMonths, startOfMonth, addDays, format, differenceInDays } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
  Building2, TrendingUp, DollarSign, MessageCircle, ChevronRight,
  Bot, FlaskConical, Sparkles, AlertTriangle, Clock,
} from 'lucide-react'
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

const AI_PRICE_WA = 350
const AI_PRICE_IG = 350
const AI_PRICE_COMBO = 600

async function getAdminStats() {
  const today = new Date()
  const next5Days = addDays(today, 5)
  const sixMonthsAgo = subMonths(startOfMonth(today), 5)
  const monthStart = startOfMonth(today)

  const [
    payingTenants,
    trialCount,
    expiredCount,
    totalCount,
    waAgg,
    recentTenants,
    transactions,
    newThisMonth,
    criticalRenewals,
    criticalAiRenewals,
  ] = await Promise.all([
    // Gerçek ödemeli
    prisma.tenant.findMany({
      where: { isActive: true, subscription: { status: 'ACTIVE' }, planEndsAt: { gte: today } },
      select: { plan: true, whatsappAIEnabled: true, instagramAIEnabled: true, whatsappAIEndsAt: true, instagramAIEndsAt: true },
    }),
    // Deneme sayısı
    prisma.tenant.count({ where: { isActive: true, subscription: { status: 'TRIAL' } } }),
    // Süresi dolmuş sayısı
    prisma.tenant.count({
      where: {
        isActive: true,
        OR: [
          { planEndsAt: { lt: today }, subscription: { status: { not: 'TRIAL' } } },
          { subscription: { status: { notIn: ['ACTIVE', 'TRIAL'] } } },
        ],
      },
    }),
    // Toplam aktif işletme
    prisma.tenant.count({ where: { isActive: true } }),
    // WA kullanım toplamı
    prisma.tenant.aggregate({ _sum: { waUsed: true } }),
    // Son 5 kayıt
    prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true, name: true, slug: true, plan: true, isActive: true, createdAt: true,
        subscription: { select: { status: true } },
        _count: { select: { appointments: true, customers: true } },
      },
    }),
    // Gelir trendi (son 6 ay)
    prisma.transaction.findMany({
      where: { type: 'GELIR', date: { gte: sixMonthsAgo } },
      select: { amount: true, date: true },
    }),
    // Bu ay yeni abonelik
    prisma.subscription.count({ where: { status: 'ACTIVE', createdAt: { gte: monthStart } } }),
    // Kritik plan yenilemeleri (5 gün içinde)
    prisma.tenant.findMany({
      where: { isActive: true, planEndsAt: { gte: today, lte: next5Days }, subscription: { status: 'ACTIVE' } },
      select: { id: true, name: true, plan: true, planEndsAt: true, subscription: { select: { amount: true } } },
      orderBy: { planEndsAt: 'asc' },
    }),
    // Kritik AI yenilemeleri (5 gün içinde)
    prisma.tenant.findMany({
      where: {
        isActive: true,
        OR: [
          { whatsappAIEnabled: true, whatsappAIEndsAt: { gte: today, lte: next5Days } },
          { instagramAIEnabled: true, instagramAIEndsAt: { gte: today, lte: next5Days } },
        ],
      },
      select: {
        id: true, name: true,
        whatsappAIEnabled: true, whatsappAIEndsAt: true,
        instagramAIEnabled: true, instagramAIEndsAt: true,
      },
      orderBy: { name: 'asc' },
    }),
  ])

  const planPrices = await getPlanPricesTRY()

  // Gerçek MRR: plan + AI (sadece ödemeli ve süresi dolmamış)
  const planMrr = payingTenants.reduce((s, t) => s + (planPrices[t.plan] ?? 0), 0)
  const aiMrr = payingTenants.reduce((sum, t) => {
    const waActive = t.whatsappAIEnabled && t.whatsappAIEndsAt && new Date(t.whatsappAIEndsAt) >= today
    const igActive = t.instagramAIEnabled && t.instagramAIEndsAt && new Date(t.instagramAIEndsAt) >= today
    if (waActive && igActive) return sum + AI_PRICE_COMBO
    if (waActive) return sum + AI_PRICE_WA
    if (igActive) return sum + AI_PRICE_IG
    return sum
  }, 0)
  const totalMrr = planMrr + aiMrr

  // Tahmini potansiyel (deneme + süresi dolmuş convert olursa)
  const estimatedPotential = (trialCount + expiredCount) * (planPrices['BASLANGIC'] ?? 0)

  const months = Array.from({ length: 6 }, (_, i) => subMonths(startOfMonth(today), 5 - i))
  const mrrTrend = months.map((month) => {
    const key = format(month, 'yyyy-MM')
    const revenue = transactions
      .filter((t) => format(new Date(t.date), 'yyyy-MM') === key)
      .reduce((sum, t) => sum + t.amount, 0)
    return { month: format(month, 'MMM yy', { locale: tr }), revenue }
  })

  return {
    totalMrr, planMrr, aiMrr, estimatedPotential,
    payingCount: payingTenants.length,
    trialCount, expiredCount, totalCount,
    waUsedTotal: waAgg._sum.waUsed ?? 0,
    recentTenants, mrrTrend, newThisMonth,
    criticalRenewals, criticalAiRenewals,
    planPrices,
  }
}

function daysLeft(date: Date | string | null | undefined) {
  if (!date) return null
  return differenceInDays(new Date(date), new Date())
}

function urgencyBadge(days: number) {
  if (days <= 1) return 'bg-red-100 text-red-700'
  if (days <= 3) return 'bg-orange-100 text-orange-700'
  return 'bg-yellow-100 text-yellow-700'
}

export default async function AdminDashboardPage() {
  const {
    totalMrr, planMrr, aiMrr, estimatedPotential,
    payingCount, trialCount, expiredCount, totalCount,
    waUsedTotal, recentTenants, mrrTrend, newThisMonth,
    criticalRenewals, criticalAiRenewals,
    planPrices,
  } = await getAdminStats()

  const criticalTotal = criticalRenewals.length + criticalAiRenewals.length

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {format(new Date(), 'd MMMM yyyy', { locale: tr })} — Sistem özeti
          </p>
        </div>
        {criticalTotal > 0 && (
          <Link href="/admin/abonelikler" className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-red-100 transition-colors">
            <AlertTriangle className="h-3.5 w-3.5" />
            {criticalTotal} kritik yenileme
          </Link>
        )}
      </div>

      {/* Stats — 4 kart */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Gerçek MRR */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center mb-3">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Gerçek MRR</p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">₺{totalMrr.toLocaleString('tr-TR')}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Plan ₺{planMrr.toLocaleString('tr-TR')} · AI ₺{aiMrr.toLocaleString('tr-TR')}
          </p>
        </div>

        {/* Tahmini Potansiyel */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 shadow-sm border border-amber-100">
          <div className="h-9 w-9 rounded-xl bg-amber-500 flex items-center justify-center mb-3">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wide">Potansiyel</p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">₺{estimatedPotential.toLocaleString('tr-TR')}</p>
          <p className="text-[11px] text-amber-500 mt-0.5">{trialCount} deneme · {expiredCount} süresi dolmuş</p>
        </div>

        {/* Ödemeli İşletme */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="h-9 w-9 rounded-xl bg-blue-500 flex items-center justify-center mb-3">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Ödemeli</p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">{payingCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{totalCount} toplam · {newThisMonth} bu ay yeni</p>
        </div>

        {/* AI + WA */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="h-9 w-9 rounded-xl bg-purple-500 flex items-center justify-center mb-3">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">AI Geliri</p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">₺{aiMrr.toLocaleString('tr-TR')}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">WA {waUsedTotal.toLocaleString('tr-TR')} mesaj</p>
        </div>
      </div>

      {/* Kritik uyarı: 5 gün içinde yenileme */}
      {criticalTotal > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <h2 className="text-sm font-bold text-red-800">5 Gün İçinde Yenilenecekler</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {criticalRenewals.map((t) => {
              const days = daysLeft(t.planEndsAt)!
              return (
                <div key={t.id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-red-100">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{t.name}</p>
                    <p className="text-[10px] text-gray-500">
                      Plan · {t.planEndsAt ? format(new Date(t.planEndsAt), 'd MMM', { locale: tr }) : '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${PLAN_COLORS[t.plan]}`}>
                      {PLAN_LABELS[t.plan]}
                    </span>
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${urgencyBadge(days)}`}>
                      {days === 0 ? 'bugün' : `${days}g`}
                    </span>
                  </div>
                </div>
              )
            })}
            {criticalAiRenewals.map((t) => {
              const waDays = daysLeft(t.whatsappAIEndsAt)
              const igDays = daysLeft(t.instagramAIEndsAt)
              const minDays = Math.min(
                waDays !== null && waDays <= 5 ? waDays : 999,
                igDays !== null && igDays <= 5 ? igDays : 999,
              )
              return (
                <div key={`ai-${t.id}`} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-red-100">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{t.name}</p>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Bot className="h-3 w-3 inline" /> AI paketi
                    </p>
                  </div>
                  {minDays < 999 && (
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${urgencyBadge(minDays)}`}>
                      {minDays === 0 ? 'bugün' : `${minDays}g`}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Gelir Trendi</h2>
              <p className="text-xs text-gray-400 mt-0.5">Son 6 ay işlem gelirleri</p>
            </div>
            <Link href="/admin/abonelikler" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-0.5">
              Detay <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <AdminRevenueChart data={mrrTrend} />
        </div>

        {/* Son kayıtlar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Son İşletmeler</h2>
            <Link href="/admin/isletmeler" className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-0.5">
              Tümü <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentTenants.map((t) => {
              const isTrial = t.subscription?.status === 'TRIAL'
              return (
                <div key={t.id} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                    {isTrial
                      ? <FlaskConical className="h-4 w-4 text-sky-400" />
                      : <Building2 className="h-4 w-4 text-gray-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{t.name}</p>
                    <p className="text-[11px] text-gray-400">
                      {t._count.appointments} randevu · {t._count.customers} müşteri
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isTrial ? 'bg-sky-100 text-sky-700' : (PLAN_COLORS[t.plan] ?? 'bg-gray-100 text-gray-600')
                  }`}>
                    {isTrial ? 'Deneme' : (PLAN_LABELS[t.plan] ?? t.plan)}
                  </span>
                </div>
              )
            })}
            {recentTenants.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">İşletme bulunamadı</p>
            )}
          </div>
        </div>
      </div>

      {/* Hızlı linkler */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Abonelikler', href: '/admin/abonelikler', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'İşletmeler', href: '/admin/isletmeler', icon: Building2, color: 'text-blue-600 bg-blue-50' },
          { label: 'AI Yönetim', href: '/admin/ai', icon: Bot, color: 'text-purple-600 bg-purple-50' },
          { label: 'SMS', href: '/admin/sms', icon: MessageCircle, color: 'text-orange-600 bg-orange-50' },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all"
          >
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${item.color}`}>
              <item.icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-gray-700">{item.label}</span>
            <ChevronRight className="h-4 w-4 text-gray-300 ml-auto" />
          </Link>
        ))}
      </div>
    </div>
  )
}
