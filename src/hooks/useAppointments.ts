import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import type { AppointmentStatus } from '@/types'

export interface AppointmentFull {
  id: string
  tenantId: string
  staffId: string
  serviceId: string
  customerId: string
  date: string
  startTime: string
  endTime: string
  status: AppointmentStatus
  notes?: string
  price: number
  paid: boolean
  createdAt: string
  updatedAt: string
  staff: { id: string; name: string; color: string; avatarUrl?: string }
  service: { id: string; name: string; duration: number; color?: string }
  customer: { id: string; name: string; phone: string }
}

export interface CreateAppointmentInput {
  customerId?: string
  serviceId: string
  staffId: string
  date: string      // "2025-03-26"
  startTime: string // "14:30"
  endTime: string   // "15:30"
  price: number
  notes?: string
  customerPackageId?: string | null
}

export interface UpdateAppointmentInput {
  status?: AppointmentStatus
  staffId?: string
  serviceId?: string
  customerId?: string
  date?: string
  startTime?: string
  endTime?: string
  price?: number
  notes?: string
  paid?: boolean
}

interface FetchParams {
  date?: string
  from?: string
  to?: string
  status?: string
}

function buildQS(params: FetchParams): string {
  const p = new URLSearchParams()
  if (params.date) p.set('date', params.date)
  if (params.from) p.set('from', params.from)
  if (params.to) p.set('to', params.to)
  if (params.status) p.set('status', params.status)
  const qs = p.toString()
  return qs ? `?${qs}` : ''
}

export function useAppointments(params: FetchParams = {}) {
  return useQuery<AppointmentFull[]>({
    queryKey: ['appointments', params],
    queryFn: async () => {
      const { data } = await axios.get<AppointmentFull[]>(`/api/appointments${buildQS(params)}`)
      return data
    },
  })
}

export function useCreateAppointment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateAppointmentInput) => {
      const { data } = await axios.post<AppointmentFull>('/api/appointments', input)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

export function useUpdateAppointment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateAppointmentInput & { id: string }) => {
      const { data } = await axios.put<AppointmentFull>(`/api/appointments/${id}`, input)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

export function useDeleteAppointment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/appointments/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}
