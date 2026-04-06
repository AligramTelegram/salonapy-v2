import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const SMS_PACKS = [
  { amount: 100, price: 120 },
  { amount: 250, price: 300 },
  { amount: 500, price: 600 },
  { amount: 1000, price: 1200 },
]

// POST /api/payments/sms-checkout
// Body: { amount: number, tenantSlug: string }
// Şimdilik mock — ileride İyzico entegrasyonu
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
    }

    const body = await req.json()
    const { amount, tenantSlug } = body

    // Geçerli paket mi?
    const pack = SMS_PACKS.find((p) => p.amount === amount)
    if (!pack) {
      return NextResponse.json({ error: 'Geçersiz paket' }, { status: 400 })
    }

    // Tenant'ı doğrula
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { tenant: { select: { id: true, slug: true } } },
    })
    if (!dbUser || dbUser.tenant.slug !== tenantSlug) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
    }

    // Mock: smsCredits'i direkt artır (ödeme entegrasyonu sonraya)
    await prisma.tenant.update({
      where: { id: dbUser.tenant.id },
      data: { smsCredits: { increment: pack.amount } },
    })

    return NextResponse.json({ success: true, added: pack.amount })
  } catch (err) {
    console.error('[POST /api/payments/sms-checkout]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
