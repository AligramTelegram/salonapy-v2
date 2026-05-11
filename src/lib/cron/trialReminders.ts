import { prisma } from '@/lib/prisma'
import { sendSms } from '@/lib/netgsm'
import { isTurkishPhone, detectLanguageFromPhone } from '@/lib/country-detect'
import { getTrialEndingEmailContent } from '@/lib/email-i18n'
import { addDays, differenceInDays } from 'date-fns'
import { Resend } from 'resend'

const REMINDER_DAYS = 3 // Send warning when <= 3 days left

/**
 * Find tenants with trial subscriptions ending within REMINDER_DAYS and send emails.
 * Called by /api/cron/trial-reminders route (triggered by Vercel Cron).
 */
export async function runTrialReminders(): Promise<{ sent: number; skipped: number; errors: number }> {
  const now = new Date()
  const warningThreshold = addDays(now, REMINDER_DAYS)

  // Find trial subscriptions expiring within the next 3 days (and not already expired)
  const expiringTrials = await prisma.subscription.findMany({
    where: {
      status: 'TRIAL',
      endDate: {
        gt: now,           // not yet expired
        lte: warningThreshold,
      },
    },
    select: {
      tenantId: true,
      endDate: true,
      tenant: {
        select: {
          slug: true,
          name: true,
          email: true,
          phone: true,
          users: {
            where: { role: 'OWNER' },
            select: { name: true, email: true },
            take: 1,
          },
        },
      },
    },
  })

  let sent = 0
  let skipped = 0
  let errors = 0

  for (const sub of expiringTrials) {
    const owner = sub.tenant.users[0]
    const tenantEmail = sub.tenant.email ?? owner?.email

    if (!tenantEmail || !owner) {
      skipped++
      continue
    }

    const daysLeft = differenceInDays(sub.endDate, now)

    try {
      const lang = detectLanguageFromPhone(sub.tenant.phone)
      const { subject, html } = getTrialEndingEmailContent(lang, {
        ownerName: owner.name,
        tenantName: sub.tenant.name,
        slug: sub.tenant.slug,
        daysLeft: Math.max(daysLeft, 1),
      })

      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({ from: 'Hemensalon <noreply@hemensalon.com>', to: tenantEmail, subject, html })
      }

      // Türkiye numarası varsa SMS de gönder
      if (isTurkishPhone(sub.tenant.phone)) {
        const daysLeftDisplay = Math.max(daysLeft, 1)
        sendSms({
          phone: sub.tenant.phone!,
          message: `Hemensalon: ${sub.tenant.name} isletmenizin deneme suresi ${daysLeftDisplay} gun sonra bitiyor. Devam etmek icin: hemensalon.com/b/${sub.tenant.slug}`,
        }).catch((err) => console.error(`[trialReminders] SMS failed for ${sub.tenantId}:`, err))
      }

      // Mark notification sent so we don't re-send on next cron run
      await prisma.notification.create({
        data: {
          tenantId: sub.tenantId,
          channel: 'EMAIL',
          to: tenantEmail,
          message: `Trial ending reminder — ${daysLeft} days left`,
          status: 'GONDERILDI',
          sentAt: now,
        },
      })

      sent++
    } catch (err) {
      console.error(`[trialReminders] Failed for tenant ${sub.tenantId}:`, err)

      await prisma.notification.create({
        data: {
          tenantId: sub.tenantId,
          channel: 'EMAIL',
          to: tenantEmail,
          message: `Trial ending reminder — ${daysLeft} days left`,
          status: 'BASARISIZ',
          errorMessage: err instanceof Error ? err.message : 'Unknown error',
        },
      }).catch(() => null)

      errors++
    }
  }

  console.log(`[trialReminders] sent=${sent} skipped=${skipped} errors=${errors}`)
  return { sent, skipped, errors }
}
