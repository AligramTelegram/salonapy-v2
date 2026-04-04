'use client'

import { useState, useEffect, useCallback } from 'react'
import { format, addDays, startOfWeek, parseISO } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Loader2,
  Clock,
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { AppointmentStatus } from '@/types'

interface StaffAppointment {
  id: string
  date: string
  startTime: string
  endTime: string
  status: AppointmentStatus
  price: number
  notes?: string
  service: { id: string; name: string; duration: number; color: string }
  customer: { id: string; name: string; phone: string }
}

const DAY_LABELS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

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

// --- Appointment Detail Sheet ---
function AppointmentDetailSheet({
  appointment,
  onClose,
  onStatusChange,
}: {
  appointment: StaffAppointment
  onClose: () => void
  onStatusChange: (id: string, status: AppointmentStatus) => void
}) {
  const [updating, setUpdating] = useState<string | null>(null)

  async function updateStatus(status: AppointmentStatus) {
    setUpdating(status)
    try {
      await axios.put(`/api/staff/appointments/${appointment.id}`, { status })
      onStatusChange(appointment.id, status)
      toast.success(`Durum: ${STATUS_LABELS[status]}`)
      onClose()
    } catch {
      toast.error('Güncelleme başarısız')
    } finally {
      setUpdating(null)
    }
  }

  const initials = appointment.customer.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Sheet */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-2xl shadow-xl max-w-lg mx-auto overflow-hidden">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="px-5 pb-8 pt-2">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
                style={{ backgroundColor: appointment.service.color }}
              >
                {initials}
              </div>
              <div>
                <p className="font-bold text-gray-900">{appointment.customer.name}</p>
                <p className="text-sm text-gray-500">{appointment.customer.phone}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: appointment.service.color }}
              />
              <span className="text-sm font-medium text-gray-800">
                {appointment.service.name}
              </span>
              <span className="text-xs text-gray-400 ml-auto">
                {appointment.service.duration} dk
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <Clock className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="text-sm text-gray-700">
                {format(parseISO(appointment.date), 'd MMMM yyyy', { locale: tr })}
                {' · '}
                {appointment.startTime} — {appointment.endTime}
              </span>
            </div>
            {appointment.notes && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-sm text-amber-800">{appointment.notes}</p>
              </div>
            )}
          </div>

          {/* Current status */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Durum</span>
            <span
              className={`text-sm px-3 py-1 rounded-full font-medium ${STATUS_COLORS[appointment.status]}`}
            >
              {STATUS_LABELS[appointment.status]}
            </span>
          </div>

          {/* Status actions */}
          {appointment.status !== 'TAMAMLANDI' && appointment.status !== 'IPTAL' && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateStatus('TAMAMLANDI')}
                disabled={!!updating}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
              >
                {updating === 'TAMAMLANDI' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Tamamlandı
              </button>
              <button
                onClick={() => updateStatus('GELMEDI')}
                disabled={!!updating}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-60 border border-red-100"
              >
                {updating === 'GELMEDI' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                Gelmedi
              </button>
              <button
                onClick={() => updateStatus('ONAYLANDI')}
                disabled={!!updating || appointment.status === 'ONAYLANDI'}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 text-blue-600 text-sm font-semibold hover:bg-blue-100 transition-colors disabled:opacity-60 col-span-2 border border-blue-100"
              >
                {updating === 'ONAYLANDI' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Onayla
              </button>
              <button
                onClick={() => updateStatus('IPTAL')}
                disabled={!!updating}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 text-gray-500 text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-60 col-span-2 border border-gray-100"
              >
                {updating === 'IPTAL' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                İptal Et
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// --- Main Page ---
export default function PersonelTakvimPage() {
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )
  const [appointments, setAppointments] = useState<StaffAppointment[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedApt, setSelectedApt] = useState<StaffAppointment | null>(null)

  const selectedStr = format(selectedDate, 'yyyy-MM-dd')

  const fetchAppointments = useCallback(async (date: Date) => {
    setLoading(true)
    try {
      const dateStr = format(date, 'yyyy-MM-dd')
      const { data } = await axios.get<StaffAppointment[]>(
        `/api/staff/appointments?date=${dateStr}`
      )
      setAppointments(data)
    } catch {
      toast.error('Randevular yüklenemedi')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAppointments(selectedDate)
  }, [selectedDate, fetchAppointments])

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  function goToToday() {
    const today = new Date()
    setSelectedDate(today)
    setWeekStart(startOfWeek(today, { weekStartsOn: 1 }))
  }

  function handleStatusChange(id: string, status: AppointmentStatus) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    )
    if (selectedApt?.id === id) {
      setSelectedApt((prev) => (prev ? { ...prev, status } : prev))
    }
  }

  return (
    <div className="space-y-4">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-900">Takvim</h1>
        {selectedStr !== todayStr && (
          <button
            onClick={goToToday}
            className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors"
          >
            Bugüne Dön
          </button>
        )}
      </div>

      {/* Week strip */}
      <div className="glass-card p-3">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setWeekStart((ws) => addDays(ws, -7))}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-gray-500" />
          </button>
          <span className="text-xs font-semibold text-gray-600 capitalize">
            {format(weekStart, 'MMMM yyyy', { locale: tr })}
          </span>
          <button
            onClick={() => setWeekStart((ws) => addDays(ws, 7))}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day, i) => {
            const dayStr = format(day, 'yyyy-MM-dd')
            const isSelected = dayStr === selectedStr
            const isToday = dayStr === todayStr

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  'flex flex-col items-center py-2 rounded-xl transition-all duration-150',
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                    : isToday
                    ? 'bg-purple-50 text-purple-600 ring-1 ring-purple-200'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <span className="text-[10px] font-medium">{DAY_LABELS[i]}</span>
                <span className="text-sm font-bold mt-0.5">{format(day, 'd')}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected day header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-800 capitalize">
            {format(selectedDate, 'd MMMM, EEEE', { locale: tr })}
          </h2>
          {!loading && (
            <p className="text-xs text-gray-400">
              {appointments.length === 0
                ? 'Randevu yok'
                : `${appointments.length} randevu`}
            </p>
          )}
        </div>
      </div>

      {/* Appointments list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-14 text-gray-400">
          <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-200" />
          <p className="text-sm font-medium">Bu gün randevu yok</p>
        </div>
      ) : (
        <div className="space-y-2">
          {appointments.map((apt) => (
            <button
              key={apt.id}
              onClick={() => setSelectedApt(apt)}
              className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm text-left hover:border-purple-200 hover:shadow-md transition-all"
            >
              <div
                className="w-1 self-stretch rounded-full shrink-0"
                style={{ backgroundColor: apt.service.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {apt.customer.name}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_COLORS[apt.status]}`}
                  >
                    {STATUS_LABELS[apt.status]}
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {apt.service.name}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-800">{apt.startTime}</p>
                <p className="text-xs text-gray-400">{apt.endTime}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Appointment detail sheet */}
      {selectedApt && (
        <AppointmentDetailSheet
          appointment={selectedApt}
          onClose={() => setSelectedApt(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}
