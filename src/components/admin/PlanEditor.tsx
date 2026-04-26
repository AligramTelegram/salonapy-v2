'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Trash2, Save, Loader2, ChevronDown, ChevronUp, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { PlanConfig, PlansConfig } from '@/app/api/plans/route'

const PLAN_ORDER = ['BASLANGIC', 'PROFESYONEL', 'ISLETME'] as const
type PlanKey = typeof PLAN_ORDER[number]

const PLAN_STYLE: Record<PlanKey, { label: string; color: string; accent: string }> = {
  BASLANGIC:   { label: 'Başlangıç',   color: 'text-blue-600',   accent: 'bg-blue-100 text-blue-700' },
  PROFESYONEL: { label: 'Profesyonel', color: 'text-purple-600', accent: 'bg-purple-100 text-purple-700' },
  ISLETME:     { label: 'İşletme',     color: 'text-amber-600',  accent: 'bg-amber-100 text-amber-700' },
}

const DEFAULT_PLANS: PlansConfig = {
  BASLANGIC: {
    name: 'Başlangıç', price: '540', smsLimit: 200, popular: false, trial: true,
    description: 'Küçük işletmeler ve tek kişilik salonlar için ideal başlangıç.',
    features: ['200 SMS/ay', '1 personel', 'Online randevu', 'SMS hatırlatmaları', 'Temel raporlar', 'Müşteri kaydı', '3 gün ücretsiz deneme'],
  },
  PROFESYONEL: {
    name: 'Profesyonel', price: '1.140', smsLimit: 600, popular: true, trial: false,
    description: 'Büyüyen salonlar için gelişmiş özellikler ve daha fazla kapasite.',
    features: ['600 SMS/ay', '3 personel', 'Online randevu', 'SMS hatırlatmaları', 'Gelişmiş raporlar', 'Müşteri CRM', 'Finansal takip'],
  },
  ISLETME: {
    name: 'İşletme', price: '1.740', smsLimit: 1500, popular: false, trial: false,
    description: 'Çok şubeli ve büyük ekipli işletmeler için tam kapasite.',
    features: ['1.500 SMS/ay', '10 personel', 'Online randevu', 'SMS hatırlatmaları', 'Tam analiz & raporlar', 'Müşteri CRM', 'Finansal takip', 'Öncelikli destek'],
  },
}

export function PlanEditor() {
  const [plans, setPlans] = useState<PlansConfig>(DEFAULT_PLANS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<PlanKey | null>(null)
  const [expanded, setExpanded] = useState<PlanKey | null>('BASLANGIC')

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/plans')
      const data = await res.json()
      setPlans(data)
    } catch {
      toast.error('Plan verileri yüklenemedi')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  function updatePlan(key: PlanKey, field: keyof PlanConfig, value: unknown) {
    setPlans((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }))
  }

  function updateFeature(key: PlanKey, index: number, value: string) {
    const features = [...plans[key].features]
    features[index] = value
    updatePlan(key, 'features', features)
  }

  function addFeature(key: PlanKey) {
    updatePlan(key, 'features', [...plans[key].features, ''])
  }

  function removeFeature(key: PlanKey, index: number) {
    const features = plans[key].features.filter((_, i) => i !== index)
    updatePlan(key, 'features', features)
  }

  async function savePlan(key: PlanKey) {
    setSaving(key)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: [{
            key: `plan_config_${key}`,
            value: JSON.stringify(plans[key]),
            category: 'plans',
          }],
        }),
      })
      if (!res.ok) throw new Error()
      toast.success(`${PLAN_STYLE[key].label} planı kaydedildi`)
    } catch {
      toast.error('Kayıt başarısız')
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {PLAN_ORDER.map((key) => {
        const plan = plans[key]
        const style = PLAN_STYLE[key]
        const isOpen = expanded === key

        return (
          <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Accordion header */}
            <button
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(isOpen ? null : key)}
            >
              <div className="flex items-center gap-3">
                <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full', style.accent)}>
                  {style.label}
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  ₺{plan.price}<span className="text-gray-400 font-normal">/ay</span>
                </span>
                {plan.popular && (
                  <span className="inline-flex items-center gap-1 text-xs text-purple-600 font-medium">
                    <Star className="h-3 w-3 fill-purple-600" /> Popüler
                  </span>
                )}
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </button>

            {/* Accordion body */}
            {isOpen && (
              <div className="px-5 pb-5 space-y-5 border-t border-gray-100 pt-4">
                {/* Basic fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Plan Adı</Label>
                    <Input
                      value={plan.name}
                      onChange={(e) => updatePlan(key, 'name', e.target.value)}
                      className="bg-gray-50 border-gray-200 text-gray-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Fiyat (₺)</Label>
                    <Input
                      value={plan.price}
                      onChange={(e) => updatePlan(key, 'price', e.target.value)}
                      placeholder="450"
                      className="bg-gray-50 border-gray-200 text-gray-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">SMS Limiti (adet/ay)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={plan.smsLimit}
                      onChange={(e) => updatePlan(key, 'smsLimit', parseInt(e.target.value) || 0)}
                      placeholder="200"
                      className="bg-gray-50 border-gray-200 text-gray-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Seçenekler</Label>
                    <div className="flex gap-4 pt-1.5">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={plan.popular}
                          onChange={(e) => updatePlan(key, 'popular', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-600">En Popüler</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={plan.trial}
                          onChange={(e) => updatePlan(key, 'trial', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-600">Ücretsiz Deneme</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Açıklama</Label>
                  <textarea
                    rows={2}
                    value={plan.description}
                    onChange={(e) => updatePlan(key, 'description', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Özellikler</Label>
                  <div className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input
                          value={feature}
                          onChange={(e) => updateFeature(key, idx, e.target.value)}
                          placeholder="Özellik açıklaması"
                          className="bg-gray-50 border-gray-200 text-gray-900 flex-1"
                        />
                        <button
                          onClick={() => removeFeature(key, idx)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addFeature(key)}
                    className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 font-medium mt-1"
                  >
                    <Plus className="h-4 w-4" />
                    Özellik Ekle
                  </button>
                </div>

                {/* Save */}
                <div className="pt-2 border-t border-gray-100">
                  <Button
                    onClick={() => savePlan(key)}
                    disabled={saving === key}
                    className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                  >
                    {saving === key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {style.label} Planını Kaydet
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
