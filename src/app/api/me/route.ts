import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getUserFromToken(token: string): Promise<{ id: string; email: string } | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
  })
  if (!res.ok) return null
  const data = await res.json()
  return data?.id ? { id: data.id, email: data.email } : null
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return NextResponse.json({ error: 'Token eksik' }, { status: 401 })

  const supaUser = await getUserFromToken(token)
  if (!supaUser) return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: supaUser.id },
    select: {
      name: true,
      role: true,
      tenant: { select: { slug: true, name: true, plan: true, phone: true, email: true } },
    },
  })

  if (!dbUser) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })

  return NextResponse.json({ user: { ...dbUser, email: supaUser.email } })
}
