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
      tenant: { select: { id: true, name: true, plan: true, smsUsed: true, smsCredits: true } },
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
    total: toSend.length,
    sent,
    skipped,
    errors,
  })
}
