/**
 * Appointment Reminder Worker — NetGSM SMS
 *
 * Bu worker BullMQ kuyruğunu dinler ve SMS hatırlatmaları gönderir.
 * Ayrı bir Node.js process olarak çalıştırılır:
 *
 *   npx tsx src/workers/reminderWorker.ts
 *
 * Veya package.json:
 *   "worker": "tsx src/workers/reminderWorker.ts"
 */

import 'dotenv/config'
import { Worker, Job } from 'bullmq'
import { prisma } from '@/lib/prisma'
import { sendSms } from '@/lib/netgsm'
import { ReminderJobData } from '@/lib/queue'
import { getSmsLimits } from '@/lib/plans'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

function getRedisConnection(): { host: string; port: number; password?: string; tls?: object } {
  const url = process.env.REDIS_URL
  if (!url) throw new Error('REDIS_URL ortam değişkeni ayarlanmamış')

  const parsed = new URL(url)
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port) || 6379,
    password: parsed.password || undefined,
    ...(url.startsWith('rediss://') ? { tls: {} } : {}),
  }
}

async function processReminder(job: Job<ReminderJobData>): Promise<void> {
  const { appointmentId, tenantId, type } = job.data
  console.log(`[Worker] İşleniyor: ${type} | appointment: ${appointmentId}`)

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      customer: { select: { name: true, phone: true } },
      service: { select: { name: true } },
      staff: { select: { name: true } },
      tenant: {
        select: {
          name: true,
          plan: true,
          smsUsed: true,
          smsCredits: true,
          sms24hReminder: true,
          sms1hReminder: true,
        },
      },
    },
  })

  if (!appointment) {
    console.log(`[Worker] Randevu bulunamadı: ${appointmentId}, atlanıyor`)
    return
  }

  if (appointment.status === 'IPTAL' || appointment.status === 'TAMAMLANDI') {
    console.log(`[Worker] Randevu ${appointment.status}, SMS gönderilmeyecek`)
    return
  }

  const tenant = appointment.tenant

  if (type === 'reminder-24h' && !tenant.sms24hReminder) {
    console.log(`[Worker] 24s SMS hatırlatma kapalı, tenant: ${tenantId}`)
    return
  }
  if (type === 'reminder-1h' && !tenant.sms1hReminder) {
    console.log(`[Worker] 1s SMS hatırlatma kapalı, tenant: ${tenantId}`)
    return
  }

  const smsLimits = await getSmsLimits()
  const limit = smsLimits[tenant.plan] ?? 200
  const hasMonthlyQuota = tenant.smsUsed < limit
  const hasCredits = (tenant.smsCredits ?? 0) > 0

  if (!hasMonthlyQuota && !hasCredits) {
    console.log(`[Worker] SMS limiti ve kredi tükendi: ${tenant.smsUsed}/${limit}, credits: ${tenant.smsCredits}`)
    await prisma.notification.create({
      data: {
        tenantId,
        appointmentId,
        channel: 'SMS',
        to: appointment.customer.phone,
        message: `${type} hatırlatma: limit aşıldı`,
        status: 'BASARISIZ',
        errorMessage: `SMS limiti aşıldı (${tenant.smsUsed}/${limit}), ek kredi yok`,
      },
    })
    return
  }

  const dateStr = format(new Date(appointment.date), 'd MMMM yyyy', { locale: tr })

  // SMS mesajını oluştur (maks 160 karakter, Türkçe karakter içerdiğinden unicode)
  const message =
    `Merhaba ${appointment.customer.name}, ${tenant.name} randevunuz yaklasıyor. ` +
    `Tarih: ${dateStr} Saat: ${appointment.startTime} ` +
    `Hizmet: ${appointment.service.name} Personel: ${appointment.staff.name}`

  const result = await sendSms({
    phone: appointment.customer.phone,
    message,
  })

  if (result.success) {
    if (hasMonthlyQuota) {
      // Önce aylık limitten düş
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { smsUsed: { increment: 1 } },
      })
    } else {
      // Aylık limit doldu, ek krediden düş
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { smsCredits: { decrement: 1 } },
      })
    }
  }

  await prisma.notification.create({
    data: {
      tenantId,
      appointmentId,
      channel: 'SMS',
      to: appointment.customer.phone,
      message: type === 'reminder-1h' ? '1 saat öncesi SMS hatırlatma' : '24 saat öncesi SMS hatırlatma',
      status: result.success ? 'GONDERILDI' : 'BASARISIZ',
      sentAt: result.success ? new Date() : undefined,
      errorMessage: result.error,
    },
  })

  console.log(
    `[Worker] ${type} ${result.success ? '✓ SMS gönderildi' : '✗ başarısız'} | ${appointment.customer.phone}`
  )
}

const connection = getRedisConnection()
const worker = new Worker<ReminderJobData>('appointmentReminders', processReminder, {
  connection,
  concurrency: 5,
})

worker.on('completed', (job) => {
  console.log(`[Worker] ✓ Job tamamlandı: ${job.id}`)
})

worker.on('failed', (job, err) => {
  console.error(`[Worker] ✗ Job başarısız: ${job?.id} | ${err.message}`)
})

worker.on('error', (err) => {
  console.error('[Worker] Worker hatası:', err)
})

console.log('[Worker] SMS hatırlatma worker başlatıldı, kuyruk dinleniyor...')

process.on('SIGTERM', async () => {
  console.log('[Worker] Kapatılıyor...')
  await worker.close()
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('[Worker] Kapatılıyor...')
  await worker.close()
  await prisma.$disconnect()
  process.exit(0)
})
