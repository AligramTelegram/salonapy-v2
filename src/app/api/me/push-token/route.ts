import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

// PATCH /api/me/push-token — mobile app registers its Expo push token
export async function PATCH(request: NextRequest) {
  const token = request.headers.get('x-mobile-token')
  if (!token) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const { pushToken } = body as { pushToken?: string }
  if (!pushToken) return NextResponse.json({ error: 'pushToken zorunlu' }, { status: 400 })

  // Decode userId from JWT to update their push token
  function decodeJwtSub(t: string): string | null {
    try {
      const b64 = t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const payload = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
      return payload?.sub ?? null
    } catch { return null }
  }

  const sub = decodeJwtSub(token)
  if (!sub) return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 })

  await prisma.user.updateMany({
    where: { supabaseId: sub, tenantId },
    data: { pushToken },
  })

  return NextResponse.json({ ok: true })
}
