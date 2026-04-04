'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  format,
  differenceInMinutes,
  parse,
  startOfMonth,
  endOfMonth,
} from 'date-fns'
import { tr } from 'date-fns/locale'
import { Calendar, Clock, Loader2, CheckCircle2, ChevronRight } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
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

function getNextAppointment(
  appointments: StaffAppointment[]
): StaffAppointment | null {
  const nowTime = format(new Date(), 'HH:mm')
  return (
    appointments.find(
      (apt) =>
        (apt.status === 'BEKLIYOR' || apt.status === 'ONAYLANDI') &&
        apt.startTime >= nowTime
    ) ?? null
  )
}

function getRemainingTime(startTime: string): string {
  const now = new Date()
  const start = parse(startTime, 'HH:mm', now)
  const diff = differenceInMinutes(start, now)

  if (diff <= 0) return 'Başladı'
  if (diff < 60) return `${diff} dk`
  const h = Math.floor(diff / 60)
  const m = diff % 60
  return m > 0 ? `${h} sa ${m} dk` : `${h} saat`
}

function CustomerAvatar({ name, color }: { name: string; color: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <div
      className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  )
}

export default function PersonelBugunPage() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const [todayApts, setTodayApts] = useState<StaffAppointment[]>([])
  const [monthCount, setMonthCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    const now = new Date()
    const from = format(startOfMonth(now), 'yyyy-MM-dd')
    const to = format(endOfMonth(now), 'yyyy-MM-dd')

    try {
      const [todayRes, monthRes] = await Promise.all([
        axios.get<StaffAppointment[]>(`/api/staff/appointments?date=${today}`),
        axios.get<StaffAppointment[]>(
          `/api/staff/appointments?from=${from}&to=${to}`
        ),
      ])
      setTodayApts(todayRes.data)
      setMonthCount(monthRes.data.length)
    } finally {
      setLoading(false)
    }
  }, [today])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleComplete(id: string) {
    setCompleting(id)
    try {
      await axios.put(`/api/staff/appointments/${id}`, { status: 'TAMAMLANDI' })
      setTodayApts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'TAMAMLANDI' } : a))
      )
      toast.success('Randevu tamamlandı')
    } catch {
      toast.error('İşlem başarısız')
    } finally {
      setCompleting(null)
    }
  }

  const nextApt = getNextAppointment(todayApts)
  const completedToday = todayApts.filter(
    (a) => a.status === 'TAMAMLANDI'
  ).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Date header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">
          {format(new Date(), 'd MMMM', { locale: tr })}
        </h1>
        <p className="text-sm text-gray-500 capitalize">
          {format(new Date(), 'EEEE', { locale: tr })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-purple-500" />
            <span className="text-xs font-medium text-gray-500">Bugün</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{todayApts.length}</div>
          <div className="text-xs text-gray-400">{completedToday} tamamlandı</div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-xs font-medium text-gray-500">Bu Ay</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{monthCount}</div>
          <div className="text-xs text-gray-400">randevu</div>
        </div>
      </div>

      {/* Next appointment — highlighted card */}
      {nextApt ? (
        <div className="rounded-2xl bg-purple-600 p-4 text-white shadow-lg shadow-purple-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-purple-200 uppercase tracking-wide">
              Sıradaki Randevu
            </span>
            <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
              {getRemainingTime(nextApt.startTime)}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center text-lg font-bold shrink-0">
              {nextApt.customer.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-base leading-tight truncate">
                {nextApt.customer.name}
              </p>
              <p className="text-sm text-purple-200 truncate">
                {nextApt.service.name}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm text-purple-100">
              <Clock className="h-4 w-4 shrink-0" />
              <span>
                {nextApt.startTime} — {nextApt.endTime}
              </span>
            </div>
            <button
              onClick={() => handleComplete(nextApt.id)}
              disabled={completing === nextApt.id}
              className="flex items-center gap-1.5 bg-white text-purple-700 text-sm font-semibold px-4 py-1.5 rounded-xl hover:bg-purple-50 transition-colors disabled:opacity-60"
            >
              {completing === nextApt.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  Başla <ChevronRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : todayApts.length > 0 ? (
        <div className="rounded-2xl bg-green-50 border border-green-100 p-4 flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-green-500 shrink-0" />
          <div>
            <p className="font-semibold text-green-800">Bugün tamamlandı!</p>
            <p className="text-sm text-green-600">Tüm randevular bitti.</p>
          </div>
        </div>
      ) : null}

      {/* Today's full list */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Bugünün Randevuları
        </h2>

        {todayApts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-200" />
            <p className="text-sm font-medium">Bugün randevu yok</p>
            <p className="text-xs mt-1">Dinlenmek için iyi bir gün!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayApts.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
              >
                <div
                  className="w-1 self-stretch rounded-full shrink-0"
                  style={{ backgroundColor: apt.service.color }}
                />

                <CustomerAvatar
                  name={apt.customer.name}
                  color={apt.service.color}
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

                <div className="text-right shrink-0 ml-1">
                  <p className="text-sm font-bold text-gray-800">
                    {apt.startTime}
                  </p>
                  <p className="text-xs text-gray-400">{apt.endTime}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
