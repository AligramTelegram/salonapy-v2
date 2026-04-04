'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import {
  Plus,
  Search,
  Users,
  Phone,
  Mail,
  CalendarDays,
  Banknote,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCustomers, type CustomerRow } from '@/hooks/useCustomers'
import { CustomerModal } from '@/components/dashboard/CustomerModal'
import { CustomerDetailModal } from '@/components/dashboard/CustomerDetailModal'
import { NewAppointmentModal } from '@/components/dashboard/NewAppointmentModal'

type SortKey = 'name' | 'totalVisits' | 'totalSpent' | 'lastVisitAt'
type SortDir = 'asc' | 'desc'

function SortButton({
  label,
  sortKey,
  current,
  dir,
  onSort,
}: {
  label: string
  sortKey: SortKey
  current: SortKey
  dir: SortDir
  onSort: (k: SortKey) => void
}) {
  const active = current === sortKey
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`flex items-center gap-1 text-xs font-medium transition-colors ${
        active ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      {label}
      {active ? (
        dir === 'asc' ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )
      ) : (
        <ChevronDown className="h-3.5 w-3.5 opacity-30" />
      )}
    </button>
  )
}

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setDebounced(value), delay)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [value, delay])
  return debounced
}

export default function MusterilerPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<CustomerRow | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false)
  const [appointmentCustomerId, setAppointmentCustomerId] = useState<string | undefined>(undefined)

  const { data: customers = [], isLoading } = useCustomers(debouncedSearch)

  const sorted = useMemo(() => {
    return [...customers].sort((a, b) => {
      let av: string | number | null, bv: string | number | null

      if (sortKey === 'name') {
        av = a.name.toLowerCase()
        bv = b.name.toLowerCase()
      } else if (sortKey === 'totalVisits') {
        av = a.totalVisits
        bv = b.totalVisits
      } else if (sortKey === 'totalSpent') {
        av = a.totalSpent
        bv = b.totalSpent
      } else {
        av = a.lastVisitAt ? new Date(a.lastVisitAt).getTime() : 0
        bv = b.lastVisitAt ? new Date(b.lastVisitAt).getTime() : 0
      }

      if (av === null) return 1
      if (bv === null) return -1
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [customers, sortKey, sortDir])

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'name' ? 'asc' : 'desc')
    }
  }

  function openNew() {
    setEditingCustomer(null)
    setModalOpen(true)
  }

  function openEdit(c: CustomerRow) {
    setEditingCustomer(c)
    setModalOpen(true)
  }

  function openDetail(id: string) {
    setDetailId(id)
    setDetailOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingCustomer(null)
  }

  function closeDetail() {
    setDetailOpen(false)
    setDetailId(null)
  }

  // Stats
  const topVisitor = customers.reduce<CustomerRow | null>(
    (acc, c) => (!acc || c.totalVisits > acc.totalVisits ? c : acc),
    null
  )
  const topSpender = customers.reduce<CustomerRow | null>(
    (acc, c) => (!acc || c.totalSpent > acc.totalSpent ? c : acc),
    null
  )

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const inactiveCount = customers.filter(
    (c) => !c.lastVisitAt || new Date(c.lastVisitAt) < thirtyDaysAgo
  ).length

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Müşteriler</h1>
          <p className="text-sm text-gray-500 mt-1">{customers.length} kayıtlı müşteri</p>
        </div>
        <Button onClick={openNew} className="bg-purple-600 hover:bg-purple-700 gap-2">
          <Plus className="h-4 w-4" />
          Yeni Müşteri
        </Button>
      </div>

      {/* Stats kartları */}
      {customers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="h-4 w-4 text-purple-500" />
              <span className="text-xs font-medium text-gray-500">En Sadık Müşteri</span>
            </div>
            {topVisitor ? (
              <>
                <p className="font-semibold text-gray-900 truncate">{topVisitor.name}</p>
                <p className="text-sm text-gray-400">{topVisitor.totalVisits} ziyaret</p>
              </>
            ) : (
              <p className="text-sm text-gray-400">—</p>
            )}
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Banknote className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium text-gray-500">En Çok Harcama</span>
            </div>
            {topSpender ? (
              <>
                <p className="font-semibold text-gray-900 truncate">{topSpender.name}</p>
                <p className="text-sm text-gray-400">
                  ₺{topSpender.totalSpent.toLocaleString('tr-TR')}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400">—</p>
            )}
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-orange-400" />
              <span className="text-xs font-medium text-gray-500">30 Günde Gelmeyen</span>
            </div>
            <p className="font-semibold text-gray-900">{inactiveCount}</p>
            <p className="text-sm text-gray-400">müşteri</p>
          </div>
        </div>
      )}

      {/* Arama */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="İsim veya telefon ara..."
          className="pl-9"
        />
      </div>

      {/* Tablo */}
      {isLoading ? (
        <div className="glass-card overflow-hidden animate-pulse">
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      ) : sorted.length === 0 ? (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-purple-300" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">
            {debouncedSearch ? 'Sonuç bulunamadı' : 'Henüz müşteri yok'}
          </h3>
          <p className="text-sm text-gray-400 mb-5">
            {debouncedSearch
              ? `"${debouncedSearch}" için sonuç yok`
              : 'İlk müşterinizi ekleyerek başlayın'}
          </p>
          {!debouncedSearch && (
            <Button onClick={openNew} className="bg-purple-600 hover:bg-purple-700 gap-2">
              <Plus className="h-4 w-4" />
              İlk Müşteriyi Ekle
            </Button>
          )}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          {/* Tablo başlığı */}
          <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] gap-4 px-4 py-2 border-b border-gray-100 bg-gray-50/50">
            <SortButton label="Ad Soyad" sortKey="name" current={sortKey} dir={sortDir} onSort={handleSort} />
            <span className="text-xs font-medium text-gray-400">İletişim</span>
            <SortButton label="Ziyaret" sortKey="totalVisits" current={sortKey} dir={sortDir} onSort={handleSort} />
            <SortButton label="Harcama" sortKey="totalSpent" current={sortKey} dir={sortDir} onSort={handleSort} />
            <SortButton label="Son Ziyaret" sortKey="lastVisitAt" current={sortKey} dir={sortDir} onSort={handleSort} />
          </div>

          <div className="divide-y divide-gray-50">
            {sorted.map((c) => {
              const initials = c.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()

              return (
                <div
                  key={c.id}
                  onClick={() => openDetail(c.id)}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr_1fr] gap-2 md:gap-4 px-4 py-3 hover:bg-purple-50/40 cursor-pointer transition-colors"
                >
                  {/* Ad */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-sm font-bold shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{c.name}</p>
                      {/* Mobile: iletişim */}
                      <div className="md:hidden flex items-center gap-1 text-xs text-gray-400">
                        <Phone className="h-3 w-3" />
                        {c.phone}
                      </div>
                    </div>
                  </div>

                  {/* İletişim */}
                  <div className="hidden md:flex flex-col gap-0.5 justify-center min-w-0">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{c.phone}</span>
                    </div>
                    {c.email && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{c.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Ziyaret */}
                  <div className="hidden md:flex items-center">
                    <span className="text-sm font-semibold text-gray-700">
                      {c.totalVisits}
                    </span>
                  </div>

                  {/* Harcama */}
                  <div className="hidden md:flex items-center">
                    <span className="text-sm font-semibold text-gray-700">
                      ₺{c.totalSpent.toLocaleString('tr-TR')}
                    </span>
                  </div>

                  {/* Son ziyaret */}
                  <div className="hidden md:flex items-center">
                    <span className="text-sm text-gray-400">
                      {c.lastVisitAt
                        ? format(new Date(c.lastVisitAt), 'd MMM yyyy', { locale: tr })
                        : '—'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Modaller */}
      <CustomerModal
        customer={editingCustomer}
        open={modalOpen}
        onClose={closeModal}
      />

      <CustomerDetailModal
        customerId={detailId}
        open={detailOpen}
        onClose={closeDetail}
        onEdit={(c) => {
          closeDetail()
          openEdit(c)
        }}
        onNewAppointment={(customerId) => {
          setAppointmentCustomerId(customerId)
          setAppointmentModalOpen(true)
        }}
      />

      <NewAppointmentModal
        open={appointmentModalOpen}
        onClose={() => {
          setAppointmentModalOpen(false)
          setAppointmentCustomerId(undefined)
        }}
        initialCustomerId={appointmentCustomerId}
      />
    </div>
  )
}
