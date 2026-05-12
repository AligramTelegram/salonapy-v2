import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<string, string> = {
  BEKLIYOR: 'Bekliyor',
  ONAYLANDI: 'Onaylandı',
  TAMAMLANDI: 'Tamamlandı',
  IPTAL: 'İptal',
  GELMEDI: 'Gelmedi',
}

export async function GET(req: Request) {
  try {
    let user: { id: string } | null = null

    // Bearer token (mobil) kontrolü
    const authHeader = req.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7)
      const { createClient: createServiceClient } = await import('@supabase/supabase-js')
      const admin = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      )
      const { data } = await admin.auth.getUser(token)
      user = data.user
    }

    // Cookie (web) kontrolü
    if (!user) {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      user = data.user
    }

    if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      select: { tenantId: true },
    })
    if (!dbUser) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })

    const appointments = await prisma.appointment.findMany({
      where: { tenantId: dbUser.tenantId },
      include: {
        customer: { select: { name: true } },
        service: { select: { name: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 12,
    })

    const notifications = appointments.map((a) => ({
      id: a.id,
      customerName: a.customer.name,
      serviceName: a.service.name,
      status: a.status,
      statusLabel: STATUS_LABELS[a.status] ?? a.status,
      startTime: a.startTime,
      date: a.date.toISOString(),
      timeAgo: formatDistanceToNow(new Date(a.updatedAt), {
        addSuffix: true,
        locale: tr,
      }),
      isNew: Date.now() - new Date(a.updatedAt).getTime() < 24 * 60 * 60 * 1000,
    }))

    return NextResponse.json(notifications)
  } catch (err) {
    console.error('[GET /api/notifications]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
