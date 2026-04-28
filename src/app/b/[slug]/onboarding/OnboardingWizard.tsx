'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Building2, Phone, MapPin, CheckCircle2, ArrowRight, ArrowLeft,
  Scissors, Clock, Banknote, User, Mail, Lock, Copy, Sparkles,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// ─── Tipler ──────────────────────────────────────────────────────────────────

interface Props {
  slug: string
  initialName: string
  initialPhone: string
  initialAddress: string
  hasServices: boolean
  hasStaff: boolean
}

interface ServiceForm {
  name: string
  duration: string
  price: string
  color: string
}

interface StaffForm {
  name: string
  email: string
  password: string
  title: string
}

const COLORS = [
  '#7c3aed', '#2563eb', '#16a34a', '#dc2626',
  '#d97706', '#0891b2', '#be185d', '#4f46e5',
]

const STEP_LABELS = ['İşletme', 'Hizmetler', 'Personel', 'Hazır!']

// ─── Adım göstergesi ─────────────────────────────────────────────────────────

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEP_LABELS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all
                  ${done ? 'bg-green-500 text-white' : active ? 'bg-purple-600 text-white ring-4 ring-purple-100' : 'bg-gray-100 text-gray-400'}`}
              >
                {done ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`mt-1 text-xs font-medium ${active ? 'text-purple-700' : done ? 'text-green-600' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 transition-colors ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Wizard ──────────────────────────────────────────────────────────────────

export function OnboardingWizard({ slug, initialName, initialPhone, initialAddress, hasServices, hasStaff }: Props) {
  const router = useRouter()

  // Adım başlangıcı: zaten hizmet varsa 2. adımdan başlat
  const startStep = hasServices ? (hasStaff ? 3 : 2) : 0
  const [step, setStep] = useState(startStep)
  const [saving, setSaving] = useState(false)

  // Adım 1 — İşletme bilgileri
  const [bizName, setBizName] = useState(initialName)
  const [bizPhone, setBizPhone] = useState(initialPhone)
  const [bizAddress, setBizAddress] = useState(initialAddress)

  // Adım 2 — Hizmetler
  const [services, setServices] = useState<ServiceForm[]>([
    { name: '', duration: '30', price: '', color: COLORS[0] },
  ])
  const [servicesAdded, setServicesAdded] = useState(hasServices)

  // Adım 3 — Personel
  const [skipStaff, setSkipStaff] = useState(hasStaff)
  const [staff, setStaff] = useState<StaffForm>({ name: '', email: '', password: '', title: '' })
  const [staffAdded, setStaffAdded] = useState(hasStaff)

  // ── Adım 1: İşletme kaydet ───────────────────────────────────────────────

  async function saveBizInfo() {
    if (!bizName.trim()) { toast.error('İşletme adı zorunlu'); return }
    setSaving(true)
    try {
      const res = await fetch(`/api/tenants/${slug}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: bizName.trim(), phone: bizPhone.trim() || null, address: bizAddress.trim() || null }),
      })
      if (!res.ok) throw new Error()
      setStep(1)
    } catch {
      toast.error('Kaydedilemedi, tekrar deneyin')
    } finally {
      setSaving(false)
    }
  }

  // ── Adım 2: Hizmet ekle ─────────────────────────────────────────────────

  function addServiceRow() {
    setServices(p => [...p, { name: '', duration: '30', price: '', color: COLORS[p.length % COLORS.length] }])
  }

  function updateService(i: number, k: keyof ServiceForm, v: string) {
    setServices(p => p.map((s, idx) => idx === i ? { ...s, [k]: v } : s))
  }

  function removeService(i: number) {
    setServices(p => p.length > 1 ? p.filter((_, idx) => idx !== i) : p)
  }

  async function saveServices() {
    const valid = services.filter(s => s.name.trim() && parseFloat(s.price) > 0)
    if (valid.length === 0) { toast.error('En az 1 hizmet ekleyin'); return }
    setSaving(true)
    try {
      await Promise.all(valid.map(s =>
        fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: s.name.trim(),
            duration: parseInt(s.duration),
            price: parseFloat(s.price),
            color: s.color,
          }),
        }).then(r => { if (!r.ok) throw new Error() })
      ))
      setServicesAdded(true)
      setStep(2)
    } catch {
      toast.error('Hizmet kaydedilemedi')
    } finally {
      setSaving(false)
    }
  }

  // ── Adım 3: Personel ekle ───────────────────────────────────────────────

  async function saveStaff() {
    if (!staff.name.trim() || !staff.email.trim() || !staff.password.trim()) {
      toast.error('Ad, email ve şifre zorunlu')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/staff/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: staff.name.trim(), email: staff.email.trim(), password: staff.password, title: staff.title.trim() || undefined, color: '#7c3aed' }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Personel eklenemedi')
      }
      setStaffAdded(true)
      setStep(3)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Personel eklenemedi')
    } finally {
      setSaving(false)
    }
  }

  // ── Adım 4: Tamamla ─────────────────────────────────────────────────────

  async function complete() {
    setSaving(true)
    try {
      await fetch(`/api/tenants/${slug}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingCompleted: true }),
      })
      toast.success('Kurulum tamamlandı! 🎉')
      router.push(`/b/${slug}`)
      router.refresh()
    } catch {
      toast.error('Bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const bookingUrl = `https://hemensalon.com/p/${slug}`

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-start justify-center p-4 pt-8 lg:pt-16">
      <div className="w-full max-w-lg">
        {/* Başlık */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
            <Sparkles className="w-4 h-4" />
            Hemensalon'a hoş geldiniz
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Salonunuzu birlikte kuralım</h1>
          <p className="text-gray-500 mt-1 text-sm">Sadece birkaç adım, 3 dakika yeterli.</p>
        </div>

        <StepBar current={step} />

        {/* ── ADIM 0: İşletme bilgileri ── */}
        {step === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">İşletme Bilgileri</h2>
                <p className="text-xs text-gray-500">Müşterileriniz bu bilgileri görecek</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">İşletme Adı <span className="text-red-500">*</span></label>
                <input
                  value={bizName}
                  onChange={e => setBizName(e.target.value)}
                  placeholder="Salon Adınız"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  <Phone className="w-3.5 h-3.5 inline mr-1" />Telefon
                </label>
                <input
                  value={bizPhone}
                  onChange={e => setBizPhone(e.target.value)}
                  placeholder="0532 000 00 00"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  <MapPin className="w-3.5 h-3.5 inline mr-1" />Adres
                </label>
                <input
                  value={bizAddress}
                  onChange={e => setBizAddress(e.target.value)}
                  placeholder="İlçe, Şehir"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <Button onClick={saveBizInfo} disabled={saving} className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-2.5">
              {saving ? 'Kaydediliyor…' : 'Devam Et'} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* ── ADIM 1: Hizmetler ── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Scissors className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Hizmetlerinizi Ekleyin</h2>
                <p className="text-xs text-gray-500">Müşteriler randevu alırken bunları seçecek</p>
              </div>
            </div>

            <div className="space-y-3">
              {services.map((svc, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hizmet {i + 1}</span>
                    {services.length > 1 && (
                      <button onClick={() => removeService(i)} className="text-xs text-red-400 hover:text-red-600">Kaldır</button>
                    )}
                  </div>
                  <input
                    value={svc.name}
                    onChange={e => updateService(i, 'name', e.target.value)}
                    placeholder="Hizmet adı (örn. Saç Kesimi)"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Clock className="w-3 h-3" />Süre (dk)</label>
                      <select
                        value={svc.duration}
                        onChange={e => updateService(i, 'duration', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >
                        {[15, 20, 30, 45, 60, 90, 120].map(d => (
                          <option key={d} value={d}>{d} dk</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Banknote className="w-3 h-3" />Fiyat (₺)</label>
                      <input
                        type="number"
                        value={svc.price}
                        onChange={e => updateService(i, 'price', e.target.value)}
                        placeholder="250"
                        min="0"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Renk</label>
                    <div className="flex gap-2">
                      {COLORS.map(c => (
                        <button
                          key={c}
                          onClick={() => updateService(i, 'color', c)}
                          className={`w-6 h-6 rounded-full transition-transform ${svc.color === c ? 'ring-2 ring-offset-1 ring-gray-700 scale-110' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={addServiceRow} className="w-full text-sm text-purple-600 font-medium border border-dashed border-purple-300 rounded-xl py-2 hover:bg-purple-50 transition-colors">
              + Başka hizmet ekle
            </button>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)} className="rounded-xl">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button onClick={saveServices} disabled={saving} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-2.5">
                {saving ? 'Kaydediliyor…' : 'Devam Et'} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ── ADIM 2: Personel ── */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Personel Ekleyin</h2>
                <p className="text-xs text-gray-500">Çalışan yoksa bu adımı atlayabilirsiniz</p>
              </div>
            </div>

            {/* Sadece ben seçeneği */}
            <button
              onClick={() => { setSkipStaff(true); setStep(3) }}
              className="w-full flex items-center justify-between rounded-xl border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 px-4 py-3 text-sm text-gray-600 font-medium transition-colors"
            >
              <span>👤 Sadece ben çalışıyorum, personel yok</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-200" />
              <span className="mx-3 text-xs text-gray-400 font-medium">veya personel ekle</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  <User className="w-3.5 h-3.5 inline mr-1" />Ad Soyad <span className="text-red-500">*</span>
                </label>
                <input
                  value={staff.name}
                  onChange={e => setStaff(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ahmet Yılmaz"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Unvan</label>
                <input
                  value={staff.title}
                  onChange={e => setStaff(p => ({ ...p, title: e.target.value }))}
                  placeholder="Kuaför, Berber, Uzman…"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  <Mail className="w-3.5 h-3.5 inline mr-1" />Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={staff.email}
                  onChange={e => setStaff(p => ({ ...p, email: e.target.value }))}
                  placeholder="personel@salon.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  <Lock className="w-3.5 h-3.5 inline mr-1" />Şifre <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={staff.password}
                  onChange={e => setStaff(p => ({ ...p, password: e.target.value }))}
                  placeholder="En az 6 karakter"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button onClick={saveStaff} disabled={saving} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-2.5">
                {saving ? 'Kaydediliyor…' : 'Personel Ekle & Devam'} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ── ADIM 3: Hazır ── */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle2 className="w-9 h-9 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Salonunuz hazır! 🎉</h2>
              <p className="text-gray-500 text-sm mt-1">Müşterileriniz şimdi online randevu alabilir.</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 text-left">
              <p className="text-xs font-semibold text-purple-700 mb-2 uppercase tracking-wide">Randevu Linkiniz</p>
              <div className="flex items-center gap-2">
                <span className="flex-1 text-sm text-purple-900 font-mono bg-white border border-purple-200 rounded-lg px-3 py-2 truncate">
                  {bookingUrl}
                </span>
                <button
                  onClick={() => { navigator.clipboard.writeText(bookingUrl); toast.success('Link kopyalandı!') }}
                  className="shrink-0 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-purple-600 mt-2">Bu linki Instagram bio'nuz veya WhatsApp'ınızda paylaşabilirsiniz.</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { icon: '📅', label: 'Randevu takibi' },
                { icon: '💬', label: 'SMS hatırlatma' },
                { icon: '📊', label: 'Gelir raporları' },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-xs text-gray-600 font-medium">{item.label}</div>
                </div>
              ))}
            </div>

            <Button
              onClick={complete}
              disabled={saving}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3 text-base font-semibold"
            >
              {saving ? 'Yönlendiriliyorsunuz…' : 'Panele Git →'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
