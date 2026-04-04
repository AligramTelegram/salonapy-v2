import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export interface PackageFull {
  id: string
  tenantId: string
  name: string
  description: string | null
  serviceId: string
  sessions: number
  price: number
  validDays: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  service: { id: string; name: string; color: string; duration: number }
  _count: { customerPackages: number }
}

export interface CustomerPackageFull {
  id: string
  tenantId: string
  customerId: string
  packageId: string
  totalSessions: number
  usedSessions: number
  remainingSessions: number
  purchaseDate: string
  expiryDate: string | null
  isActive: boolean
  createdAt: string
  package: {
    id: string
    name: string
    sessions: number
    price: number
    service: { id: string; name: string; color: string }
  }
}

export interface CreatePackageInput {
  name: string
  description?: string
  serviceId: string
  sessions: number
  price: number
  validDays?: number | null
  isActive?: boolean
}

export interface UpdatePackageInput {
  name?: string
  description?: string
  sessions?: number
  price?: number
  validDays?: number | null
  isActive?: boolean
}

const QUERY_KEY = ['packages']

export function usePackages() {
  return useQuery<PackageFull[]>({
    queryKey: QUERY_KEY,
    queryFn: () => axios.get<PackageFull[]>('/api/packages').then((r) => r.data),
  })
}

export function useCustomerPackages(customerId: string | null) {
  return useQuery<CustomerPackageFull[]>({
    queryKey: ['customer-packages', customerId],
    queryFn: () =>
      axios.get<CustomerPackageFull[]>(`/api/customers/${customerId}/packages`).then((r) => r.data),
    enabled: !!customerId,
  })
}

export function useCreatePackage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePackageInput) =>
      axios.post<PackageFull>('/api/packages', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdatePackage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: UpdatePackageInput & { id: string }) =>
      axios.put<PackageFull>(`/api/packages/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeletePackage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => axios.delete(`/api/packages/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function usePurchasePackage(customerId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (packageId: string) =>
      axios
        .post<CustomerPackageFull>(`/api/customers/${customerId}/packages/purchase`, { packageId })
        .then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-packages', customerId] })
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      qc.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
