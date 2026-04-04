import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    // Kullanıcının tenant'ını bul
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { tenant: true },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    const tenantId = dbUser.tenantId
    const now = new Date()
    const todayStart = startOfDay(now)
    const todayEnd = endOfDay(now)
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    // Paralel sorgular
    const [
      todayCount,
      monthCount,
      monthRevenue,
      monthExpense,
      tenant,
    ] = await Promise.all([
      // Bugünkü randevu sayısı
      prisma.appointment.count({
        where: {
          tenantId,
          date: { gte: todayStart, lte: todayEnd },
          status: { not: 'IPTAL' },
        },
      }),

      // Bu ayki randevu sayısı
      prisma.appointment.count({
        where: {
          tenantId,
          date: { gte: monthStart, lte: monthEnd },
          status: { not: 'IPTAL' },
        },
      }),

      // Bu ayki gelir (sadece GELIR tipi işlemler)
      prisma.transaction.aggregate({
        where: {
          tenantId,
          type: 'GELIR',
          date: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      }),

      // Bu ayki gider (sadece GIDER tipi işlemler)
      prisma.transaction.aggregate({
        where: {
          tenantId,
          type: 'GIDER',
          date: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      }),

      // Tenant (WA mesaj bilgisi için)
      prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { waUsed: true, plan: true },
      }),
    ])

    // Plan bazlı WA limiti
    const WA_LIMITS: Record<string, number> = {
      BASLANGIC: 200,
      PROFESYONEL: 600,
      ISLETME: 1500,
    }
    const waLimit = WA_LIMITS[tenant?.plan ?? 'BASLANGIC'] ?? 200

    const revenue = monthRevenue._sum.amount ?? 0
    const expense = monthExpense._sum.amount ?? 0

    return NextResponse.json({
      today: todayCount,
      month: monthCount,
      revenue,
      expense,
      netProfit: revenue - expense,
      waUsed: tenant?.waUsed ?? 0,
      waLimit,
    })
  } catch (error) {
    console.error('[dashboard/stats]', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
