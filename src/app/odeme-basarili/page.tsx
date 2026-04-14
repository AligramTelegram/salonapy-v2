'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

const PLAN_LABELS: Record<string, string> = {
  BASLANGIC: 'Başlangıç',
  PROFESYONEL: 'Profesyonel',
  ISLETME: 'İşletme',
}

function OdemeBasariliContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') ?? 'BASLANGIC'
  const slug = searchParams.get('slug') ?? ''
  const provider = searchParams.get('provider') ?? 'iyzico'
  const currency = provider === 'stripe' ? 'EUR' : 'TRY'

  const planLabel = PLAN_LABELS[plan] ?? plan
  const [planPrice, setPlanPrice] = useState<string>('—')

  useEffect(() => {
    fetch('/api/plans')
      .then((r) => r.json())
      .then((data) => {
        const p = data[plan]
        if (!p) return
        if (currency === 'EUR') setPlanPrice(`€${p.priceEur}`)
        else setPlanPrice(`₺${p.price}`)
      })
      .catch(() => {/* keep default */})
  }, [plan, currency])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
          {/* Icon */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ödeme Başarılı! 🎉
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            {planLabel} planınız aktifleştirildi. Artık tüm özelliklere erişebilirsiniz.
          </p>

          {/* Plan info */}
          <div className="bg-purple-50 rounded-2xl p-4 mb-6 border border-purple-100">
            <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide mb-1">Aktif Plan</p>
            <p className="text-xl font-bold text-purple-700">{planLabel}</p>
            <p className="text-sm text-purple-500 mt-0.5">
              {planPrice}/ay
            </p>
          </div>

          {/* CTA */}
          {slug ? (
            <Link
              href={`/b/${slug}?upgrade_success=true`}
              className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm"
            >
              Panele Git
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm"
            >
              Ana Sayfaya Git
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Support note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Sorun mu yaşıyorsunuz?{' '}
          <a href="mailto:destek@salonapy.com" className="text-purple-600 hover:underline">
            destek@salonapy.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default function OdemeBasariliPage() {
  return (
    <Suspense>
      <OdemeBasariliContent />
    </Suspense>
  )
}
