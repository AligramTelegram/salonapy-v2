import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getPlans } from '@/lib/plans'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { TrialBanner } from '@/components/layout/TrialBanner'
import { UpgradeCards } from './upgrade/UpgradeCards'
import { AlertCircle } from 'lucide-react'

// Kritik yol dışı — sayfa interaktif olduktan sonra yükle
const AnnouncementPopup = dynamic(() => import('@/components/dashboard/AnnouncementPopup').then(m => ({ default: m.AnnouncementPopup })), { ssr: false })
const GrowthTip = dynamic(() => import('@/components/dashboard/GrowthTip').then(m => ({ default: m.GrowthTip })), { ssr: false })
const ProfileCompletePopup = dynamic(() => import('@/components/dashboard/ProfileCompletePopup').then(m => ({ default: m.ProfileCompletePopup })), { ssr: false })
const WelcomeSetupPopup = dynamic(() => import('@/components/dashboard/WelcomeSetupPopup').then(m => ({ default: m.WelcomeSetupPopup })), { ssr: false })

export default async function IsletmePaneliLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/giris')
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: {
      tenant: {
        include: {
          subscription: true,
        },
      },
    },
  })

  if (!dbUser) {
    redirect('/giris?error=user-not-found')
  }

  if (dbUser.tenant.slug !== params.slug) {
    redirect(`/b/${dbUser.tenant.slug}`)
  }

  if (!dbUser.tenant.isActive) {
    redirect('/giris?error=tenant-inactive')
  }


  // smsLimit: plans cache'den al (5dk TTL, DB hit yok)
  const plans = await getPlans()
  const smsLimit = plans[dbUser.tenant.plan as keyof typeof plans]?.smsLimit ?? 200

  const sub = dbUser.tenant.subscription
  const now = Date.now()

  const isTrialActive =
    sub?.status === 'TRIAL' &&
    dbUser.tenant.plan === 'BASLANGIC' &&
    sub.endDate != null &&
    new Date(sub.endDate).getTime() > now

  const hasActiveSubscription = sub?.status === 'ACTIVE'

  const isTrialExpired =
    sub?.status === 'TRIAL' &&
    sub.endDate != null &&
    new Date(sub.endDate).getTime() <= now

  const isBlocked = isTrialExpired && !hasActiveSubscription

  const trialDaysLeft = isTrialActive
    ? Math.max(0, Math.ceil((new Date(sub!.endDate).getTime() - now) / (1000 * 60 * 60 * 24)))
    : null

  // Trial süresi dolmuşsa redirect yerine doğrudan upgrade UI'ı göster.
  // redirect() RSC soft-navigation'da blank page açabiliyor; inline render güvenilir.
  if (isBlocked) {
    const planData = {
      BASLANGIC: {
        name: plans.BASLANGIC.name,
        price: plans.BASLANGIC.priceTRY.toLocaleString('tr-TR'),
        smsLimit: plans.BASLANGIC.smsLimit,
        description: plans.BASLANGIC.description,
        popular: plans.BASLANGIC.popular,
        features: plans.BASLANGIC.features,
      },
      PROFESYONEL: {
        name: plans.PROFESYONEL.name,
        price: plans.PROFESYONEL.priceTRY.toLocaleString('tr-TR'),
        smsLimit: plans.PROFESYONEL.smsLimit,
        description: plans.PROFESYONEL.description,
        popular: plans.PROFESYONEL.popular,
        features: plans.PROFESYONEL.features,
      },
      ISLETME: {
        name: plans.ISLETME.name,
        price: plans.ISLETME.priceTRY.toLocaleString('tr-TR'),
        smsLimit: plans.ISLETME.smsLimit,
        description: plans.ISLETME.description,
        popular: plans.ISLETME.popular,
        features: plans.ISLETME.features,
      },
    }

    return (
      <div className="flex min-h-screen bg-[#faf8ff]">
        <Sidebar
          slug={params.slug}
          tenantName={dbUser.tenant.name}
          plan={dbUser.tenant.plan}
          smsUsed={dbUser.tenant.smsUsed}
          smsLimit={smsLimit}
          trialExpired={true}
        />
        <div className="flex flex-1 flex-col min-w-0">
          <DashboardHeader
            slug={params.slug}
            tenantName={dbUser.tenant.name}
            tenantLogo={dbUser.tenant.logo}
            userName={dbUser.name}
            userEmail={dbUser.email}
            userAvatarUrl={dbUser.avatarUrl}
          />
          <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
            <div className="p-6 lg:p-8 space-y-6">
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-base font-bold text-red-800">Deneme Süreniz Sona Erdi</h2>
                  <p className="text-sm text-red-700 mt-0.5">
                    Hemensalon&apos;yi kullanmaya devam etmek için aşağıdan bir paket seçin.
                  </p>
                </div>
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-gray-900">Paketi Yükselt</h1>
                <p className="text-sm text-gray-500 mt-1">İhtiyacınıza göre en uygun planı seçin.</p>
              </div>
              <UpgradeCards
                slug={params.slug}
                currentPlan={dbUser.tenant.plan}
                hasActiveSubscription={false}
                plans={planData}
              />
            </div>
          </main>
        </div>
        <BottomNav slug={params.slug} plan={dbUser.tenant.plan} />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#faf8ff]">
      <Sidebar
        slug={params.slug}
        tenantName={dbUser.tenant.name}
        plan={dbUser.tenant.plan}
        smsUsed={dbUser.tenant.smsUsed}
        smsLimit={smsLimit}
        trialExpired={false}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader
          slug={params.slug}
          tenantName={dbUser.tenant.name}
          userName={dbUser.name}
          userEmail={dbUser.email}
          userAvatarUrl={dbUser.avatarUrl}
        />
        {isTrialActive && trialDaysLeft !== null && (
          <TrialBanner daysLeft={trialDaysLeft} slug={params.slug} />
        )}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          {children}
        </main>
      </div>
      <BottomNav slug={params.slug} plan={dbUser.tenant.plan} />
      <AnnouncementPopup />
      <GrowthTip />
      {!dbUser.tenant.phone && (
        <WelcomeSetupPopup slug={params.slug} />
      )}
    </div>
  )
}
