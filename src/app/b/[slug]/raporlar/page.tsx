'use client'

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  parseISO,
} from 'date-fns'
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Download,
  Loader2,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { toast } from 'sonner'

// --- Types ---
interface MonthlyPoint {
  month: string
  income: number
  expense: number
  count: number
}

interface ServiceStat {
  name: string
  count: number
  revenue: number
  color: string
}

interface StaffStat {
  name: string
  count: number
  revenue: number
}

interface StatusStat {
  status: string
  label: string
  count: number
}

interface ReportSummary {
  totalAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  totalRevenue: number
  totalExpense: number
  avgAppointmentValue: number
  topService: { name: string; count: number } | null
  monthlyTrend: MonthlyPoint[]
  serviceDistribution: ServiceStat[]
  staffPerformance: StaffStat[]
  statusDistribution: StatusStat[]
}

// --- Period ---
type Period = 'month' | 'quarter' | 'half' | 'year' | 'custom'

const PERIOD_OPTIONS: { key: Period; label: string }[] = [
  { key: 'month', label: 'Bu Ay' },
  { key: 'quarter', label: 'Son 3 Ay' },
  { key: 'half', label: 'Son 6 Ay' },
  { key: 'year', label: 'Bu Yıl' },
  { key: 'custom', label: 'Özel' },
]

function getDateRange(period: Period, customStart: string, customEnd: string) {
  const today = new Date()
  switch (period) {
    case 'month':
      return { startDate: startOfMonth(today), endDate: endOfMonth(today) }
    case 'quarter':
      return {
        startDate: startOfMonth(subMonths(today, 2)),
        endDate: endOfMonth(today),
      }
    case 'half':
      return {
        startDate: startOfMonth(subMonths(today, 5)),
        endDate: endOfMonth(today),
      }
    case 'year':
      return { startDate: startOfYear(today), endDate: endOfYear(today) }
    case 'custom':
      return {
        startDate: customStart ? parseISO(customStart) : startOfMonth(today),
        endDate: customEnd ? parseISO(customEnd) : endOfMonth(today),
      }
  }
}

// --- Color palette ---
const CHART_COLORS = [
  '#7c3aed',
  '#8b5cf6',
  '#a78bfa',
  '#6d28d9',
  '#c4b5fd',
  '#4c1d95',
  '#ddd6fe',
]

const STATUS_COLORS: Record<string, string> = {
  TAMAMLANDI: '#16a34a',
  ONAYLANDI: '#2563eb',
  BEKLIYOR: '#d97706',
  IPTAL: '#9ca3af',
  GELMEDI: '#dc2626',
}

// --- Stat card ---
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconBg,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  iconBg: string
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

// --- Custom tooltip ---
function CurrencyTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map(
        (p: { name: string; value: number; color: string }, i: number) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}:{' '}
            {p.name === 'Randevu'
              ? p.value
              : `₺${Number(p.value).toLocaleString('tr-TR')}`}
          </p>
        )
      )}
    </div>
  )
}

