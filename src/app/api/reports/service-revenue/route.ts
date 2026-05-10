import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { searchParams } = request.nextUrl
  const period = searchParams.get('period') ?? 'month'
  const now = new Date()
  let from: Date
  if (period === 'quarter') from = new Date(now.getFullYear(), now.getMonth() - 2, 1)
  else if (period === 'year') from = new Date(now.getFullYear(), 0, 1)
  else from = new Date(now.getFullYear(), now.getMonth(), 1)

  const appointments = await prisma.appointment.findMany({
    where: { tenantId, date: { gte: from }, status: 'TAMAMLANDI' },
    select: { price: true, service: { select: { id: true, name: true, color: true } } },
  })

  const map = new Map<string, { serviceId: string; serviceName: string; serviceColor: string; count: number; revenue: number }>()
  for (const a of appointments) {
    const key = a.service.id
    const entry = map.get(key) ?? { serviceId: key, serviceName: a.service.name, serviceColor: a.service.color, count: 0, revenue: 0 }
    entry.count++
    entry.revenue += a.price
    map.set(key, entry)
  }

  return NextResponse.json(Array.from(map.values()).sort((a, b) => b.revenue - a.revenue))
}
