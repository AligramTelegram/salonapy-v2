import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedStaffFromRequest } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

// POST /api/staff/push-token — Staff push token kaydı
export async function POST(request: NextRequest) {
  const staff = await getAuthenticatedStaffFromRequest(request)
  if (!staff) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const token = (body as any)?.token
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Token gerekli' }, { status: 400 })
  }

  await prisma.staff.update({
    where: { id: staff.id },
    data: { pushToken: token },
  })

  return NextResponse.json({ ok: true })
}
