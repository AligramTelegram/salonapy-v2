import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { StaffHeader } from '@/components/layout/StaffHeader'
import { StaffBottomNav } from '@/components/layout/StaffBottomNav'

export default async function PersonelPaneliLayout({
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

  const staff = await prisma.staff.findUnique({
    where: { supabaseId: user.id },
    include: { tenant: { select: { name: true } } },
  })

  if (!staff) {
    const owner = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { tenant: true },
    })
    if (owner) redirect(`/b/${owner.tenant.slug}`)
    redirect('/giris?error=not-staff')
  }

  if (staff.slug !== params.slug) {
    redirect(`/p/${staff.slug}`)
  }

  if (!staff.isActive) {
    redirect('/giris?error=staff-inactive')
  }

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      <StaffHeader
        staffName={staff.name}
        tenantName={staff.tenant.name}
        avatarUrl={staff.avatarUrl}
      />
      <main className="pb-24 pt-5 px-4 max-w-lg mx-auto">
        {children}
      </main>
      <StaffBottomNav slug={params.slug} />
    </div>
  )
}
