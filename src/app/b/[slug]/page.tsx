export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Calendar, TrendingUp, TrendingDown, DollarSign, Plus, ChevronRight, CheckCircle2, Circle } from 'lucide-react'
import { startOfMonth, endOfMonth, formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { prisma } from '@/lib/prisma'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { AppointmentList } from '@/components/dashboard/AppointmentList'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { Button } from '@/components/ui/button'
import { UpgradeSuccessToast } from '@/components/dashboard/UpgradeSuccessToast'
import type { ActivityItem } from '@/components/dashboard/ActivityFeed'
import type { AppointmentFull } from '@/hooks/useAppointments'

async function getDashboardData(slug: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
  })

  if (!tenant) return null

  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)

  const [todayAppointments, monthCount, monthRevenue, monthExpense, recentAppointments, customersCount, servicesCount, staffCount] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        tenantId: tenant.id,
        date: { gte: todayStart, lt: todayEnd },
      },
      include: { customer: true, service: true, staff: true },
      orderBy: { startTime: 'asc' },
    }),
    // count ile tüm kayıtları çekmiyoruz
    prisma.appointment.count({
      where: {
        tenantId: tenant.id,
        date: { gte: monthStart, lte: monthEnd },
      },
    }),
    // Sadece GELIR tipi işlemler
    prisma.transaction.aggregate({
      where: {
        tenantId: tenant.id,
        type: 'GELIR',
        date: { gte: monthStart, lte: monthEnd },
      },
      _sum: { amount: true },
    }),
    // Sadece GIDER tipi işlemler
    prisma.transaction.aggregate({
      where: {
        tenantId: tenant.id,
        type: 'GIDER',
        date: { gte: monthStart, lte: monthEnd },
      },
      _sum: { amount: true },
    }),
    prisma.appointment.findMany({
      where: {
        tenantId: tenant.id,
      },
      include: {
        customer: true,
        service: true,
        staff: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 6,
    }),
    prisma.customer.count({ where: { tenantId: tenant.id } }),
    prisma.service.count({ where: { tenantId: tenant.id } }),
    prisma.staff.count({ where: { tenantId: tenant.id } }),
  ])

  return {
    tenant,
    todayAppointments,
    monthCount,
    monthRevenue: monthRevenue._sum.amount ?? 0,
    monthExpense: monthExpense._sum.amount ?? 0,
    recentAppointments,
    customersCount,
    servicesCount,
    staffCount,
    today,
  }
}

