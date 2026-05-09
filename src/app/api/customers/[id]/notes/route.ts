import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const CreateNoteSchema = z.object({
  content: z.string().min(1),
  category: z.enum(['GENEL', 'ALERJI', 'TERCIH', 'OZEL']).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const customer = await prisma.customer.findFirst({ where: { id: params.id, tenantId } })
  if (!customer) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const notes = await prisma.customerNote.findMany({
    where: { customerId: params.id, tenantId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(notes)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const customer = await prisma.customer.findFirst({ where: { id: params.id, tenantId } })
  if (!customer) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const body = await request.json()
  const parsed = CreateNoteSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const note = await prisma.customerNote.create({
    data: {
      tenantId,
      customerId: params.id,
      content: parsed.data.content,
      category: parsed.data.category ?? 'GENEL',
    },
  })

  return NextResponse.json(note, { status: 201 })
}
