import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { TrialBanner } from '@/components/layout/TrialBanner'

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

  // Trial banner: sadece BAŞLANGIÇ + TRIAL durumunda
  const sub = dbUser.tenant.subscription
  const isTrialActive =
    sub?.status === 'TRIAL' &&
    dbUser.tenant.plan === 'BASLANGIC' &&
    sub.endDate != null

  const trialDaysLeft = isTrialActive
    ? Math.max(0, Math.ceil((new Date(sub!.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  return (
    <div className="flex min-h-screen bg-[#faf8ff]">
      {/* Sidebar - sadece desktop */}
      <Sidebar
        slug={params.slug}
        tenantName={dbUser.tenant.name}
        plan={dbUser.tenant.plan}
        smsUsed={dbUser.tenant.smsUsed}
      />

      {/* Sağ taraf: header + content */}
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader
          slug={params.slug}
          tenantName={dbUser.tenant.name}
          userName={dbUser.name}
          userEmail={dbUser.email}
          userAvatarUrl={dbUser.avatarUrl}
        />
        {/* Trial banner — sadece BAŞLANGIÇ trial kullanıcılarında */}
        {isTrialActive && trialDaysLeft !== null && (
          <TrialBanner daysLeft={trialDaysLeft} slug={params.slug} />
        )}
        {/* Ana içerik */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom nav - sadece mobil */}
      <BottomNav slug={params.slug} />
    </div>
  )
}
