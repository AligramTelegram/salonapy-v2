'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  month: string
  revenue: number
}

interface AdminRevenueChartProps {
  data: DataPoint[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CurrencyTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-gray-900 border border-gray-700 px-3 py-2 shadow-xl text-xs">
      <p className="font-bold text-gray-300 mb-1">{label}</p>
      <p className="font-bold text-emerald-400">
        ₺{(payload[0].value as number).toLocaleString('tr-TR')}
      </p>
    </div>
  )
}

export function AdminRevenueChart({ data }: AdminRevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.5} />
        <XAxis
          dataKey="month"
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}K`}
          width={50}
        />
        <Tooltip content={<CurrencyTooltip />} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#10b981"
          strokeWidth={2.5}
          dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
