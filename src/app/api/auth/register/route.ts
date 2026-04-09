import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addDays } from 'date-fns'
import { sendWelcomeEmail } from '@/lib/resend'

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function getUniqueSlug(base: string): Promise<string> {
  let slug = base || 'isletme'
  let counter = 0
  while (true) {
    const existing = await prisma.tenant.findUnique({ where: { slug } })
    if (!existing) return slug
    counter++
    slug = `${base}-${counter}`
  }
}

const PAID_PLANS = ['PROFESYONEL', 'ISLETME']

export async function POST(request: Request) {
  try {
    const { supabaseId, email, name, businessName, phone, plan } = await request.json()

    if (!supabaseId || !email || !name || !businessName) {
      return NextResponse.json({ error: 'Eksik bilgi: supabaseId, email, name, businessName zorunlu' }, { status: 400 })
    }

    const isPaidPlan = PAID_PLANS.includes(plan)
    const baseSlug = generateSlug(businessName)
    const slug = await getUniqueSlug(baseSlug)

    const tenant = await prisma.tenant.create({
      data: {
        name: businessName,
        slug,
        email,
        phone: phone || null,
        // Ücretli planlar ödeme tamamlanana kadar inaktif başlar
        isActive: !isPaidPlan,
        plan: isPaidPlan ? plan : 'BASLANGIC',
        users: {
          create: {
            supabaseId,
            email,
            name,
            role: 'OWNER',
          },
        },
      },
      select: { id: true },
    })

    if (!isPaidPlan) {
      // BAŞLANGIÇ: 3 günlük ücretsiz deneme aboneliği oluştur
      const now = new Date()
      await prisma.subscription.create({
        data: {
          tenantId: tenant.id,
          plan: 'BASLANGIC',
          amount: 0,
          currency: 'TRY',
          paymentProvider: 'trial',
          status: 'TRIAL',
          startDate: now,
          endDate: addDays(now, 3),
          autoRenew: false,
        },
      })
    }
    // PROFESYONEL/İŞLETME: abonelik yok, ödeme sonrası oluşturulacak

    // Send welcome email (fire-and-forget — don't block registration on email failure)
    sendWelcomeEmail({
      to: email,
      ownerName: name,
      tenantName: businessName,
      slug,
      isTrial: !isPaidPlan,
    }).catch((err) => console.error('[register] Welcome email failed:', err))

    return NextResponse.json({ tenantSlug: slug })
  } catch (err) {
    console.error('[/api/auth/register]', err)
    return NextResponse.json({ error: 'Hesap oluşturulurken hata oluştu' }, { status: 500 })
  }
}
