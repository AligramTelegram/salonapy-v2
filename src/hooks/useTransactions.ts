import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export type TransactionType = 'GELIR' | 'GIDER'

export interface Transaction {
  id: string
  tenantId: string
  type: TransactionType
  amount: number
  category: string
  description: string | null
  date: string
  createdAt: string
}

export interface TransactionStats {
  thisMonth: {
    income: number
    expense: number
    net: number
  }
  incomeByCategory: { name: string; value: number }[]
  expenseByCategory: { name: string; value: number }[]
  trend: { label: string; income: number; expense: number }[]
}

export interface CreateTransactionInput {
  type: TransactionType
  amount: number
  category: string
  description?: string
  date: string
}

export interface UpdateTransactionInput {
  type?: TransactionType
  amount?: number
  category?: string
  description?: string
  date?: string
}

export type Period = 'month' | 'quarter' | 'year'

const QUERY_KEY = ['transactions']

export function useTransactions(period: Period = 'month') {
  return useQuery<Transaction[]>({
    queryKey: [...QUERY_KEY, { period }],
    queryFn: () =>
      axios.get<Transaction[]>(`/api/transactions?period=${period}`).then((r) => r.data),
  })
}

export function useTransactionStats() {
  return useQuery<TransactionStats>({
    queryKey: [...QUERY_KEY, 'stats'],
    queryFn: () => axios.get<TransactionStats>('/api/transactions/stats').then((r) => r.data),
  })
}

export function useCreateTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTransactionInput) =>
      axios.post<Transaction>('/api/transactions', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useUpdateTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateTransactionInput & { id: string }) =>
      axios.put<Transaction>(`/api/transactions/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useDeleteTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      axios.delete(`/api/transactions/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
