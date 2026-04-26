import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendSms } from '@/lib/netgsm'
import { checkSmsLimit, incrementSms } from '@/lib/sms-limit'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

/**
 * GET /api/cron/send-reminders
 *
 * Yarın randevusu olan müşterilere 24s öncesi SMS hatırlatması gönderir.
 * Her gün saat 18:00'de çalışır (vercel.json).
 * Güvenlik: Authorization: Bearer CRON_SECRET header'ı zorunludur.
 *
 * Vercel Cron örneği (vercel.json):
 *   { "path": "/api/cron/send-reminders", "schedule": "0 18 * * *" }
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const now = new Date()

  // Yarının 00:00 - 23:59 aralığı
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const tomorrowEnd = new Date(tomorrow)
  tomorrowEnd.setHours(23, 59, 59, 999)

  // Yarın randevusu olan, iptal/tamamlanmamış, sms24hReminder açık tenant'lara ait randevular
  const appointments = await prisma.appointment.findMany({
    where: {
      date: { gte: tomorrow, lte: tomorrowEnd },
      status: { in: ['BEKLIYOR', 'ONAYLANDI'] },
      tenant: { sms24hReminder: true, isActive: true },
    },
    include: {
      customer: { select: { name: true, phone: true } },
      service: { select: { name: true } },
      staff: { select: { name: true } },
      tenant: { select: { id: true, name: true, plan: true, smsUsed: true, smsCredits: true } },
    },
  })

  let sent = 0
  let skipped = 0
  let errors = 0

  for (const apt of appointments) {
    if (!apt.customer.phone) {
      skipped++
      continue
    }

    // Bu randevu için 24s SMS daha önce gönderildi mi?
    const alreadySent = await prisma.notification.findFirst({
      where: {
        appointmentId: apt.id,
        channel: 'SMS',
        status: 'GONDERILDI',
      },
    })

    if (alreadySent) {
      skipped++
      continue
    }

    // SMS limiti kontrolü
    const hasCredit = await checkSmsLimit(apt.tenantId)
    if (!hasCredit) {
      await prisma.notification.create({
        data: {
          tenantId: apt.tenantId,
          appointmentId: apt.id,
          channel: 'SMS',
          to: apt.customer.phone,
          message: '24 saat öncesi SMS hatırlatma — limit aşıldı',
          status: 'BASARISIZ',
          errorMessage: 'SMS limiti ve kredisi tükendi',
        },
      })
      skipped++
      continue
    }

    const dateStr = format(new Date(apt.date), 'd MMMM yyyy', { locale: tr })
    const msg =
      `Hatirlatma: Yarin ${apt.startTime} ${apt.service.name} randevunuz var. ` +
      `${apt.tenant.name} - ${dateStr}`

    try {
      const result = await sendSms({ phone: apt.customer.phone, message: msg })

      if (result.success) {
        await incrementSms(apt.tenantId)
        sent++
      } else {
        errors++
      }

      await prisma.notification.create({
        data: {
          tenantId: apt.tenantId,
          appointmentId: apt.id,
          channel: 'SMS',
          to: apt.customer.phone,
          message: '24 saat öncesi SMS hatırlatma',
          status: result.success ? 'GONDERILDI' : 'BASARISIZ',
          sentAt: result.success ? new Date() : undefined,
          errorMessage: result.error,
        },
      })
    } catch (err) {
      console.error(`[send-reminders] Hata - appointment ${apt.id}:`, err)
      errors++
    }
  }

  console.log(`[send-reminders] Tamamlandı: sent=${sent} skipped=${skipped} errors=${errors}`)

  return NextResponse.json({
    success: true,
    total: appointments.length,
    sent,
    skipped,
    errors,
  })
}
