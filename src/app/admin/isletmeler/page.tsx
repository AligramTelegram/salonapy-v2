'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search, Building2, ChevronLeft, ChevronRight, ExternalLink,
  ToggleLeft, ToggleRight, Loader2, X, Users, Calendar, TrendingUp,
  MessageCircle, CreditCard, CheckCircle2, XCircle, Mail, Phone,
  MapPin, Lock, Eye, EyeOff, RefreshCw, Trash2,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TenantRow {
  id: string
  name: string
  slug: string
  email: string | null
  phone: string | null
  plan: string
  isActive: boolean
  waUsed: number
  createdAt: string
  planEndsAt: string | null
  _count: { staff: number; appointments: number; customers: number }
}

interface OwnerUser {
  id: string
  email: string
  name: string
  supabaseId: string
}

interface TenantDetail {
  tenant: TenantRow & {
    subscription: { amount: number; status: string; endDate: string } | null
    address: string | null
    logo: string | null
    country: string
    currency: string
    timezone: string
    planStartedAt: string
    planEndsAt: string | null
  }
  ownerUser: OwnerUser | null
  stats: {
    totalAppointments: number
    totalCustomers: number
    staffCount: number
    totalRevenue: number
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PLAN_LABELS: Record<string, string> = {
  BASLANGIC: 'Başlangıç',
  PROFESYONEL: 'Profesyonel',
  ISLETME: 'İşletme',
}
const PLAN_COLORS: Record<string, string> = {
  BASLANGIC: 'bg-blue-100 text-blue-700',
  PROFESYONEL: 'bg-purple-100 text-purple-700',
  ISLETME: 'bg-amber-100 text-amber-700',
}
const PLAN_PRICES: Record<string, number> = {
  BASLANGIC: 450, PROFESYONEL: 950, ISLETME: 1450, // fallback — gerçek değer /api/plans'tan gelir
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function IsletmelerPage() {
  const [tenants, setTenants] = useState<TenantRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  // Filters
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Detail modal
  const [detailOpen, setDetailOpen] = useState(false)
  const [detail, setDetail] = useState<TenantDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  // Action loading
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [changingPlanId, setChangingPlanId] = useState<string | null>(null)

  // Hard delete
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Credentials form
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [savingCredentials, setSavingCredentials] = useState(false)

  // ── Fetch list ──
  const fetchTenants = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: p.toString(),
        limit: '10',
        ...(search && { search }),
        ...(planFilter && { plan: planFilter }),
        ...(statusFilter && { status: statusFilter }),
      })
      const res = await fetch(`/api/admin/tenants?${params}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setTenants(data.tenants)
      setTotal(data.total)
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch {
      toast.error('Liste yüklenemedi')
    } finally {
      setLoading(false)
    }
  }, [search, planFilter, statusFilter])

  useEffect(() => {
    const t = setTimeout(() => fetchTenants(1), 300)
    return () => clearTimeout(t)
  }, [fetchTenants])

  // ── Detail modal ──
  async function openDetail(id: string) {
    setDetailOpen(true)
    setLoadingDetail(true)
    setNewName('')
    setNewEmail('')
    setNewPassword('')
    setShowPassword(false)
    try {
      const res = await fetch(`/api/admin/tenants/${id}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setDetail(data)
      setNewName(data.tenant.name ?? '')
      setNewEmail(data.ownerUser?.email ?? '')
    } catch {
      toast.error('Detay yüklenemedi')
      setDetailOpen(false)
    } finally {
      setLoadingDetail(false)
    }
  }

