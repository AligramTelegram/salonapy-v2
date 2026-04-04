import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const CancelSchema = z.object({
  tenantSlug: z.string().min(1),
})

// POST /api/payments/iyzico/cancel — Abonelik iptal
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { tenantId: true },
  })
  if (!dbUser) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 403 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const parsed = CancelSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  // Verify ownership
  const tenant = await prisma.tenant.findFirst({
    where: { slug: parsed.data.tenantSlug, id: dbUser.tenantId },
    select: { id: true, subscription: { select: { id: true, paymentId: true, status: true } } },
  })
  if (!tenant) return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 404 })

  if (!tenant.subscription || tenant.subscription.status === 'CANCELLED') {
    return NextResponse.json({ error: 'Aktif abonelik bulunamadı' }, { status: 400 })
  }

  // Update subscription status in DB
  // Note: For recurring İyzico subscriptions, also call cancelIyzicoSubscription(paymentId)
  // For manual monthly payments, DB update is sufficient.
  await prisma.subscription.update({
    where: { id: tenant.subscription.id },
    data: {
      status: 'CANCELLED',
      autoRenew: false,
    },
  })

  console.log(`[Cancel] Abonelik iptal edildi: tenant=${tenant.id}`)
  return NextResponse.json({ success: true })
}
