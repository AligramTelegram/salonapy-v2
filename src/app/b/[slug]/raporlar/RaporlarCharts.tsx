'use client'

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

interface MonthlyPoint { month: string; income: number; expense: number; count: number }
interface ServiceStat { name: string; count: number; revenue: number; color: string }
interface StaffStat { name: string; count: number; revenue: number }
interface StatusStat { status: string; label: string; count: number }

interface ReportData {
  monthlyTrend: MonthlyPoint[]
  serviceDistribution: ServiceStat[]
  staffPerformance: StaffStat[]
  statusDistribution: StatusStat[]
}

const CHART_COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#6d28d9', '#c4b5fd', '#4c1d95', '#ddd6fe']
const STATUS_COLORS: Record<string, string> = {
  TAMAMLANDI: '#16a34a', ONAYLANDI: '#2563eb', BEKLIYOR: '#d97706', IPTAL: '#9ca3af', GELMEDI: '#dc2626',
}

function CurrencyTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: ₺{Number(p.value).toLocaleString('tr-TR')}
        </p>
      ))}
    </div>
  )
}

export default function RaporlarCharts({ data }: { data: ReportData }) {
  return (
    <>
      {/* Grafik 1 — Aylık Gelir-Gider Trendi */}
      {data.monthlyTrend.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Aylık Gelir-Gider Trendi</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.monthlyTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CurrencyTooltip />} />
              <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: 11, color: '#6b7280' }}>{value}</span>} />
              <Line type="monotone" dataKey="income" name="Gelir" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4, fill: '#16a34a', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="expense" name="Gider" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }} strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Grafik 2 + 3 yan yana */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {data.serviceDistribution.length > 0 && (
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Hizmet Dağılımı</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.serviceDistribution} cx="50%" cy="45%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="count" nameKey="name">
                  {data.serviceDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: 11, color: '#6b7280' }}>{value}</span>} />
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <Tooltip formatter={(value: any, name: any) => [`${value} randevu`, name]} contentStyle={{ borderRadius: '12px', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {data.statusDistribution.length > 0 && (
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Randevu Durumları</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.statusDistribution} cx="50%" cy="45%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="count" nameKey="label">
                  {data.statusDistribution.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? '#9ca3af'} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: 11, color: '#6b7280' }}>{value}</span>} />
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <Tooltip formatter={(value: any, name: any) => [`${value} randevu`, name]} contentStyle={{ borderRadius: '12px', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Grafik 4 — Personel Performansı */}
      {data.staffPerformance.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Personel Performansı</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.staffPerformance} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CurrencyTooltip />} />
              <Bar dataKey="revenue" name="Gelir" fill="#7c3aed" radius={[6, 6, 0, 0]}>
                {data.staffPerformance.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 divide-y divide-gray-50">
            {data.staffPerformance.map((s, i) => (
              <div key={s.name} className="flex items-center gap-3 py-2.5">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="flex-1 text-sm font-medium text-gray-700">{s.name}</span>
                <span className="text-xs text-gray-400">{s.count} randevu</span>
                <span className="text-sm font-semibold text-gray-800">₺{s.revenue.toLocaleString('tr-TR')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
