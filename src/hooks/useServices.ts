import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export interface StaffRef {
  id: string
  name: string
  color: string
  avatarUrl: string | null
}

export interface ServiceFull {
  id: string
  name: string
  description: string | null
  duration: number
  price: number
  color: string
  isActive: boolean
  createdAt: string
  staff: StaffRef[]
}

export interface CreateServiceInput {
  name: string
  description?: string
  duration: number
  price: number
  color: string
  isActive?: boolean
  staffIds?: string[]
}

export interface UpdateServiceInput {
  name?: string
  description?: string
  duration?: number
  price?: number
  color?: string
  isActive?: boolean
  staffIds?: string[]
}

const QUERY_KEY = ['services']

export function useServices(all = false) {
  return useQuery<ServiceFull[]>({
    queryKey: [...QUERY_KEY, { all }],
    queryFn: () =>
      axios.get<ServiceFull[]>(`/api/services${all ? '?all=true' : ''}`).then((r) => r.data),
  })
}

export function useCreateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateServiceInput) =>
      axios.post<ServiceFull>('/api/services', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateServiceInput & { id: string }) =>
      axios.put<ServiceFull>(`/api/services/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      axios.delete(`/api/services/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      qc.invalidateQueries({ queryKey: ['staff'] }) // staff'ın services listesi güncellenir
    },
  })
}
