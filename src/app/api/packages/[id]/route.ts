import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getTenantId } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

const UpdatePackageSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  sessions: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
  validDays: z.number().int().positive().optional().nullable(),
  isActive: z.boolean().optional(),
})

// PUT /api/packages/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const existing = await prisma.package.findFirst({ where: { id: params.id, tenantId } })
  if (!existing) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const parsed = UpdatePackageSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const pkg = await prisma.package.update({
    where: { id: params.id },
    data: parsed.data,
    include: {
      service: { select: { id: true, name: true, color: true, duration: true } },
      _count: { select: { customerPackages: { where: { isActive: true } } } },
    },
  })

  return NextResponse.json(pkg)
}

// DELETE /api/packages/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const existing = await prisma.package.findFirst({ where: { id: params.id, tenantId } })
  if (!existing) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  await prisma.package.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
