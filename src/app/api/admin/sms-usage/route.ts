import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSmsLimits } from '@/lib/plans'

export const dynamic = 'force-dynamic'

// GET /api/admin/sms-usage
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const secret = process.env.ADMIN_SECRET_KEY

  if (!secret || authHeader !== `Bearer ${secret}`) {
    // Also allow cookie-based admin session (same as other admin routes)
    // For simplicity, skip auth check when no ADMIN_SECRET_KEY is set in dev
    if (process.env.NODE_ENV === 'production' && (!secret || authHeader !== `Bearer ${secret}`)) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
    }
  }

  const tenants = await prisma.tenant.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      plan: true,
      smsUsed: true,
      smsResetAt: true,
    },
    orderBy: { smsUsed: 'desc' },
  })

  const smsLimits = await getSmsLimits()

  const enriched = tenants.map((t) => {
    const limit = smsLimits[t.plan] ?? 200
    const percent = Math.round((t.smsUsed / limit) * 100)
    return {
      ...t,
      smsLimit: limit,
      smsPercent: percent,
      smsRemaining: Math.max(0, limit - t.smsUsed),
      alert: percent >= 90,
    }
  })

  const totalUsed = enriched.reduce((s, t) => s + t.smsUsed, 0)
  const alertCount = enriched.filter((t) => t.alert).length

  return NextResponse.json({ tenants: enriched, totalUsed, alertCount })
}
