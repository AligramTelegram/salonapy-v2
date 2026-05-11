import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'
import { isTurkishPhone } from '@/lib/country-detect'

const SMS_PLAN_LIMITS: Record<string, number> = {
  BASLANGIC: 200,
  PROFESYONEL: 600,
  ISLETME: 1500,
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      id: true, name: true, slug: true, phone: true, email: true,
      address: true, plan: true, planEndsAt: true,
      smsUsed: true, smsCredits: true,
      subscription: { select: { endDate: true, status: true } },
    },
  })

  if (!tenant) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const trialSub = tenant.subscription?.status === 'TRIAL' ? tenant.subscription : null

  return NextResponse.json({
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    phone: tenant.phone,
    email: tenant.email,
    address: tenant.address,
    plan: tenant.plan,
    planEndsAt: tenant.planEndsAt?.toISOString(),
    trialEndsAt: trialSub?.endDate?.toISOString(),
    smsUsed: tenant.smsUsed,
    smsCredits: tenant.smsCredits,
    smsMonthlyLimit: SMS_PLAN_LIMITS[tenant.plan] ?? 0,
    isTurkish: isTurkishPhone(tenant.phone),
  })
}

export async function PUT(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const body = await request.json()
  const { name, phone, email, address } = body

  const tenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
      ...(address !== undefined && { address }),
    },
    select: {
      id: true, name: true, slug: true, phone: true, email: true,
      address: true, plan: true, planEndsAt: true, smsUsed: true, smsCredits: true,
    },
  })

  return NextResponse.json(tenant)
}
