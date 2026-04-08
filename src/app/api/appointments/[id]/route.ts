import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { parse } from 'date-fns'
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

  // ── Çakışma kontrolü (tarih/saat/personel değişiyorsa) ────────────────────
  const isRescheduling = date || parsed.data.startTime || parsed.data.endTime || parsed.data.staffId
  if (isRescheduling && parsed.data.status !== 'IPTAL') {
    // Güncelleme sonrası geçerli olacak değerleri hesapla
    const finalStaffId  = parsed.data.staffId  ?? existing.staffId
    const finalStartTime = parsed.data.startTime ?? existing.startTime
    const finalEndTime   = parsed.data.endTime   ?? existing.endTime
    const finalDateRaw   = date ?? null

    let finalDate: Date
    if (finalDateRaw) {
      finalDate = parse(finalDateRaw, 'yyyy-MM-dd', new Date())
      finalDate.setHours(12, 0, 0, 0)
    } else {
      finalDate = existing.date
    }

    const conflict = await prisma.appointment.findFirst({
      where: {
        tenantId,
        staffId: finalStaffId,
        date: finalDate,
        status: { notIn: ['IPTAL'] },
        id: { not: params.id }, // kendisiyle çakışmasın
        AND: [
          { startTime: { lt: finalEndTime } },
          { endTime: { gt: finalStartTime } },
        ],
      },
      select: { startTime: true, endTime: true, customer: { select: { name: true } } },
    })

    if (conflict) {
      const staffRecord = await prisma.staff.findUnique({ where: { id: finalStaffId }, select: { name: true } })
      return NextResponse.json(
        {
          error: `${staffRecord?.name ?? 'Personel'} adlı personelin ${conflict.startTime}–${conflict.endTime} saatleri arasında zaten bir randevusu var (${conflict.customer.name}).`,
          code: 'APPOINTMENT_CONFLICT',
        },
        { status: 409 }
      )
    }
  }
  // ──────────────────────────────────────────────────────────────────────────

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
