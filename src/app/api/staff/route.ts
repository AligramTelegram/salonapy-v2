import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { searchParams } = request.nextUrl
  const all = searchParams.get('all') === 'true' // include inactive

  const staff = await prisma.staff.findMany({
    where: { tenantId, ...(all ? {} : { isActive: true }) },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      color: true,
      avatarUrl: true,
      title: true,
      slug: true,
      isActive: true,
      createdAt: true,
      services: { select: { id: true, name: true, color: true } },
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(staff)
}
