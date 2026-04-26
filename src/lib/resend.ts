import { Resend } from 'resend'
import { getEmailFrom, getEmailSubject } from '@/lib/emails/templates'
import { renderWelcomeEmail } from '@/emails/WelcomeEmail'
import { renderStaffWelcomeEmail } from '@/emails/StaffWelcomeEmail'
import { renderAppointmentConfirmation } from '@/emails/AppointmentConfirmation'
import { renderTrialEndingEmail } from '@/emails/TrialEndingEmail'
import { renderPaymentSuccessEmail } from '@/emails/PaymentSuccessEmail'
import { renderPaymentFailedEmail } from '@/emails/PaymentFailedEmail'
import { addDays, format } from 'date-fns'
import { tr } from 'date-fns/locale'

// ─── Client ───────────────────────────────────────────────────────────────────

let _resend: Resend | null = null

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

export const isResendConfigured = !!process.env.RESEND_API_KEY

// ─── Core send helper ─────────────────────────────────────────────────────────

interface SendEmailParams {
  to: string
  subject: string
  html: string
  tenantId?: string
  appointmentId?: string
}

async function sendEmail(params: SendEmailParams): Promise<{ id: string; mockMode: boolean }> {
  const resend = getResend()
  const from = getEmailFrom()

  if (!resend) {
    console.log(`[EMAIL MOCK] To: ${params.to} | Subject: ${params.subject}`)
    return { id: `mock-${Date.now()}`, mockMode: true }
  }

  const { data, error } = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  })

  if (error || !data) {
    throw new Error(error?.message ?? 'Resend: unknown error')
  }

  return { id: data.id, mockMode: false }
}

// ─── Welcome email ────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(params: {
  to: string
  ownerName: string
  tenantName: string
  slug: string
  isTrial?: boolean
}): Promise<void> {
  const html = renderWelcomeEmail({
    tenantName: params.tenantName,
    ownerName: params.ownerName,
    slug: params.slug,
    isTrial: params.isTrial ?? true,
  })
  const subject = getEmailSubject('welcome', { tenantName: params.tenantName })
  await sendEmail({ to: params.to, subject, html })
}

// ─── Staff welcome email ──────────────────────────────────────────────────────

export async function sendStaffWelcomeEmail(params: {
  to: string
  staffName: string
  tenantName: string
  slug: string
  email: string
  password: string
}): Promise<void> {
  const html = renderStaffWelcomeEmail({
    staffName: params.staffName,
    tenantName: params.tenantName,
    slug: params.slug,
    email: params.email,
    password: params.password,
  })
  const subject = getEmailSubject('staff-welcome', { staffName: params.staffName })
  await sendEmail({ to: params.to, subject, html })
}

// ─── Appointment confirmation ─────────────────────────────────────────────────

export interface AppointmentEmailData {
  customerName: string
  customerEmail: string
  serviceName: string
  staffName: string
  date: Date
  startTime: string
  endTime: string
  tenantName: string
  tenantPhone?: string
  tenantEmail?: string
}

export async function sendAppointmentConfirmation(data: AppointmentEmailData): Promise<void> {
  const dateStr = format(data.date, 'd MMMM yyyy', { locale: tr })
  const html = renderAppointmentConfirmation({
    customerName: data.customerName,
    serviceName: data.serviceName,
    staffName: data.staffName,
    date: dateStr,
    startTime: data.startTime,
    endTime: data.endTime,
    tenantName: data.tenantName,
    tenantPhone: data.tenantPhone,
    tenantEmail: data.tenantEmail,
  })
  const subject = getEmailSubject('appointment-confirmation', { date: dateStr })
  await sendEmail({ to: data.customerEmail, subject, html })
}

// ─── Trial ending email ───────────────────────────────────────────────────────

