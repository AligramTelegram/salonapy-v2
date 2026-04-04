import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

async function getStaffBySupabaseId(userId: string) {
  return prisma.staff.findUnique({
    where: { supabaseId: userId },
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

export async function GET() {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Oturum yok' }, { status: 401 })

    const staff = await getStaffBySupabaseId(user.id)
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
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Oturum yok' }, { status: 401 })

    const staff = await prisma.staff.findUnique({
      where: { supabaseId: user.id },
      select: { id: true },
    })
    if (!staff) return NextResponse.json({ error: 'Personel bulunamadı' }, { status: 404 })

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
