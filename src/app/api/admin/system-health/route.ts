import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminSecret } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// GET /api/admin/system-health
export async function GET(request: NextRequest) {
  const authError = await verifyAdminSecret(request)
  if (authError) return authError
  // DB check
  const dbStart = Date.now()
  let dbStatus: 'ok' | 'error' = 'ok'
  let dbError: string | null = null
  let counts = {
    tenants: 0,
    users: 0,
    staff: 0,
    appointments: 0,
    customers: 0,
    transactions: 0,
    notifications: 0,
  }

  try {
    const [tenants, users, staff, appointments, customers, transactions, notifications] =
      await Promise.all([
        prisma.tenant.count(),
        prisma.user.count(),
        prisma.staff.count(),
        prisma.appointment.count(),
        prisma.customer.count(),
        prisma.transaction.count(),
        prisma.notification.count(),
      ])
    counts = { tenants, users, staff, appointments, customers, transactions, notifications }
  } catch (err) {
    dbStatus = 'error'
    dbError = err instanceof Error ? err.message : 'Unknown error'
  }

  const dbLatency = Date.now() - dbStart

  // Redis check (env vars present?)
  const redisConfigured = !!(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  )
  const redisStatus = redisConfigured ? 'configured' : 'not_configured'

  // BullMQ requires Redis
  const queueStatus = redisConfigured ? 'configured' : 'not_configured'

  const uptimeSeconds = Math.floor(process.uptime())

  return NextResponse.json({
    db: { status: dbStatus, latency: dbLatency, error: dbError },
    redis: { status: redisStatus },
    queue: { status: queueStatus },
    uptime: uptimeSeconds,
    counts,
    timestamp: new Date().toISOString(),
  })
}
