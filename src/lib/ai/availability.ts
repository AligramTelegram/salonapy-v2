import { prisma } from '@/lib/prisma'

export interface AvailableSlot {
  date: string        // YYYY-MM-DD
  startTime: string   // HH:MM
  endTime: string     // HH:MM
  staffId: string
  staffName: string
}

/** Verilen tarih için uygun randevu slotlarını döner */
export async function getAvailableSlots(
  tenantId: string,
  serviceId: string,
  date: string,           // YYYY-MM-DD
  preferredStaffId?: string
): Promise<AvailableSlot[]> {
  const service = await prisma.service.findFirst({
    where: { id: serviceId, tenantId, isActive: true },
    select: { duration: true },
  })
  if (!service) return []

  const duration = service.duration // dakika

  // İstenen gün: dayOfWeek (0=Pazar, 1=Pzt...)
  const dateObj = new Date(date + 'T00:00:00')
  const dayOfWeek = dateObj.getDay()

  // Personel listesi
  const staffQuery = preferredStaffId
    ? { id: preferredStaffId, tenantId, isActive: true }
    : { tenantId, isActive: true }
  const staffList = await prisma.staff.findMany({
    where: staffQuery,
    select: {
      id: true,
      name: true,
      workHours: { where: { dayOfWeek, isWorking: true } },
    },
  })

  // O günkü mevcut randevular
  const startOfDay = new Date(date + 'T00:00:00Z')
  const endOfDay = new Date(date + 'T23:59:59Z')
  const existingAppointments = await prisma.appointment.findMany({
    where: {
      tenantId,
      date: { gte: startOfDay, lte: endOfDay },
      status: { notIn: ['IPTAL'] },
    },
    select: { staffId: true, startTime: true, endTime: true },
  })

  const slots: AvailableSlot[] = []

  for (const staff of staffList) {
    const workHour = staff.workHours[0]
    if (!workHour) continue

    const staffBusy = existingAppointments
      .filter(a => a.staffId === staff.id)
      .map(a => ({ start: timeToMin(a.startTime), end: timeToMin(a.endTime) }))

    // Slotları 30 dk aralıklarla üret
    const workStart = timeToMin(workHour.startTime)
    const workEnd = timeToMin(workHour.endTime)

    let cursor = workStart
    while (cursor + duration <= workEnd) {
      const slotEnd = cursor + duration
      const overlaps = staffBusy.some(b => cursor < b.end && slotEnd > b.start)
      if (!overlaps) {
        slots.push({
          date,
          startTime: minToTime(cursor),
          endTime: minToTime(slotEnd),
          staffId: staff.id,
          staffName: staff.name,
        })
      }
      cursor += 30
    }
  }

  return slots
}

/** Sonraki N günde müsait slot ara (bugünden itibaren) */
export async function getNextAvailableSlots(
  tenantId: string,
  serviceId: string,
  daysAhead = 7,
  maxSlots = 6,
  preferredStaffId?: string
): Promise<AvailableSlot[]> {
  const results: AvailableSlot[] = []
  const today = new Date()

  for (let i = 0; i < daysAhead && results.length < maxSlots; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    const daySlots = await getAvailableSlots(tenantId, serviceId, dateStr, preferredStaffId)
    results.push(...daySlots.slice(0, maxSlots - results.length))
  }

  return results
}

function timeToMin(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function minToTime(min: number): string {
  const h = Math.floor(min / 60).toString().padStart(2, '0')
  const m = (min % 60).toString().padStart(2, '0')
  return `${h}:${m}`
}