export default async function IsletmeDashboardPage({
  params,
}: {
  params: { slug: string }
}) {
  const data = await getDashboardData(params.slug)
  if (!data) {
    notFound()
  }

  if (!data.tenant.onboardingCompleted) {
    redirect(`/b/${params.slug}/onboarding`)
  }

  const {
    today,
    todayAppointments,
    monthCount,
    monthRevenue,
    monthExpense,
    recentAppointments,
    customersCount,
    servicesCount,
    staffCount,
    tenant,
  } = data

  const setupSteps = [
    { label: 'Hizmet ekle', done: servicesCount > 0, href: `/b/${params.slug}/hizmetler` },
    { label: 'Personel ekle', done: staffCount > 0, href: `/b/${params.slug}/calisanlar` },
    { label: 'Logo yükle', done: !!tenant.logo, href: `/b/${params.slug}/ayarlar` },
    { label: 'İlk randevunu al', done: customersCount > 0, href: `/b/${params.slug}/randevular` },
  ]
  const setupDone = setupSteps.filter(s => s.done).length
  const showSetupCard = setupDone < setupSteps.length

  const todayLabel = today.toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const statistics = {
    todayCount: todayAppointments.length,
    monthCount,
    monthRevenue,
    monthExpense,
    netProfit: monthRevenue - monthExpense,
    customerCount: customersCount,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serializedTodayAppointments = todayAppointments.map((apt) => ({
    ...apt,
    date: apt.date.toISOString(),
    createdAt: apt.createdAt.toISOString(),
    updatedAt: apt.updatedAt.toISOString(),
  })) as unknown as AppointmentFull[]

  const recentActivities: ActivityItem[] = recentAppointments.map((apt) => {
    const type: ActivityItem['type'] =
      apt.status === 'TAMAMLANDI'
        ? 'RANDEVU_TAMAMLANDI'
        : apt.status === 'IPTAL'
        ? 'RANDEVU_IPTAL'
        : 'RANDEVU_OLUSTURULDU'

    const relativeTime = formatDistanceToNow(new Date(apt.updatedAt), {
      addSuffix: true,
      locale: tr,
    })

    return {
      id: apt.id,
      type,
      title:
        type === 'RANDEVU_OLUSTURULDU'
          ? 'Yeni randevu oluşturuldu'
          : type === 'RANDEVU_TAMAMLANDI'
          ? 'Randevu tamamlandı'
          : 'Randevu iptal edildi',
      description: `${apt.customer.name} — ${apt.service.name}, ${apt.startTime}`,
      time: relativeTime,
    }
  })

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Paket yükseltme başarı toastı */}
      <Suspense>
        <UpgradeSuccessToast />
      </Suspense>

      {/* Kurulum ilerleme kartı */}
      {showSetupCard && (
        <div className="rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Kurulumu tamamlayın</h2>
              <p className="text-xs text-gray-500 mt-0.5">{setupDone}/{setupSteps.length} adım tamamlandı</p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
              %{Math.round((setupDone / setupSteps.length) * 100)}
            </span>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-1.5 mb-4">
            <div
              className="bg-purple-600 h-1.5 rounded-full transition-all"
              style={{ width: `${(setupDone / setupSteps.length) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {setupSteps.map(step => (
              <Link
                key={step.label}
                href={step.href}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors
                  ${step.done ? 'bg-green-50 text-green-700 pointer-events-none' : 'bg-white hover:bg-purple-50 text-gray-700 border border-gray-100'}`}
              >
                {step.done
                  ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  : <Circle className="w-4 h-4 text-gray-300 shrink-0" />}
                {step.label}
                {!step.done && <ChevronRight className="w-3.5 h-3.5 ml-auto text-gray-400" />}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Başlık */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Hoş geldiniz 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500 capitalize">{todayLabel}</p>
        </div>
        <Link href={`/b/${params.slug}/randevular`}>
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200/60 shrink-0"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Randevu Ekle
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
        <StatsCard
          title="Bugün"
          value={statistics.todayCount.toString()}
          icon={Calendar}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          subtitle={`${statistics.monthCount} randevu bu ay`}
        />
        <StatsCard
          title="Bu Ay"
          value={statistics.monthCount.toString()}
          icon={Calendar}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          subtitle={`${statistics.customerCount} toplam müşteri`}
        />
        <StatsCard
          title="Aylık Gelir"
          value={`₺${statistics.monthRevenue.toLocaleString('tr-TR')}`}
          icon={TrendingUp}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <StatsCard
          title="Aylık Gider"
          value={`₺${statistics.monthExpense.toLocaleString('tr-TR')}`}
          icon={TrendingDown}
          iconBg="bg-red-100"
          iconColor="text-red-500"
        />
        <StatsCard
          title="Net Kar/Zarar"
          value={`₺${statistics.netProfit.toLocaleString('tr-TR')}`}
          icon={DollarSign}
          iconBg={statistics.netProfit >= 0 ? 'bg-emerald-100' : 'bg-red-100'}
          iconColor={statistics.netProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}
          subtitle={statistics.netProfit >= 0 ? 'Kâr' : 'Zarar'}
        />
      </div>

      {/* Alt bölüm: Bugünün randevuları + Aktiviteler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Bugünün randevuları */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-bold text-gray-900">Bugünün Randevuları</h2>
            <Link
              href={`/b/${params.slug}/randevular`}
              className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
            >
              Tümünü Gör
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <AppointmentList appointments={serializedTodayAppointments} slug={params.slug} />
        </div>

        {/* Son Aktiviteler */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-bold text-gray-900">Son Aktiviteler</h2>
          </div>
          <ActivityFeed activities={recentActivities} />
        </div>
      </div>
    </div>
  )
}
