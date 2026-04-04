import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getTenantId } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

const CreatePackageSchema = z.object({
  name: z.string().min(1, 'Paket adı zorunlu'),
  description: z.string().optional(),
  serviceId: z.string().min(1, 'Hizmet zorunlu'),
  sessions: z.number().int().positive('Seans sayısı pozitif olmalı'),
  price: z.number().positive('Fiyat pozitif olmalı'),
  validDays: z.number().int().positive().optional().nullable(),
  isActive: z.boolean().optional(),
})

// GET /api/packages
export async function GET() {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const packages = await prisma.package.findMany({
    where: { tenantId },
    include: {
      service: { select: { id: true, name: true, color: true, duration: true } },
      _count: { select: { customerPackages: { where: { isActive: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(packages)
}

// POST /api/packages
export async function POST(request: NextRequest) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const parsed = CreatePackageSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  // Verify service belongs to this tenant
  const service = await prisma.service.findFirst({
    where: { id: parsed.data.serviceId, tenantId },
  })
  if (!service) return NextResponse.json({ error: 'Hizmet bulunamadı' }, { status: 404 })

  const pkg = await prisma.package.create({
    data: { tenantId, ...parsed.data },
    include: {
      service: { select: { id: true, name: true, color: true, duration: true } },
      _count: { select: { customerPackages: { where: { isActive: true } } } },
    },
  })

  return NextResponse.json(pkg, { status: 201 })
}
