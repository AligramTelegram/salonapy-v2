import { prisma } from '@/lib/prisma'
import { getPlans } from '@/lib/plans'
import { UpgradeCards } from './UpgradeCards'
import { AlertCircle } from 'lucide-react'

export default async function UpgradePage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams?: { trial_expired?: string }
}) {
  const trialExpired = searchParams?.trial_expired === 'true'
  const [tenant, plans] = await Promise.all([
    prisma.tenant.findUnique({
      where: { slug: params.slug },
      select: {
        plan: true,
        subscription: { select: { status: true, endDate: true } },
      },
    }),
    getPlans(),
  ])

  const currentPlan = tenant?.plan ?? 'BASLANGIC'
  const sub = tenant?.subscription
  const now = new Date()
  const hasActiveSubscription =
    sub?.status === 'ACTIVE' ||
    (sub?.status === 'TRIAL' && sub.endDate != null && new Date(sub.endDate) > now)

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
      {trialExpired && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-base font-bold text-red-800">Deneme Süreniz Sona Erdi</h2>
            <p className="text-sm text-red-700 mt-0.5">
              Hemensalon&apos;yi kullanmaya devam etmek için aşağıdan bir paket seçin.
            </p>
          </div>
        </div>
      )}

      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Paketi Yükselt</h1>
        <p className="text-sm text-gray-500 mt-1">
          İhtiyacınıza göre en uygun planı seçin.
        </p>
      </div>

      <UpgradeCards
        slug={params.slug}
        currentPlan={currentPlan}
        hasActiveSubscription={hasActiveSubscription}
        plans={planData}
      />
    </div>
  )
}
