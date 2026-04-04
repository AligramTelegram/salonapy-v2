import { NextRequest, NextResponse } from 'next/server'
import {
  sendWelcomeEmail,
  sendStaffWelcomeEmail,
  sendAppointmentConfirmation,
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
      })
      results['appointment-confirmation'] = 'ok'
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
