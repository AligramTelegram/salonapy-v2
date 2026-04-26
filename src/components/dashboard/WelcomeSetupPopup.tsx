'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Receipt, Phone, MapPin, User, CreditCard, ChevronRight, Loader2, X, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  slug: string
}

const STORAGE_KEY = (slug: string) => `welcome-setup-done-${slug}`

export function WelcomeSetupPopup({ slug }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const [biz, setBiz] = useState({ phone: '', address: '' })
  const [billing, setBilling] = useState({
    ownerName: '',
    ownerPhone: '',
    ownerCity: '',
    ownerAddress: '',
    taxNumber: '',
    taxOffice: '',
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const seen = localStorage.getItem(STORAGE_KEY(slug))
    if (!seen) setOpen(true)
  }, [slug])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY(slug), '1')
    setOpen(false)
  }

  async function handleStep1() {
    if (!biz.phone.trim()) return
    setStep(2)
  }

  async function handleFinish() {
    setLoading(true)
    try {
      await fetch(`/api/tenants/${slug}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: biz.phone || undefined,
          address: biz.address || undefined,
          ownerName: billing.ownerName || undefined,
          ownerPhone: billing.ownerPhone || undefined,
          ownerCity: billing.ownerCity || undefined,
          ownerAddress: billing.ownerAddress || undefined,
          taxNumber: billing.taxNumber || undefined,
          taxOffice: billing.taxOffice || undefined,
        }),
      })
      setDone(true)
      localStorage.setItem(STORAGE_KEY(slug), '1')
      setTimeout(() => {
        setOpen(false)
        router.refresh()
      }, 1500)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 pt-6 pb-10">
          <button
            onClick={dismiss}
            className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
              {step === 1 ? <Building2 className="h-6 w-6 text-white" /> : <Receipt className="h-6 w-6 text-white" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {step === 1 ? 'İşletme Bilgilerinizi Tamamlayın' : 'Fatura Bilgilerini Ekleyin'}
              </h2>
              <p className="text-sm text-purple-100">
                {step === 1 ? 'Müşterileriniz sizi kolayca bulsun' : 'Faturalarınız doğru kesilsin'}
              </p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            <div className={`h-2 rounded-full flex-1 transition-all ${step >= 1 ? 'bg-white' : 'bg-white/30'}`} />
            <div className={`h-2 rounded-full flex-1 transition-all ${step >= 2 ? 'bg-white' : 'bg-white/30'}`} />
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 -mt-4">
          <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-4 space-y-4">

            {done ? (
              <div className="flex flex-col items-center py-6 gap-3">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <p className="font-semibold text-gray-800">Bilgiler kaydedildi!</p>
              </div>
            ) : step === 1 ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-purple-500" />
                    Telefon Numarası <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="0555 123 45 67"
                    value={biz.phone}
                    onChange={(e) => setBiz((f) => ({ ...f, phone: e.target.value }))}
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-purple-500" />
                    İşletme Adresi <span className="text-gray-400 font-normal text-xs">(opsiyonel)</span>
                  </label>
                  <Input
                    placeholder="Mahalle, Cadde, İlçe, Şehir"
                    value={biz.address}
                    onChange={(e) => setBiz((f) => ({ ...f, address: e.target.value }))}
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-purple-500" />
                      Ad Soyad
                    </label>
                    <Input
                      placeholder="Ahmet Yılmaz"
                      value={billing.ownerName}
                      onChange={(e) => setBilling((f) => ({ ...f, ownerName: e.target.value }))}
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-purple-500" />
                      Telefon
                    </label>
                    <Input
                      type="tel"
                      placeholder="0555 123 45 67"
                      value={billing.ownerPhone}
                      onChange={(e) => setBilling((f) => ({ ...f, ownerPhone: e.target.value }))}
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Şehir</label>
                    <Input
                      placeholder="İstanbul"
                      value={billing.ownerCity}
                      onChange={(e) => setBilling((f) => ({ ...f, ownerCity: e.target.value }))}
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Vergi Dairesi</label>
                    <Input
                      placeholder="Kadıköy"
                      value={billing.taxOffice}
                      onChange={(e) => setBilling((f) => ({ ...f, taxOffice: e.target.value }))}
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-purple-500" />
                    Fatura Adresi
                  </label>
                  <Input
                    placeholder="Mahalle, Cadde, İlçe, Şehir"
                    value={billing.ownerAddress}
                    onChange={(e) => setBilling((f) => ({ ...f, ownerAddress: e.target.value }))}
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Vergi No / TC Kimlik No</label>
                  <Input
                    placeholder="11 haneli TC veya 10 haneli vergi no"
                    value={billing.taxNumber}
                    onChange={(e) => setBilling((f) => ({ ...f, taxNumber: e.target.value }))}
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </>
            )}
          </div>

          {!done && (
            <div className="flex gap-3 mt-4">
              <Button
                variant="ghost"
                className="flex-1 text-gray-500 hover:text-gray-700"
                onClick={dismiss}
              >
                Sonra Yapayım
              </Button>
              {step === 1 ? (
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700 gap-2"
                  onClick={handleStep1}
                  disabled={!biz.phone.trim()}
                >
                  Devam Et
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700 gap-2"
                  onClick={handleFinish}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
