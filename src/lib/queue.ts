import { Queue } from 'bullmq'

export interface ReminderJobData {
  appointmentId: string
  tenantId: string
  type: 'reminder-24h' | 'reminder-1h'
  customerPhone: string
}

// BullMQ requires REDIS_URL in format: rediss://default:PASSWORD@HOST:PORT
// Upstash provides this in the Redis CLI section of their console.
// This is separate from UPSTASH_REDIS_REST_URL (which is for HTTP REST client).

function getRedisConnection(): { host: string; port: number; password?: string; tls?: object } | null {
  const url = process.env.REDIS_URL
  if (!url) return null
  try {
    const parsed = new URL(url)
    return {
      host: parsed.hostname,
      port: parseInt(parsed.port) || 6379,
      password: parsed.password || undefined,
      ...(url.startsWith('rediss://') ? { tls: {} } : {}),
    }
  } catch {
    console.error('[Queue] Invalid REDIS_URL')
    return null
  }
}

let _queue: Queue<ReminderJobData> | null = null

function getQueue(): Queue<ReminderJobData> | null {
  const conn = getRedisConnection()
  if (!conn) return null

  if (!_queue) {
    _queue = new Queue<ReminderJobData>('appointmentReminders', {
      connection: conn,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 },
      },
    })
  }
  return _queue
}

/**
 * Add a reminder job to the queue.
 * If queue is not configured (no REDIS_URL), runs in mock mode and logs to console.
 * Returns the job ID or a mock ID.
 */
export async function addReminderJob(
  data: ReminderJobData,
  delayMs: number
): Promise<string | null> {
  const queue = getQueue()

  if (!queue) {
    console.log(
      `[QUEUE MOCK] Job eklendi: ${data.type} | appointmentId: ${data.appointmentId} | delay: ${Math.round(delayMs / 1000 / 60)}dk`
    )
    return `mock-${Date.now()}`
  }

  const job = await queue.add(data.type, data, { delay: delayMs })
  console.log(`[Queue] Job eklendi: ${job.id} | ${data.type} | ${Math.round(delayMs / 1000 / 60)}dk sonra`)
  return job.id ?? null
}

export const isQueueConfigured = !!process.env.REDIS_URL
