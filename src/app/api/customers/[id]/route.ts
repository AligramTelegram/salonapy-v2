import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getTenantId } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

const UpdateCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email().optional().or(z.literal('')),
  notes: z.string().optional(),
})

// GET /api/customers/[id]  — includes last 10 appointments
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const customer = await prisma.customer.findFirst({
    where: { id: params.id, tenantId },
  })
  if (!customer) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const appointments = await prisma.appointment.findMany({
    where: { customerId: params.id, tenantId },
    select: {
      id: true,
      date: true,
      startTime: true,
      endTime: true,
      status: true,
      price: true,
      paid: true,
      notes: true,
      service: { select: { id: true, name: true, color: true, duration: true } },
      staff: { select: { id: true, name: true, color: true, avatarUrl: true } },
    },
    orderBy: { date: 'desc' },
    take: 10,
  })

  return NextResponse.json({ ...customer, appointments })
}

// PUT /api/customers/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const existing = await prisma.customer.findFirst({ where: { id: params.id, tenantId } })
  if (!existing) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const parsed = UpdateCustomerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { email, ...rest } = parsed.data

  // If phone is changing, check uniqueness
  if (rest.phone && rest.phone !== existing.phone) {
    const conflict = await prisma.customer.findUnique({
      where: { tenantId_phone: { tenantId, phone: rest.phone } },
    })
    if (conflict) {
      return NextResponse.json({ error: 'Bu telefon numarası zaten kayıtlı' }, { status: 409 })
    }
  }

  const customer = await prisma.customer.update({
    where: { id: params.id },
    data: {
      ...rest,
      ...(email !== undefined ? { email: email || null } : {}),
    },
  })

  return NextResponse.json(customer)
}

// DELETE /api/customers/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const existing = await prisma.customer.findFirst({ where: { id: params.id, tenantId } })
  if (!existing) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  await prisma.customer.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
