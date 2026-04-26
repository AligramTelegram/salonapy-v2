'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, MapPin, User, X, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  slug: string
}

export function ProfileCompletePopup({ slug }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ phone: '', address: '' })

  if (!open) return null

  async function handleSave() {
    if (!form.phone.trim()) return
    setLoading(true)
    try {
      await fetch(`/api/tenants/${slug}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone, address: form.address }),
      })
      setOpen(false)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 pt-6 pb-8">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Profilinizi Tamamlayın</h2>
              <p className="text-sm text-purple-100">Müşterileriniz sizi kolayca bulsun</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-500">
            Hesabınız aktif! Müşterilerinizin sizi arayabilmesi ve randevu sayfanızın eksiksiz görünmesi için iletişim bilgilerinizi ekleyin.
          </p>

          {/* Telefon */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-purple-500" />
              Telefon Numarası <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              placeholder="0555 123 45 67"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          {/* Adres */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-purple-500" />
              İşletme Adresi <span className="text-gray-400 font-normal">(opsiyonel)</span>
            </label>
            <Input
              placeholder="Mahalle, Cadde, Şehir"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              variant="ghost"
              className="flex-1 text-gray-500 hover:text-gray-700"
              onClick={() => setOpen(false)}
            >
              Sonra Yapayım
            </Button>
            <Button
              className="flex-1 bg-purple-600 hover:bg-purple-700 gap-2"
              onClick={handleSave}
              disabled={loading || !form.phone.trim()}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Kaydet
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