export async function sendTrialEndingEmail(params: {
  to: string
  ownerName: string
  tenantName: string
  daysLeft: number
  slug: string
}): Promise<void> {
  const html = renderTrialEndingEmail({
    tenantName: params.tenantName,
    ownerName: params.ownerName,
    daysLeft: params.daysLeft,
    slug: params.slug,
  })
  const subject = getEmailSubject('trial-ending', { daysLeft: String(params.daysLeft) })
  await sendEmail({ to: params.to, subject, html })
}

// ─── Payment success email ────────────────────────────────────────────────────

const PLAN_LABELS: Record<string, string> = {
  BASLANGIC: 'Başlangıç',
  PROFESYONEL: 'Profesyonel',
  ISLETME: 'İşletme',
}

export async function sendPaymentSuccessEmail(params: {
  to: string
  ownerName: string
  tenantName: string
  plan: string
  amount: number
  currency: string
  slug: string
}): Promise<void> {
  const currencySymbol = params.currency === 'USD' ? '$' : params.currency === 'EUR' ? '€' : '₺'
  const amountStr = `${currencySymbol}${params.amount.toLocaleString('tr-TR')}`
  const planLabel = PLAN_LABELS[params.plan] ?? params.plan
  const nextPaymentDate = format(addDays(new Date(), 30), 'd MMMM yyyy', { locale: tr })

  const html = renderPaymentSuccessEmail({
    ownerName: params.ownerName,
    tenantName: params.tenantName,
    plan: planLabel,
    amount: amountStr,
    nextPaymentDate,
    slug: params.slug,
  })
  const subject = getEmailSubject('payment-success', { plan: planLabel })
  await sendEmail({ to: params.to, subject, html })
}

// ─── Admin: yeni işletme bildirimi ───────────────────────────────────────────

export async function sendAdminNewTenantEmail(params: {
  adminEmail: string
  name: string
  email: string
  businessName: string
  slug: string
  plan: string
}): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hemensalon.com'
  const planLabel = { BASLANGIC: 'Başlangıç (Deneme)', PROFESYONEL: 'Profesyonel', ISLETME: 'İşletme' }[params.plan] ?? params.plan
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <h2 style="color:#7c3aed;margin-bottom:4px">🎉 Yeni İşletme Kaydı</h2>
      <p style="color:#6b7280;font-size:13px;margin-top:0">hemensalon.com</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
        <tr><td style="padding:8px 0;color:#9ca3af;width:140px">İşletme Adı</td><td style="padding:8px 0;font-weight:600;color:#111827">${params.businessName}</td></tr>
        <tr><td style="padding:8px 0;color:#9ca3af">Yetkili Adı</td><td style="padding:8px 0;color:#111827">${params.name}</td></tr>
        <tr><td style="padding:8px 0;color:#9ca3af">Email</td><td style="padding:8px 0;color:#111827">${params.email}</td></tr>
        <tr><td style="padding:8px 0;color:#9ca3af">Plan</td><td style="padding:8px 0;color:#7c3aed;font-weight:600">${planLabel}</td></tr>
        <tr><td style="padding:8px 0;color:#9ca3af">Panel</td><td style="padding:8px 0"><a href="${appUrl}/b/${params.slug}" style="color:#7c3aed">/b/${params.slug}</a></td></tr>
      </table>
      <div style="margin-top:20px">
        <a href="${appUrl}/admin/isletmeler" style="display:inline-block;background:#7c3aed;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">Admin Panelinde Görüntüle</a>
      </div>
    </div>
  `
  await sendEmail({ to: params.adminEmail, subject: `Yeni kayıt: ${params.businessName}`, html })
}

// ─── Payment failed email ─────────────────────────────────────────────────────

export async function sendPaymentFailedEmail(params: {
  to: string
  ownerName: string
  tenantName: string
  reason?: string
  slug: string
}): Promise<void> {
  const html = renderPaymentFailedEmail({
    ownerName: params.ownerName,
    tenantName: params.tenantName,
    reason: params.reason,
    slug: params.slug,
  })
  const subject = getEmailSubject('payment-failed')
  await sendEmail({ to: params.to, subject, html })
}
