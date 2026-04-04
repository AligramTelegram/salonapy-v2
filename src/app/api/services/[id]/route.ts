import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getTenantId } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

const UpdateServiceSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  duration: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
  staffIds: z.array(z.string()).optional(),
})

// GET /api/services/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const service = await prisma.service.findFirst({
    where: { id: params.id, tenantId },
    include: {
      staff: { select: { id: true, name: true, color: true, avatarUrl: true } },
    },
  })

  if (!service) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  return NextResponse.json(service)
}

// PUT /api/services/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const existing = await prisma.service.findFirst({ where: { id: params.id, tenantId } })
  if (!existing) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const parsed = UpdateServiceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { staffIds, ...fields } = parsed.data

  const service = await prisma.service.update({
    where: { id: params.id },
    data: {
      ...fields,
      ...(staffIds !== undefined
        ? { staff: { set: staffIds.map((id) => ({ id })) } }
        : {}),
    },
    include: {
      staff: { select: { id: true, name: true, color: true, avatarUrl: true } },
    },
  })

  return NextResponse.json(service)
}

// DELETE /api/services/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const existing = await prisma.service.findFirst({ where: { id: params.id, tenantId } })
  if (!existing) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  await prisma.service.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