// --- Main page ---
export default function RaporlarPage() {
  const [period, setPeriod] = useState<Period>('month')
  const [customStart, setCustomStart] = useState(
    format(startOfMonth(new Date()), 'yyyy-MM-dd')
  )
  const [customEnd, setCustomEnd] = useState(
    format(endOfMonth(new Date()), 'yyyy-MM-dd')
  )
  const [data, setData] = useState<ReportSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

  const fetchReports = useCallback(async () => {
    const { startDate, endDate } = getDateRange(period, customStart, customEnd)
    setLoading(true)
    try {
      const { data: summary } = await axios.get<ReportSummary>(
        '/api/reports/summary',
        {
          params: {
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: format(endDate, 'yyyy-MM-dd'),
          },
        }
      )
      setData(summary)
    } catch {
      toast.error('Raporlar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }, [period, customStart, customEnd])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  async function exportCSV() {
    const { startDate, endDate } = getDateRange(period, customStart, customEnd)
    setExporting(true)
    try {
      const response = await axios.get('/api/reports/export', {
        params: {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
        },
        responseType: 'blob',
      })
      const url = URL.createObjectURL(response.data as Blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `raporlar-${format(startDate, 'yyyy-MM-dd')}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      toast.error('CSV export başarısız')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Raporlar</h1>
          <p className="text-sm text-gray-500 mt-1">Randevu ve gelir analizleri</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={exporting || loading || !data}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-60 self-start sm:self-auto"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          CSV İndir
        </button>
      </div>

      {/* Dönem seçici */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setPeriod(opt.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                period === opt.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Özel tarih aralığı */}
        {period === 'custom' && (
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-400"
            />
            <span className="text-gray-400 text-sm">—</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-400"
            />
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
        </div>
      )}

      {!loading && data && (
        <>
          {/* Stats kartları */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Toplam Randevu"
              value={data.totalAppointments.toString()}
              sub={`${data.completedAppointments} tamamlandı`}
              icon={Calendar}
              iconBg="bg-purple-100 text-purple-600"
            />
            <StatCard
              label="Toplam Gelir"
              value={`₺${data.totalRevenue.toLocaleString('tr-TR')}`}
              sub={`Net: ₺${(data.totalRevenue - data.totalExpense).toLocaleString('tr-TR')}`}
              icon={TrendingUp}
              iconBg="bg-green-100 text-green-600"
            />
            <StatCard
              label="Toplam Gider"
              value={`₺${data.totalExpense.toLocaleString('tr-TR')}`}
              sub="Gider işlemleri"
              icon={TrendingDown}
              iconBg="bg-red-100 text-red-500"
            />
            <StatCard
              label="Ort. Randevu Değeri"
              value={`₺${Math.round(data.avgAppointmentValue).toLocaleString('tr-TR')}`}
              sub="Tamamlanan başına"
              icon={BarChart2}
              iconBg="bg-blue-100 text-blue-600"
            />
          </div>

          {/* Grafik 1 — Aylık Gelir-Gider Trendi */}
          {data.monthlyTrend.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Aylık Gelir-Gider Trendi
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={data.monthlyTrend}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span style={{ fontSize: 11, color: '#6b7280' }}>{value}</span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    name="Gelir"
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#16a34a', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    name="Gider"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }}
                    strokeDasharray="5 3"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Grafik 2 + 3 yan yana */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Hizmet Dağılımı - Pie */}
            {data.serviceDistribution.length > 0 && (
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Hizmet Dağılımı
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={data.serviceDistribution}
                      cx="50%"
                      cy="45%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="count"
                      nameKey="name"
                    >
                      {data.serviceDistribution.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span style={{ fontSize: 11, color: '#6b7280' }}>{value}</span>
                      )}
                    />
                    <Tooltip
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={(value: any, name: any) => [
                        `${value} randevu`,
                        name,
                      ]}
                      contentStyle={{ borderRadius: '12px', fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Randevu Durumları - Pie */}
            {data.statusDistribution.length > 0 && (
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Randevu Durumları
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={data.statusDistribution}
                      cx="50%"
                      cy="45%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="count"
                      nameKey="label"
                    >
                      {data.statusDistribution.map((entry) => (
                        <Cell
                          key={entry.status}
                          fill={STATUS_COLORS[entry.status] ?? '#9ca3af'}
                        />
                      ))}
                    </Pie>
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span style={{ fontSize: 11, color: '#6b7280' }}>{value}</span>
                      )}
                    />
                    <Tooltip
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={(value: any, name: any) => [
                        `${value} randevu`,
                        name,
                      ]}
                      contentStyle={{ borderRadius: '12px', fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Grafik 4 — Personel Performansı - Bar */}
          {data.staffPerformance.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Personel Performansı
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={data.staffPerformance}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Bar
                    dataKey="revenue"
                    name="Gelir"
                    fill="#7c3aed"
                    radius={[6, 6, 0, 0]}
                  >
                    {data.staffPerformance.map((_, index) => (
                      <Cell
                        key={index}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Personel tablosu */}
              <div className="mt-4 divide-y divide-gray-50">
                {data.staffPerformance.map((s, i) => (
                  <div
                    key={s.name}
                    className="flex items-center gap-3 py-2.5"
                  >
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          CHART_COLORS[i % CHART_COLORS.length],
                      }}
                    />
                    <span className="flex-1 text-sm font-medium text-gray-700">
                      {s.name}
                    </span>
                    <span className="text-xs text-gray-400">{s.count} randevu</span>
                    <span className="text-sm font-semibold text-gray-800">
                      ₺{s.revenue.toLocaleString('tr-TR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Boş durum */}
          {data.totalAppointments === 0 && (
            <div className="glass-card p-14 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
                <BarChart2 className="h-8 w-8 text-purple-300" />
              </div>
              <h3 className="font-semibold text-gray-700 mb-1">Veri yok</h3>
              <p className="text-sm text-gray-400">
                Seçilen tarih aralığında randevu bulunamadı
              </p>
            </div>
          )}

          {/* Özet tablo */}
          {data.totalAppointments > 0 && (
            <div className="glass-card overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-sm font-semibold text-gray-700">Özet</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { label: 'Toplam Randevu', value: data.totalAppointments, color: '' },
                  { label: 'Tamamlandı', value: data.completedAppointments, color: '' },
                  { label: 'İptal', value: data.cancelledAppointments, color: '' },
                  { label: 'Toplam Gelir', value: `₺${data.totalRevenue.toLocaleString('tr-TR')}`, color: 'text-green-600' },
                  { label: 'Toplam Gider', value: `₺${data.totalExpense.toLocaleString('tr-TR')}`, color: 'text-red-500' },
                  { label: 'Net Kar/Zarar', value: `₺${(data.totalRevenue - data.totalExpense).toLocaleString('tr-TR')}`, color: data.totalRevenue >= data.totalExpense ? 'text-green-600' : 'text-red-500' },
                  { label: 'Ort. Randevu Değeri', value: `₺${Math.round(data.avgAppointmentValue).toLocaleString('tr-TR')}`, color: '' },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <span className="text-sm text-gray-500">{row.label}</span>
                    <span className={`text-sm font-semibold ${row.color || 'text-gray-800'}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* İlk yüklemede veri yoksa */}
      {!loading && !data && (
        <div className="glass-card p-14 flex flex-col items-center justify-center text-center">
          <Users className="h-12 w-12 text-gray-200 mb-3" />
          <p className="text-sm text-gray-400">Raporlar yüklenemedi</p>
        </div>
      )}
    </div>
  )
}
