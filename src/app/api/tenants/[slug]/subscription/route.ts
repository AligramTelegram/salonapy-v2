import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getPlanPricesTRY } from '@/lib/plans'

export const dynamic = 'force-dynamic'

async function getOwnerTenant(slug: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: {
      tenant: {
        include: { subscription: true },
      },
    },
  })
  if (!dbUser || dbUser.tenant.slug !== slug) return null
  return dbUser.tenant
}

// GET /api/tenants/[slug]/subscription
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const tenant = await getOwnerTenant(params.slug)
    if (!tenant) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    if (tenant.subscription) {
      return NextResponse.json(tenant.subscription)
    }

    // No subscription record — return virtual subscription based on tenant plan
    const planPrices = await getPlanPricesTRY()
    const planEndsAt = tenant.planEndsAt ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    return NextResponse.json({
      id: null,
      tenantId: tenant.id,
      plan: tenant.plan,
      amount: planPrices[tenant.plan] ?? 450,
      currency: 'TRY',
      paymentProvider: null,
      paymentId: null,
      status: tenant.isActive ? 'ACTIVE' : 'EXPIRED',
      startDate: tenant.planStartedAt,
      endDate: planEndsAt,
      autoRenew: true,
    })
  } catch (err) {
    console.error('[GET /api/tenants/[slug]/subscription]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

const PatchSchema = z.object({
  autoRenew: z.boolean(),
})

// PATCH /api/tenants/[slug]/subscription — update autoRenew
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const tenant = await getOwnerTenant(params.slug)
    if (!tenant) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    if (!tenant.subscription) {
      return NextResponse.json({ error: 'Abonelik bulunamadı' }, { status: 404 })
    }

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

    const updated = await prisma.subscription.update({
      where: { id: tenant.subscription.id },
      data: { autoRenew: parsed.data.autoRenew },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PATCH /api/tenants/[slug]/subscription]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
