'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CreditCard, Loader2, Zap, Check } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const PLAN_CONFIG: Record<string, {
  label: string
  price: string
  priceEur: string
  features: string[]
  color: string
  bg: string
}> = {
  PROFESYONEL: {
    label: 'Profesyonel',
    price: '₺1.140',
    priceEur: '€69',
    features: [
      '600 WhatsApp mesajı/ay',
      '3 personel hesabı',
      'Online randevu',
      'Gelişmiş raporlar',
      'Müşteri CRM',
      'Finansal takip',
    ],
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  ISLETME: {
    label: 'İşletme',
    price: '₺1.740',
    priceEur: '€119',
    features: [
      '1.500 WhatsApp mesajı/ay',
      '10 personel hesabı',
      'Online randevu',
      'Tam analiz & raporlar',
      'Müşteri CRM',
      'Finansal takip',
      'Öncelikli destek',
    ],
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
}

function OdemeYapContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')?.toUpperCase() ?? ''
  const slug = searchParams.get('slug') ?? ''
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const config = PLAN_CONFIG[plan]

  if (!config || !slug) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Geçersiz ödeme bağlantısı.</p>
          <Link href="/" className="text-purple-600 hover:underline text-sm">Ana sayfaya dön</Link>
        </div>
      </div>
    )
  }

  async function handlePayment() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/payments/iyzico/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, tenantSlug: slug }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Ödeme başlatılamadı')
      window.location.href = json.paymentPageUrl
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ödeme başlatılamadı')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-8 py-6 text-white">
            <div className="flex items-center gap-3 mb-1">
              <div className={`p-1.5 rounded-lg bg-white/20`}>
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-white/80">Seçilen Plan</span>
            </div>
            <h1 className="text-2xl font-bold">{config.label} Planı</h1>
            <p className="text-white/70 text-sm mt-1">Hesabınız oluşturuldu, ödeme ile aktifleştirin</p>
          </div>

          <div className="p-8">
            {/* Plan summary */}
            <div className={`rounded-2xl ${config.bg} p-5 mb-6`}>
              <div className="flex items-end gap-1 mb-4">
                <span className={`text-3xl font-extrabold ${config.color}`}>{config.price}</span>
                <span className="text-gray-400 text-sm mb-1">/ay</span>
                <span className="text-gray-400 text-xs mb-1 ml-1">veya {config.priceEur}/ay</span>
              </div>
              <ul className="space-y-2">
                {config.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className={`h-4 w-4 shrink-0 ${config.color}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ödeme sayfasına yönlendiriliyor...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Ödeme Yap · {config.price}/ay
                </>
              )}
            </Button>

            <p className="text-center text-xs text-gray-400 mt-3">
              Güvenli ödeme · İyzico ile işleniyor
            </p>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                Ödeme yapılmadan hesabınız aktifleşmeyecektir.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Sorun yaşarsanız{' '}
          <a href="mailto:destek@salonapy.com" className="text-purple-400 hover:underline">
            destek@salonapy.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default function OdemeYapPage() {
  return (
    <Suspense>
      <OdemeYapContent />
    </Suspense>
  )
}
