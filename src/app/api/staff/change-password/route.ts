import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const Schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Oturum yok' }, { status: 401 })

    const staff = await prisma.staff.findUnique({
      where: { supabaseId: user.id },
      select: { id: true, email: true },
    })
    if (!staff) return NextResponse.json({ error: 'Personel bulunamadı' }, { status: 404 })

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
    }

    const parsed = Schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
    }

    const { currentPassword, newPassword } = parsed.data

    // Verify current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: staff.email,
      password: currentPassword,
    })
    if (signInError) {
      return NextResponse.json({ error: 'Mevcut şifre hatalı' }, { status: 400 })
    }

    // Update password via admin client
    const adminSupabase = createAdminClient()
    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    })
    if (updateError) {
      console.error('[change-password] updateUserById error:', updateError)
      return NextResponse.json({ error: 'Şifre güncellenemedi' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[POST /api/staff/change-password]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
