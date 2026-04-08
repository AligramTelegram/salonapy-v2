import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantId } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

// GET /api/announcements — aktif, süresi geçmemiş, bu tenant tarafından kapatılmamış duyurular
export async function GET(request: NextRequest) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { plan: true },
  })

  const now = new Date()

  const announcements = await prisma.announcement.findMany({
    where: {
      isActive: true,
      AND: [
        { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
        { OR: [{ targetPlan: null }, { targetPlan: tenant?.plan ?? undefined }] },
      ],
      dismissals: {
        none: { tenantId },
      },
    },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, content: true, type: true, createdAt: true },
  })

  return NextResponse.json(announcements)
}

// POST /api/announcements — dismiss (kapat)
export async function POST(request: NextRequest) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const { announcementId } = body as { announcementId?: string }
  if (!announcementId) return NextResponse.json({ error: 'announcementId gerekli' }, { status: 400 })

  await prisma.announcementDismissal.upsert({
    where: { announcementId_tenantId: { announcementId, tenantId } },
    create: { announcementId, tenantId },
    update: {},
  })

  return NextResponse.json({ ok: true })
}
