import { NextResponse } from 'next/server'
import { getPlans } from '@/lib/plans'

export const dynamic = 'force-dynamic'

export interface PlanConfig {
  name: string
  price: string
  priceEur: string
  priceUsd: string
  smsLimit: number
  description: string
  popular: boolean
  trial: boolean
  features: string[]
}

export type PlansConfig = Record<'BASLANGIC' | 'PROFESYONEL' | 'ISLETME', PlanConfig>

// GET /api/plans — vitrin Pricing.tsx ve PlanEditor tarafından kullanılır
export async function GET() {
  try {
    const plans = await getPlans()
    const result: PlansConfig = {
      BASLANGIC: {
        name: plans.BASLANGIC.name,
        price: plans.BASLANGIC.priceTRY.toLocaleString('tr-TR'),
        priceEur: String(plans.BASLANGIC.priceEUR),
        priceUsd: String(plans.BASLANGIC.priceUSD),
        smsLimit: plans.BASLANGIC.smsLimit,
        description: plans.BASLANGIC.description,
        popular: plans.BASLANGIC.popular,
        trial: plans.BASLANGIC.trial,
        features: plans.BASLANGIC.features,
      },
      PROFESYONEL: {
        name: plans.PROFESYONEL.name,
        price: plans.PROFESYONEL.priceTRY.toLocaleString('tr-TR'),
        priceEur: String(plans.PROFESYONEL.priceEUR),
        priceUsd: String(plans.PROFESYONEL.priceUSD),
        smsLimit: plans.PROFESYONEL.smsLimit,
        description: plans.PROFESYONEL.description,
        popular: plans.PROFESYONEL.popular,
        trial: plans.PROFESYONEL.trial,
        features: plans.PROFESYONEL.features,
      },
      ISLETME: {
        name: plans.ISLETME.name,
        price: plans.ISLETME.priceTRY.toLocaleString('tr-TR'),
        priceEur: String(plans.ISLETME.priceEUR),
        priceUsd: String(plans.ISLETME.priceUSD),
        smsLimit: plans.ISLETME.smsLimit,
        description: plans.ISLETME.description,
        popular: plans.ISLETME.popular,
        trial: plans.ISLETME.trial,
        features: plans.ISLETME.features,
      },
    }
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Plan verileri alınamadı' }, { status: 500 })
  }
}
