'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { format, parseISO } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
  Search,
  Loader2,
  Users,
  Phone,
  X,
  Calendar,
  Clock,
  ChevronRight,
  Plus,
} from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { AppointmentStatus } from '@/types'

// ---- Types ----
interface StaffCustomer {
  id: string
  name: string
  phone: string
  email: string | null
  totalVisitsWithStaff: number
  lastVisitAt: string | null
}

interface CustomerAppointment {
  id: string
  date: string
  startTime: string
  endTime: string
  status: AppointmentStatus
  price: number
  notes?: string
  service: { id: string; name: string; color: string; duration: number }
  customer: { id: string; name: string; phone: string }
}

interface ServiceOption {
  id: string
  name: string
  duration: number
  price: number
  color: string
}

interface StaffInfo {
  id: string
  name: string
  tenantId: string
}

// ---- Constants ----
const STATUS_LABELS: Record<AppointmentStatus, string> = {
  BEKLIYOR: 'Bekliyor',
  ONAYLANDI: 'Onaylandı',
  TAMAMLANDI: 'Tamamlandı',
  IPTAL: 'İptal',
  GELMEDI: 'Gelmedi',
}

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  BEKLIYOR: 'bg-yellow-100 text-yellow-700',
  ONAYLANDI: 'bg-blue-100 text-blue-700',
  TAMAMLANDI: 'bg-green-100 text-green-700',
  IPTAL: 'bg-gray-100 text-gray-500',
  GELMEDI: 'bg-red-100 text-red-600',
}

// ---- Debounce hook ----
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer.current)
  }, [value, delay])
  return debounced
}

// ---- Avatar ----
function Avatar({ name, color, size = 'md' }: { name: string; color?: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const bg = color ?? '#7c3aed'
  const sizeClass = size === 'sm' ? 'h-9 w-9 text-xs' : size === 'lg' ? 'h-14 w-14 text-xl' : 'h-11 w-11 text-sm'
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
      style={{ backgroundColor: bg }}
    >
      {initials}
    </div>
  )
}

