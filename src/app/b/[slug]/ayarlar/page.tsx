'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import {
  Building2, Phone, Mail, MapPin, Globe, Camera, Copy, Check,
  MessageSquare, Bell, CreditCard, AlertTriangle, Loader2,
  ShieldAlert, Calendar, TrendingUp, Scissors, Users,
  ChevronRight, BarChart3, Settings, MessageCircle, Sparkles, Camera as InstagramIcon,
  Link2, ChevronDown, Clock, Bot, Key, Hash,
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { AI_PACKAGES, type AIPackageKey } from '@/lib/ai-packages'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { format, addMonths } from 'date-fns'
import { tr } from 'date-fns/locale'
import Image from 'next/image'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TenantProfile {
  id: string
  name: string
  slug: string
  phone: string | null
  email: string | null
  address: string | null
  logo: string | null
  plan: 'BASLANGIC' | 'PROFESYONEL' | 'ISLETME'
  planStartedAt: string
  planEndsAt: string | null
  smsUsed: number
  smsCredits: number
  smsResetAt: string
  sms24hReminder: boolean
  sms1hReminder: boolean
  timezone: string
  isActive: boolean
  country: string
  // İşletme sahibi / Fatura bilgileri
  ownerName: string | null
  ownerPhone: string | null
  ownerEmail: string | null
  ownerIdNumber: string | null
  ownerAddress: string | null
  ownerCity: string | null
  taxNumber: string | null
  taxOffice: string | null
  whatsappAIEnabled: boolean
  whatsappMessagesUsed: number
  whatsappMessagesLimit: number
  instagramAIEnabled: boolean
  instagramMessagesUsed: number
  instagramMessagesLimit: number
}

