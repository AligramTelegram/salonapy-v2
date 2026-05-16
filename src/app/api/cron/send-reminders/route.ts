import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendSms } from '@/lib/netgsm'
import { checkSmsLimit, incrementSms } from '@/lib/sms-limit'
import { isTurkishPhone } from '@/lib/country-detect'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

/**
 * GET /api/cron/send-reminders
 *
 * Saatte bir çalışır. Tam 24 saat sonra randevusu olan müşterilere SMS gönderir.
 * Pencere: şu andan +23.5s ile +24.5s arası (±30dk tolerans).
 *
 * vercel.json: { "path": "/api/cron/send-reminders", "schedule": "0 * * * *" }
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const now = new Date()

  // 24 saat sonrasına ±30 dakika pencere
  const windowStart = new Date(now.getTime() + 23.5 * 60 * 60 * 1000)
  const windowEnd   = new Date(now.getTime() + 24.5 * 60 * 60 * 1000)

  // Pencerenin kapsadığı tarihleri belirle (gün kesişimi için)
  const dateStart = new Date(windowStart)
  dateStart.setHours(0, 0, 0, 0)
  const dateEnd = new Date(windowEnd)
  dateEnd.setHours(23, 59, 59, 999)

  const appointments = await prisma.appointment.findMany({
    where: {
      date: { gte: dateStart, lte: dateEnd },
      status: { in: ['BEKLIYOR', 'ONAYLANDI'] },
      tenant: { sms24hReminder: true, isActive: true },
    },
    include: {
      customer: { select: { name: true, phone: true } },
      service: { select: { name: true } },
      staff: { select: { name: true } },
      tenant: { select: { id: true, name: true, phone: true, plan: true, smsUsed: true, smsCredits: true } },
    },
  })

  // startTime ile pencereyi karşılaştır — tam 24 saat öncesini yakala
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
    if (!apt.customer.phone) { skipped++; continue }
    if (!isTurkishPhone(apt.tenant.phone)) { skipped++; continue }

    // 24h SMS dedup — hem cron hem worker prefix'ini kontrol et
    const existing = await prisma.notification.findMany({
      where: {
        appointmentId: apt.id,
        channel: 'SMS',
        OR: [
          { message: { startsWith: 'REMINDER_24H_SMS:' } },
          { message: { startsWith: 'WORKER_24H_SMS:' } },
        ],
      },
      select: { status: true },
    })
    if (existing.some(n => n.status === 'GONDERILDI')) { skipped++; continue }
    if (existing.filter(n => n.status === 'BASARISIZ').length >= 3) { skipped++; continue }

    const hasCredit = await checkSmsLimit(apt.tenantId)
    if (!hasCredit) {
      await prisma.notification.create({
        data: {
          tenantId: apt.tenantId,
          appointmentId: apt.id,
          channel: 'SMS',
          to: apt.customer.phone,
          message: 'REMINDER_24H_SMS: limit aşıldı',
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

    // İdempotency lock — önce BASARISIZ kayıt oluştur
    const notif = await prisma.notification.create({
      data: {
        tenantId: apt.tenantId,
        appointmentId: apt.id,
        channel: 'SMS',
        to: apt.customer.phone,
        message: `REMINDER_24H_SMS: ${apt.startTime}`,
        status: 'BASARISIZ',
      },
    })

    try {
      const result = await sendSms({ phone: apt.customer.phone, message: msg })

      if (result.success) {
        await incrementSms(apt.tenantId)
        await prisma.notification.update({
          where: { id: notif.id },
          data: { status: 'GONDERILDI', sentAt: new Date() },
        })
        sent++
      } else {
        await prisma.notification.update({
          where: { id: notif.id },
          data: { errorMessage: result.error },
        })
        errors++
      }
    } catch (err) {
      console.error(`[send-reminders] Hata - appointment ${apt.id}:`, err)
      await prisma.notification.update({
        where: { id: notif.id },
        data: { errorMessage: String(err) },
      })
      errors++
    }
  }

  console.log(`[send-reminders] Tamamlandı: sent=${sent} skipped=${skipped} errors=${errors}`)

  return NextResponse.json({
    success: true,
    total: toSend.length,
    sent,
    skipped,
    errors,
  })
}
