import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addDays } from 'date-fns'

export const dynamic = 'force-dynamic'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'hemensalon-admin-2026'

// POST /api/admin/extend-trial
// Body: { secret, email, days }
export async function POST(request: NextRequest) {
  const { secret, email, days = 30 } = await request.json().catch(() => ({}))

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { tenantId: true },
  })

  if (!user) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })

  const endDate = addDays(new Date(), days)

  const existing = await prisma.subscription.findFirst({
    where: { tenantId: user.tenantId },
  })

  if (existing) {
    await prisma.subscription.update({
      where: { id: existing.id },
      data: { endDate, status: 'TRIAL' },
    })
  } else {
    await prisma.subscription.create({
      data: {
        tenantId: user.tenantId,
        plan: 'BASLANGIC',
        amount: 0,
        currency: 'TRY',
        paymentProvider: 'trial',
        status: 'TRIAL',
        startDate: new Date(),
        endDate,
        autoRenew: false,
      },
    })
  }

  return NextResponse.json({ success: true, endDate: endDate.toISOString() })
}
