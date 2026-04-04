import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Oturum bulunamadı' }, { status: 401 })
    }

    // Önce Staff tablosunu kontrol et
    const staff = await prisma.staff.findUnique({
      where: { supabaseId: user.id },
    })
    if (staff) {
      return NextResponse.json({ type: 'staff', redirectPath: `/p/${staff.slug}` })
    }

    // Sonra User (işletme sahibi) tablosunu kontrol et
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { tenant: true },
    })
    if (dbUser) {
      return NextResponse.json({ type: 'owner', redirectPath: `/b/${dbUser.tenant.slug}` })
    }

    return NextResponse.json({ error: 'Kullanıcı veritabanında bulunamadı' }, { status: 404 })
  } catch (err) {
    console.error('[/api/auth/me]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
