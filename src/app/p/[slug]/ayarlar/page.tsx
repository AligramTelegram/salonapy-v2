'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import {
  Mail,
  Phone,
  Briefcase,
  Clock,
  Scissors,
  Link2,
  Copy,
  Check,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Share2,
} from 'lucide-react'

interface WorkHour {
  dayOfWeek: number
  startTime: string
  endTime: string
  isWorking: boolean
}

interface Service {
  id: string
  name: string
  color: string
  duration: number
  price: number
}

interface StaffMe {
  id: string
  name: string
  email: string
  phone: string | null
  title: string | null
  color: string
  avatarUrl: string | null
  slug: string
  tenant: { name: string; slug: string }
  workHours: WorkHour[]
  services: Service[]
}

const DAY_NAMES = [
  'Pazar',
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
]

export default function PersonelAyarlarPage() {
  const [staff, setStaff] = useState<StaffMe | null>(null)
  const [loading, setLoading] = useState(true)

  // Phone edit
  const [phone, setPhone] = useState('')
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [savingPhone, setSavingPhone] = useState(false)

  // Password change
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  // Copy link
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await axios.get<StaffMe>('/api/staff/me')
        setStaff(data)
        setPhone(data.phone ?? '')
      } catch {
        toast.error('Bilgiler yüklenemedi')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function savePhone() {
    setSavingPhone(true)
    try {
      await axios.patch('/api/staff/me', { phone })
      setStaff((prev) => (prev ? { ...prev, phone } : prev))
      setIsEditingPhone(false)
      toast.success('Telefon güncellendi')
    } catch {
      toast.error('Güncellenemedi')
    } finally {
      setSavingPhone(false)
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Şifreler eşleşmiyor')
      return
    }
    setChangingPassword(true)
    try {
      await axios.post('/api/staff/change-password', { currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Şifre güncellendi')
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : 'Şifre güncellenemedi'
      toast.error(msg)
    } finally {
      setChangingPassword(false)
    }
  }

  async function copyLink() {
    if (!staff) return
    const url = `${window.location.origin}/p/${staff.slug}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Link kopyalandı')
  }

  async function shareLink() {
    if (!staff) return
    const url = `${window.location.origin}/p/${staff.slug}`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Randevu Linkim', url })
      } catch {
        // user cancelled
      }
    } else {
      copyLink()
    }
  }

  async function logout() {
    try {
      await axios.post('/api/auth/logout')
    } finally {
      window.location.href = '/giris'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
      </div>
    )
  }

  if (!staff) return null

  const initials = staff.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const portalUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/p/${staff.slug}`
      : `/p/${staff.slug}`

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold text-gray-900">Ayarlar</h1>

      {/* Profil Bilgileri */}
      <div className="glass-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-800">Profil Bilgileri</h2>

        {/* Avatar + isim */}
        <div className="flex items-center gap-4">
          <div
            className="h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 overflow-hidden"
            style={{ backgroundColor: staff.color }}
          >
            {staff.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={staff.avatarUrl}
                alt={staff.name}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900">{staff.name}</p>
            {staff.title && <p className="text-sm text-gray-500">{staff.title}</p>}
            <p className="text-xs text-gray-400">{staff.tenant.name}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <Mail className="h-4 w-4 text-gray-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 mb-0.5">Email</p>
            <p className="text-sm font-medium text-gray-800">{staff.email}</p>
          </div>
        </div>

        {/* Telefon - düzenlenebilir */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <Phone className="h-4 w-4 text-gray-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 mb-0.5">Telefon</p>
            {isEditingPhone ? (
              <div className="flex items-center gap-2">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 text-sm bg-white border border-purple-200 rounded-lg px-2 py-1 focus:outline-none focus:border-purple-400"
                  placeholder="05xx xxx xx xx"
                  autoFocus
                />
                <button
                  onClick={savePhone}
                  disabled={savingPhone}
                  className="text-xs font-semibold text-white bg-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60 flex items-center gap-1 shrink-0"
                >
                  {savingPhone && <Loader2 className="h-3 w-3 animate-spin" />}
                  Kaydet
                </button>
                <button
                  onClick={() => {
                    setIsEditingPhone(false)
                    setPhone(staff.phone ?? '')
                  }}
                  className="text-xs text-gray-500 px-2 py-1.5 hover:bg-gray-100 rounded-lg shrink-0"
                >
                  İptal
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-800">
                  {staff.phone ?? (
                    <span className="text-gray-400 italic text-xs">Eklenmedi</span>
                  )}
                </p>
                <button
                  onClick={() => setIsEditingPhone(true)}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  Düzenle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Unvan */}
        {staff.title && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Briefcase className="h-4 w-4 text-gray-400 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-0.5">Unvan</p>
              <p className="text-sm font-medium text-gray-800">{staff.title}</p>
            </div>
          </div>
        )}
      </div>

      {/* Şifre Değiştir */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Şifre Değiştir</h2>
        <form onSubmit={changePassword} className="space-y-3">
          {/* Mevcut şifre */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
            <Lock className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Mevcut şifre"
              className="flex-1 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Yeni şifre */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
            <Lock className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Yeni şifre (min. 6 karakter)"
              className="flex-1 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Yeni şifre tekrar */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
            <Lock className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Yeni şifre tekrar"
              className="flex-1 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={
              changingPassword || !currentPassword || !newPassword || !confirmPassword
            }
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-60"
          >
            {changingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
            Şifre Güncelle
          </button>
        </form>
      </div>

      {/* Çalışma Saatleri */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800">Çalışma Saatleri</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
            Salt okunur
          </span>
        </div>

        {staff.workHours.length === 0 ? (
          <p className="text-sm text-gray-400">Çalışma saati belirlenmemiş</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {staff.workHours.map((wh) => (
              <div
                key={wh.dayOfWeek}
                className="flex items-center justify-between py-2.5"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      wh.isWorking ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {DAY_NAMES[wh.dayOfWeek]}
                  </span>
                </div>
                {wh.isWorking ? (
                  <span className="text-sm text-gray-600">
                    {wh.startTime} — {wh.endTime}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Kapalı</span>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
          <Clock className="h-3 w-3 shrink-0" />
          İşletme yöneticisi tarafından belirlenir
        </p>
      </div>

      {/* Hizmetlerim */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800">Hizmetlerim</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
            Salt okunur
          </span>
        </div>

        {staff.services.length === 0 ? (
          <p className="text-sm text-gray-400">Hizmet atanmamış</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {staff.services.map((svc) => (
              <div key={svc.id} className="flex items-center gap-3 py-2.5">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: svc.color }}
                />
                <span className="flex-1 text-sm font-medium text-gray-700">
                  {svc.name}
                </span>
                <span className="text-xs text-gray-400">{svc.duration} dk</span>
                <span className="text-sm font-semibold text-gray-800">
                  ₺{svc.price.toLocaleString('tr-TR')}
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
          <Scissors className="h-3 w-3 shrink-0" />
          İşletme yöneticisi tarafından belirlenir
        </p>
      </div>

      {/* Randevu Linkim */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Randevu Linkim</h2>
        <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl border border-purple-100">
          <Link2 className="h-4 w-4 text-purple-400 shrink-0" />
          <span className="flex-1 text-sm text-purple-700 font-medium truncate">
            {portalUrl}
          </span>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={copyLink}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? 'Kopyalandı!' : 'Kopyala'}
          </button>
          <button
            onClick={shareLink}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            Paylaş
          </button>
        </div>
      </div>

      {/* Çıkış Yap */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Çıkış Yap
      </button>

      <div className="h-2" />
    </div>
  )
}