interface SubscriptionInfo {
  id: string | null
  plan: string
  amount: number
  currency: string
  status: string
  startDate: string
  endDate: string
  autoRenew: boolean
  paymentProvider: string | null
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PLAN_STYLE = {
  BASLANGIC:   { color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  PROFESYONEL: { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  ISLETME:     { color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200' },
} as const

// Fallback — DB'den gelene kadar kullanılır
const PLAN_CONFIG_DEFAULTS = {
  BASLANGIC:   { label: 'Başlangıç',   price: 540,  priceEur: 35,  priceUsd: 19,  smsLimit: 200,  features: ['200 SMS/ay', '1 personel hesabı', 'Sınırsız randevu', 'Müşteri yönetimi', 'Temel raporlar'] },
  PROFESYONEL: { label: 'Profesyonel', price: 1140, priceEur: 69,  priceUsd: 49,  smsLimit: 600,  features: ['600 SMS/ay', '3 personel hesabı', 'Sınırsız randevu', 'Müşteri yönetimi', 'Gelişmiş raporlar', 'Paket yönetimi'] },
  ISLETME:     { label: 'İşletme',     price: 1740, priceEur: 119, priceUsd: 99,  smsLimit: 1500, features: ['1.500 SMS/ay', '10 personel hesabı', 'Sınırsız randevu', 'Müşteri yönetimi', 'Gelişmiş raporlar', 'Paket yönetimi', 'Öncelikli destek'] },
}

type PlanKey = 'BASLANGIC' | 'PROFESYONEL' | 'ISLETME'
type PlanConfigMap = Record<PlanKey, typeof PLAN_CONFIG_DEFAULTS[PlanKey]>

const TIMEZONES = [
  { value: 'Europe/Istanbul', label: 'İstanbul (UTC+3)' },
  { value: 'Europe/London', label: 'Londra (UTC+0/+1)' },
  { value: 'Europe/Berlin', label: 'Berlin (UTC+1/+2)' },
  { value: 'America/New_York', label: 'New York (UTC-5/-4)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (UTC-8/-7)' },
  { value: 'Asia/Dubai', label: 'Dubai (UTC+4)' },
]

// SMS reminder template preview
const SMS_TEMPLATE = `Merhaba {müşteri_adı}, {işletme_adı} randevunuz yaklasıyor. Tarih: {tarih} Saat: {saat} Hizmet: {hizmet} Personel: {personel}`

// Ek SMS paketleri
const SMS_PACKS = [
  { amount: 100, price: 120 },
  { amount: 250, price: 300 },
  { amount: 500, price: 600 },
  { amount: 1000, price: 1200 },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function AyarlarPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = params.slug as string

  // ── State ──
  const [tenant, setTenant] = useState<TenantProfile | null>(null)
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)

  // İşletme profil formu
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [timezone, setTimezone] = useState('Europe/Istanbul')
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // İşletme sahibi / Fatura bilgileri formu
  const [ownerName, setOwnerName] = useState('')
  const [ownerPhone, setOwnerPhone] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [ownerIdNumber, setOwnerIdNumber] = useState('')
  const [ownerAddress, setOwnerAddress] = useState('')
  const [ownerCity, setOwnerCity] = useState('')
  const [taxNumber, setTaxNumber] = useState('')
  const [taxOffice, setTaxOffice] = useState('')
  const [isSavingOwner, setIsSavingOwner] = useState(false)

  // Logo
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // SMS settings
  const [sms24h, setSms24h] = useState(true)
  const [sms1h, setSms1h] = useState(true)
  const [isSavingSms, setIsSavingSms] = useState(false)
  const [buyingSmsAmount, setBuyingSmsAmount] = useState<number | null>(null)

  // Subscription
  const [autoRenew, setAutoRenew] = useState(true)
  const [isSavingAutoRenew, setIsSavingAutoRenew] = useState(false)
  const [cancelSubOpen, setCancelSubOpen] = useState(false)
  const [isCancellingSubscription, setIsCancellingSubscription] = useState(false)
  const [checkoutLoadingPlan, setCheckoutLoadingPlan] = useState<string | null>(null)
  const [upgradePlanKey, setUpgradePlanKey] = useState<PlanKey | null>(null)

  // Stripe portal
  const [isLoadingPortal, setIsLoadingPortal] = useState(false)

  // Faturalar
  const [invoices, setInvoices] = useState<Array<{
    id: string; title: string; amount: number | null; issuedAt: string; downloadUrl: string | null
  }>>([])
  const [invoicesLoaded, setInvoicesLoaded] = useState(false)

  // AI packages
  const [buyingAIPackage, setBuyingAIPackage] = useState<AIPackageKey | null>(null)

  // AI Settings
  const [aiSettings, setAiSettings] = useState({
    whatsappAutoReply: true, whatsappAutoBook: false, whatsappPrompt: '',
    instagramAutoReply: true, instagramAutoBook: false, instagramPrompt: '',
    workingHoursStart: '09:00', workingHoursEnd: '18:00', outOfHoursMessage: '',
  })
  const [isSavingAI, setIsSavingAI] = useState(false)

  // Integration connections
  const [waToken, setWaToken] = useState('')
  const [waPhoneId, setWaPhoneId] = useState('')
  const [igToken, setIgToken] = useState('')
  const [igAccountId, setIgAccountId] = useState('')
  const [waStatus, setWaStatus] = useState<string>('NOT_CONNECTED')
  const [igStatus, setIgStatus] = useState<string>('NOT_CONNECTED')
  const [isSavingWa, setIsSavingWa] = useState(false)
  const [isSavingIg, setIsSavingIg] = useState(false)
  const [showWaSettings, setShowWaSettings] = useState(false)
  const [showIgSettings, setShowIgSettings] = useState(false)

  // Slug copy
  const [copiedSlug, setCopiedSlug] = useState(false)

  // Plan config (DB'den)
  const [planConfigs, setPlanConfigs] = useState<PlanConfigMap>(PLAN_CONFIG_DEFAULTS)

  // ── Fetch ──
  const fetchData = useCallback(async () => {
    try {
      const [tenantRes, subRes, plansRes, invRes, aiRes, waRes, igRes] = await Promise.all([
        fetch(`/api/tenants/${slug}`),
        fetch(`/api/tenants/${slug}/subscription`),
        fetch('/api/plans'),
        fetch(`/api/tenants/${slug}/invoices`),
        fetch(`/api/tenants/${slug}/ai-settings`),
        fetch(`/api/tenants/${slug}/integrations/whatsapp`),
        fetch(`/api/tenants/${slug}/integrations/instagram`),
      ])
      if (invRes.ok) {
        const invData = await invRes.json()
        setInvoices(invData.invoices ?? [])
        setInvoicesLoaded(true)
      }
      if (aiRes.ok) {
        const ai = await aiRes.json()
        setAiSettings(prev => ({ ...prev, ...ai }))
      }
      if (waRes.ok) {
        const wa = await waRes.json()
        setWaStatus(wa.status ?? 'NOT_CONNECTED')
        setWaPhoneId(wa.phoneNumberId ?? '')
      }
      if (igRes.ok) {
        const ig = await igRes.json()
        setIgStatus(ig.status ?? 'NOT_CONNECTED')
        setIgAccountId(ig.instagramAccountId ?? '')
      }

      if (tenantRes.ok) {
        const data: TenantProfile = await tenantRes.json()
        setTenant(data)
        setName(data.name)
        setPhone(data.phone ?? '')
        setEmail(data.email ?? '')
        setAddress(data.address ?? '')
        setTimezone(data.timezone)
        setLogoPreview(data.logo)
        setSms24h(data.sms24hReminder)
        setSms1h(data.sms1hReminder)
        // İşletme sahibi / fatura bilgileri
        setOwnerName(data.ownerName ?? '')
        setOwnerPhone(data.ownerPhone ?? '')
        setOwnerEmail(data.ownerEmail ?? '')
        setOwnerIdNumber(data.ownerIdNumber ?? '')
        setOwnerAddress(data.ownerAddress ?? '')
        setOwnerCity(data.ownerCity ?? '')
        setTaxNumber(data.taxNumber ?? '')
        setTaxOffice(data.taxOffice ?? '')
      }

      if (subRes.ok) {
        const sub: SubscriptionInfo = await subRes.json()
        setSubscription(sub)
        setAutoRenew(sub.autoRenew)
      }

      if (plansRes.ok) {
        const apiPlans = await plansRes.json()
        setPlanConfigs((prev) => {
          const next = { ...prev }
          for (const key of ['BASLANGIC', 'PROFESYONEL', 'ISLETME'] as PlanKey[]) {
            const p = apiPlans[key]
            if (!p) continue
            const priceNum = parseInt(String(p.price).replace(/\D/g, ''), 10)
            next[key] = {
              label: p.name ?? prev[key].label,
              price: isNaN(priceNum) ? prev[key].price : priceNum,
              priceEur: parseInt(p.priceEur) || prev[key].priceEur,
              priceUsd: parseInt(p.priceUsd) || prev[key].priceUsd,
              smsLimit: typeof p.smsLimit === 'number' ? p.smsLimit : prev[key].smsLimit,
              features: Array.isArray(p.features) ? p.features : prev[key].features,
            }
          }
          return next
        })
      }
    } catch {
      toast.error('Veriler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // SMS satın alma başarı bildirimi
  useEffect(() => {
    const smsSuccess = searchParams.get('sms_success')
    if (smsSuccess) {
      toast.success(`${smsSuccess} SMS kredinize eklendi!`)
      router.replace(`/b/${slug}/ayarlar?tab=sms`)
    }
    const aiSuccess = searchParams.get('ai_success')
    if (aiSuccess) {
      toast.success('AI paketi başarıyla aktif edildi!')
      router.replace(`/b/${slug}/ayarlar?tab=ai-entegrasyon`)
    }
  }, [searchParams, slug, router])

  // ── Handlers ──

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('İşletme adı zorunludur')
      return
    }
    setIsSavingProfile(true)
    try {
      const res = await fetch(`/api/tenants/${slug}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || null,
          email: email.trim() || null,
          address: address.trim() || null,
          timezone,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Güncelleme başarısız')
      }
      const updated: TenantProfile = await res.json()
      setTenant(updated)
      toast.success('Profil güncellendi')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Güncelleme başarısız')
    } finally {
      setIsSavingProfile(false)
    }
  }

  async function handleSaveOwner(e: React.FormEvent) {
    e.preventDefault()
    setIsSavingOwner(true)
    try {
      const res = await fetch(`/api/tenants/${slug}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerName: ownerName.trim() || null,
          ownerPhone: ownerPhone.trim() || null,
          ownerEmail: ownerEmail.trim() || null,
          ownerIdNumber: ownerIdNumber.trim() || null,
          ownerAddress: ownerAddress.trim() || null,
          ownerCity: ownerCity.trim() || null,
          taxNumber: taxNumber.trim() || null,
          taxOffice: taxOffice.trim() || null,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Güncelleme başarısız')
      }
      const updated: TenantProfile = await res.json()
      setTenant(updated)
      toast.success('Sahip bilgileri güncellendi')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Güncelleme başarısız')
    } finally {
      setIsSavingOwner(false)
    }
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Dosya boyutu maksimum 2MB olabilir')
      return
    }

    // Local preview
    const reader = new FileReader()
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    // Upload
    setIsUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append('logo', file)
      const res = await fetch(`/api/tenants/${slug}/upload-logo`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Yükleme başarısız')
      }
      const { logo } = await res.json()
      setLogoPreview(logo)
      setTenant((prev) => prev ? { ...prev, logo } : null)
      toast.success('Logo güncellendi')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Yükleme başarısız')
      setLogoPreview(tenant?.logo ?? null)
    } finally {
      setIsUploadingLogo(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleSaveSmsSettings() {
    setIsSavingSms(true)
    try {
      const res = await fetch(`/api/tenants/${slug}/sms-settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sms24hReminder: sms24h, sms1hReminder: sms1h }),
      })
      if (!res.ok) throw new Error('Güncelleme başarısız')
      toast.success('SMS ayarları kaydedildi')
    } catch {
      toast.error('Güncelleme başarısız')
    } finally {
      setIsSavingSms(false)
    }
  }

  async function handleBuySms(pack: { amount: number; price: number }) {
    setBuyingSmsAmount(pack.amount)
    try {
      const res = await fetch('/api/payments/sms-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: pack.amount, tenantSlug: slug }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Hata')
      // İyzico ödeme sayfasına yönlendir
      window.location.href = json.paymentPageUrl
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'İşlem başarısız')
      setBuyingSmsAmount(null)
    }
  }

  async function handleAutoRenewChange(value: boolean) {
    setAutoRenew(value)
    if (!subscription?.id) return
    setIsSavingAutoRenew(true)
    try {
      const res = await fetch(`/api/tenants/${slug}/subscription`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoRenew: value }),
      })
      if (!res.ok) throw new Error('Güncelleme başarısız')
      toast.success(value ? 'Otomatik yenileme açıldı' : 'Otomatik yenileme kapatıldı')
    } catch {
      setAutoRenew(!value) // revert
      toast.error('Güncelleme başarısız')
    } finally {
      setIsSavingAutoRenew(false)
    }
  }

  async function handleCheckout(plan: string) {
    if (!tenant) return
    setCheckoutLoadingPlan(plan)
    try {
      const isTR = !tenant.country || tenant.country.toUpperCase() === 'TR'
      if (isTR) {
        // Turkey → İyzico
        const res = await fetch('/api/payments/iyzico/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, tenantSlug: slug }),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error ?? 'Ödeme sayfası açılamadı')
        }
        const data: { paymentPageUrl: string } = await res.json()
        window.location.href = data.paymentPageUrl
      } else {
        // Global → Stripe
        const res = await fetch('/api/payments/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, tenantSlug: slug }),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error ?? 'Ödeme sayfası açılamadı')
        }
        const data: { url: string } = await res.json()
        window.location.href = data.url
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ödeme sayfası açılamadı')
      setCheckoutLoadingPlan(null)
    }
  }

  async function handleStripePortal() {
    setIsLoadingPortal(true)
    try {
      const res = await fetch('/api/payments/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantSlug: slug }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Portal açılamadı')
      }
      const data: { url: string } = await res.json()
      window.location.href = data.url
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Fatura portalı açılamadı')
    } finally {
      setIsLoadingPortal(false)
    }
  }

  async function handleCancelSubscription() {
    setIsCancellingSubscription(true)
    try {
      if (subscription?.paymentProvider === 'stripe') {
        // Stripe cancellation is done via Customer Portal
        setCancelSubOpen(false)
        await handleStripePortal()
      } else {
        // İyzico cancellation
        const res = await fetch('/api/payments/iyzico/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenantSlug: slug }),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error ?? 'İptal başarısız')
        }
        toast.success('Abonelik iptal edildi')
        setCancelSubOpen(false)
        await fetchData()
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Abonelik iptal edilemedi')
    } finally {
      setIsCancellingSubscription(false)
    }
  }

  async function handleSaveAISettings() {
    setIsSavingAI(true)
    try {
      const res = await fetch(`/api/tenants/${slug}/ai-settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiSettings),
      })
      if (!res.ok) throw new Error()
      toast.success('AI ayarları kaydedildi')
    } catch {
      toast.error('Kayıt başarısız')
    } finally {
      setIsSavingAI(false)
    }
  }

  async function handleSaveIntegration(platform: 'whatsapp' | 'instagram') {
    const isWa = platform === 'whatsapp'
    if (isWa) setIsSavingWa(true); else setIsSavingIg(true)
    try {
      const body = isWa
        ? { credentials: { accessToken: waToken }, phoneNumberId: waPhoneId }
        : { credentials: { accessToken: igToken }, instagramAccountId: igAccountId }
      const res = await fetch(`/api/tenants/${slug}/integrations/${platform}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      if (isWa) { setWaStatus('ACTIVE'); setWaToken('') }
      else { setIgStatus('ACTIVE'); setIgToken('') }
      toast.success(`${isWa ? 'WhatsApp' : 'Instagram'} bağlantısı kaydedildi`)
    } catch {
      toast.error('Kayıt başarısız')
    } finally {
      if (isWa) setIsSavingWa(false); else setIsSavingIg(false)
    }
  }

  async function handleBuyAIPackage(packageKey: AIPackageKey) {
    setBuyingAIPackage(packageKey)
    try {
      const res = await fetch('/api/ai-packages/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageKey, tenantSlug: slug }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Hata')
      window.location.href = json.paymentPageUrl
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'İşlem başarısız')
      setBuyingAIPackage(null)
    }
  }

  function handleCopySlug() {
    if (!tenant) return
    const url = `${window.location.origin}/b/${tenant.slug}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiedSlug(true)
      setTimeout(() => setCopiedSlug(false), 2000)
    })
  }

  // ── Derived ──
  const planConfig = tenant ? { ...planConfigs[tenant.plan], ...PLAN_STYLE[tenant.plan] } : null
  const smsLimit = planConfig?.smsLimit ?? 200
  const smsPercent = tenant ? Math.min(100, Math.round((tenant.smsUsed / smsLimit) * 100)) : 0
  const smsResetDate = tenant
    ? format(addMonths(new Date(tenant.smsResetAt), 1), 'd MMMM yyyy', { locale: tr })
    : ''

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        İşletme bilgileri yüklenemedi.
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Ayarlar</h1>
        <p className="mt-1 text-sm text-gray-500">İşletme bilgilerini ve tercihlerini yönetin</p>
      </div>

      <Tabs defaultValue={searchParams.get('tab') ?? 'profil'} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-purple-50 p-1 rounded-xl h-auto">
          <TabsTrigger
            value="profil"
            className="flex items-center gap-1.5 text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm py-2"
          >
            <Settings className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger
            value="sms"
            className="flex items-center gap-1.5 text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm py-2"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">SMS</span>
          </TabsTrigger>
          <TabsTrigger
            value="abonelik"
            className="flex items-center gap-1.5 text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm py-2"
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Abonelik</span>
          </TabsTrigger>
          <TabsTrigger
            value="plan-degistir"
            className="flex items-center gap-1.5 text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm py-2"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Plan</span>
          </TabsTrigger>
          <TabsTrigger
            value="ai-entegrasyon"
            className="flex items-center gap-1.5 text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm py-2"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">AI</span>
          </TabsTrigger>
        </TabsList>

        {/* ── TAB 1: Profil ── */}
        <TabsContent value="profil">
          <form onSubmit={handleSaveProfile} className="glass-card p-6 space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-5">
              <div className="relative h-20 w-20 shrink-0">
                <div className="h-20 w-20 rounded-2xl overflow-hidden bg-purple-100 border-2 border-purple-200">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Logo"
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-purple-300" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center shadow-md transition-colors disabled:opacity-50"
                >
                  {isUploadingLogo ? (
                    <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                  ) : (
                    <Camera className="h-3.5 w-3.5 text-white" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">İşletme Logosu</p>
                <p className="text-xs text-gray-500 mt-0.5">JPG, PNG veya WebP · Maks. 2MB</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="mt-2 text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors disabled:opacity-50"
                >
                  {isUploadingLogo ? 'Yükleniyor...' : 'Logo Değiştir'}
                </button>
              </div>
            </div>

            <div className="h-px bg-purple-100" />

            {/* Form alanları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                  İşletme Adı <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9"
                    placeholder="Örn: Güzellik Salonu Ayşe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Telefon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9"
                    placeholder="+90 555 000 0000"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    placeholder="info@isletme.com"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="address" className="text-sm font-semibold text-gray-700">Adres</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="pl-9"
                    placeholder="Mahalle, Sokak No, İlçe/Şehir"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="timezone" className="text-sm font-semibold text-gray-700">Saat Dilimi</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <select
                    id="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">İşletme URL</Label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <div className="h-10 px-3 rounded-md border border-purple-100 bg-purple-50 flex items-center text-sm text-gray-600 font-mono truncate">
                      /b/{tenant.slug}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopySlug}
                    className="h-10 w-10 rounded-md border border-purple-200 bg-purple-50 hover:bg-purple-100 flex items-center justify-center transition-colors shrink-0"
                  >
                    {copiedSlug ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-purple-600" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400">URL değiştirilemez (destek ile iletişime geçin)</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isSavingProfile}
                className="bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200/60"
              >
                {isSavingProfile ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Kaydet
              </Button>
            </div>
          </form>

          {/* ── İşletme Sahibi / Fatura Bilgileri ── */}
          <form onSubmit={handleSaveOwner} className="glass-card p-6 space-y-6 mt-4">
            <div>
              <h2 className="font-display text-base font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-purple-500" />
                İşletme Sahibi & Fatura Bilgileri
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Bu bilgiler İyzico ödeme alıcı bilgileri ve fatura için kullanılır. Doğru doldurulması zorunludur.
              </p>
            </div>

            <div className="h-px bg-purple-100" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="ownerName" className="text-sm font-semibold text-gray-700">
                  Ad Soyad <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="ownerName"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="pl-9"
                    placeholder="Örn: Ayşe Yılmaz"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ownerPhone" className="text-sm font-semibold text-gray-700">Telefon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="ownerPhone"
                    type="tel"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="pl-9"
                    placeholder="+90 555 000 0000"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ownerEmail" className="text-sm font-semibold text-gray-700">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="ownerEmail"
                    type="email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="pl-9"
                    placeholder="sahip@email.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ownerIdNumber" className="text-sm font-semibold text-gray-700">
                  TC Kimlik No
                  <span className="ml-1 text-[11px] font-normal text-gray-400">(İyzico için zorunlu)</span>
                </Label>
                <div className="relative">
                  <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="ownerIdNumber"
                    value={ownerIdNumber}
                    onChange={(e) => setOwnerIdNumber(e.target.value)}
                    className="pl-9"
                    placeholder="12345678901"
                    maxLength={11}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ownerCity" className="text-sm font-semibold text-gray-700">Şehir</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="ownerCity"
                    value={ownerCity}
                    onChange={(e) => setOwnerCity(e.target.value)}
                    className="pl-9"
                    placeholder="İstanbul"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="ownerAddress" className="text-sm font-semibold text-gray-700">Fatura Adresi</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="ownerAddress"
                    value={ownerAddress}
                    onChange={(e) => setOwnerAddress(e.target.value)}
                    className="pl-9"
                    placeholder="Mahalle, Cadde No, İlçe/Şehir"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="taxNumber" className="text-sm font-semibold text-gray-700">Vergi Numarası</Label>
                <div className="relative">
                  <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="taxNumber"
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                    className="pl-9"
                    placeholder="Opsiyonel"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="taxOffice" className="text-sm font-semibold text-gray-700">Vergi Dairesi</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="taxOffice"
                    value={taxOffice}
                    onChange={(e) => setTaxOffice(e.target.value)}
                    className="pl-9"
                    placeholder="Opsiyonel"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isSavingOwner}
                className="bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200/60"
              >
                {isSavingOwner ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Kaydet
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* ── TAB 2: SMS ── */}
        <TabsContent value="sms">
          <div className="space-y-4">
            {/* Kullanım bilgisi */}
            <div className="glass-card p-5 space-y-4">
              <h2 className="font-display text-sm font-bold text-gray-900">SMS Kullanımı</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl bg-green-50 border border-green-100 p-3">
                  <p className="text-[11px] font-semibold text-green-600 uppercase tracking-wide">Plan</p>
                  <p className="mt-1 text-sm font-bold text-green-700">{planConfig?.label}</p>
                </div>
                <div className="rounded-xl bg-purple-50 border border-purple-100 p-3">
                  <p className="text-[11px] font-semibold text-purple-600 uppercase tracking-wide">Aylık Limit</p>
                  <p className="mt-1 text-sm font-bold text-purple-700">{smsLimit.toLocaleString('tr-TR')}</p>
                </div>
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                  <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide">Kullanılan</p>
                  <p className="mt-1 text-sm font-bold text-blue-700">{tenant.smsUsed.toLocaleString('tr-TR')}</p>
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                  <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wide">Sıfırlanma</p>
                  <p className="mt-1 text-sm font-bold text-amber-700">{smsResetDate}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-gray-500">
                  <span>{tenant.smsUsed} / {smsLimit} SMS kullanıldı</span>
                  <span className={smsPercent > 80 ? 'text-red-500' : 'text-gray-500'}>{smsPercent}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      smsPercent > 80 ? 'bg-red-400' : smsPercent > 60 ? 'bg-amber-400' : 'bg-green-400'
                    }`}
                    style={{ width: `${smsPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* SMS şablonu önizleme */}
            <div className="glass-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-sm font-bold text-gray-900">SMS Şablonu</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                  <Check className="h-3 w-3" />
                  NetGSM
                </span>
              </div>

              <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                <p className="text-sm text-gray-800 leading-relaxed font-mono">{SMS_TEMPLATE}</p>
              </div>

              <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                Gönderici adı: HEMENSALON · Türkçe karakter desteklenir.
              </p>
            </div>

            {/* Ek SMS Satın Al */}
            <div className="glass-card p-5 space-y-4">
              <div>
                <h2 className="font-display text-sm font-bold text-gray-900">Ek SMS Satın Al</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Aylık limitiniz bitti mi? Tek seferlik ek SMS paketi satın alabilirsiniz.
                  {tenant.smsCredits > 0 && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                      Mevcut kredi: {tenant.smsCredits} SMS
                    </span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {SMS_PACKS.map((pack) => (
                  <div
                    key={pack.amount}
                    className="border-2 border-purple-100 rounded-xl p-4 hover:border-purple-400 transition-all text-center"
                  >
                    <p className="text-2xl font-extrabold text-purple-600">{pack.amount.toLocaleString('tr-TR')}</p>
                    <p className="text-xs text-gray-500 mb-2">SMS</p>
                    <p className="text-lg font-bold text-gray-900 mb-3">₺{pack.price.toLocaleString('tr-TR')}</p>
                    <p className="text-[10px] text-gray-400 mb-3">₺{(pack.price / pack.amount).toFixed(2)}/SMS</p>
                    <Button
                      size="sm"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-xs h-8"
                      disabled={buyingSmsAmount !== null}
                      onClick={() => handleBuySms(pack)}
                    >
                      {buyingSmsAmount === pack.amount ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        'Satın Al'
                      )}
                    </Button>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-gray-400">
                * Satın aldığınız SMS&apos;ler mevcut bakiyenize eklenir ve süresiz kullanabilirsiniz. Aylık limitiniz dolduğunda ek kredilerden otomatik düşülür.
              </p>
            </div>

            {/* Otomatik hatırlatma */}
            <div className="glass-card p-5 space-y-4">
              <div>
                <h2 className="font-display text-sm font-bold text-gray-900">Otomatik Hatırlatma</h2>
                <p className="text-xs text-gray-500 mt-0.5">Randevu öncesi müşterilere otomatik SMS gönder</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Bell className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">24 Saat Önce</p>
                      <p className="text-xs text-gray-500">Randevu günü öncesi gece hatırlatma</p>
                    </div>
                  </div>
                  <Switch
                    checked={sms24h}
                    onCheckedChange={setSms24h}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>

                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Bell className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">1 Saat Önce</p>
                      <p className="text-xs text-gray-500">Randevu saatinden 1 saat önce hatırlatma</p>
                    </div>
                  </div>
                  <Switch
                    checked={sms1h}
                    onCheckedChange={setSms1h}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSmsSettings}
                  disabled={isSavingSms}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200/60"
                >
                  {isSavingSms ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
                  Kaydet
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── TAB 3: Abonelik ── */}
        <TabsContent value="abonelik">
          <div className="space-y-4">
            {/* Mevcut plan kartı */}
            {subscription && planConfig && (
              <div className={`glass-card p-5 border-2 ${planConfig.border}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-2xl ${planConfig.bg} flex items-center justify-center`}>
                      <CreditCard className={`h-6 w-6 ${planConfig.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mevcut Plan</p>
                      <p className={`text-lg font-bold ${planConfig.color}`}>{planConfig.label}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {subscription?.currency === 'USD'
                        ? `$${subscription.amount}`
                        : subscription?.currency === 'EUR'
                          ? `€${subscription.amount}`
                          : `₺${planConfig.price.toLocaleString('tr-TR')}`
                      }
                    </p>
                    <p className="text-xs text-gray-500">/ay</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Başlangıç</p>
                    <p className="mt-0.5 font-semibold text-gray-800">
                      {format(new Date(subscription.startDate), 'd MMMM yyyy', { locale: tr })}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Bitiş</p>
                    <p className="mt-0.5 font-semibold text-gray-800">
                      {format(new Date(subscription.endDate), 'd MMMM yyyy', { locale: tr })}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Otomatik Yenileme</p>
                    <p className="text-xs text-gray-500">Plan biterken otomatik olarak yenilenir</p>
                  </div>
                  <Switch
                    checked={autoRenew}
                    onCheckedChange={handleAutoRenewChange}
                    disabled={isSavingAutoRenew || !subscription.id}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>

                {/* Abonelik iptali */}
                {(subscription.status === 'ACTIVE' || subscription.status === 'TRIAL') && (
                  <button
                    type="button"
                    className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
                    onClick={() => setCancelSubOpen(true)}
                  >
                    Aboneliği İptal Et
                  </button>
                )}
              </div>
            )}

            {/* Plan özellikleri */}
            {planConfig && (
              <div className="glass-card p-5 space-y-3">
                <h2 className="font-display text-sm font-bold text-gray-900">Plan Özellikleri</h2>
                <ul className="space-y-2">
                  {planConfig.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fatura geçmişi — sadece fatura varsa göster */}
            {invoicesLoaded && invoices.length > 0 && (
              <div className="glass-card p-5 space-y-3">
                <h2 className="font-display text-sm font-bold text-gray-900">Fatura Geçmişi</h2>
                {subscription?.paymentProvider === 'stripe' ? (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500">
                      Stripe üzerinden yapılan ödemelerinizi ve faturalarınızı görüntülemek için aşağıdaki butonu kullanın.
                    </p>
                    <button
                      type="button"
                      onClick={handleStripePortal}
                      disabled={isLoadingPortal}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 py-2.5 text-sm font-semibold text-purple-700 transition-colors disabled:opacity-60"
                    >
                      {isLoadingPortal ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                      Faturalarımı Görüntüle (Stripe)
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {invoices.map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{inv.title}</p>
                          <p className="text-xs text-gray-400">{format(new Date(inv.issuedAt), 'd MMMM yyyy', { locale: tr })}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {inv.amount != null && (
                            <span className="text-sm font-bold text-gray-900">₺{inv.amount.toLocaleString('tr-TR')}</span>
                          )}
                          {inv.downloadUrl ? (
                            <a
                              href={inv.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                            >
                              İndir
                            </a>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── TAB 4: Plan Değiştir ── */}
        <TabsContent value="plan-degistir">
          <div className="space-y-4">
            {tenant && (
              <div className="glass-card p-5 space-y-3">
                <div>
                  <h2 className="font-display text-sm font-bold text-gray-900">Plan Değiştir</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Planınızı yükseltmek veya düşürmek için aşağıdaki seçenekleri kullanın.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(['BASLANGIC', 'PROFESYONEL', 'ISLETME'] as PlanKey[])
                    .filter((pk) => pk !== tenant.plan)
                    .map((pk) => {
                      const cfg = planConfigs[pk]
                      const style = PLAN_STYLE[pk]
                      const isUSD = ['US', 'USA', 'CA', 'AU', 'NZ'].includes((tenant.country ?? '').toUpperCase())
                      const isTRY = !tenant.country || tenant.country.toUpperCase() === 'TR'
                      const priceStr = isTRY
                        ? `₺${cfg.price.toLocaleString('tr-TR')}/ay`
                        : isUSD
                          ? `$${cfg.priceUsd}/ay`
                          : `€${cfg.priceEur}/ay`
                      const isUpgrade = ['BASLANGIC', 'PROFESYONEL', 'ISLETME'].indexOf(pk) > ['BASLANGIC', 'PROFESYONEL', 'ISLETME'].indexOf(tenant.plan)
                      return (
                        <button
                          key={pk}
                          type="button"
                          disabled={checkoutLoadingPlan === pk}
                          className={`flex items-center justify-between p-3 rounded-xl border ${style.border} ${style.bg} hover:opacity-90 transition-colors text-left disabled:opacity-60`}
                          onClick={() => setUpgradePlanKey(pk)}
                        >
                          <div>
                            <p className={`text-sm font-bold ${style.color}`}>
                              {isUpgrade ? `${cfg.label}'e Yükselt` : cfg.label}
                            </p>
                            <p className={`text-xs ${style.color} opacity-75`}>
                              {priceStr} · {cfg.smsLimit.toLocaleString('tr-TR')} SMS
                            </p>
                          </div>
                          {checkoutLoadingPlan === pk
                            ? <Loader2 className={`h-4 w-4 animate-spin ${style.color}`} />
                            : <ChevronRight className={`h-4 w-4 ${style.color}`} />}
                        </button>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── TAB 5: AI Entegrasyon ── */}
        <TabsContent value="ai-entegrasyon">
          <div className="relative">
            {/* Yakında overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-white/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8 max-w-sm w-full mx-4 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 mb-4">
                  <Bot className="h-7 w-7 text-purple-600" />
                </div>
                <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 mb-3">Yakında</span>
                <h3 className="font-display text-lg font-bold text-gray-900 mb-2">AI Randevu Asistanı</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  WhatsApp ve Instagram üzerinden gelen mesajlara yapay zeka yanıt verir, müsait slotları gösterir ve randevu oluşturur.
                </p>
                <p className="text-xs text-purple-600 font-medium mt-4">Çok yakında hizmetinizde olacak!</p>
              </div>
            </div>
          <div className="space-y-4 blur-sm pointer-events-none select-none">
            <div>
              <h2 className="font-display text-base font-bold text-gray-900">AI Asistan</h2>
              <p className="text-xs text-gray-500 mt-1">WhatsApp ve Instagram bağlantılarını yapılandırın</p>
            </div>

            {/* ─ WhatsApp ─ */}
            <div className="glass-card overflow-hidden">
              {/* Başlık satırı */}
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">WhatsApp AI</p>
                    {tenant.whatsappAIEnabled ? (
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${waStatus === 'ACTIVE' ? 'text-green-600' : 'text-amber-600'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${waStatus === 'ACTIVE' ? 'bg-green-500' : 'bg-amber-400'}`} />
                        {waStatus === 'ACTIVE' ? 'Bağlı' : 'Bağlantı bekleniyor'}
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400">Aktif değil</span>
                    )}
                  </div>
                </div>
                {tenant.whatsappAIEnabled && (
                  <button
                    onClick={() => setShowWaSettings(v => !v)}
                    className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700"
                  >
                    Ayarlar
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showWaSettings ? 'rotate-180' : ''}`} />
                  </button>
                )}
                {!tenant.whatsappAIEnabled && (
                  <Button size="sm" onClick={() => handleBuyAIPackage('WHATSAPP')} disabled={buyingAIPackage !== null} className="bg-green-600 hover:bg-green-700 text-xs h-8">
                    {buyingAIPackage === 'WHATSAPP' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : `₺${AI_PACKAGES.WHATSAPP.price}/ay`}
                  </Button>
                )}
              </div>

              {/* Kullanım barı */}
              {tenant.whatsappAIEnabled && (
                <div className="px-5 pb-3">
                  <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                    <span>Mesaj kullanımı</span>
                    <span>{tenant.whatsappMessagesUsed} / {tenant.whatsappMessagesLimit}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full bg-green-400 rounded-full" style={{ width: `${Math.min(100, (tenant.whatsappMessagesUsed / tenant.whatsappMessagesLimit) * 100)}%` }} />
                  </div>
                </div>
              )}

              {/* Genişleyen ayar formu */}
              {tenant.whatsappAIEnabled && showWaSettings && (
                <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50/50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Link2 className="h-3.5 w-3.5" /> API Bağlantısı
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                        <Hash className="h-3 w-3" /> Phone Number ID
                      </Label>
                      <Input
                        value={waPhoneId}
                        onChange={e => setWaPhoneId(e.target.value)}
                        placeholder="Meta Business'tan alın"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                        <Key className="h-3 w-3" /> Access Token
                      </Label>
                      <Input
                        value={waToken}
                        onChange={e => setWaToken(e.target.value)}
                        placeholder={waStatus === 'ACTIVE' ? 'EAA••••••••••••' : 'Meta Business token'}
                        type="password"
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                      <Bot className="h-3 w-3" /> AI Sistem Mesajı
                    </Label>
                    <Textarea
                      value={aiSettings.whatsappPrompt}
                      onChange={e => setAiSettings(p => ({ ...p, whatsappPrompt: e.target.value }))}
                      placeholder="Örn: Sen Ayşe Kuaför&apos;ün AI asistanısın. Randevu almak için müşterilere yardımcı olursun..."
                      rows={3}
                      className="text-sm resize-none"
                    />
                    <p className="text-[11px] text-gray-400">AI&apos;ın işletmeni nasıl tanıtacağını ve nasıl davranacağını yaz</p>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white border border-gray-100">
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Otomatik Yanıt</p>
                      <p className="text-[11px] text-gray-400">Gelen mesajları otomatik yanıtla</p>
                    </div>
                    <Switch checked={aiSettings.whatsappAutoReply} onCheckedChange={v => setAiSettings(p => ({ ...p, whatsappAutoReply: v }))} className="data-[state=checked]:bg-green-600" />
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white border border-gray-100">
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Otomatik Randevu</p>
                      <p className="text-[11px] text-gray-400">AI doğrudan randevu oluştursun</p>
                    </div>
                    <Switch checked={aiSettings.whatsappAutoBook} onCheckedChange={v => setAiSettings(p => ({ ...p, whatsappAutoBook: v }))} className="data-[state=checked]:bg-green-600" />
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" onClick={() => handleSaveIntegration('whatsapp')} disabled={isSavingWa} className="bg-green-600 hover:bg-green-700">
                      {isSavingWa ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
                      Kaydet
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* ─ Instagram ─ */}
            <div className="glass-card overflow-hidden">
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-pink-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="h-5 w-5 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Instagram AI</p>
                    {tenant.instagramAIEnabled ? (
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${igStatus === 'ACTIVE' ? 'text-pink-600' : 'text-amber-600'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${igStatus === 'ACTIVE' ? 'bg-pink-500' : 'bg-amber-400'}`} />
                        {igStatus === 'ACTIVE' ? 'Bağlı' : 'Bağlantı bekleniyor'}
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400">Aktif değil</span>
                    )}
                  </div>
                </div>
                {tenant.instagramAIEnabled && (
                  <button
                    onClick={() => setShowIgSettings(v => !v)}
                    className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700"
                  >
                    Ayarlar
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showIgSettings ? 'rotate-180' : ''}`} />
                  </button>
                )}
                {!tenant.instagramAIEnabled && (
                  <Button size="sm" onClick={() => handleBuyAIPackage('INSTAGRAM')} disabled={buyingAIPackage !== null} className="bg-pink-600 hover:bg-pink-700 text-xs h-8">
                    {buyingAIPackage === 'INSTAGRAM' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : `₺${AI_PACKAGES.INSTAGRAM.price}/ay`}
                  </Button>
                )}
              </div>

              {tenant.instagramAIEnabled && (
                <div className="px-5 pb-3">
                  <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                    <span>Mesaj kullanımı</span>
                    <span>{tenant.instagramMessagesUsed} / {tenant.instagramMessagesLimit}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full bg-pink-400 rounded-full" style={{ width: `${Math.min(100, (tenant.instagramMessagesUsed / tenant.instagramMessagesLimit) * 100)}%` }} />
                  </div>
                </div>
              )}

              {tenant.instagramAIEnabled && showIgSettings && (
                <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50/50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Link2 className="h-3.5 w-3.5" /> API Bağlantısı
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                        <Hash className="h-3 w-3" /> Instagram Hesap ID
                      </Label>
                      <Input
                        value={igAccountId}
                        onChange={e => setIgAccountId(e.target.value)}
                        placeholder="Meta Business'tan alın"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                        <Key className="h-3 w-3" /> Access Token
                      </Label>
                      <Input
                        value={igToken}
                        onChange={e => setIgToken(e.target.value)}
                        placeholder={igStatus === 'ACTIVE' ? 'EAA••••••••••••' : 'Meta Business token'}
                        type="password"
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                      <Bot className="h-3 w-3" /> AI Sistem Mesajı
                    </Label>
                    <Textarea
                      value={aiSettings.instagramPrompt}
                      onChange={e => setAiSettings(p => ({ ...p, instagramPrompt: e.target.value }))}
                      placeholder="Örn: Sen Ayşe Kuaför&apos;ün Instagram AI asistanısın..."
                      rows={3}
                      className="text-sm resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white border border-gray-100">
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Otomatik Yanıt</p>
                      <p className="text-[11px] text-gray-400">DM&apos;leri otomatik yanıtla</p>
                    </div>
                    <Switch checked={aiSettings.instagramAutoReply} onCheckedChange={v => setAiSettings(p => ({ ...p, instagramAutoReply: v }))} className="data-[state=checked]:bg-pink-600" />
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white border border-gray-100">
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Otomatik Randevu</p>
                      <p className="text-[11px] text-gray-400">AI doğrudan randevu oluştursun</p>
                    </div>
                    <Switch checked={aiSettings.instagramAutoBook} onCheckedChange={v => setAiSettings(p => ({ ...p, instagramAutoBook: v }))} className="data-[state=checked]:bg-pink-600" />
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" onClick={() => handleSaveIntegration('instagram')} disabled={isSavingIg} className="bg-pink-600 hover:bg-pink-700">
                      {isSavingIg ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
                      Kaydet
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* ─ Çalışma Saatleri + Mesaj dışı saat (her iki platform aktifse) ─ */}
            {(tenant.whatsappAIEnabled || tenant.instagramAIEnabled) && (
              <div className="glass-card p-5 space-y-4">
                <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500" /> Çalışma Saatleri
                </p>
                <p className="text-xs text-gray-500 -mt-2">Bu saatler dışında gelen mesajlara özel bir yanıt gönderilir</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">Açılış</Label>
                    <Input type="time" value={aiSettings.workingHoursStart} onChange={e => setAiSettings(p => ({ ...p, workingHoursStart: e.target.value }))} className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">Kapanış</Label>
                    <Input type="time" value={aiSettings.workingHoursEnd} onChange={e => setAiSettings(p => ({ ...p, workingHoursEnd: e.target.value }))} className="h-9 text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600">Mesai Dışı Mesaj</Label>
                  <Textarea
                    value={aiSettings.outOfHoursMessage}
                    onChange={e => setAiSettings(p => ({ ...p, outOfHoursMessage: e.target.value }))}
                    placeholder="Örn: Şu an çalışma saatlerimiz dışındayız. 09:00-18:00 arasında yanıt vereceğiz."
                    rows={2}
                    className="text-sm resize-none"
                  />
                </div>
                <div className="flex justify-end">
                  <Button size="sm" onClick={handleSaveAISettings} disabled={isSavingAI} className="bg-purple-600 hover:bg-purple-700">
                    {isSavingAI ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
                    Kaydet
                  </Button>
                </div>
              </div>
            )}

            {/* ─ Combo satın al (ikisi de yoksa) ─ */}
            {!tenant.whatsappAIEnabled && !tenant.instagramAIEnabled && (
              <div className="glass-card p-5 border-2 border-purple-300 relative">
                <div className="absolute -top-3 left-4 bg-purple-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
                  {AI_PACKAGES.COMBO.badge}
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{AI_PACKAGES.COMBO.name}</p>
                      <p className="text-xs text-gray-500">₺{AI_PACKAGES.COMBO.price}/ay <span className="line-through text-gray-400">₺{AI_PACKAGES.COMBO.originalPrice}</span></p>
                    </div>
                  </div>
                  <Button onClick={() => handleBuyAIPackage('COMBO')} disabled={buyingAIPackage !== null} className="bg-purple-600 hover:bg-purple-700 shrink-0">
                    {buyingAIPackage === 'COMBO' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Combo Al
                  </Button>
                </div>
              </div>
            )}
          </div>
          </div>
        </TabsContent>

      </Tabs>

      {/* Plan Yükseltme Karşılaştırma Modalı */}
      {upgradePlanKey && tenant && (() => {
        const newPlan   = planConfigs[upgradePlanKey]
        const curPlan   = planConfigs[tenant.plan as PlanKey]
        const newStyle  = PLAN_STYLE[upgradePlanKey]
        const isUpgrade = ['BASLANGIC','PROFESYONEL','ISLETME'].indexOf(upgradePlanKey) > ['BASLANGIC','PROFESYONEL','ISLETME'].indexOf(tenant.plan as PlanKey)
        const isTRY = !tenant.country || tenant.country.toUpperCase() === 'TR'
        const isUSD = ['US','USA','CA','AU','NZ'].includes((tenant.country ?? '').toUpperCase())
        const newPrice  = isTRY ? `₺${newPlan.price.toLocaleString('tr-TR')}` : isUSD ? `$${newPlan.priceUsd}` : `€${newPlan.priceEur}`
        const curPrice  = isTRY ? `₺${curPlan.price.toLocaleString('tr-TR')}` : isUSD ? `$${curPlan.priceUsd}` : `€${curPlan.priceEur}`
        const newFeatures = newPlan.features.filter((f) => !curPlan.features.includes(f))

        return (
          <Dialog open onOpenChange={(v) => !v && setUpgradePlanKey(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-xl font-bold">
                  {isUpgrade ? 'Paketi Yükselt' : 'Plan Değiştir'}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  {curPlan.label} → {newPlan.label} paketine geçiyorsunuz.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Mevcut</p>
                  <p className="text-sm font-bold text-gray-700">{curPlan.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{curPrice}/ay</p>
                  <ul className="mt-2 space-y-1">
                    {curPlan.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-300 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`rounded-xl border ${newStyle.border} ${newStyle.bg} p-3`}>
                  <p className={`text-[11px] font-semibold uppercase tracking-wide mb-1 ${newStyle.color} opacity-60`}>
                    {isUpgrade ? 'Yeni' : 'Seçilen'}
                  </p>
                  <p className={`text-sm font-bold ${newStyle.color}`}>{newPlan.label}</p>
                  <p className={`text-xs mt-0.5 ${newStyle.color} opacity-75`}>{newPrice}/ay</p>
                  <ul className="mt-2 space-y-1">
                    {newPlan.features.map((f) => {
                      const isNew = newFeatures.includes(f)
                      return (
                        <li key={f} className={`flex items-center gap-1.5 text-xs ${isNew ? `font-semibold ${newStyle.color}` : 'text-gray-500'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isNew ? (upgradePlanKey === 'PROFESYONEL' ? 'bg-purple-500' : 'bg-amber-400') : 'bg-gray-300'}`} />
                          {f}
                          {isNew && <span className="text-[10px] font-bold opacity-60">✦</span>}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>

              {newFeatures.length > 0 && isUpgrade && (
                <div className={`rounded-xl ${newStyle.bg} border ${newStyle.border} px-3 py-2.5`}>
                  <p className={`text-xs font-semibold ${newStyle.color} mb-1`}>✦ Bu paketle kazanacaklarınız:</p>
                  <p className={`text-xs ${newStyle.color} opacity-80`}>{newFeatures.join(' · ')}</p>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => { setUpgradePlanKey(null); handleCheckout(upgradePlanKey) }}
                  disabled={!!checkoutLoadingPlan}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold transition-colors disabled:opacity-60 ${
                    upgradePlanKey === 'ISLETME' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {checkoutLoadingPlan ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{newPrice}/ay · Ödemeye Geç</>}
                </button>
                <button
                  onClick={() => setUpgradePlanKey(null)}
                  className="w-full py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Vazgeç
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )
      })()}

      {/* Cancel subscription dialog */}
      <Dialog open={cancelSubOpen} onOpenChange={setCancelSubOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-700">Aboneliği İptal Et</DialogTitle>
            <DialogDescription>
              Bu işlemi gerçekleştirirseniz mevcut plan dönemi sonunda hizmetiniz sona erecek.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              <ul className="space-y-1 list-none">
                <li>· SMS hatırlatmalar durur</li>
                <li>· Yeni personel ekleyemezsiniz</li>
                <li>· Mevcut verileriniz korunur</li>
              </ul>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCancelSubOpen(false)}
                disabled={isCancellingSubscription}
              >
                Vazgeç
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                disabled={isCancellingSubscription}
                onClick={handleCancelSubscription}
              >
                {isCancellingSubscription
                  ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  : null}
                Aboneliği İptal Et
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
