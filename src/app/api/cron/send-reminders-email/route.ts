import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAppointmentReminder } from '@/lib/resend'
import { format } from 'date-fns'
import { tr, enUS } from 'date-fns/locale'
import type { EmailLocale } from '@/lib/emails/templates'
import { isTurkishPhone } from '@/lib/country-detect'

export const dynamic = 'force-dynamic'

/**
 * GET /api/cron/send-reminders-email
 *
 * Saatte bir çalışır. Tam 24 saat sonra randevusu olan müşterilere email gönderir.
 * Pencere: şu andan +23.5s ile +24.5s arası (±30dk tolerans).
 *
 * vercel.json: { "path": "/api/cron/send-reminders-email", "schedule": "0 * * * *" }
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const now = new Date()

  const windowStart = new Date(now.getTime() + 23.5 * 60 * 60 * 1000)
  const windowEnd   = new Date(now.getTime() + 24.5 * 60 * 60 * 1000)

  const dateStart = new Date(windowStart)
  dateStart.setHours(0, 0, 0, 0)
  const dateEnd = new Date(windowEnd)
  dateEnd.setHours(23, 59, 59, 999)

  const appointments = await prisma.appointment.findMany({
    where: {
      date: { gte: dateStart, lte: dateEnd },
      status: { in: ['BEKLIYOR', 'ONAYLANDI'] },
      tenant: { isActive: true },
    },
    include: {
      customer: { select: { name: true, email: true } },
      service: { select: { name: true } },
      staff: { select: { name: true } },
      tenant: { select: { id: true, name: true, phone: true, email: true } },
    },
  })

  const toSend = appointments.filter((apt) => {
    const [h, m] = apt.startTime.split(':').map(Number)
    const aptTime = new Date(apt.date)
    aptTime.setHours(h, m, 0, 0)
    return aptTime >= windowStart && aptTime <= windowEnd
  })

  let sent = 0
  let skipped = 0
  let errors = 0

  for (const apt of toSend) {
    if (!apt.customer.email) { skipped++; continue }

    const existing = await prisma.notification.findMany({
      where: {
        appointmentId: apt.id,
        channel: 'EMAIL',
        message: { startsWith: 'REMINDER_24H:' },
      },
      select: { status: true },
    })
    if (existing.some(n => n.status === 'GONDERILDI')) { skipped++; continue }
    if (existing.filter(n => n.status === 'BASARISIZ').length >= 3) { skipped++; continue }

    const locale: EmailLocale = isTurkishPhone(apt.tenant.phone) ? 'tr' : 'en'
    const dateFnsLocale = locale === 'tr' ? tr : enUS
    const dateStr = format(new Date(apt.date), 'd MMMM yyyy', { locale: dateFnsLocale })

    try {
      const notif = await prisma.notification.create({
        data: {
          tenantId: apt.tenantId,
          appointmentId: apt.id,
          channel: 'EMAIL',
          to: apt.customer.email,
          message: `REMINDER_24H: 24 saat öncesi email hatırlatma — ${dateStr} ${apt.startTime}`,
          status: 'BASARISIZ',
        },
      })

      await sendAppointmentReminder({
        customerName: apt.customer.name,
        customerEmail: apt.customer.email,
        serviceName: apt.service.name,
        staffName: apt.staff?.name ?? '',
        date: new Date(apt.date),
        startTime: apt.startTime,
        endTime: apt.endTime,
        tenantName: apt.tenant.name,
        tenantPhone: apt.tenant.phone ?? undefined,
        tenantEmail: apt.tenant.email ?? undefined,
        locale,
        reminderType: '24h',
      })

      await prisma.notification.update({
        where: { id: notif.id },
        data: { status: 'GONDERILDI', sentAt: new Date() },
      })

      sent++
    } catch (err) {
      console.error(`[send-reminders-email] Hata - appointment ${apt.id}:`, err)
      errors++
    }
  }

  console.log(`[send-reminders-email] Tamamlandı: sent=${sent} skipped=${skipped} errors=${errors}`)

  return NextResponse.json({
    success: true,
    total: toSend.length,
    sent,
    skipped,
    errors,
  })
}
