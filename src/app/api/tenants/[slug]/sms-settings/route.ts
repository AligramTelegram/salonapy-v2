import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getTenantId } from '@/lib/getTenantId'
import { getSmsLimits } from '@/lib/plans'

export const dynamic = 'force-dynamic'

const SmsSettingsSchema = z.object({
  sms24hReminder: z.boolean().optional(),
  sms1hReminder: z.boolean().optional(),
})

// GET /api/tenants/[slug]/sms-settings
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const tenant = await prisma.tenant.findFirst({
    where: { slug: params.slug, id: tenantId },
    select: {
      plan: true,
      smsUsed: true,
      smsResetAt: true,
      sms24hReminder: true,
      sms1hReminder: true,
    },
  })

  if (!tenant) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const smsLimits = await getSmsLimits()

  return NextResponse.json({
    ...tenant,
    smsLimit: smsLimits[tenant.plan] ?? 200,
  })
}

// PATCH /api/tenants/[slug]/sms-settings
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const tenant = await prisma.tenant.findFirst({
    where: { slug: params.slug, id: tenantId },
  })
  if (!tenant) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const parsed = SmsSettingsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const updated = await prisma.tenant.update({
    where: { id: tenantId },
    data: parsed.data,
    select: { sms24hReminder: true, sms1hReminder: true },
  })

  return NextResponse.json(updated)
}
