import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Vercel moves Authorization to x-vercel-sc-headers for its cache system
function getAuthHeader(request: NextRequest): string | null {
  const direct = request.headers.get('authorization')
  if (direct) return direct
  try {
    const scHeaders = request.headers.get('x-vercel-sc-headers')
    if (scHeaders) {
      const parsed = JSON.parse(scHeaders)
      return parsed['Authorization'] || parsed['authorization'] || null
    }
  } catch { /* ignore */ }
  return null
}

async function getUserFromToken(token: string): Promise<{ id: string; email: string } | null> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
  })
  const body = await res.json()
  console.log('Supabase auth response:', res.status, JSON.stringify(body).slice(0, 200))
  if (!res.ok) return null
  return body?.id ? { id: body.id, email: body.email } : null
}

export async function GET(request: NextRequest) {
  const authHeader = getAuthHeader(request)
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
