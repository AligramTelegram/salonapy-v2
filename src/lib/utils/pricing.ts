export type Currency = 'TRY'

export const PLAN_PRICES: Record<string, number> = {
  BASLANGIC:   540,
  PROFESYONEL: 1140,
  ISLETME:     1740,
}

export const PLAN_LABELS: Record<string, string> = {
  BASLANGIC:   'Başlangıç',
  PROFESYONEL: 'Profesyonel',
  ISLETME:     'İşletme',
}

export function getPlanPrice(plan: string): { amount: number; currency: Currency } {
  return { amount: PLAN_PRICES[plan] ?? PLAN_PRICES['BASLANGIC'], currency: 'TRY' }
}
