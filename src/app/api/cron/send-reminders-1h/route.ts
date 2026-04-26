import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendSms } from '@/lib/netgsm'
import { checkSmsLimit, incrementSms } from '@/lib/sms-limit'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

/**
 * GET /api/cron/send-reminders-1h
 * Bir saat sonra randevusu olan müşterilere SMS hatırlatması gönderir.
 * Her saat başı çalışır (vercel.json).
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const now = new Date()

  // 1 saat sonraki pencere: şu andan +30dk ile +90dk arası
  // cron-job.org saatte bir çalışır, tüm yarım saatleri yakalamak için geniş pencere
  const windowStart = new Date(now.getTime() + 30 * 60 * 1000)
  const windowEnd = new Date(now.getTime() + 90 * 60 * 1000)

  // Bugünün tarihini al (saat kısmı olmadan)
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const todayEnd = new Date(now)
  todayEnd.setHours(23, 59, 59, 999)

  // Bugün randevusu olan, sms1hReminder açık tenant'lara ait randevular
  const appointments = await prisma.appointment.findMany({
    where: {
      date: { gte: today, lte: todayEnd },
      status: { in: ['BEKLIYOR', 'ONAYLANDI'] },
      tenant: { sms1hReminder: true, isActive: true },
    },
    include: {
      customer: { select: { name: true, phone: true } },
      service: { select: { name: true } },
      staff: { select: { name: true } },
      tenant: { select: { id: true, name: true, plan: true } },
    },
  })

  // startTime ile pencereyi karşılaştır
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

    const alreadySent = await prisma.notification.findFirst({
      where: {
        appointmentId: apt.id,
        channel: 'SMS',
        status: 'GONDERILDI',
      },
    })
    if (alreadySent) { skipped++; continue }

    const hasCredit = await checkSmsLimit(apt.tenantId)
    if (!hasCredit) {
      await prisma.notification.create({
        data: {
          tenantId: apt.tenantId,
          appointmentId: apt.id,
          channel: 'SMS',
          to: apt.customer.phone,
          message: '1 saat öncesi SMS hatırlatma — limit aşıldı',
          status: 'BASARISIZ',
          errorMessage: 'SMS limiti ve kredisi tükendi',
        },
      })
      skipped++
      continue
    }

    const dateStr = format(new Date(apt.date), 'd MMMM yyyy', { locale: tr })
    const msg =
      `Hatirlatma: Bugun saat ${apt.startTime} ${apt.service.name} randevunuz var. ` +
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
          message: '1 saat öncesi SMS hatırlatma',
          status: result.success ? 'GONDERILDI' : 'BASARISIZ',
          sentAt: result.success ? new Date() : undefined,
          errorMessage: result.error,
        },
      })
    } catch (err) {
      console.error(`[send-reminders-1h] Hata - appointment ${apt.id}:`, err)
      errors++
    }
  }

  console.log(`[send-reminders-1h] Tamamlandı: sent=${sent} skipped=${skipped} errors=${errors}`)
  return NextResponse.json({ success: true, total: toSend.length, sent, skipped, errors })
}
