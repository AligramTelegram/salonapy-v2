import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import type { AppointmentStatus } from '@/types'

export interface CustomerRow {
  id: string
  name: string
  phone: string
  email: string | null
  notes: string | null
  totalVisits: number
  totalSpent: number
  lastVisitAt: string | null
  createdAt: string
}

export interface AppointmentHistory {
  id: string
  date: string
  startTime: string
  endTime: string
  status: AppointmentStatus
  price: number
  paid: boolean
  notes: string | null
  service: { id: string; name: string; color: string; duration: number }
  staff: { id: string; name: string; color: string; avatarUrl: string | null }
}

export interface CustomerDetail extends CustomerRow {
  appointments: AppointmentHistory[]
}

export interface CreateCustomerInput {
  name: string
  phone: string
  email?: string
  notes?: string
}

export interface UpdateCustomerInput {
  name?: string
  phone?: string
  email?: string
  notes?: string
}

const QUERY_KEY = ['customers']

export function useCustomers(q = '') {
  return useQuery<CustomerRow[]>({
    queryKey: [...QUERY_KEY, { q }],
    queryFn: () =>
      axios
        .get<CustomerRow[]>(`/api/customers${q ? `?q=${encodeURIComponent(q)}` : ''}`)
        .then((r) => r.data),
  })
}

export function useCustomerDetail(id: string | null) {
  return useQuery<CustomerDetail>({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => axios.get<CustomerDetail>(`/api/customers/${id}`).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCustomerInput) =>
      axios.post<CustomerRow>('/api/customers', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateCustomerInput & { id: string }) =>
      axios.put<CustomerRow>(`/api/customers/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      axios.delete(`/api/customers/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
