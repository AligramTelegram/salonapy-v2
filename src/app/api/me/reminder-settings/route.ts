import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/me/reminder-settings
export async function GET(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { sms24hReminder: true, sms1hReminder: true },
  })

  if (!tenant) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  return NextResponse.json({
    remind24h: tenant.sms24hReminder,
    remind2h: tenant.sms1hReminder,
  })
}

// PUT /api/me/reminder-settings
export async function PUT(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const body = await request.json()
  const { remind24h, remind2h } = body

  const tenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      ...(remind24h !== undefined && { sms24hReminder: remind24h }),
      ...(remind2h  !== undefined && { sms1hReminder:  remind2h  }),
    },
    select: { sms24hReminder: true, sms1hReminder: true },
  })

  return NextResponse.json({
    remind24h: tenant.sms24hReminder,
    remind2h: tenant.sms1hReminder,
  })
}
