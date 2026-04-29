import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function decodeJwtSub(token: string): string | null {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
    return payload?.sub ?? null
  } catch { return null }
}

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-mobile-token')
  if (!token) return NextResponse.json({ error: 'Token eksik' }, { status: 401 })

  const sub = decodeJwtSub(token)
  if (!sub) return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: sub },
    select: {
      name: true,
      role: true,
      email: true,
      tenant: { select: { slug: true, name: true, plan: true, phone: true, email: true } },
    },
  })

  if (!dbUser) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
  return NextResponse.json({ user: dbUser })
}
