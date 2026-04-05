'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import {
  useTransactions,
  useTransactionStats,
  useDeleteTransaction,
  type Transaction,
  type Period,
} from '@/hooks/useTransactions'
import { TransactionModal } from '@/components/dashboard/TransactionModal'

const PIE_COLORS = [
  '#7c3aed', '#a78bfa', '#6d28d9', '#c4b5fd',
  '#8b5cf6', '#ddd6fe', '#4c1d95',
]

const PERIOD_LABELS: Record<Period, string> = {
  month: 'Bu Ay',
  quarter: 'Son 3 Ay',
  year: 'Bu Yıl',
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string
  value: string
  icon: React.ElementType
  color: string
  sub?: string
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function TransactionRow({
  tx,
  onEdit,
}: {
  tx: Transaction
  onEdit: (t: Transaction) => void
}) {
  const { mutateAsync: del, isPending } = useDeleteTransaction()

  async function handleDelete() {
    try {
      await del(tx.id)
      toast.success('İşlem silindi')
    } catch {
      toast.error('Silme başarısız')
    }
  }

  const isIncome = tx.type === 'GELIR'

  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors">
      {/* Renk indikatör */}
      <div
        className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
          isIncome ? 'bg-green-100' : 'bg-red-100'
        }`}
      >
        {isIncome ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        )}
      </div>

      {/* Sol: tarih + kategori + açıklama */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <span className="text-sm font-medium text-gray-800">{tx.category}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {format(new Date(tx.date), 'd MMM', { locale: tr })}
              </span>
              <Badge
                className={`text-xs hidden sm:inline-flex ${
                  isIncome
                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                    : 'bg-red-100 text-red-600 hover:bg-red-100'
                }`}
                variant="secondary"
              >
                {isIncome ? 'Gelir' : 'Gider'}
              </Badge>
            </div>
            {tx.description && (
              <p className="text-xs text-gray-400 break-words">{tx.description}</p>
            )}
          </div>
          {/* Tutar */}
          <div className={`text-sm font-bold shrink-0 ${isIncome ? 'text-green-600' : 'text-red-500'}`}>
            {isIncome ? '+' : '-'}₺{tx.amount.toLocaleString('tr-TR')}
          </div>
        </div>
      </div>

      {/* Eylemler */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-gray-400 hover:text-purple-600"
          onClick={() => onEdit(tx)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-gray-400 hover:text-red-500"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>İşlemi Sil?</AlertDialogTitle>
              <AlertDialogDescription>
                Bu işlem kalıcı olarak silinecek. Geri alınamaz.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Sil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default function FinansPage() {
  const [period, setPeriod] = useState<Period>('month')
  const [activeTab, setActiveTab] = useState<'all' | 'GELIR' | 'GIDER'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [defaultType, setDefaultType] = useState<'GELIR' | 'GIDER'>('GELIR')

  const { data: transactions = [], isLoading } = useTransactions(period)
  const { data: stats } = useTransactionStats()

  const filtered = transactions.filter((t) =>
    activeTab === 'all' ? true : t.type === activeTab
  )

  function openNew(type: 'GELIR' | 'GIDER' = 'GELIR') {
    setEditingTx(null)
    setDefaultType(type)
    setModalOpen(true)
  }

  function openEdit(tx: Transaction) {
    setEditingTx(tx)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingTx(null)
  }

  const net = stats?.thisMonth.net ?? 0
  const netPositive = net >= 0

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Finans</h1>
          <p className="text-sm text-gray-500 mt-1">Gelir ve gider takibi</p>
        </div>
        <Button
          onClick={() => openNew('GELIR')}
          className="bg-purple-600 hover:bg-purple-700 gap-2"
        >
          <Plus className="h-4 w-4" />
          Yeni İşlem
        </Button>
      </div>

      {/* Stats kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Bu Ay Gelir"
          value={`₺${(stats?.thisMonth.income ?? 0).toLocaleString('tr-TR')}`}
          icon={TrendingUp}
          color="bg-green-100 text-green-600"
          sub="Bu ayki toplam gelir"
        />
        <StatCard
          label="Bu Ay Gider"
          value={`₺${(stats?.thisMonth.expense ?? 0).toLocaleString('tr-TR')}`}
          icon={TrendingDown}
          color="bg-red-100 text-red-500"
          sub="Bu ayki toplam gider"
        />
        <StatCard
          label="Net Kar/Zarar"
          value={`${netPositive ? '+' : ''}₺${Math.abs(net).toLocaleString('tr-TR')}`}
          icon={Wallet}
          color={netPositive ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-500'}
          sub={netPositive ? 'Kar' : 'Zarar'}
        />
      </div>

      {/* Grafikler */}
      {stats && (stats.trend.some((t) => t.income > 0 || t.expense > 0)) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Trend çizgi grafiği */}
          <div className="glass-card p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Son 6 Ay Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.trend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="label"
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
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any, name: any) => [
                    `₺${Number(value).toLocaleString('tr-TR')}`,
                    name === 'income' ? 'Gelir' : 'Gider',
                  ]}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#16a34a' }}
                  name="Gelir"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#dc2626' }}
                  name="Gider"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pasta grafik */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              {activeTab === 'GIDER' ? 'Gider' : 'Gelir'} Dağılımı
            </h3>
            {(() => {
              const pieData =
                activeTab === 'GIDER'
                  ? stats.expenseByCategory
                  : stats.incomeByCategory
              if (pieData.length === 0) {
                return (
                  <div className="flex items-center justify-center h-[150px] text-sm text-gray-400">
                    Veri yok
                  </div>
                )
              }
              return (
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
                        <Cell
                          key={index}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
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
                      formatter={(value: any) => `₺${Number(value).toLocaleString('tr-TR')}`}
                      contentStyle={{ borderRadius: '12px', fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )
            })()}
          </div>
        </div>
      )}

      {/* Dönem + Tab filtresi */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Tablar */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {(['all', 'GELIR', 'GIDER'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'all' ? 'Tümü' : tab === 'GELIR' ? 'Gelirler' : 'Giderler'}
            </button>
          ))}
        </div>

        {/* Dönem */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === p
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* İşlem listesi */}
      {isLoading ? (
        <div className="glass-card overflow-hidden animate-pulse">
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
            <Wallet className="h-8 w-8 text-purple-300" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">İşlem yok</h3>
          <p className="text-sm text-gray-400 mb-5">
            {PERIOD_LABELS[period]} için kayıtlı işlem bulunamadı
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => openNew('GELIR')}
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Gelir Ekle
            </Button>
            <Button
              onClick={() => openNew('GIDER')}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 gap-2"
            >
              <TrendingDown className="h-4 w-4" />
              Gider Ekle
            </Button>
          </div>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          {/* Özet satırı */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
            <span className="text-xs font-medium text-gray-500">
              {filtered.length} işlem
            </span>
            <div className="flex items-center gap-4 text-xs">
              {activeTab !== 'GIDER' && (
                <span className="text-green-600 font-semibold">
                  +₺
                  {filtered
                    .filter((t) => t.type === 'GELIR')
                    .reduce((s, t) => s + t.amount, 0)
                    .toLocaleString('tr-TR')}
                </span>
              )}
              {activeTab !== 'GELIR' && (
                <span className="text-red-500 font-semibold">
                  -₺
                  {filtered
                    .filter((t) => t.type === 'GIDER')
                    .reduce((s, t) => s + t.amount, 0)
                    .toLocaleString('tr-TR')}
                </span>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} onEdit={openEdit} />
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <TransactionModal
        transaction={editingTx}
        defaultType={defaultType}
        open={modalOpen}
        onClose={closeModal}
      />
    </div>
  )
}
