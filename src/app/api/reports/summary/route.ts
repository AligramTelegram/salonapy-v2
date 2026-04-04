import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { parseISO, startOfMonth, endOfMonth, format } from 'date-fns'
import { tr } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

async function getOwnerTenantId(): Promise<string | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { tenantId: true },
  })
  return dbUser?.tenantId ?? null
}

const STATUS_LABELS: Record<string, string> = {
  BEKLIYOR: 'Bekliyor',
  ONAYLANDI: 'Onaylandı',
  TAMAMLANDI: 'Tamamlandı',
  IPTAL: 'İptal',
  GELMEDI: 'Gelmedi',
}

// GET /api/reports/summary?startDate=2025-01-01&endDate=2025-01-31
export async function GET(request: NextRequest) {
  try {
    const tenantId = await getOwnerTenantId()
    if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const { searchParams } = request.nextUrl
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    const today = new Date()
    const startDate = startDateParam ? parseISO(startDateParam) : startOfMonth(today)
    const endDate = endDateParam ? parseISO(endDateParam) : endOfMonth(today)

    const appointments = await prisma.appointment.findMany({
      where: {
        tenantId,
        date: { gte: startDate, lte: endDate },
      },
      include: {
        service: { select: { id: true, name: true, color: true } },
        staff: { select: { id: true, name: true } },
      },
    })

    // --- Basic stats ---
    const totalAppointments = appointments.length
    const completedApts = appointments.filter((a) => a.status === 'TAMAMLANDI')
    const completedAppointments = completedApts.length
    const cancelledAppointments = appointments.filter((a) => a.status === 'IPTAL').length
    // Randevu başına ortalama değer (appointments tablosundan, sadece analitik)
    const appointmentRevenue = completedApts.reduce((sum, a) => sum + a.price, 0)
    const avgAppointmentValue =
      completedAppointments > 0 ? appointmentRevenue / completedAppointments : 0

    // Transaction tablosu tek finansal kaynak — randevu tamamlandığında otomatik
    // GELIR transaction oluşturulduğundan, randevu fiyatları zaten burada.
    // Appointments tablosundan ayrıca toplamak çift sayıma neden olur.
    const allTransactions = await prisma.transaction.findMany({
      where: {
        tenantId,
        date: { gte: startDate, lte: endDate },
      },
    })
    const totalRevenue = allTransactions
      .filter((t) => t.type === 'GELIR')
      .reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = allTransactions
      .filter((t) => t.type === 'GIDER')
      .reduce((sum, t) => sum + t.amount, 0)

    // transactions değişkeni: service distribution için GELIR olanlar
    const transactions = allTransactions.filter((t) => t.type === 'GELIR')

    // --- Service & Transaction distribution ---
    const serviceMap = new Map<
      string,
      { name: string; count: number; revenue: number; color: string }
    >()
    // Randevu hizmetleri
    appointments.forEach((a) => {
      const existing = serviceMap.get(a.service.id)
      if (existing) {
        existing.count++
        if (a.status === 'TAMAMLANDI') existing.revenue += a.price
      } else {
        serviceMap.set(a.service.id, {
          name: a.service.name,
          count: 1,
          revenue: a.status === 'TAMAMLANDI' ? a.price : 0,
          color: a.service.color,
        })
      }
    })
    // Tüm transaction kategorilerini dinamik ekle (GELIR ve GIDER)
    const categoryColors: Record<string, string> = {
      'Paket Satışı': '#a855f7',
      'Diğer Gelir': '#22c55e',
      'Diğer Gider': '#ef4444',
      // Diğer kategoriler için varsayılan renk
    }
    transactions.forEach((t) => {
      const key = `txn-${t.category}`
      if (!serviceMap.has(key)) {
        serviceMap.set(key, {
          name: t.category,
          count: 1,
          revenue: t.amount,
          color: categoryColors[t.category] || (t.type === 'GELIR' ? '#22c55e' : '#ef4444'),
        })
      } else {
        const existing = serviceMap.get(key)!
        existing.count++
        existing.revenue += t.amount
      }
    })
    const serviceDistribution = Array.from(serviceMap.values()).sort(
      (a, b) => b.count - a.count
    )

    // --- Staff performance ---
    const staffMap = new Map<string, { name: string; count: number; revenue: number }>()
    appointments.forEach((a) => {
      const existing = staffMap.get(a.staff.id)
      if (existing) {
        existing.count++
        if (a.status === 'TAMAMLANDI') existing.revenue += a.price
      } else {
        staffMap.set(a.staff.id, {
          name: a.staff.name,
          count: 1,
          revenue: a.status === 'TAMAMLANDI' ? a.price : 0,
        })
      }
    })
    const staffPerformance = Array.from(staffMap.values()).sort(
      (a, b) => b.revenue - a.revenue
    )

    // --- Status distribution ---
    const statusMap = new Map<string, number>()
    appointments.forEach((a) => {
      statusMap.set(a.status, (statusMap.get(a.status) ?? 0) + 1)
    })
    const statusDistribution = Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      label: STATUS_LABELS[status] ?? status,
      count,
    }))

    // --- Monthly trend ---
    // Randevu sayıları appointments tablosundan, gelir/gider sadece transactions tablosundan
    const monthMap = new Map<string, { month: string; income: number; expense: number; count: number }>()

    appointments.forEach((a) => {
      const key = format(new Date(a.date), 'yyyy-MM')
      const label = format(new Date(a.date), 'MMM yy', { locale: tr })
      const existing = monthMap.get(key)
      if (existing) {
        existing.count++
      } else {
        monthMap.set(key, { month: label, income: 0, expense: 0, count: 1 })
      }
    })

    // Tüm finansal hareketler transactions tablosundan (tek kaynak)
    allTransactions.forEach((t) => {
      const key = format(new Date(t.date), 'yyyy-MM')
      const label = format(new Date(t.date), 'MMM yy', { locale: tr })
      const existing = monthMap.get(key)
      if (existing) {
        if (t.type === 'GELIR') existing.income += t.amount
        else existing.expense += t.amount
      } else {
        monthMap.set(key, {
          month: label,
          income: t.type === 'GELIR' ? t.amount : 0,
          expense: t.type === 'GIDER' ? t.amount : 0,
          count: 0,
        })
      }
    })

    const monthlyTrend = Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v)

    return NextResponse.json({
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      totalRevenue,
      totalExpense,
      avgAppointmentValue,
      topService: serviceDistribution[0] ?? null,
      monthlyTrend,
      serviceDistribution,
      staffPerformance,
      statusDistribution,
    })
  } catch (err) {
    console.error('[GET /api/reports/summary]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
