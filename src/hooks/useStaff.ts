import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export interface ServiceRef {
  id: string
  name: string
  color: string
}

export interface StaffFull {
  id: string
  name: string
  email: string
  phone: string | null
  color: string
  avatarUrl: string | null
  title: string | null
  slug: string
  isActive: boolean
  createdAt: string
  services: ServiceRef[]
}

export interface WorkHourInput {
  dayOfWeek: number
  startTime: string
  endTime: string
  isWorking: boolean
}

export interface CreateStaffInput {
  name: string
  email: string
  password: string
  phone?: string
  title?: string
  color: string
  serviceIds?: string[]
  workHours?: WorkHourInput[]
}

export interface UpdateStaffInput {
  name?: string
  phone?: string
  title?: string
  color?: string
  isActive?: boolean
  serviceIds?: string[]
  workHours?: WorkHourInput[]
}

const QUERY_KEY = ['staff']

export function useStaff(all = false) {
  return useQuery<StaffFull[]>({
    queryKey: [...QUERY_KEY, { all }],
    queryFn: () =>
      axios.get<StaffFull[]>(`/api/staff${all ? '?all=true' : ''}`).then((r) => r.data),
  })
}

export function useCreateStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateStaffInput) =>
      axios.post<StaffFull>('/api/staff/create', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateStaffInput & { id: string }) =>
      axios.put<StaffFull>(`/api/staff/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      axios.delete(`/api/staff/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
