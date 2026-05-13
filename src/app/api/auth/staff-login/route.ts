import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

// POST /api/auth/staff-login
// Body: { email, password }
// Returns: { access_token, refresh_token, staffId, name }
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
  }

  const parsed = LoginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Email ve şifre gereklidir' }, { status: 422 })
  }

  const { email, password } = parsed.data

  // Regular anon-key client for password sign-in
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    return NextResponse.json({ error: 'Email veya şifre hatalı' }, { status: 401 })
  }

  const userId = data.user.id

  // Verify this is a staff member (not a salon owner)
  const staff = await prisma.staff.findUnique({
    where: { supabaseId: userId },
    select: { id: true, name: true, tenantId: true, isActive: true },
  })

  if (!staff) {
    return NextResponse.json({ error: 'Personel hesabı bulunamadı' }, { status: 403 })
  }

  if (!staff.isActive) {
    return NextResponse.json({ error: 'Hesabınız pasif durumda' }, { status: 403 })
  }

  return NextResponse.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    staffId: staff.id,
    name: staff.name,
    tenantId: staff.tenantId,
  })
}
