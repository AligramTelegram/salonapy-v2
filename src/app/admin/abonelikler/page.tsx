export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { getPlanPricesTRY } from '@/lib/plans'
import { startOfMonth, endOfMonth, addDays, format, differenceInDays } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
  CreditCard, TrendingUp, Building2, ChevronRight, LayoutTemplate,
  Bot, Clock, FlaskConical, Zap, MessageCircle, Sparkles, Camera,
} from 'lucide-react'
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

// AI paket fiyatları (ai-packages.ts ile senkron)
const AI_PRICE_WA = 350
const AI_PRICE_IG = 350
const AI_PRICE_COMBO = 600

async function getSubscriptionData() {
  const today = new Date()
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)
  const next5Days = addDays(today, 5)

  const [
    // Gerçek ödemeli: ACTIVE plan, süresi dolmamış
    payingTenants,
    // Tüm aktif (plan dağılımı için)
    planGroups,
    newSubscriptions,
    upcomingRenewals,
    trialTenants,
    // Süresi dolmuş / yenilenmeyen işletmeler
    expiredTenants,
    aiTenants,
    aiUpcoming,
  ] = await Promise.all([
    prisma.tenant.findMany({
      where: {
        isActive: true,
        subscription: { status: 'ACTIVE' },
        planEndsAt: { gte: today },
      },
      select: { plan: true, whatsappAIEnabled: true, instagramAIEnabled: true, whatsappAIEndsAt: true, instagramAIEndsAt: true },
    }),
    prisma.tenant.groupBy({
      by: ['plan'],
      where: {
        isActive: true,
        subscription: { status: 'ACTIVE' },
        planEndsAt: { gte: today },
      },
      _count: { _all: true },
    }),
    prisma.subscription.count({
      where: { status: 'ACTIVE', createdAt: { gte: monthStart, lte: monthEnd } },
    }),
    // Yaklaşan plan yenilemeleri (5 gün içinde, ödemeli)
    prisma.tenant.findMany({
      where: {
        isActive: true,
        planEndsAt: { gte: today, lte: next5Days },
        subscription: { status: 'ACTIVE' },
      },
      select: {
        id: true, name: true, slug: true, plan: true, planEndsAt: true,
        subscription: { select: { amount: true, autoRenew: true } },
      },
      orderBy: { planEndsAt: 'asc' },
    }),
    // Deneme (TRIAL) işletmeleri
    prisma.tenant.findMany({
      where: {
        isActive: true,
        subscription: { status: 'TRIAL' },
      },
      select: {
        id: true, name: true, slug: true, plan: true, createdAt: true,
        subscription: { select: { endDate: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    // Süresi dolmuş veya yenilenmeyen işletmeler (aktif ama plan süresi geçmiş)
    prisma.tenant.findMany({
      where: {
        isActive: true,
        OR: [
          { planEndsAt: { lt: today }, subscription: { status: { not: 'TRIAL' } } },
          { subscription: { status: { notIn: ['ACTIVE', 'TRIAL'] } } },
        ],
      },
      select: { id: true, name: true, plan: true, planEndsAt: true, subscription: { select: { status: true, endDate: true } } },
      orderBy: { planEndsAt: 'asc' },
    }),
    // Aktif AI paketleri olan işletmeler
    prisma.tenant.findMany({
      where: {
        isActive: true,
        OR: [{ whatsappAIEnabled: true }, { instagramAIEnabled: true }],
      },
      select: {
        id: true, name: true, slug: true,
        whatsappAIEnabled: true, whatsappAIEndsAt: true, whatsappMessagesUsed: true, whatsappMessagesLimit: true,
        instagramAIEnabled: true, instagramAIEndsAt: true, instagramMessagesUsed: true, instagramMessagesLimit: true,
      },
      orderBy: { name: 'asc' },
    }),
    // Yaklaşan AI yenilemeleri (5 gün içinde)
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

  // GERÇEK MRR: sadece aktif ödemeli planlar (TRIAL ve süresi dolmuş hariç)
  const planMrr = payingTenants.reduce((sum, t) => sum + (planPrices[t.plan] ?? 0), 0)

  // GERÇEK AI MRR: sadece süresi dolmamış AI paketleri
  const aiMrr = payingTenants.reduce((sum, t) => {
    const waActive = t.whatsappAIEnabled && t.whatsappAIEndsAt && new Date(t.whatsappAIEndsAt) >= today
    const igActive = t.instagramAIEnabled && t.instagramAIEndsAt && new Date(t.instagramAIEndsAt) >= today
    if (waActive && igActive) return sum + AI_PRICE_COMBO
    if (waActive) return sum + AI_PRICE_WA
    if (igActive) return sum + AI_PRICE_IG
    return sum
  }, 0)

  // TAHMİNİ POTANSIYEL: deneme + süresi dolmuş işletmeler ödeme yaparsa
  const trialPotential = trialTenants.reduce((sum, t) => sum + (planPrices[t.plan] ?? planPrices['BASLANGIC'] ?? 0), 0)
  const expiredPotential = expiredTenants.reduce((sum, t) => sum + (planPrices[t.plan] ?? 0), 0)
  const estimatedPotential = trialPotential + expiredPotential

  const planDistribution: Record<string, number> = { BASLANGIC: 0, PROFESYONEL: 0, ISLETME: 0 }
  for (const g of planGroups) planDistribution[g.plan] = g._count._all

  return {
    planMrr, aiMrr, totalMrr: planMrr + aiMrr,
    estimatedPotential, trialPotential, expiredPotential,
    newSubscriptions, planDistribution,
    upcomingRenewals,
    trialTenants,
    expiredTenants,
    aiTenants,
    aiUpcoming,
    total: payingTenants.length,
    planPrices,
  }
}

function daysLeft(date: Date | null | undefined) {
  if (!date) return null
  return differenceInDays(new Date(date), new Date())
}

function urgencyColor(days: number | null) {
  if (days === null) return 'text-gray-400'
  if (days <= 3) return 'text-red-600 font-bold'
  if (days <= 7) return 'text-orange-500 font-semibold'
  return 'text-gray-500'
}

export default async function AboneliklerPage() {
  const {
    planMrr, aiMrr, totalMrr,
    estimatedPotential, trialPotential, expiredPotential,
    newSubscriptions, planDistribution,
    upcomingRenewals, trialTenants, expiredTenants, aiTenants, aiUpcoming,
    total, planPrices,
  } = await getSubscriptionData()

  const maxPlanCount = Math.max(...Object.values(planDistribution), 1)

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Abonelikler</h1>
        <p className="text-sm text-gray-500 mt-0.5">{total} ödemeli aktif işletme</p>
      </div>

      {/* Stats — 4 kart */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* GERÇEK KAZANÇ */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center mb-3">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Gerçek MRR</p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">₺{totalMrr.toLocaleString('tr-TR')}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Plan ₺{planMrr.toLocaleString('tr-TR')} + AI ₺{aiMrr.toLocaleString('tr-TR')}
          </p>
        </div>

        {/* TAHMİNİ POTANSIYEL */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 shadow-sm border border-amber-100">
          <div className="h-9 w-9 rounded-xl bg-amber-500 flex items-center justify-center mb-3">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wide">Tahmini Potansiyel</p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">₺{estimatedPotential.toLocaleString('tr-TR')}</p>
          <p className="text-[11px] text-amber-500 mt-0.5">
            Deneme ₺{trialPotential.toLocaleString('tr-TR')} + Süresi dolan ₺{expiredPotential.toLocaleString('tr-TR')}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="h-9 w-9 rounded-xl bg-purple-500 flex items-center justify-center mb-3">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">AI Gelirim</p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">₺{aiMrr.toLocaleString('tr-TR')}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{aiTenants.length} aktif AI paketi</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="h-9 w-9 rounded-xl bg-amber-500 flex items-center justify-center mb-3">
            <Clock className="h-4 w-4 text-white" />
          </div>
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Yenileme</p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">{upcomingRenewals.length}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">5 gün içinde plan</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="h-9 w-9 rounded-xl bg-sky-500 flex items-center justify-center mb-3">
            <FlaskConical className="h-4 w-4 text-white" />
          </div>
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Deneme / Süresi Dolmuş</p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">{trialTenants.length + expiredTenants.length}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{trialTenants.length} deneme · {expiredTenants.length} süresi dolmuş</p>
        </div>
      </div>

      {/* Plan dağılımı + Yaklaşan plan yenilemeler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                    <span className="text-gray-500 text-xs">₺{((planPrices[plan] ?? 0) * count).toLocaleString('tr-TR')}/ay</span>
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
          <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between text-sm">
            <span className="font-semibold text-gray-600">Plan MRR</span>
            <span className="font-bold text-emerald-600">₺{planMrr.toLocaleString('tr-TR')}/ay</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Yaklaşan Plan Yenilemeleri</h2>
          {upcomingRenewals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CreditCard className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">5 gün içinde yenilenecek plan yok</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {upcomingRenewals.map((t) => {
                const days = daysLeft(t.planEndsAt)
                return (
                  <div key={t.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                        <Building2 className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">{t.name}</p>
                        <p className={`text-[11px] ${urgencyColor(days)}`}>
                          {t.planEndsAt ? format(new Date(t.planEndsAt), 'd MMM yyyy', { locale: tr }) : '—'}
                          {days !== null && ` · ${days} gün`}
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
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* AI Paketleri + Yaklaşan AI yenileme */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Aktif AI Paketleri</h2>
            <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">
              ₺{aiMrr.toLocaleString('tr-TR')}/ay
            </span>
          </div>
          {aiTenants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bot className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">Henüz aktif AI paketi yok</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {aiTenants.map((t) => {
                const isCombo = t.whatsappAIEnabled && t.instagramAIEnabled
                const price = isCombo ? AI_PRICE_COMBO : t.whatsappAIEnabled ? AI_PRICE_WA : AI_PRICE_IG
                const waUsedPct = t.whatsappAIEnabled
                  ? Math.min(100, Math.round((t.whatsappMessagesUsed / t.whatsappMessagesLimit) * 100))
                  : null
                const igUsedPct = t.instagramAIEnabled
                  ? Math.min(100, Math.round((t.instagramMessagesUsed / t.instagramMessagesLimit) * 100))
                  : null
                return (
                  <div key={t.id} className="py-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                      <div className="flex items-center gap-1.5">
                        {isCombo && (
                          <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Combo
                          </span>
                        )}
                        <span className="text-sm font-bold text-purple-700">₺{price}/ay</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {waUsedPct !== null && (
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                          <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div className={`h-full rounded-full ${waUsedPct > 80 ? 'bg-red-400' : 'bg-green-400'}`}
                              style={{ width: `${waUsedPct}%` }} />
                          </div>
                          <span className="text-[10px] text-gray-400 shrink-0 w-16 text-right">
                            {t.whatsappMessagesUsed}/{t.whatsappMessagesLimit}
                          </span>
                        </div>
                      )}
                      {igUsedPct !== null && (
                        <div className="flex items-center gap-2">
                          <Camera className="h-3.5 w-3.5 text-pink-500 shrink-0" />
                          <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div className={`h-full rounded-full ${igUsedPct > 80 ? 'bg-red-400' : 'bg-pink-400'}`}
                              style={{ width: `${igUsedPct}%` }} />
                          </div>
                          <span className="text-[10px] text-gray-400 shrink-0 w-16 text-right">
                            {t.instagramMessagesUsed}/{t.instagramMessagesLimit}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Yaklaşan AI Yenilemeleri</h2>
          {aiUpcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Zap className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">5 gün içinde yenilenecek AI paketi yok</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {aiUpcoming.map((t) => {
                const waDays = daysLeft(t.whatsappAIEndsAt)
                const igDays = daysLeft(t.instagramAIEndsAt)
                return (
                  <div key={t.id} className="py-3">
                    <p className="font-semibold text-sm text-gray-900 mb-1">{t.name}</p>
                    <div className="space-y-1">
                      {t.whatsappAIEnabled && t.whatsappAIEndsAt && waDays !== null && waDays <= 5 && (
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-[11px] text-gray-500">
                            WhatsApp — {format(new Date(t.whatsappAIEndsAt), 'd MMM', { locale: tr })}
                          </span>
                          <span className={`text-[11px] ml-auto ${urgencyColor(waDays)}`}>
                            {waDays} gün
                          </span>
                        </div>
                      )}
                      {t.instagramAIEnabled && t.instagramAIEndsAt && igDays !== null && igDays <= 5 && (
                        <div className="flex items-center gap-2">
                          <Camera className="h-3.5 w-3.5 text-pink-500" />
                          <span className="text-[11px] text-gray-500">
                            Instagram — {format(new Date(t.instagramAIEndsAt), 'd MMM', { locale: tr })}
                          </span>
                          <span className={`text-[11px] ml-auto ${urgencyColor(igDays)}`}>
                            {igDays} gün
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Potansiyel: Deneme + Süresi Dolmuş */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Deneme işletmeleri */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-sky-500" />
              Denemede Olan İşletmeler
            </h2>
            <span className="text-xs bg-sky-100 text-sky-700 font-bold px-2 py-0.5 rounded-full">
              Pot. ₺{trialPotential.toLocaleString('tr-TR')}/ay
            </span>
          </div>
          {trialTenants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <FlaskConical className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">Şu anda deneme kullanan işletme yok</p>
            </div>
          ) : (
            <div className="space-y-2">
              {trialTenants.map((t) => {
                const trialEnd = t.subscription?.endDate
                const days = daysLeft(trialEnd)
                const isExpired = days !== null && days < 0
                return (
                  <div key={t.id} className={`rounded-xl border p-3 flex items-center justify-between gap-2 ${isExpired ? 'border-red-200 bg-red-50' : 'border-sky-100 bg-sky-50'}`}>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{t.name}</p>
                      <p className="text-[10px] text-gray-500">
                        Kayıt: {format(new Date(t.createdAt), 'd MMM yyyy', { locale: tr })}
                      </p>
                    </div>
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                      isExpired ? 'bg-red-100 text-red-600' : 'bg-sky-100 text-sky-700'
                    }`}>
                      {isExpired ? 'Bitti' : `${days} gün`}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Süresi dolmuş / yenilenmeyen işletmeler */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              Süresi Dolmuş / Yenilenmeyen
            </h2>
            <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">
              Pot. ₺{expiredPotential.toLocaleString('tr-TR')}/ay
            </span>
          </div>
          {expiredTenants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Clock className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">Süresi dolmuş abonelik yok</p>
            </div>
          ) : (
            <div className="space-y-2">
              {expiredTenants.map((t) => {
                const days = daysLeft(t.planEndsAt)
                return (
                  <div key={t.id} className="rounded-xl border border-orange-100 bg-orange-50 p-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{t.name}</p>
                      <p className="text-[10px] text-gray-500">
                        {t.planEndsAt
                          ? `Bitti: ${format(new Date(t.planEndsAt), 'd MMM yyyy', { locale: tr })}`
                          : 'Bitiş tarihi yok'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PLAN_COLORS[t.plan]}`}>
                        {PLAN_LABELS[t.plan]}
                      </span>
                      {days !== null && days < 0 && (
                        <span className="text-[11px] font-bold text-red-600">{Math.abs(days)}g önce</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bu ay yeni abonelik */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
          <CreditCard className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500">Bu Ay Yeni Abonelik</p>
          <p className="text-xl font-bold text-gray-900">{newSubscriptions} kayıt</p>
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
