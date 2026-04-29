import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getTenantIdFromRequest } from '@/lib/getTenantId'
import { checkSubscription } from '@/lib/checkSubscription'

export const dynamic = 'force-dynamic'

const CreateServiceSchema = z.object({
  name: z.string().min(1, 'Hizmet adı zorunlu'),
  description: z.string().optional(),
  duration: z.number().int().positive(),
  price: z.number().positive(),
  color: z.string(),
  isActive: z.boolean().optional(),
  staffIds: z.array(z.string()).optional(),
})

// GET /api/services — used by appointment modal (active only) and services page (?all=true)
export async function GET(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { searchParams } = request.nextUrl
  const all = searchParams.get('all') === 'true'

  const services = await prisma.service.findMany({
    where: { tenantId, ...(all ? {} : { isActive: true }) },
    select: {
      id: true,
      name: true,
      description: true,
      duration: true,
      price: true,
      color: true,
      isActive: true,
      createdAt: true,
      staff: { select: { id: true, name: true, color: true, avatarUrl: true } },
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(services)
}

// POST /api/services
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

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const parsed = CreateServiceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { staffIds, isActive, ...fields } = parsed.data

  const service = await prisma.service.create({
    data: {
      tenantId,
      ...fields,
      isActive: isActive ?? true,
      ...(staffIds?.length
        ? { staff: { connect: staffIds.map((id) => ({ id })) } }
        : {}),
    },
    include: {
      staff: { select: { id: true, name: true, color: true, avatarUrl: true } },
    },
  })

  return NextResponse.json(service, { status: 201 })
}
