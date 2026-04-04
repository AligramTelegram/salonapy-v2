'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  MessageSquare, AlertTriangle, RefreshCw, TrendingUp,
  Settings, Save, Loader2, Send, Eye, EyeOff, CheckCircle2, XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { addMonths } from 'date-fns'

interface TenantSmsUsage {
  id: string
  name: string
  slug: string
  plan: string
  smsUsed: number
  smsLimit: number
  smsPercent: number
  smsRemaining: number
  smsResetAt: string
  alert: boolean
}

const PLAN_LABELS: Record<string, string> = {
  BASLANGIC: 'Başlangıç',
  PROFESYONEL: 'Profesyonel',
  ISLETME: 'İşletme',
}

export default function AdminSmsPage() {
  // --- Usage state ---
  const [tenants, setTenants] = useState<TenantSmsUsage[]>([])
  const [totalUsed, setTotalUsed] = useState(0)
  const [alertCount, setAlertCount] = useState(0)
  const [loadingUsage, setLoadingUsage] = useState(true)

  // --- Settings state ---
  const [usercode, setUsercode] = useState('')
  const [password, setPassword] = useState('')
  const [header, setHeader] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)
  const [loadingSettings, setLoadingSettings] = useState(true)

  // --- Test SMS state ---
  const [testPhone, setTestPhone] = useState('')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const loadUsage = useCallback(async () => {
    setLoadingUsage(true)
    try {
      const res = await fetch('/api/admin/sms-usage')
      if (!res.ok) return
      const data = await res.json()
      setTenants(data.tenants ?? [])
      setTotalUsed(data.totalUsed ?? 0)
      setAlertCount(data.alertCount ?? 0)
    } finally {
      setLoadingUsage(false)
    }
  }, [])

  const loadSettings = useCallback(async () => {
    setLoadingSettings(true)
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      setUsercode(data.netgsm_usercode ?? '')
      setPassword(data.netgsm_password ?? '')
      setHeader(data.netgsm_header ?? '')
    } catch {
      toast.error('Ayarlar yüklenemedi')
    } finally {
      setLoadingSettings(false)
    }
  }, [])

  useEffect(() => {
    loadUsage()
    loadSettings()
  }, [loadUsage, loadSettings])

  async function saveSettings() {
    setSavingSettings(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: [
            { key: 'netgsm_usercode', value: usercode, category: 'sms' },
            { key: 'netgsm_password', value: password, category: 'sms' },
            { key: 'netgsm_header', value: header, category: 'sms' },
          ],
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('NetGSM ayarları kaydedildi')
    } catch {
      toast.error('Kayıt başarısız')
    } finally {
      setSavingSettings(false)
    }
  }

  async function sendTestSms() {
    if (!testPhone) { toast.error('Test için telefon numarası girin'); return }
    if (!usercode || !password) { toast.error('Önce kullanıcı kodu ve şifreyi kaydedin'); return }
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/admin/sms-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usercode, password, header, phone: testPhone }),
      })
      const data = await res.json()
      if (data.success) {
        setTestResult({ success: true, message: `Gönderildi (ID: ${data.messageId})` })
        toast.success('Test SMS başarıyla gönderildi')
      } else {
        setTestResult({ success: false, message: data.error ?? 'Bilinmeyen hata' })
        toast.error('SMS gönderilemedi: ' + data.error)
      }
    } catch {
      setTestResult({ success: false, message: 'Bağlantı hatası' })
      toast.error('Bağlantı hatası')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            SMS İzleme
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Bu ayki NetGSM SMS kullanımı</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={loadUsage}
          disabled={loadingUsage}
          className="border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className={cn('h-4 w-4 mr-2', loadingUsage && 'animate-spin')} />
          Yenile
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="h-10 w-10 rounded-xl bg-purple-500 flex items-center justify-center mb-3">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <p className="text-xs font-semibold text-gray-500">Bu Ay Toplam SMS</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{totalUsed.toLocaleString('tr-TR')}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{tenants.length} aktif işletme</p>
        </div>
        <div className={cn(
          'rounded-2xl p-4 shadow-sm border',
          alertCount > 0 ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'
        )}>
          <div className={cn(
            'h-10 w-10 rounded-xl flex items-center justify-center mb-3',
            alertCount > 0 ? 'bg-red-500' : 'bg-gray-200'
          )}>
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <p className="text-xs font-semibold text-gray-500">Limit Uyarısı (%90+)</p>
          <p className={cn('text-2xl font-bold mt-0.5', alertCount > 0 ? 'text-red-600' : 'text-gray-900')}>
            {alertCount}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">işletme kritik seviyede</p>
        </div>
      </div>

      {/* Usage table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">İşletme Bazlı Kullanım</h2>
        </div>
        {loadingUsage ? (
          <div className="p-10 text-center text-gray-400 text-sm">Yükleniyor...</div>
        ) : tenants.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Kayıt bulunamadı</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tenants.map((t) => (
              <div key={t.id} className="px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{t.name}</span>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      t.plan === 'ISLETME' ? 'bg-amber-100 text-amber-700' :
                      t.plan === 'PROFESYONEL' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    )}>
                      {PLAN_LABELS[t.plan] ?? t.plan}
                    </span>
                    {t.alert && <AlertTriangle className="h-3.5 w-3.5 text-red-500" />}
                  </div>
                  <span className={cn(
                    'text-sm font-bold',
                    t.smsPercent >= 90 ? 'text-red-600' : t.smsPercent >= 80 ? 'text-amber-600' : 'text-gray-900'
                  )}>
                    {t.smsUsed} / {t.smsLimit} <span className="text-xs font-normal text-gray-400">SMS</span>
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      t.smsPercent >= 90 ? 'bg-red-500' : t.smsPercent >= 80 ? 'bg-amber-400' : 'bg-purple-500'
                    )}
                    style={{ width: `${Math.min(t.smsPercent, 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Sıfırlanma: {format(addMonths(new Date(t.smsResetAt), 1), 'd MMMM yyyy', { locale: tr })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NetGSM Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Settings className="h-4 w-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">NetGSM Servis Ayarları</h2>
        </div>

        {loadingSettings ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Usercode */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Kullanıcı Kodu</Label>
                <Input
                  value={usercode}
                  onChange={(e) => setUsercode(e.target.value)}
                  placeholder="NetGSM kullanıcı adı"
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Şifre</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="NetGSM şifresi"
                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Header */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Mesaj Başlığı (Header)</Label>
                <Input
                  value={header}
                  onChange={(e) => setHeader(e.target.value)}
                  placeholder="SALONAPY"
                  maxLength={11}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                />
                <p className="text-[11px] text-gray-400">Maks. 11 karakter. NetGSM panelinde onaylı olmalı.</p>
              </div>
            </div>

            <div className="pt-1 border-t border-gray-100 flex items-center justify-between">
              <Button
                onClick={saveSettings}
                disabled={savingSettings}
                className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
              >
                {savingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Kaydet
              </Button>
              <p className="text-[11px] text-gray-400">
                Env değişkenleri varsa onlar öncelikli kullanılır.
              </p>
            </div>

            {/* Test SMS */}
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-700">Test SMS Gönder</p>
              <div className="flex gap-2">
                <Input
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="5xxxxxxxxx"
                  className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 max-w-[200px]"
                />
                <Button
                  onClick={sendTestSms}
                  disabled={testing}
                  variant="outline"
                  className="border-gray-200 text-gray-700 hover:bg-white gap-2"
                >
                  {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Gönder
                </Button>
              </div>
              {testResult && (
                <div className={cn(
                  'flex items-center gap-2 text-sm rounded-lg px-3 py-2',
                  testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                )}>
                  {testResult.success
                    ? <CheckCircle2 className="h-4 w-4 shrink-0" />
                    : <XCircle className="h-4 w-4 shrink-0" />}
                  {testResult.message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
