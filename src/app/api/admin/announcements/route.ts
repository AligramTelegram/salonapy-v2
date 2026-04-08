import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const CreateSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(5000),
  type: z.enum(['INFO', 'WARNING', 'SUCCESS']).default('INFO'),
  isActive: z.boolean().default(true),
  targetPlan: z.string().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
})

// GET /api/admin/announcements
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = 20
  const skip = (page - 1) * limit

  const [announcements, total] = await Promise.all([
    prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { _count: { select: { dismissals: true } } },
    }),
    prisma.announcement.count(),
  ])

  return NextResponse.json({ announcements, total, totalPages: Math.ceil(total / limit) })
}

// POST /api/admin/announcements
export async function POST(request: NextRequest) {
  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const parsed = CreateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const { title, content, type, isActive, targetPlan, expiresAt } = parsed.data

  const announcement = await prisma.announcement.create({
    data: {
      title,
      content,
      type,
      isActive,
      targetPlan: targetPlan ?? null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  })

  return NextResponse.json(announcement, { status: 201 })
}
