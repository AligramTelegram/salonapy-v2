export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import {
  Database, Server, Wifi, Clock, WifiOff, CheckCircle2, XCircle, Activity,
} from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

async function getSystemHealth() {
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

  const redisConfigured = !!(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  )

  const uptimeSeconds = Math.floor(process.uptime())
  const uptimeHours = Math.floor(uptimeSeconds / 3600)
  const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60)

  return {
    dbStatus,
    dbLatency,
    dbError,
    redisConfigured,
    counts,
    uptimeSeconds,
    uptimeHours,
    uptimeMinutes,
    timestamp: new Date(),
  }
}

export default async function SistemPage() {
  const {
    dbStatus, dbLatency, dbError, redisConfigured,
    counts, uptimeHours, uptimeMinutes, timestamp,
  } = await getSystemHealth()

  const DB_COUNTS = [
    { label: 'İşletmeler', key: 'tenants', color: 'text-purple-600' },
    { label: 'Kullanıcılar', key: 'users', color: 'text-blue-600' },
    { label: 'Personel', key: 'staff', color: 'text-emerald-600' },
    { label: 'Randevular', key: 'appointments', color: 'text-orange-600' },
    { label: 'Müşteriler', key: 'customers', color: 'text-pink-600' },
    { label: 'İşlemler', key: 'transactions', color: 'text-amber-600' },
    { label: 'Bildirimler', key: 'notifications', color: 'text-cyan-600' },
  ] as const

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Sistem Sağlığı</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Son kontrol: {format(timestamp, 'HH:mm:ss', { locale: tr })}
          </p>
        </div>
        <a
          href="/admin/sistem"
          className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 bg-purple-50 border border-purple-200 rounded-lg px-3 py-1.5 transition-colors"
        >
          <Activity className="h-3.5 w-3.5" />
          Yenile
        </a>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Database */}
        <div className={`rounded-2xl p-4 shadow-sm border ${
          dbStatus === 'ok' ? 'bg-white border-gray-100' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start justify-between">
            <div className={`h-10 w-10 rounded-xl ${dbStatus === 'ok' ? 'bg-emerald-100' : 'bg-red-100'} flex items-center justify-center`}>
              <Database className={`h-5 w-5 ${dbStatus === 'ok' ? 'text-emerald-600' : 'text-red-600'}`} />
            </div>
            {dbStatus === 'ok' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
            )}
          </div>
          <p className="text-sm font-bold text-gray-900 mt-3">PostgreSQL</p>
          <p className={`text-xs font-semibold mt-0.5 ${dbStatus === 'ok' ? 'text-emerald-600' : 'text-red-600'}`}>
            {dbStatus === 'ok' ? `Bağlı · ${dbLatency}ms` : 'Bağlantı Hatası'}
          </p>
          {dbError && (
            <p className="text-[10px] text-red-500 mt-1 font-mono truncate">{dbError}</p>
          )}
        </div>

        {/* Redis */}
        <div className={`rounded-2xl p-4 shadow-sm border ${
          redisConfigured ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-start justify-between">
            <div className={`h-10 w-10 rounded-xl ${redisConfigured ? 'bg-orange-100' : 'bg-gray-100'} flex items-center justify-center`}>
              {redisConfigured ? (
                <Wifi className="h-5 w-5 text-orange-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-gray-400" />
              )}
            </div>
            {redisConfigured ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
            ) : (
              <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center mt-0.5">
                <span className="text-[8px] text-gray-500">—</span>
              </div>
            )}
          </div>
          <p className="text-sm font-bold text-gray-900 mt-3">Redis (Upstash)</p>
          <p className={`text-xs font-semibold mt-0.5 ${redisConfigured ? 'text-emerald-600' : 'text-gray-400'}`}>
            {redisConfigured ? 'Yapılandırıldı' : 'Yapılandırılmadı'}
          </p>
          {!redisConfigured && (
            <p className="text-[10px] text-gray-400 mt-1">Session 25'te eklenecek</p>
          )}
        </div>

        {/* Uptime */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <Server className="h-5 w-5 text-gray-300 mt-0.5" />
          </div>
          <p className="text-sm font-bold text-gray-900 mt-3">Server Uptime</p>
          <p className="text-xs font-semibold text-blue-600 mt-0.5">
            {uptimeHours}sa {uptimeMinutes}dk çalışıyor
          </p>
        </div>
      </div>

      {/* DB stats */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Veritabanı İstatistikleri</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {DB_COUNTS.map(({ label, key, color }) => (
            <div key={key} className="rounded-xl bg-gray-50 p-3 text-center">
              <p className={`text-lg font-bold ${color}`}>{counts[key].toLocaleString('tr-TR')}</p>
              <p className="text-[11px] font-semibold text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Queue status */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Queue Durumu (BullMQ)</h2>
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-center">
          <WifiOff className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-500">BullMQ Yapılandırılmadı</p>
          <p className="text-xs text-gray-400 mt-1">Redis bağlantısı gereklidir — Session 25'te aktif olacak</p>
        </div>
      </div>

      {/* Env check */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Servis Durumları</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { label: 'Supabase URL', configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL },
            { label: 'Supabase Anon Key', configured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
            { label: 'Service Role Key', configured: !!process.env.SUPABASE_SERVICE_ROLE_KEY },
            { label: 'Database URL', configured: !!process.env.DATABASE_URL },
            { label: 'Upstash Redis', configured: !!process.env.UPSTASH_REDIS_REST_URL },
            { label: 'WhatsApp Token', configured: !!process.env.WHATSAPP_ACCESS_TOKEN },
            { label: 'İyzico API Key', configured: !!process.env.IYZICO_API_KEY },
            { label: 'Resend API Key', configured: !!process.env.RESEND_API_KEY },
          ].map(({ label, configured }) => (
            <div
              key={label}
              className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                configured ? 'bg-emerald-50' : 'bg-gray-50'
              }`}
            >
              <span className="text-xs font-semibold text-gray-700">{label}</span>
              {configured ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
