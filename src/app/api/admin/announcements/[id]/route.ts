import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const UpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(5000).optional(),
  type: z.enum(['INFO', 'WARNING', 'SUCCESS']).optional(),
  isActive: z.boolean().optional(),
  targetPlan: z.string().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
})

// PATCH /api/admin/announcements/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const existing = await prisma.announcement.findUnique({ where: { id: params.id } })
  if (!existing) return NextResponse.json({ error: 'Duyuru bulunamadı' }, { status: 404 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const { expiresAt, targetPlan, ...rest } = parsed.data

  const updated = await prisma.announcement.update({
    where: { id: params.id },
    data: {
      ...rest,
      ...(targetPlan !== undefined ? { targetPlan: targetPlan ?? null } : {}),
      ...(expiresAt !== undefined ? { expiresAt: expiresAt ? new Date(expiresAt) : null } : {}),
    },
  })

  return NextResponse.json(updated)
}

// DELETE /api/admin/announcements/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const existing = await prisma.announcement.findUnique({ where: { id: params.id } })
  if (!existing) return NextResponse.json({ error: 'Duyuru bulunamadı' }, { status: 404 })

  await prisma.announcement.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
