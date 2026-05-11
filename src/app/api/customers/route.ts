import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getTenantId, getTenantIdFromRequest } from '@/lib/getTenantId'
import { checkSubscription } from '@/lib/checkSubscription'
import { getLimit } from '@/lib/plan-features'

export const dynamic = 'force-dynamic'

const CreateCustomerSchema = z.object({
  name: z.string().min(1, 'Ad zorunlu'),
  phone: z.string().min(1, 'Telefon zorunlu'),
  email: z.string().email().optional().or(z.literal('')),
  notes: z.string().optional(),
  birthday: z.string().optional().nullable(),
})

// GET /api/customers?q=xxx
export async function GET(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { searchParams } = request.nextUrl
  const q = searchParams.get('q')?.trim()

  const customers = await prisma.customer.findMany({
    where: {
      tenantId,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { phone: { contains: q } },
              { email: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      notes: true,
      birthday: true,
      totalVisits: true,
      totalSpent: true,
      lastVisitAt: true,
      createdAt: true,
    },
    orderBy: { name: 'asc' },
    take: 100,
  })

  return NextResponse.json(customers)
}

// POST /api/customers
export async function POST(request: NextRequest) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  try {
    await checkSubscription(tenantId)
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'SUBSCRIPTION_REQUIRED') {
      return NextResponse.json({ error: 'Paket yükseltmesi gerekli' }, { status: 402 })
    }
    throw e
  }

  // Müşteri limiti kontrolü (deneme süresinde ISLETME limitleri geçerli)
  const tenantForLimit = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { plan: true, subscription: { select: { status: true } } },
  })
  if (tenantForLimit) {
    const subStatus = tenantForLimit.subscription?.status ?? null
    const maxCustomers = getLimit(tenantForLimit.plan, 'maxCustomers', subStatus)
    const currentCount = await prisma.customer.count({ where: { tenantId } })
    if (currentCount >= maxCustomers) {
      return NextResponse.json(
        { error: `Mevcut paketinizde en fazla ${maxCustomers} müşteri ekleyebilirsiniz. Daha fazlası için paketinizi yükseltin.` },
        { status: 403 }
      )
    }
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const parsed = CreateCustomerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { email, birthday, ...rest } = parsed.data

  const existing = await prisma.customer.findUnique({
    where: { tenantId_phone: { tenantId, phone: rest.phone } },
  })
  if (existing) {
    return NextResponse.json({ error: 'Bu telefon numarası zaten kayıtlı' }, { status: 409 })
  }

  const customer = await prisma.customer.create({
    data: {
      tenantId,
      ...rest,
      email: email || null,
      birthday: birthday ? new Date(birthday) : null,
    },
  })

  return NextResponse.json(customer, { status: 201 })
}
