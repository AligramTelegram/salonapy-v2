'use client'

import { useMemo, useCallback } from 'react'
import { Calendar, dateFnsLocalizer, Views, type Event as RBCEvent, type View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay, addHours, setHours } from 'date-fns'
import { tr } from 'date-fns/locale'
import type { AppointmentFull } from '@/hooks/useAppointments'

// CSS — react-big-calendar'ı özelleştiriyoruz
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'tr': tr,
  },
})

interface CalendarEvent extends RBCEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: AppointmentFull
}

function buildEvents(appointments: AppointmentFull[]): CalendarEvent[] {
  return appointments.map((apt) => {
    const baseDate = new Date(apt.date)
    const [startHour, startMinute] = apt.startTime.split(':').map(Number)
    const [endHour, endMinute] = apt.endTime.split(':').map(Number)

    const start = new Date(baseDate)
    start.setHours(startHour, startMinute, 0, 0)

    const end = new Date(baseDate)
    end.setHours(endHour, endMinute, 0, 0)

    return {
      id: apt.id,
      title: `${apt.customer?.name ?? apt.guestName ?? 'Misafir'} — ${apt.service.name}`,
      start,
      end,
      resource: apt,
    }
  })
}

interface AppointmentCalendarProps {
  appointments: AppointmentFull[]
  date?: Date
  view?: View
  onNavigate?: (date: Date) => void
  onView?: (view: View) => void
  onSelectEvent?: (apt: AppointmentFull) => void
  onSelectSlot?: (start: Date) => void
}

export function AppointmentCalendar({
  appointments,
  date,
  view,
  onNavigate,
  onView,
  onSelectEvent,
  onSelectSlot,
}: AppointmentCalendarProps) {
  const events = useMemo(() => buildEvents(appointments), [appointments])

  const eventStyleGetter = useCallback((event: CalendarEvent): { style: React.CSSProperties } => {
    const color = event.resource.staff?.color ?? '#7c3aed'
    return {
      style: {
        backgroundColor: color,
        borderRadius: '8px',
        border: 'none',
        color: '#fff',
        fontSize: '12px',
        padding: '2px 6px',
        opacity: event.resource.status === 'IPTAL' ? 0.45 : 1,
      },
    }
  }, [])

  return (
    <div className="rbc-wrapper h-[600px]">
      <Calendar
        localizer={localizer}
        events={events}
        date={date}
        view={view}
        onNavigate={onNavigate}
        onView={onView}
        defaultView={Views.WEEK}
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        step={30}
        timeslots={2}
        min={setHours(new Date(), 8)}
        max={setHours(new Date(), 21)}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event: CalendarEvent) => onSelectEvent?.(event.resource)}
        onSelectSlot={(slotInfo: { start: Date }) => onSelectSlot?.(slotInfo.start)}
        selectable
        popup
        messages={{
          next: 'İleri',
          previous: 'Geri',
          today: 'Bugün',
          month: 'Ay',
          week: 'Hafta',
          day: 'Gün',
          agenda: 'Ajanda',
          date: 'Tarih',
          time: 'Saat',
          event: 'Randevu',
          noEventsInRange: 'Bu aralıkta randevu yok.',
          showMore: (count: number) => `+${count} randevu daha`,
          allDay: 'Tüm gün',
        }}
      />
    </div>
  )
}
