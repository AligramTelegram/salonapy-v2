export const PLAN_FEATURES = {
  BASLANGIC: {
    maxStaff: 1,
    maxServices: 10,
    maxCustomers: 100,
    features: {
      reports: false,
      packages: false,
    },
  },
  PROFESYONEL: {
    maxStaff: 3,
    maxServices: 50,
    maxCustomers: 500,
    features: {
      reports: true,
      packages: true,
    },
  },
  ISLETME: {
    maxStaff: 10,
    maxServices: Infinity,
    maxCustomers: Infinity,
    features: {
      reports: true,
      packages: true,
    },
  },
} as const

export type PlanKey = keyof typeof PLAN_FEATURES
export type FeatureKey = keyof typeof PLAN_FEATURES.BASLANGIC.features
export type LimitKey = 'maxStaff' | 'maxServices' | 'maxCustomers'

export function hasFeature(plan: string, feature: FeatureKey): boolean {
  const planData = PLAN_FEATURES[plan as PlanKey]
  if (!planData) return false
  return planData.features[feature]
}

export function getLimit(plan: string, limitKey: LimitKey): number {
  const planData = PLAN_FEATURES[plan as PlanKey]
  if (!planData) return 0
  const val = planData[limitKey]
  return val === Infinity ? Number.MAX_SAFE_INTEGER : val
}

export const PLAN_LABELS: Record<PlanKey, string> = {
  BASLANGIC: 'Başlangıç',
  PROFESYONEL: 'Profesyonel',
  ISLETME: 'İşletme',
}
