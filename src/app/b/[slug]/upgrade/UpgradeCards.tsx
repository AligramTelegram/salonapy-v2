'use client'

import { useState } from 'react'
import { Check, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type PlanKey = 'BASLANGIC' | 'PROFESYONEL' | 'ISLETME'

interface PlanInfo {
  name: string
  price: string
  smsLimit: number
  description: string
  popular: boolean
  features: string[]
}

interface UpgradeCardsProps {
  slug: string
  currentPlan: string
  plans: Record<PlanKey, PlanInfo>
}

const PLAN_ORDER: PlanKey[] = ['BASLANGIC', 'PROFESYONEL', 'ISLETME']

export function UpgradeCards({ slug, currentPlan, plans }: UpgradeCardsProps) {
  const [loading, setLoading] = useState<PlanKey | null>(null)

  async function handleUpgrade(planKey: PlanKey) {
    if (planKey === currentPlan) return
    setLoading(planKey)
    try {
      const res = await fetch('/api/payments/iyzico/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey, tenantSlug: slug }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? 'Ödeme başlatılamadı')
        return
      }
      window.location.href = json.paymentPageUrl
    } catch {
      toast.error('Bağlantı hatası')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {PLAN_ORDER.map((key) => {
        const plan = plans[key]
        const isCurrent = key === currentPlan
        const isLoading = loading === key

        return (
          <div
            key={key}
            className={cn(
              'relative flex flex-col rounded-2xl border bg-white overflow-hidden transition-all',
              plan.popular
                ? 'border-purple-400 shadow-xl shadow-purple-100'
                : 'border-gray-200 shadow-md',
              isCurrent && 'ring-2 ring-purple-600'
            )}
          >
            {plan.popular && (
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500" />
            )}
            {plan.popular && (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                  <Sparkles className="h-3 w-3" />
                  Popüler
                </span>
              </div>
            )}
            {isCurrent && (
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                  Mevcut Plan
                </span>
              </div>
            )}

            <div className="p-6 pt-8 flex-1">
              <h3 className="font-display text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">₺{plan.price}</span>
                <span className="text-sm text-gray-400">/ay</span>
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => handleUpgrade(key)}
                disabled={isCurrent || !!loading}
                className={cn(
                  'w-full py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2',
                  isCurrent
                    ? 'bg-gray-100 text-gray-400 cursor-default'
                    : plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-200'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isCurrent ? (
                  'Aktif Plan'
                ) : (
                  'Bu Plana Geç'
                )}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
