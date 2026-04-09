'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PlanConfig, PlansConfig } from '@/app/api/plans/route'

const PLAN_ORDER = ['BASLANGIC', 'PROFESYONEL', 'ISLETME'] as const

const PLAN_STYLE: Record<string, {
  color: string; bg: string; border: string; gradient: string; glow: string
}> = {
  BASLANGIC: {
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    gradient: 'from-blue-200/40 via-white to-blue-50/40',
    glow: 'rgba(59,130,246,0.15)',
  },
  PROFESYONEL: {
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    gradient: 'from-purple-300/50 via-white to-purple-100/50',
    glow: 'rgba(124,58,237,0.2)',
  },
  ISLETME: {
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    gradient: 'from-amber-200/40 via-white to-amber-50/40',
    glow: 'rgba(245,158,11,0.15)',
  },
}

const DEFAULT_PLANS: PlansConfig = {
  BASLANGIC: {
    name: 'Başlangıç', price: '540', priceEur: '35', priceUsd: '19', smsLimit: 200, popular: false, trial: true,
    description: 'Küçük işletmeler ve tek kişilik salonlar için ideal başlangıç.',
    features: ['200 SMS/ay', '1 personel', 'Online randevu', 'SMS hatırlatmaları', 'Temel raporlar', 'Müşteri kaydı', '3 gün ücretsiz deneme'],
  },
  PROFESYONEL: {
    name: 'Profesyonel', price: '1.140', priceEur: '69', priceUsd: '49', smsLimit: 600, popular: true, trial: false,
    description: 'Büyüyen salonlar için gelişmiş özellikler ve daha fazla kapasite.',
    features: ['600 SMS/ay', '3 personel', 'Online randevu', 'SMS hatırlatmaları', 'Gelişmiş raporlar', 'Müşteri CRM', 'Finansal takip'],
  },
  ISLETME: {
    name: 'İşletme', price: '1.740', priceEur: '119', priceUsd: '99', smsLimit: 1500, popular: false, trial: false,
    description: 'Çok şubeli ve büyük ekipli işletmeler için tam kapasite.',
    features: ['1.500 SMS/ay', '10 personel', 'Online randevu', 'SMS hatırlatmaları', 'Tam analiz & raporlar', 'Müşteri CRM', 'Finansal takip', 'Öncelikli destek'],
  },
}

export function Pricing() {
  const [plans, setPlans] = useState<PlansConfig>(DEFAULT_PLANS)

  useEffect(() => {
    fetch('/api/plans')
      .then((r) => r.json())
      .then((data) => setPlans(data))
      .catch(() => {/* fallback to defaults */})
  }, [])

  return (
    <section id="fiyatlar" className="py-24 md:py-32">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            Fiyatlar
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold text-gray-900 md:text-4xl">
            İşletmenize uygun
            <br />
            <span className="text-purple-600">planı seçin</span>
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-gray-500">
            Başlangıç paketinde 3 gün ücretsiz deneme. Profesyonel ve İşletme
            paketleri direkt ödeme ile başlar. İstediğiniz zaman iptal edebilirsiniz.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {PLAN_ORDER.map((planKey, i) => (
            <motion.div
              key={planKey}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <PricingCard planKey={planKey} plan={plans[planKey]} style={PLAN_STYLE[planKey]} />
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 text-center text-sm text-gray-400"
        >
          Ek 250 SMS için +₺300/ay · Fiyatlar KDV dahildir
        </motion.p>
      </div>
    </section>
  )
}

function PricingCard({
  planKey,
  plan,
  style,
}: {
  planKey: string
  plan: PlanConfig
  style: typeof PLAN_STYLE[string]
}) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: `0 24px 64px ${style.glow}` }}
      transition={{ duration: 0.25 }}
      className={`relative rounded-2xl bg-gradient-to-br p-px ${style.gradient}`}
    >
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-purple-300/50">
            <Star className="h-3 w-3 fill-white" />
            En Popüler
          </span>
        </div>
      )}

      <div className={`h-full rounded-[15px] bg-white p-7 ${plan.popular ? 'ring-2 ring-purple-400/30' : ''}`}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className={`mb-1 inline-flex rounded-lg p-2 ${style.bg}`}>
              <Zap className={`h-4 w-4 ${style.color}`} />
            </div>
            <h3 className="mt-2 font-display text-lg font-bold text-gray-900">{plan.name}</h3>
          </div>
        </div>

        <div className="mb-2 flex items-end gap-1">
          <span className="font-display text-4xl font-extrabold text-gray-900">₺{plan.price}</span>
          <span className="mb-1 text-sm text-gray-500">/ay</span>
        </div>
        <p className="mb-1 text-xs text-gray-400">veya €{plan.priceEur}/ay</p>
        <p className="mb-3 text-xs text-gray-500">*KDV dahildir</p>
        <p className="mb-6 text-sm leading-relaxed text-gray-500">{plan.description}</p>

        <Link
          href={plan.trial ? '/kayit' : `/kayit?plan=${planKey}`}
          title={plan.trial ? `${plan.name} Paketi - 3 Gün Ücretsiz` : `${plan.name} Paketi`}
          className="block"
        >
          <Button
            className={`mb-6 w-full ${
              plan.popular
                ? 'bg-purple-600 shadow-lg shadow-purple-200/60 hover:bg-purple-700'
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            {plan.trial ? '3 Gün Ücretsiz Dene' : 'Hemen Başla'}
          </Button>
        </Link>
        <p className="mb-3 -mt-3 text-center text-xs text-gray-400">
          {plan.trial ? 'Kredi kartı gerekmez' : 'Aylık ödeme'}
        </p>

        <div className={`mb-5 border-t ${style.border}`} />

        <ul className="space-y-3">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <Check className={`mt-0.5 h-4 w-4 shrink-0 ${style.color}`} />
              <span className="text-sm text-gray-600">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
