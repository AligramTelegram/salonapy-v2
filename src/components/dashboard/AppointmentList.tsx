'use client'

import { useState } from 'react'
import { Clock, ChevronRight, CalendarX, User, Scissors, CalendarDays, Loader2, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { toast } from 'sonner'
import type { AppointmentStatus } from '@/types'
import type { AppointmentFull } from '@/hooks/useAppointments'
import { useUpdateAppointment, useDeleteAppointment } from '@/hooks/useAppointments'

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; className: string; dotClass: string; badgeClass: string }> = {
  BEKLIYOR:   { label: 'Bekliyor',   className: 'bg-amber-50 text-amber-700 border-amber-200', dotClass: 'bg-amber-400', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
  ONAYLANDI:  { label: 'Onaylandı',  className: 'bg-emerald-50 text-emerald-700 border-emerald-200', dotClass: 'bg-blue-500', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
  TAMAMLANDI: { label: 'Tamamlandı', className: 'bg-blue-50 text-blue-700 border-blue-200', dotClass: 'bg-emerald-500', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  IPTAL:      { label: 'İptal',      className: 'bg-red-50 text-red-600 border-red-200', dotClass: 'bg-red-400', badgeClass: 'bg-red-50 text-red-600 border-red-200' },
  GELMEDI:    { label: 'Gelmedi',    className: 'bg-gray-100 text-gray-500 border-gray-200', dotClass: 'bg-gray-400', badgeClass: 'bg-gray-100 text-gray-500 border-gray-200' },
}

interface AppointmentListProps {
  appointments: AppointmentFull[]
  slug: string
}

export function AppointmentList({ appointments, slug }: AppointmentListProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentFull | null>(null)

  const { mutateAsync: updateApt, isPending: isUpdating } = useUpdateAppointment()
  const { mutateAsync: deleteApt, isPending: isDeleting } = useDeleteAppointment()

  async function handleStatusChange(id: string, status: AppointmentStatus) {
    try {
      await updateApt({ id, status })
      toast.success('Durum güncellendi')
      setSelectedAppointment((prev) => prev ? { ...prev, status } : null)
    } catch {
      toast.error('Güncelleme başarısız')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Randevuyu silmek istediğinize emin misiniz?')) return
    try {
      await deleteApt(id)
      toast.success('Randevu silindi')
      setSelectedAppointment(null)
    } catch {
      toast.error('Silme başarısız')
    }
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 mb-4">
          <CalendarX className="h-7 w-7 text-purple-300" />
        </div>
        <p className="text-sm font-semibold text-gray-500">Bugün randevu yok</p>
        <p className="text-xs text-gray-400 mt-1">Yeni randevu eklemek için butona tıklayın.</p>
      </div>
    )
  }

  return (
    <>
      <div className="divide-y divide-purple-50">
        {appointments.map((apt) => {
          const config = STATUS_CONFIG[apt.status]
          return (
            <button
              key={apt.id}
              onClick={() => setSelectedAppointment(apt)}
              className="w-full text-left flex items-center gap-3 py-3 px-1 hover:bg-purple-50/40 rounded-xl transition-colors group"
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

            {/* Bilgiler */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{apt.customer?.name ?? apt.guestName ?? 'Misafir'}</p>
              <p className="text-xs text-gray-500 truncate">
                {apt.service.name} · {apt.staff?.name}
              </p>
            </div>

            {/* Fiyat + durum */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span
                className={cn(
                  'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold',
                  STATUS_CONFIG[apt.status].className
                )}
              >
                {STATUS_CONFIG[apt.status].label}
              </span>
              <span className="text-xs font-bold text-gray-700">
                ₺{apt.price.toLocaleString('tr-TR')}
              </span>
            </div>

            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-purple-400 transition-colors shrink-0" />
          </button>
        )
      })}
      </div>

      <Dialog open={!!selectedAppointment} onOpenChange={(open) => { if (!open) setSelectedAppointment(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">Randevu Detayı</DialogTitle>
          </DialogHeader>

          {selectedAppointment && (
            <>
              {/* Özet */}
              <div className="space-y-3 py-1">
                <Row icon={<User className="h-4 w-4" />} label="Müşteri" value={`${selectedAppointment.customer?.name ?? selectedAppointment.guestName ?? 'Misafir'} — ${selectedAppointment.customer?.phone ?? selectedAppointment.guestPhone ?? '—'}`} />
                <Row icon={<Scissors className="h-4 w-4" />} label="Hizmet" value={`${selectedAppointment.service.name} (${selectedAppointment.service.duration} dk)`} />
                <Row
                  icon={<div className="h-3 w-3 rounded-full" style={{ backgroundColor: selectedAppointment.staff?.color }} />}
                  label="Personel"
                  value={selectedAppointment.staff?.name ?? '—'}
                />
                <Row icon={<CalendarDays className="h-4 w-4" />} label="Tarih" value={format(new Date(selectedAppointment.date), 'd MMMM yyyy, EEEE', { locale: tr })} />
                <Row icon={<Clock className="h-4 w-4" />} label="Saat" value={`${selectedAppointment.startTime} – ${selectedAppointment.endTime}`} />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">Durum</span>
                  <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold', STATUS_CONFIG[selectedAppointment.status].badgeClass)}>
                    <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', STATUS_CONFIG[selectedAppointment.status].dotClass)} />
                    {STATUS_CONFIG[selectedAppointment.status].label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">Fiyat</span>
                  <span className="font-bold text-gray-900">₺{selectedAppointment.price.toLocaleString('tr-TR')}</span>
                </div>
                {selectedAppointment.notes && (
                  <div className="rounded-xl bg-purple-50 px-3 py-2 text-sm text-gray-700">
                    <span className="font-semibold text-purple-700">Not: </span>{selectedAppointment.notes}
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
                      disabled={selectedAppointment.status === s || isUpdating}
                      onClick={() => handleStatusChange(selectedAppointment.id, s)}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-40',
                        selectedAppointment.status === s
                          ? STATUS_CONFIG[s].badgeClass
                          : 'border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-700'
                      )}
                    >
                      {isUpdating && selectedAppointment.status !== s ? <Loader2 className="h-3 w-3 animate-spin inline mr-1" /> : null}
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
                  onClick={() => handleDelete(selectedAppointment.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Trash2 className="h-4 w-4 mr-1.5" />}
                  Sil
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedAppointment(null)}>
                  Kapat
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
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
