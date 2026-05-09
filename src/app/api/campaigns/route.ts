import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantIdFromRequest } from '@/lib/getTenantId'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const CreateCampaignSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
  segment: z.enum(['ALL', 'VIP', 'KAYIP', 'RISK', 'YENI']),
})

export async function GET(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const campaigns = await prisma.campaign.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(campaigns)
}

export async function POST(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const body = await request.json()
  const parsed = CreateCampaignSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const campaign = await prisma.campaign.create({
    data: {
      tenantId,
      subject: parsed.data.subject,
      body: parsed.data.body,
      segment: parsed.data.segment,
      status: 'QUEUED',
      recipientCount: 0,
      sentAt: new Date(),
    },
  })

  return NextResponse.json(campaign, { status: 201 })
}
