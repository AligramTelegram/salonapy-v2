import { prisma } from '@/lib/prisma'
import { getPlans } from '@/lib/plans'
import { UpgradeCards } from './UpgradeCards'

export default async function UpgradePage({ params }: { params: { slug: string } }) {
  const [tenant, plans] = await Promise.all([
    prisma.tenant.findUnique({
      where: { slug: params.slug },
      select: { plan: true },
    }),
    getPlans(),
  ])

  const currentPlan = tenant?.plan ?? 'BASLANGIC'

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
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Paketi Yükselt</h1>
        <p className="text-sm text-gray-500 mt-1">
          İhtiyacınıza göre en uygun planı seçin.
        </p>
      </div>

      <UpgradeCards
        slug={params.slug}
        currentPlan={currentPlan}
        plans={planData}
      />
    </div>
  )
}
