// Salonapy Type Definitions

export type Plan = 'BASLANGIC' | 'PROFESYONEL' | 'ISLETME'

export type AppointmentStatus =
  | 'BEKLIYOR'
  | 'ONAYLANDI'
  | 'TAMAMLANDI'
  | 'IPTAL'
  | 'GELMEDI'

export type NotificationChannel = 'WHATSAPP' | 'EMAIL' | 'SMS'

export type NotificationStatus = 'BEKLIYOR' | 'GONDERILDI' | 'BASARISIZ'

export type TransactionType = 'GELIR' | 'GIDER'

export interface Tenant {
  id: string
  name: string
  slug: string
  phone?: string
  email?: string
  address?: string
  logo?: string
  plan: Plan
  planStartedAt: Date
  planEndsAt?: Date
  isActive: boolean
  waUsed: number
  waResetAt: Date
  country: string
  currency: string
  timezone: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  tenantId: string
  supabaseId: string
  email: string
  name: string
  role: string
  avatarUrl?: string
  createdAt: Date
}

export interface Staff {
  id: string
  tenantId: string
  supabaseId?: string
  name: string
  phone?: string
  email: string
  avatarUrl?: string
  slug: string
  title?: string
  bio?: string
  color: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  tenantId: string
  name: string
  description?: string
  duration: number
  price: number
  color: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: string
  tenantId: string
  name: string
  phone: string
  email?: string
  notes?: string
  totalVisits: number
  totalSpent: number
  lastVisitAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Appointment {
  id: string
  tenantId: string
  staffId: string
  serviceId: string
  customerId: string
  date: Date
  startTime: string
  endTime: string
  status: AppointmentStatus
  notes?: string
  price: number
  paid: boolean
  createdAt: Date
  updatedAt: Date
  staff?: Staff
  service?: Service
  customer?: Customer
}

export interface Transaction {
  id: string
  tenantId: string
  type: TransactionType
  amount: number
  category: string
  description?: string
  date: Date
  createdAt: Date
}
