import { NextRequest, NextResponse } from 'next/server'
import { resetMonthlySmsUsage } from '@/lib/cron/resetSmsUsage'

export const dynamic = 'force-dynamic'

/**
 * GET /api/cron/reset-sms — Aylık SMS kullanım sıfırlama
 *
 * Vercel Cron veya harici bir cron servisi tarafından çağrılır.
 * vercel.json örneği:
 *   { "crons": [{ "path": "/api/cron/reset-sms", "schedule": "0 0 1 * *" }] }
 *
 * Güvenlik: CRON_SECRET header'ı ile korunur.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  try {
    const { count } = await resetMonthlySmsUsage()
    return NextResponse.json({ success: true, reset: count })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
