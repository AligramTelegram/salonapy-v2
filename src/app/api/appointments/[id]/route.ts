import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getTenantId } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

const UpdateSchema = z.object({
  status: z.enum(['BEKLIYOR', 'ONAYLANDI', 'TAMAMLANDI', 'IPTAL', 'GELMEDI']).optional(),
  staffId: z.string().optional(),
  serviceId: z.string().optional(),
  customerId: z.string().optional(),
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  price: z.number().optional(),
  notes: z.string().max(1000).optional(),
  paid: z.boolean().optional(),
})

// PUT /api/appointments/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  // Tenant izolasyonu
  const existing = await prisma.appointment.findFirst({
    where: { id: params.id, tenantId },
  })
  if (!existing) return NextResponse.json({ error: 'Randevu bulunamadı' }, { status: 404 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { date, ...rest } = parsed.data

  const updateData: Record<string, unknown> = {
    ...rest,
    ...(date ? { date: new Date(date) } : {}),
  }

  // Paket müşterisi ve onay durumu için seans düşme kontrolü
  if (
    parsed.data.status &&
    ['ONAYLANDI', 'TAMAMLANDI'].includes(parsed.data.status) &&
    existing.customerPackageId &&
    !existing.usedPackageSession
  ) {
    const customerPackage = await prisma.customerPackage.findUnique({
      where: { id: existing.customerPackageId },
    })

    if (customerPackage && customerPackage.remainingSessions > 0) {
      const remaining = customerPackage.remainingSessions - 1
      await prisma.customerPackage.update({
        where: { id: customerPackage.id },
        data: {
          usedSessions: { increment: 1 },
          remainingSessions: remaining,
          isActive: remaining > 0,
        },
      })
      updateData.usedPackageSession = true
    }
  }

  const updated = await prisma.appointment.update({
    where: { id: params.id },
    data: updateData,
    include: {
      staff: { select: { id: true, name: true, color: true } },
      service: { select: { id: true, name: true, duration: true } },
      customer: { select: { id: true, name: true, phone: true } },
    },
  })

  // Completed appointment revenue kaydı (sadece TAMAMLANDI için ve ilk kez)
  const isCompletionTransition =
    parsed.data.status === 'TAMAMLANDI' &&
    existing.status !== 'TAMAMLANDI'

  if (isCompletionTransition && updated.price > 0) {
    await prisma.transaction.create({
      data: {
        tenantId,
        type: 'GELIR',
        amount: updated.price,
        category: 'Randevu',
        description: `Randevu ${updated.customer.name} - ${updated.service.name}`,
        date: new Date(),
      },
    })

    // Müşterinin toplam ziyaret ve harcama bilgilerini güncelle
    await prisma.customer.update({
      where: { id: updated.customerId },
      data: {
        totalVisits: { increment: 1 },
        totalSpent: { increment: updated.price },
        lastVisitAt: new Date(),
      },
    })

  }

  return NextResponse.json(updated)
}

// DELETE /api/appointments/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const existing = await prisma.appointment.findFirst({
    where: { id: params.id, tenantId },
  })
  if (!existing) return NextResponse.json({ error: 'Randevu bulunamadı' }, { status: 404 })

  await prisma.appointment.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
