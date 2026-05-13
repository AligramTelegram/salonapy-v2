import { NextRequest, NextResponse } from 'next/server'
import {
  sendWelcomeEmail,
  sendStaffWelcomeEmail,
  sendAppointmentConfirmation,
  sendAppointmentReminder,
  sendTrialEndingEmail,
  sendPaymentSuccessEmail,
  sendPaymentFailedEmail,
  isResendConfigured,
} from '@/lib/resend'

export const dynamic = 'force-dynamic'

// GET /api/emails/test?type=welcome&to=test@example.com
// Dev-only endpoint — tests all email types. Returns mock output if RESEND_API_KEY not set.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const type = searchParams.get('type') ?? 'all'
  const to = searchParams.get('to') ?? 'test@example.com'

  const results: Record<string, string> = {}

  try {
    if (type === 'welcome' || type === 'all') {
      await sendWelcomeEmail({
        to,
        ownerName: 'Ahmet Yılmaz',
        tenantName: 'Test Salonu',
        slug: 'test-salonu',
      })
      results.welcome = 'ok'
    }

    if (type === 'staff-welcome' || type === 'all') {
      await sendStaffWelcomeEmail({
        to,
        staffName: 'Ayşe Kaya',
        tenantName: 'Test Salonu',
        slug: 'test-salonu',
        email: to,
        password: 'Gecici123!',
      })
      results['staff-welcome'] = 'ok'
    }

    if (type === 'appointment-confirmation' || type === 'all') {
      await sendAppointmentConfirmation({
        customerName: 'Mehmet Demir',
        customerEmail: to,
        serviceName: 'Saç Kesimi',
        staffName: 'Ayşe Kaya',
        date: new Date(),
        startTime: '14:30',
        endTime: '15:00',
        tenantName: 'Test Salonu',
        tenantPhone: '0555 123 45 67',
        tenantEmail: 'salon@example.com',
        locale: 'tr',
      })
      results['appointment-confirmation-tr'] = 'ok'
    }

    if (type === 'appointment-confirmation-en' || type === 'all') {
      await sendAppointmentConfirmation({
        customerName: 'John Smith',
        customerEmail: to,
        serviceName: 'Haircut',
        staffName: 'Sarah Johnson',
        date: new Date(),
        startTime: '14:30',
        endTime: '15:00',
        tenantName: 'Test Salon',
        tenantPhone: '+44 20 1234 5678',
        tenantEmail: 'salon@example.com',
        locale: 'en',
      })
      results['appointment-confirmation-en'] = 'ok'
    }

    if (type === 'appointment-confirmation-de' || type === 'all') {
      await sendAppointmentConfirmation({
        customerName: 'Hans Müller',
        customerEmail: to,
        serviceName: 'Haarschnitt',
        staffName: 'Anna Schmidt',
        date: new Date(),
        startTime: '14:30',
        endTime: '15:00',
        tenantName: 'Test Salon Berlin',
        tenantPhone: '+49 30 12345678',
        tenantEmail: 'salon@example.com',
        locale: 'de',
      })
      results['appointment-confirmation-de'] = 'ok'
    }

    if (type === 'appointment-confirmation-ar' || type === 'all') {
      await sendAppointmentConfirmation({
        customerName: 'محمد أحمد',
        customerEmail: to,
        serviceName: 'قص الشعر',
        staffName: 'فاطمة علي',
        date: new Date(),
        startTime: '14:30',
        endTime: '15:00',
        tenantName: 'صالون تجريبي',
        tenantPhone: '+966 50 123 4567',
        tenantEmail: 'salon@example.com',
        locale: 'ar',
      })
      results['appointment-confirmation-ar'] = 'ok'
    }

    if (type === 'reminder-24h-tr' || type === 'reminders') {
      await sendAppointmentReminder({
        customerName: 'Mehmet Demir',
        customerEmail: to,
        serviceName: 'Saç Kesimi',
        staffName: 'Ayşe Kaya',
        date: new Date(),
        startTime: '14:30',
        endTime: '15:00',
        tenantName: 'Test Salonu',
        tenantPhone: '0555 123 45 67',
        tenantEmail: 'salon@example.com',
        locale: 'tr',
        reminderType: '24h',
      })
      results['reminder-24h-tr'] = 'ok'
    }

    if (type === 'reminder-24h-en' || type === 'reminders') {
      await sendAppointmentReminder({
        customerName: 'John Smith',
        customerEmail: to,
        serviceName: 'Haircut',
        staffName: 'Sarah Johnson',
        date: new Date(),
        startTime: '14:30',
        endTime: '15:00',
        tenantName: 'Test Salon',
        tenantPhone: '+44 20 1234 5678',
        tenantEmail: 'salon@example.com',
        locale: 'en',
        reminderType: '24h',
      })
      results['reminder-24h-en'] = 'ok'
    }

    if (type === 'reminder-24h-de' || type === 'reminders') {
      await sendAppointmentReminder({
        customerName: 'Hans Müller',
        customerEmail: to,
        serviceName: 'Haarschnitt',
        staffName: 'Anna Schmidt',
        date: new Date(),
        startTime: '14:30',
        endTime: '15:00',
        tenantName: 'Test Salon Berlin',
        tenantPhone: '+49 30 12345678',
        tenantEmail: 'salon@example.com',
        locale: 'de',
        reminderType: '24h',
      })
      results['reminder-24h-de'] = 'ok'
    }

    if (type === 'reminder-24h-ar' || type === 'reminders') {
      await sendAppointmentReminder({
        customerName: 'محمد أحمد',
        customerEmail: to,
        serviceName: 'قص الشعر',
        staffName: 'فاطمة علي',
        date: new Date(),
        startTime: '14:30',
        endTime: '15:00',
        tenantName: 'صالون تجريبي',
        tenantPhone: '+966 50 123 4567',
        tenantEmail: 'salon@example.com',
        locale: 'ar',
        reminderType: '24h',
      })
      results['reminder-24h-ar'] = 'ok'
    }

    if (type === 'reminder-1h-tr' || type === 'reminders') {
      await sendAppointmentReminder({
        customerName: 'Mehmet Demir',
        customerEmail: to,
        serviceName: 'Saç Kesimi',
        staffName: 'Ayşe Kaya',
        date: new Date(),
        startTime: '14:30',
        endTime: '15:00',
        tenantName: 'Test Salonu',
        tenantPhone: '0555 123 45 67',
        tenantEmail: 'salon@example.com',
        locale: 'tr',
        reminderType: '1h',
      })
      results['reminder-1h-tr'] = 'ok'
    }

    if (type === 'reminder-1h-en' || type === 'reminders') {
      await sendAppointmentReminder({
        customerName: 'John Smith',
        customerEmail: to,
        serviceName: 'Haircut',
        staffName: 'Sarah Johnson',
        date: new Date(),
        startTime: '14:30',
        endTime: '15:00',
        tenantName: 'Test Salon',
        tenantPhone: '+44 20 1234 5678',
        tenantEmail: 'salon@example.com',
        locale: 'en',
        reminderType: '1h',
      })
      results['reminder-1h-en'] = 'ok'
    }

    if (type === 'reminder-1h-de' || type === 'reminders') {
      await sendAppointmentReminder({
        customerName: 'Hans Müller',
        customerEmail: to,
        serviceName: 'Haarschnitt',
        staffName: 'Anna Schmidt',
        date: new Date(),
        startTime: '14:30',
        endTime: '15:00',
        tenantName: 'Test Salon Berlin',
        tenantPhone: '+49 30 12345678',
        tenantEmail: 'salon@example.com',
        locale: 'de',
        reminderType: '1h',
      })
      results['reminder-1h-de'] = 'ok'
    }

    if (type === 'reminder-1h-ar' || type === 'reminders') {
      await sendAppointmentReminder({
        customerName: 'محمد أحمد',
        customerEmail: to,
        serviceName: 'قص الشعر',
        staffName: 'فاطمة علي',
        date: new Date(),
        startTime: '14:30',
        endTime: '15:00',
        tenantName: 'صالون تجريبي',
        tenantPhone: '+966 50 123 4567',
        tenantEmail: 'salon@example.com',
        locale: 'ar',
        reminderType: '1h',
      })
      results['reminder-1h-ar'] = 'ok'
    }

    if (type === 'trial-ending' || type === 'all') {
      await sendTrialEndingEmail({
        to,
        ownerName: 'Ahmet Yılmaz',
        tenantName: 'Test Salonu',
        daysLeft: 3,
        slug: 'test-salonu',
      })
      results['trial-ending'] = 'ok'
    }

    if (type === 'payment-success' || type === 'all') {
      await sendPaymentSuccessEmail({
        to,
        ownerName: 'Ahmet Yılmaz',
        tenantName: 'Test Salonu',
        plan: 'PROFESYONEL',
        amount: 950,
        currency: 'TRY',
        slug: 'test-salonu',
      })
      results['payment-success'] = 'ok'
    }

    if (type === 'payment-failed' || type === 'all') {
      await sendPaymentFailedEmail({
        to,
        ownerName: 'Ahmet Yılmaz',
        tenantName: 'Test Salonu',
        reason: 'Yetersiz bakiye',
        slug: 'test-salonu',
      })
      results['payment-failed'] = 'ok'
    }

    return NextResponse.json({
      mockMode: !isResendConfigured,
      results,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Test email gönderilemedi'
    console.error('[/api/emails/test]', err)
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
