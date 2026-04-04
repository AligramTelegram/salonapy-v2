import { NextRequest, NextResponse } from 'next/server'
import { runTrialReminders } from '@/lib/cron/trialReminders'

export const dynamic = 'force-dynamic'

// GET /api/cron/trial-reminders
// Called daily by Vercel Cron. Protected by CRON_SECRET header.
export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-cron-secret')
  const cronSecret = process.env.CRON_SECRET

  // In production, require CRON_SECRET. In dev (no secret set), allow.
  if (cronSecret && secret !== cronSecret) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  try {
    const result = await runTrialReminders()
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    console.error('[/api/cron/trial-reminders]', err)
    return NextResponse.json({ error: 'Cron job başarısız' }, { status: 500 })
  }
}
