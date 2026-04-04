import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantId } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'

// GET /api/transactions/stats
// Returns: thisMonth summary, category breakdown, 6-month trend
export async function GET() {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  // This month totals
  const thisMonthTx = await prisma.transaction.findMany({
    where: { tenantId, date: { gte: thisMonthStart } },
    select: { type: true, amount: true },
  })

  const thisMonthIncome = thisMonthTx
    .filter((t) => t.type === 'GELIR')
    .reduce((s, t) => s + t.amount, 0)

  const thisMonthExpense = thisMonthTx
    .filter((t) => t.type === 'GIDER')
    .reduce((s, t) => s + t.amount, 0)

  // Category breakdown (all time this month)
  const categoryTx = await prisma.transaction.findMany({
    where: { tenantId, date: { gte: thisMonthStart } },
    select: { type: true, amount: true, category: true },
  })

  const incomeByCategory: Record<string, number> = {}
  const expenseByCategory: Record<string, number> = {}

  for (const t of categoryTx) {
    if (t.type === 'GELIR') {
      incomeByCategory[t.category] = (incomeByCategory[t.category] ?? 0) + t.amount
    } else {
      expenseByCategory[t.category] = (expenseByCategory[t.category] ?? 0) + t.amount
    }
  }

  // 6-month trend
  const trendTx = await prisma.transaction.findMany({
    where: { tenantId, date: { gte: sixMonthsAgo } },
    select: { type: true, amount: true, date: true },
  })

  const monthMap: Record<string, { income: number; expense: number; label: string }> = {}

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' })
    monthMap[key] = { income: 0, expense: 0, label }
  }

  for (const t of trendTx) {
    const d = new Date(t.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (monthMap[key]) {
      if (t.type === 'GELIR') monthMap[key].income += t.amount
      else monthMap[key].expense += t.amount
    }
  }

  const trend = Object.values(monthMap)

  return NextResponse.json({
    thisMonth: {
      income: thisMonthIncome,
      expense: thisMonthExpense,
      net: thisMonthIncome - thisMonthExpense,
    },
    incomeByCategory: Object.entries(incomeByCategory).map(([name, value]) => ({ name, value })),
    expenseByCategory: Object.entries(expenseByCategory).map(([name, value]) => ({ name, value })),
    trend,
  })
}
