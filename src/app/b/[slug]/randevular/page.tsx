'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
  Plus,
  LayoutList,
  CalendarDays,
  ChevronRight,
  ChevronLeft,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  XCircle,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useSearchParams, useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { NewAppointmentModal } from '@/components/dashboard/NewAppointmentModal'
import { AppointmentCalendar } from '@/components/dashboard/AppointmentCalendar'
import {
  useAppointments,
  useUpdateAppointment,
  useDeleteAppointment,
  type AppointmentFull,
} from '@/hooks/useAppointments'
import { cn } from '@/lib/utils'
import type { AppointmentStatus } from '@/types'

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  BEKLIYOR:   { label: 'Bekliyor',   dotClass: 'bg-amber-400',  badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
  ONAYLANDI:  { label: 'Onaylandı', dotClass: 'bg-blue-500',   badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
  TAMAMLANDI: { label: 'Tamamlandı',dotClass: 'bg-emerald-500',badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  IPTAL:      { label: 'İptal',      dotClass: 'bg-red-400',    badgeClass: 'bg-red-50 text-red-600 border-red-200' },
  GELMEDI:    { label: 'Gelmedi',   dotClass: 'bg-gray-400',   badgeClass: 'bg-gray-100 text-gray-500 border-gray-200' },
}

const STATUS_FILTER_OPTIONS = [
  { value: 'ALL', label: 'Tümü' },
  { value: 'BEKLIYOR', label: 'Bekliyor' },
  { value: 'ONAYLANDI', label: 'Onaylandı' },
  { value: 'TAMAMLANDI', label: 'Tamamlandı' },
  { value: 'IPTAL', label: 'İptal' },
]

export default function RandevularPage() {
  const [view, setView] = useState<'liste' | 'takvim'>('liste')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [calendarView, setCalendarView] = useState<import('react-big-calendar').View>('week')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [newModalOpen, setNewModalOpen] = useState(false)
  const [detailApt, setDetailApt] = useState<AppointmentFull | null>(null)

  const dateStr = format(selectedDate, 'yyyy-MM-dd')
  const dateLabel = format(selectedDate, 'd MMMM yyyy, EEEE', { locale: tr })

  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  // --- API --- liste: gün bazlı, takvim: ay bazlı (tüm DB yerine)
  const { data: appointments = [], isLoading } = useAppointments(
    view === 'liste'
      ? { date: dateStr }
      : {
          from: format(startOfMonth(selectedDate), 'yyyy-MM-dd'),
          to: format(endOfMonth(selectedDate), 'yyyy-MM-dd'),
        }
  )
  const { mutateAsync: updateApt, isPending: isUpdating } = useUpdateAppointment()
  const { mutateAsync: deleteApt, isPending: isDeleting } = useDeleteAppointment()

  // Filtrele (client-side, hızlı)
  const filtered = statusFilter === 'ALL'
    ? appointments
    : appointments.filter((a) => a.status === statusFilter)

  useEffect(() => {
    const aptId = searchParams.get('apt')
    if (!aptId || appointments.length === 0) return

    const found = appointments.find((a) => a.id === aptId)
    if (found) {
      setDetailApt(found)
    }
  }, [searchParams, appointments])

  function prevDay() { setSelectedDate((d) => new Date(d.getTime() - 86400000)) }
  function nextDay() { setSelectedDate((d) => new Date(d.getTime() + 86400000)) }
  function goToday()  { setSelectedDate(new Date()) }

  async function handleStatusChange(id: string, status: AppointmentStatus) {
    try {
      await updateApt({ id, status })
      toast.success('Durum güncellendi')
      setDetailApt((prev) => prev ? { ...prev, status } : null)
    } catch {
      toast.error('Güncelleme başarısız')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Randevuyu silmek istediğinize emin misiniz?')) return
    try {
      await deleteApt(id)
      toast.success('Randevu silindi')
      setDetailApt(null)
      if (params.slug) router.replace(`/b/${params.slug}/randevular`)
    } catch {
      toast.error('Silme başarısız')
    }
  }

  function closeDetail() {
    setDetailApt(null)
    if (params.slug) router.replace(`/b/${params.slug}/randevular`)
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Başlık + Yeni Randevu */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="font-display text-2xl font-bold text-gray-900">Randevular</h1>
        <Button
          onClick={() => setNewModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200/60"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Yeni Randevu
        </Button>
      </div>

      {/* Kontrol Barı */}
      <div className="glass-card p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Sol: Görünüm toggle */}
        <div className="flex items-center gap-1 rounded-xl bg-purple-50 p-1">
          <button
            onClick={() => setView('liste')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all',
              view === 'liste'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-500 hover:text-purple-600'
            )}
          >
            <LayoutList className="h-4 w-4" /> Liste
          </button>
          <button
            onClick={() => setView('takvim')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all',
              view === 'takvim'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-500 hover:text-purple-600'
            )}
          >
            <CalendarDays className="h-4 w-4" /> Takvim
          </button>
        </div>

        {/* Orta: Tarih navigasyonu (yalnızca liste görünümünde) */}
        {view === 'liste' && (
          <div className="flex items-center gap-2">
            <button
              onClick={prevDay}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-purple-50 hover:text-purple-600 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={goToday}
              className="rounded-lg px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-600 capitalize transition-colors"
            >
              {dateLabel}
            </button>
            <button
              onClick={nextDay}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-purple-50 hover:text-purple-600 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Sağ: Durum filtresi */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTER_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* İçerik */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-purple-400" />
        </div>
      ) : view === 'liste' ? (
        <ListeView
          appointments={filtered}
          onSelect={setDetailApt}
        />
      ) : (
        <div className="glass-card p-4 overflow-hidden">
          <AppointmentCalendar
            appointments={appointments}
            date={selectedDate}
            view={calendarView}
            onNavigate={(nextDate) => setSelectedDate(nextDate)}
            onView={(nextView) => setCalendarView(nextView)}
            onSelectEvent={setDetailApt}
            onSelectSlot={(start) => {
              setSelectedDate(start)
              setNewModalOpen(true)
            }}
          />
        </div>
      )}

      {/* Yeni Randevu Modal */}
      <NewAppointmentModal
        open={newModalOpen}
        onClose={() => setNewModalOpen(false)}
        slug={params.slug as string}
        defaultDate={dateStr}
      />

      {/* Detay Modal */}
      {detailApt && (
        <DetailModal
          apt={detailApt}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          onClose={closeDetail}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

// ─── Liste Görünümü ───────────────────────────────────────────────────────────
function ListeView({
  appointments,
  onSelect,
}: {
  appointments: AppointmentFull[]
  onSelect: (apt: AppointmentFull) => void
}) {
  if (appointments.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center py-16 text-center">
        <CalendarDays className="h-12 w-12 text-purple-200 mb-3" />
        <p className="text-sm font-semibold text-gray-500">Bu gün için randevu yok</p>
        <p className="text-xs text-gray-400 mt-1">Yukarıdaki butonu kullanarak yeni randevu ekleyin.</p>
      </div>
    )
  }

  return (
    <div className="glass-card divide-y divide-purple-50">
      {appointments.map((apt) => {
        const cfg = STATUS_CONFIG[apt.status]
        return (
          <div
            key={apt.id}
            onClick={() => onSelect(apt)}
            className="flex items-center gap-3 p-4 hover:bg-purple-50/40 cursor-pointer group transition-colors"
          >
            {/* Saat */}
            <div className="flex flex-col items-center min-w-[52px]">
              <span className="text-sm font-bold text-gray-800">{apt.startTime}</span>
              <span className="text-[11px] text-gray-400">{apt.endTime}</span>
            </div>

            {/* Renk çizgisi */}
            <div
              className="w-1 h-10 rounded-full shrink-0"
              style={{ backgroundColor: apt.staff?.color ?? '#7c3aed' }}
            />

            {/* Bilgi */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{apt.customer?.name ?? apt.guestName ?? 'Misafir'}</p>
              <p className="text-xs text-gray-500 truncate">
                {apt.service.name} · {apt.staff?.name}
              </p>
            </div>

            {/* Sağ */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold', cfg.badgeClass)}>
                {cfg.label}
              </span>
              <span className="text-xs font-bold text-gray-700">
                ₺{apt.price.toLocaleString('tr-TR')}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-purple-400 transition-colors shrink-0" />
          </div>
        )
      })}
    </div>
  )
}

// ─── Detay Modal ──────────────────────────────────────────────────────────────
function DetailModal({
  apt,
  isUpdating,
  isDeleting,
  onClose,
  onStatusChange,
  onDelete,
}: {
  apt: AppointmentFull
  isUpdating: boolean
  isDeleting: boolean
  onClose: () => void
  onStatusChange: (id: string, status: AppointmentStatus) => void
  onDelete: (id: string) => void
}) {
  const cfg = STATUS_CONFIG[apt.status]
  const dateLabel = format(new Date(apt.date), 'd MMMM yyyy, EEEE', { locale: tr })

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">Randevu Detayı</DialogTitle>
        </DialogHeader>

        {/* Özet */}
        <div className="space-y-3 py-1">
          <Row icon={<User className="h-4 w-4" />} label="Müşteri" value={`${apt.customer?.name ?? apt.guestName ?? 'Misafir'} — ${apt.customer?.phone ?? apt.guestPhone ?? '—'}`} />
          <Row icon={<Scissors className="h-4 w-4" />} label="Hizmet" value={`${apt.service.name} (${apt.service.duration} dk)`} />
          <Row
            icon={<div className="h-3 w-3 rounded-full" style={{ backgroundColor: apt.staff?.color }} />}
            label="Personel"
            value={apt.staff?.name ?? '—'}
          />
          <Row icon={<CalendarDays className="h-4 w-4" />} label="Tarih" value={dateLabel} />
          <Row icon={<Clock className="h-4 w-4" />} label="Saat" value={`${apt.startTime} – ${apt.endTime}`} />
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">Durum</span>
            <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold', cfg.badgeClass)}>
              <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', cfg.dotClass)} />
              {cfg.label}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">Fiyat</span>
            <span className="font-bold text-gray-900">₺{apt.price.toLocaleString('tr-TR')}</span>
          </div>
          {apt.notes && (
            <div className="rounded-xl bg-purple-50 px-3 py-2 text-sm text-gray-700">
              <span className="font-semibold text-purple-700">Not: </span>{apt.notes}
            </div>
          )}
        </div>

        {/* Hızlı durum aksiyonları */}
        <div className="border-t border-purple-100 pt-4 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Durum Değiştir</p>
          <div className="flex flex-wrap gap-2">
            {(['ONAYLANDI', 'TAMAMLANDI', 'IPTAL', 'GELMEDI'] as AppointmentStatus[]).map((s) => (
              <button
                key={s}
                disabled={apt.status === s || isUpdating}
                onClick={() => onStatusChange(apt.id, s)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-40',
                  apt.status === s
                    ? STATUS_CONFIG[s].badgeClass
                    : 'border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-700'
                )}
              >
                {isUpdating && apt.status !== s ? <Loader2 className="h-3 w-3 animate-spin inline mr-1" /> : null}
                {STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* Alt butonlar */}
        <div className="flex justify-between gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete(apt.id)}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Trash2 className="h-4 w-4 mr-1.5" />}
            Sil
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Kapat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between text-sm gap-2">
      <span className="flex items-center gap-1.5 text-gray-500 font-medium shrink-0">
        <span className="text-gray-400">{icon}</span>
        {label}
      </span>
      <span className="text-gray-800 font-medium text-right truncate">{value}</span>
    </div>
  )
}