// ---- New Appointment Modal ----
function NewAppointmentModal({
  customer,
  staffInfo,
  onClose,
  onSuccess,
}: {
  customer: StaffCustomer
  staffInfo: StaffInfo
  onClose: () => void
  onSuccess: () => void
}) {
  const [services, setServices] = useState<ServiceOption[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    serviceId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    price: 0,
    notes: '',
  })

  useEffect(() => {
    axios.get<ServiceOption[]>('/api/services').then((res) => {
      setServices(res.data)
    }).finally(() => setLoading(false))
  }, [])

  // Auto-fill price when service changes
  useEffect(() => {
    const svc = services.find((s) => s.id === form.serviceId)
    if (svc) setForm((f) => ({ ...f, price: svc.price }))
  }, [form.serviceId, services])

  function calcEndTime(startTime: string, duration: number): string {
    const [h, m] = startTime.split(':').map(Number)
    const total = h * 60 + m + duration
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.serviceId) { toast.error('Hizmet seçin'); return }
    const svc = services.find((s) => s.id === form.serviceId)
    const endTime = svc ? calcEndTime(form.startTime, svc.duration) : form.startTime
    setSubmitting(true)
    try {
      await axios.post('/api/staff/appointments', {
        customerId: customer.id,
        serviceId: form.serviceId,
        date: form.date,
        startTime: form.startTime,
        endTime,
        price: form.price,
        notes: form.notes || undefined,
      })
      toast.success('Randevu oluşturuldu')
      onSuccess()
      onClose()
    } catch {
      toast.error('Randevu oluşturulamadı')
    } finally {
      setSubmitting(false)
    }
  }

  const timeSlots: string[] = []
  for (let h = 8; h <= 21; h++) {
    for (const m of [0, 15, 30, 45]) {
      if (h === 21 && m > 30) break
      timeSlots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-2xl shadow-xl max-w-lg mx-auto overflow-hidden">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        <div className="px-5 pb-8 pt-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-bold text-gray-900">Yeni Randevu</h2>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-purple-50 rounded-xl mb-4">
            <Avatar name={customer.name} size="sm" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{customer.name}</p>
              <p className="text-xs text-gray-500">{customer.phone}</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Hizmet</label>
                <select
                  value={form.serviceId}
                  onChange={(e) => setForm((f) => ({ ...f, serviceId: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                >
                  <option value="">Hizmet seçin...</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.duration}dk — ₺{s.price.toLocaleString('tr-TR')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Tarih</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Saat</label>
                  <select
                    value={form.startTime}
                    onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Fiyat (₺)</label>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Not (opsiyonel)</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Müşteri notu..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700 transition-colors disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <><Plus className="h-4 w-4" />Randevu Oluştur</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

// ---- Customer Detail Sheet ----
function CustomerDetailSheet({
  customer,
  staffInfo,
  onClose,
  onNewAppointment,
}: {
  customer: StaffCustomer
  staffInfo: StaffInfo
  onClose: () => void
  onNewAppointment: () => void
}) {
  const [history, setHistory] = useState<CustomerAppointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get<CustomerAppointment[]>(`/api/staff/appointments?customerId=${customer.id}`)
      .then((res) => setHistory(res.data.slice(0, 15)))
      .finally(() => setLoading(false))
  }, [customer.id])

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-2xl shadow-xl max-w-lg mx-auto overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="overflow-y-auto px-5 pb-8 pt-2 flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar name={customer.name} size="lg" />
              <div>
                <p className="font-bold text-gray-900 text-base">{customer.name}</p>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                  <Phone className="h-3.5 w-3.5" />
                  {customer.phone}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="glass-card p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-xl font-bold text-gray-900">{customer.totalVisitsWithStaff}</div>
              <div className="text-xs text-gray-500">Ziyaret (sizinle)</div>
            </div>
            <div className="glass-card p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-sm font-bold text-gray-900">
                {customer.lastVisitAt
                  ? format(parseISO(customer.lastVisitAt), 'd MMM', { locale: tr })
                  : '—'}
              </div>
              <div className="text-xs text-gray-500">Son Ziyaret</div>
            </div>
          </div>

          {/* New appointment button */}
          <button
            onClick={onNewAppointment}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700 transition-colors mb-4"
          >
            <Plus className="h-4 w-4" />
            Yeni Randevu Oluştur
          </button>

          {/* Appointment history */}
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Randevu Geçmişi</h3>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Henüz randevu yok</p>
          ) : (
            <div className="space-y-2">
              {history.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <div
                    className="w-1 self-stretch rounded-full shrink-0"
                    style={{ backgroundColor: apt.service.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {apt.service.name}
                      </span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_COLORS[apt.status]}`}
                      >
                        {STATUS_LABELS[apt.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                      <span>
                        {format(parseISO(apt.date), 'd MMM yyyy', { locale: tr })}
                      </span>
                      <span>·</span>
                      <span>{apt.startTime}</span>
                      {apt.notes && (
                        <>
                          <span>·</span>
                          <span className="truncate text-amber-600">{apt.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ---- Main Page ----
type CustomerGroup = { label: string; customers: StaffCustomer[] }

function groupCustomers(customers: StaffCustomer[]): CustomerGroup[] {
  const sik = customers.filter((c) => c.totalVisitsWithStaff >= 10)
  const orta = customers.filter((c) => c.totalVisitsWithStaff >= 3 && c.totalVisitsWithStaff < 10)
  const nadir = customers.filter((c) => c.totalVisitsWithStaff < 3)

  return [
    { label: 'Sık Müşteriler', customers: sik },
    { label: 'Orta', customers: orta },
    { label: 'Nadir', customers: nadir },
  ].filter((g) => g.customers.length > 0)
}

export default function PersonelMusterilerPage() {
  const [customers, setCustomers] = useState<StaffCustomer[]>([])
  const [staffInfo, setStaffInfo] = useState<StaffInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<StaffCustomer | null>(null)
  const [showNewApt, setShowNewApt] = useState(false)
  const debouncedSearch = useDebounce(search, 300)

  const fetchCustomers = useCallback(async (q: string) => {
    try {
      const url = q ? `/api/staff/customers?q=${encodeURIComponent(q)}` : '/api/staff/customers'
      const { data } = await axios.get<StaffCustomer[]>(url)
      setCustomers(data)
    } catch {
      toast.error('Müşteriler yüklenemedi')
    }
  }, [])

  // Initial load: fetch staff info + customers
  useEffect(() => {
    Promise.all([
      axios.get<StaffInfo>('/api/staff/me'),
      axios.get<StaffCustomer[]>('/api/staff/customers'),
    ])
      .then(([staffRes, custRes]) => {
        setStaffInfo(staffRes.data)
        setCustomers(custRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  // Re-fetch when search changes
  useEffect(() => {
    if (!loading) fetchCustomers(debouncedSearch)
  }, [debouncedSearch, fetchCustomers, loading])

  const groups = groupCustomers(customers)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Müşterilerim</h1>
        <p className="text-sm text-gray-400">{customers.length} müşteri</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="İsim veya telefon ara..."
          className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Customer groups */}
      {customers.length === 0 ? (
        <div className="text-center py-14 text-gray-400">
          <Users className="h-12 w-12 mx-auto mb-3 text-gray-200" />
          <p className="text-sm font-medium">
            {debouncedSearch ? 'Müşteri bulunamadı' : 'Henüz müşteri yok'}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  {group.label}
                </h2>
                <span className="text-xs text-gray-400">({group.customers.length})</span>
              </div>
              <div className="space-y-2">
                {group.customers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCustomer(c); setShowNewApt(false) }}
                    className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm text-left hover:border-purple-200 hover:shadow-md transition-all"
                  >
                    <Avatar name={c.name} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                        <Phone className="h-3 w-3" />
                        <span>{c.phone}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-purple-600">
                        {c.totalVisitsWithStaff}
                      </p>
                      <p className="text-[10px] text-gray-400">ziyaret</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customer detail sheet */}
      {selectedCustomer && !showNewApt && staffInfo && (
        <CustomerDetailSheet
          customer={selectedCustomer}
          staffInfo={staffInfo}
          onClose={() => setSelectedCustomer(null)}
          onNewAppointment={() => setShowNewApt(true)}
        />
      )}

      {/* New appointment modal */}
      {selectedCustomer && showNewApt && staffInfo && (
        <NewAppointmentModal
          customer={selectedCustomer}
          staffInfo={staffInfo}
          onClose={() => { setShowNewApt(false); setSelectedCustomer(null) }}
          onSuccess={() => fetchCustomers(debouncedSearch)}
        />
      )}
    </div>
  )
}
