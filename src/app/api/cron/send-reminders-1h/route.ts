import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendSms } from '@/lib/netgsm'
import { checkSmsLimit, incrementSms } from '@/lib/sms-limit'
import { isTurkishPhone } from '@/lib/country-detect'
import { sendAppointmentReminder } from '@/lib/resend'
import { format } from 'date-fns'
import { tr, enUS } from 'date-fns/locale'
import type { EmailLocale } from '@/lib/emails/templates'

export const dynamic = 'force-dynamic'

/**
 * GET /api/cron/send-reminders-1h
 *
 * Saatte bir çalışır (cron-job.org). Tam 1 saat sonra randevusu olan müşterilere
 * SMS (TR) + Email gönderir. Tenant'ın sms1hReminder ayarı kapalıysa atlanır.
 *
 * Header: Authorization: Bearer <CRON_SECRET>
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const now = new Date()
  const windowStart = new Date(now.getTime() + 30 * 60 * 1000)
  const windowEnd   = new Date(now.getTime() + 90 * 60 * 1000)

  const today = new Date(now); today.setHours(0, 0, 0, 0)
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999)

  const appointments = await prisma.appointment.findMany({
    where: {
      date: { gte: today, lte: todayEnd },
      status: { in: ['BEKLIYOR', 'ONAYLANDI'] },
      tenant: { sms1hReminder: true, isActive: true },
    },
    include: {
      customer: { select: { name: true, phone: true, email: true } },
      service:  { select: { name: true } },
      staff:    { select: { name: true } },
      tenant:   { select: { id: true, name: true, phone: true, email: true, plan: true, smsUsed: true, smsCredits: true } },
    },
  })

  const toSend = appointments.filter((apt) => {
    const [h, m] = apt.startTime.split(':').map(Number)
    const aptTime = new Date(apt.date)
    aptTime.setHours(h, m, 0, 0)
    return aptTime >= windowStart && aptTime <= windowEnd
  })

  let smsSent = 0, emailSent = 0, skipped = 0, errors = 0

  for (const apt of toSend) {
    const locale: EmailLocale = isTurkishPhone(apt.tenant.phone) ? 'tr' : 'en'
    const dateFnsLocale = locale === 'tr' ? tr : enUS
    const dateStr = format(new Date(apt.date), 'd MMMM yyyy', { locale: dateFnsLocale })

    // ── SMS (Türk numaralı müşteri) ──────────────────────────────────────────
    if (apt.customer.phone && isTurkishPhone(apt.customer.phone)) {
      const smsDup = await prisma.notification.findFirst({
        where: {
          appointmentId: apt.id, channel: 'SMS',
          OR: [
            { message: { startsWith: 'REMINDER_1H_SMS:' } },
            { message: { startsWith: 'WORKER_1H_SMS:' } },
          ],
          status: 'GONDERILDI',
        },
      })

      if (!smsDup) {
        const failCount = await prisma.notification.count({
          where: {
            appointmentId: apt.id, channel: 'SMS',
            message: { startsWith: 'REMINDER_1H_SMS:' },
            status: 'BASARISIZ',
          },
        })

        if (failCount < 3) {
          const hasCredit = await checkSmsLimit(apt.tenantId)
          if (hasCredit) {
            const msg =
              `Hatirlatma: Bugun saat ${apt.startTime} ${apt.service.name} randevunuz var. ` +
              `${apt.tenant.name} - ${dateStr}`

            const notif = await prisma.notification.create({
              data: {
                tenantId: apt.tenantId, appointmentId: apt.id,
                channel: 'SMS', to: apt.customer.phone,
                message: `REMINDER_1H_SMS: ${apt.startTime}`,
                status: 'BASARISIZ',
              },
            })
            try {
              const result = await sendSms({ phone: apt.customer.phone, message: msg })
              if (result.success) {
                await incrementSms(apt.tenantId)
                await prisma.notification.update({ where: { id: notif.id }, data: { status: 'GONDERILDI', sentAt: new Date() } })
                smsSent++
              } else {
                await prisma.notification.update({ where: { id: notif.id }, data: { errorMessage: result.error } })
                errors++
              }
            } catch (err) {
              await prisma.notification.update({ where: { id: notif.id }, data: { errorMessage: String(err) } })
              errors++
            }
          } else { skipped++ }
        } else { skipped++ }
      } else { skipped++ }
    }

    // ── Email ────────────────────────────────────────────────────────────────
    if (apt.customer.email) {
      const emailDup = await prisma.notification.findFirst({
        where: {
          appointmentId: apt.id, channel: 'EMAIL',
          message: { startsWith: 'REMINDER_1H:' },
          status: 'GONDERILDI',
        },
      })

      if (!emailDup) {
        const failCount = await prisma.notification.count({
          where: {
            appointmentId: apt.id, channel: 'EMAIL',
            message: { startsWith: 'REMINDER_1H:' },
            status: 'BASARISIZ',
          },
        })

        if (failCount < 3) {
          const notif = await prisma.notification.create({
            data: {
              tenantId: apt.tenantId, appointmentId: apt.id,
              channel: 'EMAIL', to: apt.customer.email,
              message: `REMINDER_1H: ${apt.startTime}`,
              status: 'BASARISIZ',
            },
          })
          try {
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
              reminderType: '1h',
            })
            await prisma.notification.update({ where: { id: notif.id }, data: { status: 'GONDERILDI', sentAt: new Date() } })
            emailSent++
          } catch (err) {
            await prisma.notification.update({ where: { id: notif.id }, data: { errorMessage: String(err) } })
            errors++
          }
        } else { skipped++ }
      } else { skipped++ }
    }
  }

  console.log(`[send-reminders 1h] sms=${smsSent} email=${emailSent} skipped=${skipped} errors=${errors}`)
  return NextResponse.json({ success: true, total: toSend.length, smsSent, emailSent, skipped, errors })
}