  // ── Save credentials ──
  async function handleSaveCredentials() {
    if (!detail) return
    if (!newName.trim() && !newEmail && !newPassword) return
    if (newPassword && newPassword.length < 6) {
      toast.error('Şifre en az 6 karakter olmalı')
      return
    }
    if (newName.trim().length < 2) {
      toast.error('İşletme adı en az 2 karakter olmalı')
      return
    }
    setSavingCredentials(true)
    try {
      const body: Record<string, string> = {}
      if (newName.trim() && newName.trim() !== detail.tenant.name) body.name = newName.trim()
      if (newEmail && newEmail !== detail.ownerUser?.email) body.email = newEmail
      if (newPassword) body.password = newPassword
      if (Object.keys(body).length === 0) { toast.info('Değişiklik yok'); return }

      const res = await fetch(`/api/admin/tenants/${detail.tenant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      toast.success('Bilgiler güncellendi')
      setNewPassword('')
      const updatedTenant = json?.slug ? json : null
      setDetail((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          tenant: {
            ...prev.tenant,
            ...(body.name ? { name: body.name } : {}),
            ...(updatedTenant?.slug ? { slug: updatedTenant.slug } : {}),
          },
          ownerUser: prev.ownerUser && body.email ? { ...prev.ownerUser, email: body.email } : prev.ownerUser,
        }
      })
      if (body.name) {
        setTenants((prev) => prev.map((t) =>
          t.id === detail.tenant.id
            ? { ...t, name: body.name, slug: updatedTenant?.slug ?? t.slug }
            : t
        ))
      }
    } catch (err) {
      toast.error('Güncelleme başarısız: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
    } finally {
      setSavingCredentials(false)
    }
  }

  // ── Toggle active ──
  async function handleToggleActive(tenant: TenantRow) {
    setTogglingId(tenant.id)
    try {
      const res = await fetch(`/api/admin/tenants/${tenant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !tenant.isActive }),
      })
      if (!res.ok) throw new Error()
      setTenants((prev) =>
        prev.map((t) => (t.id === tenant.id ? { ...t, isActive: !tenant.isActive } : t))
      )
      toast.success(tenant.isActive ? 'İşletme pasif yapıldı' : 'İşletme aktif edildi')
    } catch {
      toast.error('İşlem başarısız')
    } finally {
      setTogglingId(null)
    }
  }

  // ── Change plan ──
  async function handleChangePlan(id: string, newPlan: string) {
    setChangingPlanId(id)
    try {
      const res = await fetch(`/api/admin/tenants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newPlan }),
      })
      if (!res.ok) throw new Error()
      setTenants((prev) =>
        prev.map((t) => (t.id === id ? { ...t, plan: newPlan } : t))
      )
      if (detail && detail.tenant.id === id) {
        setDetail((prev) => prev ? { ...prev, tenant: { ...prev.tenant, plan: newPlan } } : null)
      }
      toast.success('Plan güncellendi')
    } catch {
      toast.error('Plan güncellenemedi')
    } finally {
      setChangingPlanId(null)
    }
  }

  // ── Hard delete ──
  async function handleHardDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/tenants/${id}?hard=true`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('İşletme kalıcı olarak silindi')
      setDetailOpen(false)
      setDetail(null)
      fetchTenants(page)
    } catch {
      toast.error('Silme başarısız')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">İşletmeler</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} işletme kayıtlı</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchTenants(page)}
          disabled={loading}
          className="gap-2 h-9"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="İsim, slug veya email ara..."
            className="pl-9 h-9"
          />
        </div>

        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Tüm Planlar</option>
          <option value="BASLANGIC">Başlangıç</option>
          <option value="PROFESYONEL">Profesyonel</option>
          <option value="ISLETME">İşletme</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Tüm Durumlar</option>
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
        </select>

        {(search || planFilter || statusFilter) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9"
            onClick={() => { setSearch(''); setPlanFilter(''); setStatusFilter('') }}
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Temizle
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">İşletme</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Personel</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Kayıt</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Durum</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksiyonlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <Building2 className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate max-w-[180px]">{t.name}</p>
                          <p className="text-[11px] text-gray-400">/b/{t.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PLAN_COLORS[t.plan] ?? 'bg-gray-100 text-gray-600'}`}>
                        {PLAN_LABELS[t.plan] ?? t.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="text-xs text-gray-600">
                        <span>{t._count.staff} personel</span>
                        <span className="mx-1 text-gray-300">·</span>
                        <span>{t._count.customers} müşteri</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-gray-500">
                        {format(new Date(t.createdAt), 'd MMM yyyy', { locale: tr })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {t.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                          <CheckCircle2 className="h-3 w-3" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
                          <XCircle className="h-3 w-3" />
                          Pasif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDetail(t.id)}
                          className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          Detay
                        </button>
                        <button
                          onClick={() => handleToggleActive(t)}
                          disabled={togglingId === t.id}
                          className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                        >
                          {togglingId === t.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : t.isActive ? (
                            <ToggleRight className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tenants.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-sm text-gray-400">
                      Sonuç bulunamadı
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} / {total}
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={page === 1}
                onClick={() => fetchTenants(page - 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="flex items-center text-xs font-semibold text-gray-700 px-2">
                {page} / {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={page === totalPages}
                onClick={() => fetchTenants(page + 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={(open) => { if (!open) { setDetailOpen(false); setDetail(null) } }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold">İşletme Detayı</DialogTitle>
          </DialogHeader>

          {loadingDetail ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
            </div>
          ) : detail ? (
            <div className="space-y-5">
              {/* Tenant header */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className="h-10 w-10 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{detail.tenant.name}</p>
                  <p className="text-xs text-gray-500">/b/{detail.tenant.slug}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${PLAN_COLORS[detail.tenant.plan] ?? 'bg-gray-100 text-gray-600'}`}>
                  {PLAN_LABELS[detail.tenant.plan]}
                </span>
              </div>

              {/* Tenant contact info */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">İşletme Bilgileri</p>
                {[
                  { icon: Mail, label: 'E-posta', value: detail.tenant.email },
                  { icon: Phone, label: 'Telefon', value: detail.tenant.phone },
                  { icon: MapPin, label: 'Adres', value: detail.tenant.address },
                ].map(({ icon: Icon, label, value }) =>
                  value ? (
                    <div key={label} className="flex items-center gap-2.5 text-sm">
                      <Icon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span className="text-gray-500 text-xs w-14 shrink-0">{label}</span>
                      <span className="text-gray-800 font-medium truncate">{value}</span>
                    </div>
                  ) : null
                )}
                <div className="flex items-center gap-2.5 text-sm pt-1">
                  <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-500 text-xs w-14 shrink-0">Kayıt</span>
                  <span className="text-gray-800 font-medium">
                    {format(new Date(detail.tenant.createdAt), 'd MMMM yyyy', { locale: tr })}
                  </span>
                </div>
                {detail.tenant.planEndsAt && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <CreditCard className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span className="text-gray-500 text-xs w-14 shrink-0">Plan Sonu</span>
                    <span className="text-gray-800 font-medium">
                      {format(new Date(detail.tenant.planEndsAt), 'd MMMM yyyy', { locale: tr })}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Calendar, label: 'Randevular', value: detail.stats.totalAppointments, color: 'text-purple-600', bg: 'bg-purple-50' },
                  { icon: Users, label: 'Müşteriler', value: detail.stats.totalCustomers, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { icon: TrendingUp, label: 'Personel', value: detail.stats.staffCount, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { icon: TrendingUp, label: 'Gelir', value: `₺${detail.stats.totalRevenue.toLocaleString('tr-TR')}`, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-3`}>
                    <p className={`text-[11px] font-semibold ${s.color} uppercase tracking-wide`}>{s.label}</p>
                    <p className="text-base font-bold text-gray-900 mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* WA + Subscription */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-orange-50 border border-orange-100 p-3 flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-orange-500 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-orange-700">WhatsApp Bu Ay</p>
                    <p className="text-sm font-bold text-gray-900">{detail.tenant.waUsed} mesaj</p>
                  </div>
                </div>
                {detail.tenant.subscription ? (
                  <div className="rounded-xl bg-purple-50 border border-purple-100 p-3 flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-purple-600 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-purple-700">Abonelik</p>
                      <p className="text-sm font-bold text-gray-900">
                        ₺{detail.tenant.subscription.amount}/ay · {detail.tenant.subscription.status}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-gray-400 shrink-0" />
                    <p className="text-xs text-gray-500">Abonelik kaydı yok</p>
                  </div>
                )}
              </div>

              {/* Plan change */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan Değiştir</p>
                <div className="flex gap-2 flex-wrap">
                  {(['BASLANGIC', 'PROFESYONEL', 'ISLETME'] as const).map((p) => (
                    <button
                      key={p}
                      disabled={detail.tenant.plan === p || changingPlanId === detail.tenant.id}
                      onClick={() => handleChangePlan(detail.tenant.id, p)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all disabled:opacity-40 ${
                        detail.tenant.plan === p
                          ? `${PLAN_COLORS[p]} border-transparent`
                          : 'border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-700'
                      }`}
                    >
                      {changingPlanId === detail.tenant.id && detail.tenant.plan !== p ? (
                        <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                      ) : null}
                      {PLAN_LABELS[p]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email & Password update */}
              <div className="rounded-xl border border-gray-200 p-4 space-y-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  Bilgileri Güncelle
                </p>
                {detail.ownerUser ? (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">İşletme Adı</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <Input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="İşletme adı"
                          className="pl-9 h-9 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">E-posta</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <Input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="yeni@email.com"
                          className="pl-9 h-9 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Yeni Şifre <span className="text-gray-400 font-normal">(boş bırakılırsa değişmez)</span></Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="En az 6 karakter"
                          className="pl-9 pr-9 h-9 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleSaveCredentials}
                      disabled={savingCredentials}
                      className="bg-purple-600 hover:bg-purple-700 text-white h-8 text-xs"
                    >
                      {savingCredentials ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                      Kaydet
                    </Button>
                  </>
                ) : (
                  <p className="text-xs text-gray-400">Bu işletmeye ait kullanıcı bulunamadı.</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(detail.tenant)}
                    disabled={togglingId === detail.tenant.id}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${
                      detail.tenant.isActive
                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                        : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    {togglingId === detail.tenant.id ? <Loader2 className="h-3.5 w-3.5 animate-spin inline" /> : null}
                    {detail.tenant.isActive ? 'Pasif Yap' : 'Aktif Et'}
                  </button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        disabled={deletingId === detail.tenant.id}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 flex items-center gap-1"
                      >
                        {deletingId === detail.tenant.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Kalıcı Sil
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>İşletmeyi Kalıcı Sil?</AlertDialogTitle>
                        <AlertDialogDescription>
                          <strong>{detail.tenant.name}</strong> işletmesi ve tüm veriler (randevular, müşteriler, personel, finans) kalıcı olarak silinecek. Supabase Auth kullanıcısı da silinecek. Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleHardDelete(detail.tenant.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Evet, Kalıcı Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <a
                  href={`/b/${detail.tenant.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  İşletme Paneli
                </a>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
