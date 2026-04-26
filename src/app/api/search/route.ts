import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      select: { tenantId: true },
    })
    if (!dbUser) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })

    const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
    if (q.length < 2) return NextResponse.json({ customers: [], appointments: [], services: [] })

    const { tenantId } = dbUser

    const [customers, appointments, services] = await Promise.all([
      prisma.customer.findMany({
        where: {
          tenantId,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { phone: { contains: q } },
            { email: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, phone: true },
        take: 5,
      }),

      prisma.appointment.findMany({
        where: {
          tenantId,
          OR: [
            { customer: { name: { contains: q, mode: 'insensitive' } } },
            { service: { name: { contains: q, mode: 'insensitive' } } },
            { staff: { name: { contains: q, mode: 'insensitive' } } },
          ],
        },
        include: {
          customer: { select: { name: true } },
          service: { select: { name: true } },
        },
        orderBy: { date: 'desc' },
        take: 5,
      }),

      prisma.service.findMany({
        where: {
          tenantId,
          name: { contains: q, mode: 'insensitive' },
          isActive: true,
        },
        select: { id: true, name: true, duration: true, price: true },
        take: 4,
      }),
    ])

    return NextResponse.json({
      customers,
      appointments: appointments.map((a) => ({
        id: a.id,
        customerName: a.customer?.name ?? a.guestName ?? 'Misafir',
        serviceName: a.service.name,
        date: a.date.toISOString(),
        startTime: a.startTime,
        status: a.status,
      })),
      services,
    })
  } catch (err) {
    console.error('[GET /api/search]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
