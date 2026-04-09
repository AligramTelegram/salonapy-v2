export type Currency = 'TRY' | 'EUR' | 'USD'

export const PLAN_PRICES: Record<string, Record<Currency, number>> = {
  BASLANGIC:   { TRY: 540,  EUR: 35,  USD: 19 },
  PROFESYONEL: { TRY: 1140, EUR: 69,  USD: 49 },
  ISLETME:     { TRY: 1740, EUR: 119, USD: 99 },
}

export const PLAN_LABELS: Record<string, string> = {
  BASLANGIC:   'Başlangıç',
  PROFESYONEL: 'Profesyonel',
  ISLETME:     'İşletme',
}

/** Determine billing currency from country code */
export function getCurrency(country: string): Currency {
  const c = country.toUpperCase()
  if (['TR', 'TUR'].includes(c)) return 'TRY'
  if (['US', 'USA', 'CA', 'AU', 'NZ'].includes(c)) return 'USD'
  return 'EUR'
}

/** Get the plan price for a given country */
export function getPlanPrice(plan: string, country = 'TR'): { amount: number; currency: Currency } {
  const currency = getCurrency(country)
  const amount = PLAN_PRICES[plan]?.[currency] ?? PLAN_PRICES['BASLANGIC'][currency]
  return { amount, currency }
}
