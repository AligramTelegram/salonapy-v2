import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminSecret } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// GET /api/admin/tenants?search=&plan=&status=&page=1&limit=10
export async function GET(request: NextRequest) {
  const authError = verifyAdminSecret(request)
  if (authError) return authError

  try {
    const { searchParams } = request.nextUrl
    const search = searchParams.get('search') ?? ''
    const plan = searchParams.get('plan') ?? ''
    const status = searchParams.get('status') ?? ''
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '10', 10)))
    const skip = (page - 1) * limit

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (plan && ['BASLANGIC', 'PROFESYONEL', 'ISLETME'].includes(plan)) {
      where.plan = plan
    }
    if (status === 'active') where.isActive = true
    if (status === 'inactive') where.isActive = false

    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          email: true,
          phone: true,
          plan: true,
          isActive: true,
          waUsed: true,
          createdAt: true,
          planEndsAt: true,
          _count: { select: { staff: true, appointments: true, customers: true } },
        },
      }),
      prisma.tenant.count({ where }),
    ])

    return NextResponse.json({
      tenants,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error('[GET /api/admin/tenants]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
