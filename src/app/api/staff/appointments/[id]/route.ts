import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const UpdateSchema = z.object({
  status: z.enum(['BEKLIYOR', 'ONAYLANDI', 'TAMAMLANDI', 'IPTAL', 'GELMEDI']).optional(),
  notes: z.string().optional(),
})

// PUT /api/staff/appointments/[id] — staff updates their own appointment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Oturum yok' }, { status: 401 })

    const staff = await prisma.staff.findUnique({
      where: { supabaseId: user.id },
      select: { id: true, tenantId: true },
    })

    if (!staff) return NextResponse.json({ error: 'Personel bulunamadı' }, { status: 404 })

    // Verify this appointment belongs to this staff member
    const existing = await prisma.appointment.findFirst({
      where: { id: params.id, staffId: staff.id, tenantId: staff.tenantId },
    })

    if (!existing) return NextResponse.json({ error: 'Randevu bulunamadı' }, { status: 404 })

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
    }

    const parsed = UpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
    }

    const updateData: Record<string, unknown> = { ...parsed.data }

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
        service: { select: { id: true, name: true, duration: true, color: true } },
        customer: { select: { id: true, name: true, phone: true } },
      },
    })

    const isCompletionTransition =
      parsed.data.status === 'TAMAMLANDI' &&
      existing.status !== 'TAMAMLANDI'

    if (isCompletionTransition && updated.price > 0) {
      await prisma.transaction.create({
        data: {
          tenantId: staff.tenantId,
          type: 'GELIR',
          amount: updated.price,
          category: 'Randevu',
          description: `Randevu ${updated.customer?.name ?? existing.guestName ?? 'Misafir'} - ${updated.service.name}`,
          date: new Date(),
        },
      })

      if (updated.customerId) {
        await prisma.customer.update({
          where: { id: updated.customerId },
          data: {
            totalVisits: { increment: 1 },
            totalSpent: { increment: updated.price },
            lastVisitAt: new Date(),
          },
        })
      }

    }

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/staff/appointments/[id]]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
