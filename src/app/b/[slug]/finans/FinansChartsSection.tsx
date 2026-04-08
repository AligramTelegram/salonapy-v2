'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import type { TransactionStats } from '@/hooks/useTransactions'

const PIE_COLORS = [
  '#7c3aed', '#a78bfa', '#6d28d9', '#c4b5fd',
  '#8b5cf6', '#ddd6fe', '#4c1d95',
]

interface Props {
  stats: TransactionStats
  activeTab: 'GELIR' | 'GIDER' | 'all'
}

export default function FinansChartsSection({ stats, activeTab }: Props) {
  const pieData = activeTab === 'GIDER' ? stats.expenseByCategory : stats.incomeByCategory

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Trend çizgi grafiği */}
      <div className="glass-card p-5 lg:col-span-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Son 6 Ay Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={stats.trend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, name: any) => [
                `₺${Number(value).toLocaleString('tr-TR')}`,
                name === 'income' ? 'Gelir' : 'Gider',
              ]}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }}
            />
            <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={2} dot={{ r: 3, fill: '#16a34a' }} name="Gelir" />
            <Line type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={2} dot={{ r: 3, fill: '#dc2626' }} name="Gider" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pasta grafik */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          {activeTab === 'GIDER' ? 'Gider' : 'Gelir'} Dağılımı
        </h3>
        {pieData.length === 0 ? (
          <div className="flex items-center justify-center h-[150px] text-sm text-gray-400">Veri yok</div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ fontSize: 11, color: '#6b7280' }}>{value}</span>}
              />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => `₺${Number(value).toLocaleString('tr-TR')}`}
                contentStyle={{ borderRadius: '12px', fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
