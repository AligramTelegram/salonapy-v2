import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export interface StaffCustomer {
  id: string
  name: string
  phone: string
  email: string | null
  totalVisitsWithStaff: number
  lastVisitAt: string | null
}

// GET /api/staff/customers?q=search
// Returns customers who have had appointments with the current staff member
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Oturum yok' }, { status: 401 })

    const staff = await prisma.staff.findUnique({
      where: { supabaseId: user.id },
      select: { id: true, tenantId: true },
    })

    if (!staff) return NextResponse.json({ error: 'Personel bulunamadı' }, { status: 404 })

    const { searchParams } = request.nextUrl
    const q = searchParams.get('q')?.toLowerCase().trim()

    // Aggregate appointments by customer for this staff
    const grouped = await prisma.appointment.groupBy({
      by: ['customerId'],
      where: { staffId: staff.id, tenantId: staff.tenantId },
      _count: { id: true },
      _max: { date: true },
    })

    if (grouped.length === 0) return NextResponse.json([])

    const customerIds = grouped.map((g) => g.customerId).filter((id): id is string => id !== null)

    const customers = await prisma.customer.findMany({
      where: {
        id: { in: customerIds },
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { phone: { contains: q } },
              ],
            }
          : {}),
      },
      select: { id: true, name: true, phone: true, email: true },
    })

    // Join with aggregation data
    const result: StaffCustomer[] = customers.map((c) => {
      const agg = grouped.find((g) => g.customerId === c.id)!
      return {
        ...c,
        totalVisitsWithStaff: agg._count.id,
        lastVisitAt: agg._max.date ? agg._max.date.toISOString() : null,
      }
    })

    // Sort by most visits desc
    result.sort((a, b) => b.totalVisitsWithStaff - a.totalVisitsWithStaff)

    return NextResponse.json(result)
  } catch (err) {
    console.error('[/api/staff/customers]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
