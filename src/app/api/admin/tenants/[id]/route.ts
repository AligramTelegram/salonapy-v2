import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { verifyAdminSecret } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

// GET /api/admin/tenants/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = verifyAdminSecret(request)
  if (authError) return authError

  try {
    const [tenant, appointmentCount, customerCount, staffCount, revenueAgg] = await Promise.all([
      prisma.tenant.findUnique({
        where: { id: params.id },
        include: {
          subscription: true,
          users: { where: { role: 'OWNER' }, take: 1 },
        },
      }),
      prisma.appointment.count({ where: { tenantId: params.id } }),
      prisma.customer.count({ where: { tenantId: params.id } }),
      prisma.staff.count({ where: { tenantId: params.id } }),
      prisma.transaction.aggregate({
        where: { tenantId: params.id, type: 'GELIR' },
        _sum: { amount: true },
      }),
    ])

    if (!tenant) return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 404 })

    const ownerUser = tenant.users[0] ?? null

    return NextResponse.json({
      tenant: { ...tenant, users: undefined },
      ownerUser,
      stats: {
        totalAppointments: appointmentCount,
        totalCustomers: customerCount,
        staffCount,
        totalRevenue: revenueAgg._sum.amount ?? 0,
      },
    })
  } catch (err) {
    console.error('[GET /api/admin/tenants/[id]]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

const PatchSchema = z.object({
  name: z.string().min(2).optional(),
  plan: z.enum(['BASLANGIC', 'PROFESYONEL', 'ISLETME']).optional(),
  isActive: z.boolean().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
})

// PATCH /api/admin/tenants/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = verifyAdminSecret(request)
  if (authError) return authError

  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
    }

    const parsed = PatchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
    }

    const { email, password, name, ...tenantData } = parsed.data

    // Update tenant fields (plan, isActive, name+slug)
    let updated = null
    const updateData: Record<string, unknown> = { ...tenantData }

    if (name) {
      updateData.name = name
      // Generate new unique slug from name
      const baseSlug = name
        .toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
        .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
        .replace(/-+/g, '-').replace(/^-|-$/g, '')

      let slug = baseSlug || 'isletme'
      let counter = 0
      while (true) {
        const existing = await prisma.tenant.findFirst({ where: { slug, NOT: { id: params.id } } })
        if (!existing) break
        counter++
        slug = `${baseSlug}-${counter}`
      }
      updateData.slug = slug
    }

    if (Object.keys(updateData).length > 0) {
      updated = await prisma.tenant.update({
        where: { id: params.id },
        data: updateData,
      })
    }

    // Update email/password via Supabase Admin
    if (email || password) {
      const ownerUser = await prisma.user.findFirst({
        where: { tenantId: params.id, role: 'OWNER' },
      })
      if (!ownerUser) {
        return NextResponse.json({ error: 'Sahip kullanıcı bulunamadı' }, { status: 404 })
      }

      const supabase = createAdminClient()
      const updatePayload: { email?: string; password?: string } = {}
      if (email) updatePayload.email = email
      if (password) updatePayload.password = password

      const { error: supabaseError } = await supabase.auth.admin.updateUserById(
        ownerUser.supabaseId,
        updatePayload
      )

      if (supabaseError) {
        console.error('[PATCH tenants/[id]] Supabase error:', supabaseError)
        return NextResponse.json({ error: 'Auth güncellenemedi: ' + supabaseError.message }, { status: 500 })
      }

      // Also update email in User table
      if (email) {
        await prisma.user.update({
          where: { id: ownerUser.id },
          data: { email },
        })
      }
    }

    return NextResponse.json(updated ?? { success: true })
  } catch (err) {
    console.error('[PATCH /api/admin/tenants/[id]]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// DELETE /api/admin/tenants/[id] — soft delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = verifyAdminSecret(request)
  if (authError) return authError

  try {
    await prisma.tenant.update({
      where: { id: params.id },
      data: { isActive: false },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/tenants/[id]]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
