import { prisma } from '@/lib/prisma'
import { hasFeature } from '@/lib/plan-features'
import { LockedFeature } from '@/components/ui/LockedFeature'
import PaketlerContent from './PaketlerContent'

export default async function PaketlerPage({ params }: { params: { slug: string } }) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: params.slug },
    select: { plan: true },
  })

  if (!tenant || !hasFeature(tenant.plan, 'packages')) {
    return <LockedFeature featureName="Paketler" slug={params.slug} />
  }

  return <PaketlerContent />
}
