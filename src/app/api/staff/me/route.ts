import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getAuthenticatedStaffFromRequest } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

async function getStaffBySupabaseId_byId(staffId: string) {
  return prisma.staff.findUnique({
    where: { id: staffId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      title: true,
      color: true,
      avatarUrl: true,
      slug: true,
      tenant: { select: { name: true, slug: true } },
      workHours: { orderBy: { dayOfWeek: 'asc' } },
      services: {
        select: { id: true, name: true, color: true, duration: true, price: true },
        where: { isActive: true },
      },
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    const authStaff = await getAuthenticatedStaffFromRequest(request)
    if (!authStaff) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const staff = await getStaffBySupabaseId_byId(authStaff.id)
    if (!staff) return NextResponse.json({ error: 'Personel bulunamadı' }, { status: 404 })

    return NextResponse.json(staff)
  } catch (err) {
    console.error('[GET /api/staff/me]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

const PatchSchema = z.object({
  phone: z.string().optional(),
})

export async function PATCH(request: NextRequest) {
  try {
    const staff = await getAuthenticatedStaffFromRequest(request)
    if (!staff) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
    }

    const parsed = PatchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
    }

    const updated = await prisma.staff.update({
      where: { id: staff.id },
      data: parsed.data,
      select: { id: true, phone: true },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PATCH /api/staff/me]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
