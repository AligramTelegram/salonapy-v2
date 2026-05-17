import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPushNotification } from '@/lib/pushNotification'
import { isTurkishPhone } from '@/lib/country-detect'

export const dynamic = 'force-dynamic'

/**
 * GET /api/cron/completion-reminders
 *
 * Her 10 dakikada bir çalışır. Bitmesi gereken ama durum güncellenmeyen
 * randevular için işletme sahibine ve personele push bildirim gönderir.
 *
 * Pencereler (randevu bitiş saatinden sonra):
 *   - 1. hatırlatma: 10 dk (window: 5-15 dk)
 *   - 2. hatırlatma: 30 dk (window: 25-35 dk)
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const now = new Date()
  const ISTANBUL_OFFSET_MS = 3 * 60 * 60 * 1000

  // Bugünün tarih aralığı (İstanbul yerel)
  const todayLocal = new Date(now.getTime() - ISTANBUL_OFFSET_MS)
  const dateStr = todayLocal.toISOString().split('T')[0]
  const [yr, mo, da] = dateStr.split('-').map(Number)
  const dayStart = new Date(Date.UTC(yr, mo - 1, da, 0, 0, 0, 0) - ISTANBUL_OFFSET_MS)
  const dayEnd   = new Date(Date.UTC(yr, mo - 1, da, 23, 59, 59, 999) - ISTANBUL_OFFSET_MS)

  // Bugün, hâlâ aktif randevuları çek
  const appointments = await prisma.appointment.findMany({
    where: {
      date: { gte: dayStart, lte: dayEnd },
      status: { in: ['BEKLIYOR', 'ONAYLANDI'] },
      tenant: { isActive: true },
    },
    include: {
      tenant:   { select: { id: true, phone: true } },
      staff:    { select: { id: true, name: true, pushToken: true } },
      customer: { select: { name: true } },
      service:  { select: { name: true } },
    },
  })

  let sent = 0, skipped = 0

  for (const apt of appointments) {
    const [h, m] = apt.endTime.split(':').map(Number)
    const endTime = new Date(Date.UTC(yr, mo - 1, da, h, m, 0, 0) - ISTANBUL_OFFSET_MS)
    const elapsedMs = now.getTime() - endTime.getTime()
    const elapsedMin = elapsedMs / 60000

    // Hangi pencerede olduğumuzu belirle
    let window: '10m' | '30m' | null = null
    if (elapsedMin >= 5 && elapsedMin < 15)  window = '10m'
    if (elapsedMin >= 25 && elapsedMin < 35) window = '30m'
    if (!window) { skipped++; continue }

    const notifKey = `COMPLETION_REMINDER_${window}:`

    // Daha önce bu pencerede gönderildi mi?
    const alreadySent = await prisma.notification.findFirst({
      where: {
        appointmentId: apt.id,
        message: { startsWith: notifKey },
        status: 'GONDERILDI',
      },
    })
    if (alreadySent) { skipped++; continue }

    const isTR = isTurkishPhone(apt.tenant.phone ?? '')
    const customerName = apt.customer.name
    const serviceName  = apt.service.name

    const title = isTR
      ? window === '10m' ? '⏰ Randevu tamamlandı mı?' : '⚠️ Randevu hâlâ güncellenmedi'
      : window === '10m' ? '⏰ Appointment completed?' : '⚠️ Appointment still not updated'

    const body = isTR
      ? `${customerName} • ${serviceName} • ${apt.endTime} bitti`
      : `${customerName} • ${serviceName} • ended at ${apt.endTime}`

    const pushData = { appointmentId: apt.id, type: 'completion_reminder', window }

    // Tenant kullanıcılarına push
    const tenantUsers = await prisma.user.findMany({
      where: { tenantId: apt.tenantId, pushToken: { not: null } },
      select: { pushToken: true },
    })

    const messages = tenantUsers
      .filter(u => u.pushToken?.startsWith('ExponentPushToken'))
      .map(u => ({ to: u.pushToken!, title, body, data: pushData }))

    // Personele push (staff.pushToken varsa)
    if (apt.staff?.pushToken?.startsWith('ExponentPushToken')) {
      messages.push({ to: apt.staff.pushToken, title, body, data: pushData })
    }

    if (messages.length === 0) { skipped++; continue }

    await sendPushNotification(messages)

    // Gönderildi olarak kaydet
    await prisma.notification.create({
      data: {
        tenantId: apt.tenantId,
        appointmentId: apt.id,
        channel: 'SMS', // push kanalı yok, SMS olarak işaretle
        to: apt.tenantId,
        message: `${notifKey}${apt.endTime}`,
        status: 'GONDERILDI',
        sentAt: new Date(),
      },
    })

    sent++
  }

  console.log(`[completion-reminders] sent=${sent} skipped=${skipped}`)
  return NextResponse.json({ ok: true, sent, skipped })
}
