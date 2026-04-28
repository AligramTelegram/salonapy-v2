import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { OnboardingWizard } from './OnboardingWizard'

export default async function OnboardingPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { tenant: { select: { id: true, slug: true, name: true, phone: true, address: true, onboardingCompleted: true } } },
  })
  if (!dbUser || dbUser.tenant.slug !== params.slug) redirect('/giris')

  if (dbUser.tenant.onboardingCompleted) {
    redirect(`/b/${params.slug}`)
  }

  const [servicesCount, staffCount] = await Promise.all([
    prisma.service.count({ where: { tenantId: dbUser.tenant.id } }),
    prisma.staff.count({ where: { tenantId: dbUser.tenant.id } }),
  ])

  return (
    <OnboardingWizard
      slug={params.slug}
      initialName={dbUser.tenant.name}
      initialPhone={dbUser.tenant.phone ?? ''}
      initialAddress={dbUser.tenant.address ?? ''}
      hasServices={servicesCount > 0}
      hasStaff={staffCount > 0}
    />
  )
}
