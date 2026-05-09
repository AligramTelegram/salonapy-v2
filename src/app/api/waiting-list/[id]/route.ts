import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const UpdateWaitingSchema = z.object({
  status: z.enum(['BEKLIYOR', 'BILDIRILDI', 'IPTAL']).optional(),
  notes: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const existing = await prisma.waitingList.findFirst({ where: { id: params.id, tenantId } })
  if (!existing) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const body = await request.json()
  const parsed = UpdateWaitingSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const updated = await prisma.waitingList.update({
    where: { id: params.id },
    data: parsed.data,
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const existing = await prisma.waitingList.findFirst({ where: { id: params.id, tenantId } })
  if (!existing) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  await prisma.waitingList.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
