import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedStaffFromRequest } from '@/lib/getTenantId'

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
    const staff = await getAuthenticatedStaffFromRequest(request)
    if (!staff) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

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

    const customerIds = grouped.map((g) => g.customerId)

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
