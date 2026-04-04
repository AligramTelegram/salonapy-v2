'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
  Phone,
  Mail,
  FileText,
  CalendarDays,
  TrendingUp,
  Banknote,
  Pencil,
  Trash2,
  Loader2,
  Package,
  ShoppingCart,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { usePackages, useCustomerPackages, usePurchasePackage } from '@/hooks/usePackages'

import {
  useCustomerDetail,
  useDeleteCustomer,
  type CustomerRow,
} from '@/hooks/useCustomers'
import type { AppointmentStatus } from '@/types'

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  BEKLIYOR: 'Bekliyor',
  ONAYLANDI: 'Onaylandı',
  TAMAMLANDI: 'Tamamlandı',
  IPTAL: 'İptal',
  GELMEDI: 'Gelmedi',
}

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  BEKLIYOR: 'bg-yellow-100 text-yellow-700',
  ONAYLANDI: 'bg-blue-100 text-blue-700',
  TAMAMLANDI: 'bg-green-100 text-green-700',
  IPTAL: 'bg-gray-100 text-gray-500',
  GELMEDI: 'bg-red-100 text-red-600',
}

interface Props {
  customerId: string | null
  open: boolean
  onClose: () => void
  onEdit: (customer: CustomerRow) => void
  onNewAppointment?: (customerId: string) => void
}

export function CustomerDetailModal({ customerId, open, onClose, onEdit, onNewAppointment }: Props) {
  const { data, isLoading } = useCustomerDetail(customerId)
  const { mutateAsync: deleteCustomer, isPending: isDeleting } = useDeleteCustomer()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [purchaseOpen, setPurchaseOpen] = useState(false)
  const [selectedPackageId, setSelectedPackageId] = useState('')

  const { data: allPackages = [] } = usePackages()
  const { data: customerPackages = [], refetch: refetchPackages } = useCustomerPackages(customerId)
  const { mutateAsync: purchasePackage, isPending: isPurchasing } = usePurchasePackage(customerId ?? '')

  async function handlePurchase() {
    if (!selectedPackageId) return
    try {
      await purchasePackage(selectedPackageId)
      toast.success('Paket satıldı')
      setPurchaseOpen(false)
      setSelectedPackageId('')
      refetchPackages()
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'İşlem başarısız'
        : 'İşlem başarısız'
      toast.error(msg)
    }
  }

  async function handleDelete() {
    if (!data) return
    try {
      await deleteCustomer(data.id)
      toast.success(`${data.name} silindi`)
      onClose()
    } catch {
      toast.error('Silme başarısız')
    }
  }

  const initials = data?.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">
            Müşteri Detayı
          </DialogTitle>
        </DialogHeader>

        {isLoading || !data ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Profil */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xl font-bold shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{data.name}</h3>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Phone className="h-3.5 w-3.5" />
                    {data.phone}
                  </div>
                  {data.email && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Mail className="h-3.5 w-3.5" />
                      {data.email}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass-card p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <CalendarDays className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-xl font-bold text-gray-900">{data.totalVisits}</div>
                <div className="text-xs text-gray-500">Ziyaret</div>
              </div>
              <div className="glass-card p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Banknote className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-xl font-bold text-gray-900">
                  ₺{data.totalSpent.toLocaleString('tr-TR')}
                </div>
                <div className="text-xs text-gray-500">Harcama</div>
              </div>
              <div className="glass-card p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {data.totalVisits > 0
                    ? `₺${Math.round(data.totalSpent / data.totalVisits).toLocaleString('tr-TR')}`
                    : '—'}
                </div>
                <div className="text-xs text-gray-500">Ort.</div>
              </div>
            </div>

            {/* Notlar */}
            {data.notes && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <FileText className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800">{data.notes}</p>
              </div>
            )}

            {/* Randevu geçmişi */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-700">Son Randevular</h4>
                {onNewAppointment && customerId && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs border-purple-200 text-purple-600 hover:bg-purple-50"
                    onClick={() => {
                      onClose()
                      onNewAppointment(customerId)
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Randevu Oluştur
                  </Button>
                )}
              </div>
              {data.appointments.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">
                  Henüz randevu yok
                </p>
              ) : (
                <div className="space-y-2">
                  {data.appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white"
                    >
                      {/* Renk çizgisi */}
                      <div
                        className="w-1 self-stretch rounded-full shrink-0"
                        style={{ backgroundColor: apt.service.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {apt.service.name}
                          </span>
                          <Badge
                            className={`text-xs shrink-0 ${STATUS_COLORS[apt.status]}`}
                            variant="secondary"
                          >
                            {STATUS_LABELS[apt.status]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                          <span>
                            {format(new Date(apt.date), 'd MMM yyyy', { locale: tr })}
                          </span>
                          <span>·</span>
                          <span>{apt.startTime}</span>
                          <span>·</span>
                          <span
                            className="inline-block h-2 w-2 rounded-full"
                            style={{ backgroundColor: apt.staff.color }}
                          />
                          <span>{apt.staff.name}</span>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-700 shrink-0">
                        ₺{apt.price.toLocaleString('tr-TR')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Paketler */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-700">Paketler</h4>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs border-purple-200 text-purple-600 hover:bg-purple-50"
                  onClick={() => setPurchaseOpen(true)}
                >
                  <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                  Paket Sat
                </Button>
              </div>

              {customerPackages.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Aktif paket yok</p>
              ) : (
                <div className="space-y-2">
                  {customerPackages.map((cp) => {
                    const pct = Math.round((cp.usedSessions / cp.totalSessions) * 100)
                    return (
                      <div key={cp.id} className="p-3 rounded-xl border border-gray-100 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Package
                              className="h-4 w-4 shrink-0"
                              style={{ color: cp.package.service.color }}
                            />
                            <span className="text-sm font-medium text-gray-800 truncate">
                              {cp.package.name}
                            </span>
                          </div>
                          <Badge
                            className={
                              cp.isActive
                                ? 'text-xs bg-green-100 text-green-700 hover:bg-green-100'
                                : 'text-xs bg-gray-100 text-gray-500'
                            }
                            variant="secondary"
                          >
                            {cp.isActive ? 'Aktif' : 'Bitti'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                          <span>{cp.package.service.name}</span>
                          <span className="font-semibold text-gray-700">
                            {cp.remainingSessions}/{cp.totalSessions} seans
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: cp.package.service.color,
                            }}
                          />
                        </div>
                        {cp.expiryDate && (
                          <p className="text-xs text-gray-400 mt-1">
                            Son: {format(new Date(cp.expiryDate), 'd MMM yyyy', { locale: tr })}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Paket Sat Dialog */}
            <AlertDialog open={purchaseOpen} onOpenChange={setPurchaseOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Paket Sat</AlertDialogTitle>
                  <AlertDialogDescription>
                    {data.name} için satmak istediğiniz paketi seçin.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-2">
                  <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Paket seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {allPackages.filter((p) => p.isActive).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} — {p.sessions} seans — ₺{p.price.toLocaleString('tr-TR')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setSelectedPackageId('')}>İptal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handlePurchase}
                    disabled={!selectedPackageId || isPurchasing}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isPurchasing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sat'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Eylemler */}
            <div className="flex justify-between gap-2 pt-2 border-t border-gray-100">
              <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Sil
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Müşteriyi Sil?</AlertDialogTitle>
                    <AlertDialogDescription>
                      <strong>{data.name}</strong> kalıcı olarak silinecek. Bu müşteriye ait
                      randevular etkilenebilir. Bu işlem geri alınamaz.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Sil'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                variant="outline"
                onClick={() => {
                  onEdit(data)
                  onClose()
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Düzenle
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
