import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import {
  sendWelcomeEmail,
  sendStaffWelcomeEmail,
  sendAppointmentConfirmation,
  sendTrialEndingEmail,
  sendPaymentSuccessEmail,
  sendPaymentFailedEmail,
} from '@/lib/resend'

export const dynamic = 'force-dynamic'

const SendEmailSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('welcome'),
    to: z.string().email(),
    ownerName: z.string(),
    tenantName: z.string(),
    slug: z.string(),
  }),
  z.object({
    type: z.literal('staff-welcome'),
    to: z.string().email(),
    staffName: z.string(),
    tenantName: z.string(),
    slug: z.string(),
    email: z.string(),
    password: z.string(),
  }),
  z.object({
    type: z.literal('appointment-confirmation'),
    customerName: z.string(),
    customerEmail: z.string().email(),
    serviceName: z.string(),
    staffName: z.string(),
    date: z.string(), // ISO date string
    startTime: z.string(),
    endTime: z.string(),
    tenantName: z.string(),
    tenantPhone: z.string().optional(),
    tenantEmail: z.string().optional(),
  }),
  z.object({
    type: z.literal('trial-ending'),
    to: z.string().email(),
    ownerName: z.string(),
    tenantName: z.string(),
    daysLeft: z.number().int().min(1),
    slug: z.string(),
  }),
  z.object({
    type: z.literal('payment-success'),
    to: z.string().email(),
    ownerName: z.string(),
    tenantName: z.string(),
    plan: z.string(),
    amount: z.number(),
    currency: z.string(),
    slug: z.string(),
  }),
  z.object({
    type: z.literal('payment-failed'),
    to: z.string().email(),
    ownerName: z.string(),
    tenantName: z.string(),
    reason: z.string().optional(),
    slug: z.string(),
  }),
])

// POST /api/emails/send
// Internal endpoint — requires owner auth
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  // Verify user is an owner
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  })
  if (!dbUser || dbUser.role !== 'OWNER') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const parsed = SendEmailSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  try {
    const payload = parsed.data

    switch (payload.type) {
      case 'welcome':
        await sendWelcomeEmail(payload)
        break
      case 'staff-welcome':
        await sendStaffWelcomeEmail(payload)
        break
      case 'appointment-confirmation':
        await sendAppointmentConfirmation({
          ...payload,
          date: new Date(payload.date),
        })
        break
      case 'trial-ending':
        await sendTrialEndingEmail(payload)
        break
      case 'payment-success':
        await sendPaymentSuccessEmail(payload)
        break
      case 'payment-failed':
        await sendPaymentFailedEmail(payload)
        break
    }

    return NextResponse.json({ sent: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Email gönderilemedi'
    console.error('[/api/emails/send]', err)
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
