import { prisma } from '@/lib/prisma'
import { hasFeature } from '@/lib/plan-features'
import { LockedFeature } from '@/components/ui/LockedFeature'
import RaporlarContent from './RaporlarContent'

export default async function RaporlarPage({ params }: { params: { slug: string } }) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: params.slug },
    select: { plan: true },
  })

  if (!tenant || !hasFeature(tenant.plan, 'reports')) {
    return <LockedFeature featureName="Raporlar" slug={params.slug} />
  }

  return <RaporlarContent />
}
