/**
 * Merkezi plan konfigürasyon modülü.
 * DB'deki siteSetting tablosundan okur, 5 dakika in-memory cache tutar.
 */

import { prisma } from './prisma'

export interface PlanData {
  name: string
  /** TRY fiyatı (₺) */
  priceTRY: number
  /** Aylık SMS limiti */
  smsLimit: number
  description: string
  popular: boolean
  trial: boolean
  features: string[]
}

export type PlansMap = Record<'BASLANGIC' | 'PROFESYONEL' | 'ISLETME', PlanData>

const DEFAULTS: PlansMap = {
  BASLANGIC: {
    name: 'Başlangıç',
    priceTRY: 540,
    smsLimit: 200,
    description: 'Küçük işletmeler ve tek kişilik salonlar için ideal başlangıç.',
    popular: false, trial: true,
    features: ['200 SMS/ay', '1 personel', 'Online randevu', 'SMS hatırlatmaları', 'Temel raporlar', 'Müşteri kaydı'],
  },
  PROFESYONEL: {
    name: 'Profesyonel',
    priceTRY: 1140,
    smsLimit: 600,
    description: 'Büyüyen salonlar için gelişmiş özellikler ve daha fazla kapasite.',
    popular: true, trial: false,
    features: ['600 SMS/ay', '3 personel', 'Online randevu', 'SMS hatırlatmaları', 'Gelişmiş raporlar', 'Müşteri CRM', 'Finansal takip'],
  },
  ISLETME: {
    name: 'İşletme',
    priceTRY: 1740,
    smsLimit: 1500,
    description: 'Çok şubeli ve büyük ekipli işletmeler için tam kapasite.',
    popular: false, trial: false,
    features: ['1.500 SMS/ay', '10 personel', 'Online randevu', 'SMS hatırlatmaları', 'Tam analiz & raporlar', 'Müşteri CRM', 'Finansal takip', 'Öncelikli destek'],
  },
}

// In-memory cache: 5 dakika TTL
let _cache: { data: PlansMap; ts: number } | null = null
const CACHE_TTL = 5 * 60 * 1000

function parsePrice(raw: string | number | undefined, fallback: number): number {
  if (typeof raw === 'number') return raw
  if (!raw) return fallback
  const n = parseInt(String(raw).replace(/[^0-9]/g, ''), 10)
  return isNaN(n) ? fallback : n
}

export async function getPlans(): Promise<PlansMap> {
  if (_cache && Date.now() - _cache.ts < CACHE_TTL) return _cache.data

  try {
    const keys = ['plan_config_BASLANGIC', 'plan_config_PROFESYONEL', 'plan_config_ISLETME']
    const rows = await prisma.siteSetting.findMany({ where: { key: { in: keys } } })
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]))

    const plans = { ...DEFAULTS }

    for (const key of ['BASLANGIC', 'PROFESYONEL', 'ISLETME'] as const) {
      const raw = map[`plan_config_${key}`]
      if (!raw) continue
      try {
        const json = JSON.parse(raw)
        const def = DEFAULTS[key]
        plans[key] = {
          name: json.name ?? def.name,
          priceTRY: parsePrice(json.price, def.priceTRY),
          smsLimit: typeof json.smsLimit === 'number' ? json.smsLimit : def.smsLimit,
          description: json.description ?? def.description,
          popular: json.popular ?? def.popular,
          trial: json.trial ?? def.trial,
          features: Array.isArray(json.features) ? json.features : def.features,
        }
      } catch { /* malformed JSON, keep default */ }
    }

    _cache = { data: plans, ts: Date.now() }
    return plans
  } catch {
    return DEFAULTS
  }
}

/** Cache'i temizle — plan kaydedildiğinde çağrılmalı */
export function invalidatePlansCache() {
  _cache = null
}

/** TRY fiyatları */
export async function getPlanPricesTRY(): Promise<Record<string, number>> {
  const plans = await getPlans()
  return {
    BASLANGIC: plans.BASLANGIC.priceTRY,
    PROFESYONEL: plans.PROFESYONEL.priceTRY,
    ISLETME: plans.ISLETME.priceTRY,
  }
}

/** SMS limitleri */
export async function getSmsLimits(): Promise<Record<string, number>> {
  const plans = await getPlans()
  return {
    BASLANGIC: plans.BASLANGIC.smsLimit,
    PROFESYONEL: plans.PROFESYONEL.smsLimit,
    ISLETME: plans.ISLETME.smsLimit,
  }
}
