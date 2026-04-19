import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const purchases = await prisma.transaction.findMany({
      where: { category: 'sms_paketi' },
      include: {
        tenant: { select: { id: true, name: true, slug: true, plan: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({ purchases })
  } catch (err) {
    console.error('[admin/sms-purchases]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
