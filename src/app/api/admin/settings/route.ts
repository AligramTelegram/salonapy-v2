import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { invalidatePlansCache } from '@/lib/plans'

export const dynamic = 'force-dynamic'

// GET /api/admin/settings — returns all settings as { key: value } map
export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany()
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))
    return NextResponse.json(map)
  } catch (err) {
    console.error('[GET /api/admin/settings]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// POST /api/admin/settings — upsert multiple settings
// Body: { settings: { key: string; value: string; category: string; description?: string }[] }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { settings } = body as {
      settings: { key: string; value: string; category: string; description?: string }[]
    }

    if (!Array.isArray(settings) || settings.length === 0) {
      return NextResponse.json({ error: 'settings dizisi zorunlu' }, { status: 400 })
    }

    // Upsert each setting
    await Promise.all(
      settings.map((s) =>
        prisma.siteSetting.upsert({
          where: { key: s.key },
          create: {
            key: s.key,
            value: s.value,
            category: s.category,
            description: s.description,
          },
          update: {
            value: s.value,
          },
        })
      )
    )

    // Plan config değişmişse cache'i temizle
    const hasPlanConfig = settings.some((s) => s.key.startsWith('plan_config_'))
    if (hasPlanConfig) invalidatePlansCache()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[POST /api/admin/settings]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
