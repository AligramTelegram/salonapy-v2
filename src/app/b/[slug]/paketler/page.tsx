'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  usePackages,
  useCreatePackage,
  useUpdatePackage,
  useDeletePackage,
  type PackageFull,
} from '@/hooks/usePackages'

interface ServiceOption {
  id: string
  name: string
  color: string
  duration: number
  price: number
}

const schema = z.object({
  name: z.string().min(1, 'Paket adı zorunlu'),
  description: z.string().optional(),
  serviceId: z.string().min(1, 'Hizmet zorunlu'),
  sessions: z.number().int().positive('Pozitif sayı girin'),
  price: z.number().positive('Fiyat pozitif olmalı'),
  validDays: z.number().int().positive().optional().nullable(),
  isActive: z.boolean(),
})

type FormData = z.infer<typeof schema>

function PackageModal({
  pkg,
  open,
  onClose,
}: {
  pkg?: PackageFull | null
  open: boolean
  onClose: () => void
}) {
  const isEdit = !!pkg
  const [services, setServices] = useState<ServiceOption[]>([])
  const { mutateAsync: create, isPending: isCreating } = useCreatePackage()
  const { mutateAsync: update, isPending: isUpdating } = useUpdatePackage()
  const isPending = isCreating || isUpdating

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      serviceId: '',
      sessions: 10,
      price: 0,
      validDays: null,
      isActive: true,
    },
  })

  useEffect(() => {
    if (!open) return
    axios.get<ServiceOption[]>('/api/services').then((r) => setServices(r.data)).catch(() => {})

    if (pkg) {
      form.reset({
        name: pkg.name,
        description: pkg.description ?? '',
        serviceId: pkg.serviceId,
        sessions: pkg.sessions,
        price: pkg.price,
        validDays: pkg.validDays ?? null,
        isActive: pkg.isActive,
      })
    } else {
      form.reset({
        name: '',
        description: '',
        serviceId: '',
        sessions: 10,
        price: 0,
        validDays: null,
        isActive: true,
      })
    }
  }, [open, pkg, form])

  async function onSubmit(data: FormData) {
    try {
      if (isEdit && pkg) {
        await update({ id: pkg.id, ...data })
        toast.success('Paket güncellendi')
      } else {
        await create(data)
        toast.success('Paket oluşturuldu')
      }
      onClose()
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'İşlem başarısız'
        : 'İşlem başarısız'
      toast.error(msg)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">
            {isEdit ? 'Paketi Düzenle' : 'Yeni Paket Oluştur'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paket Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="10 Seans Masaj Paketi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama <span className="text-gray-400 font-normal">(opsiyonel)</span></FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Kısa açıklama..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hizmet</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Hizmet seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          <span className="flex items-center gap-2">
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: s.color }}
                            />
                            {s.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="sessions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seans Sayısı</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fiyat (₺)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="validDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Geçerlilik <span className="text-gray-400 font-normal">(gün, opsiyonel)</span></FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="365"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value ? e.target.valueAsNumber : null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
                İptal
              </Button>
              <Button type="submit" disabled={isPending} className="bg-purple-600 hover:bg-purple-700">
                {isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Kaydediliyor...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" />{isEdit ? 'Kaydet' : 'Paket Oluştur'}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function PackageCard({
  pkg,
  onEdit,
}: {
  pkg: PackageFull
  onEdit: (p: PackageFull) => void
}) {
  const { mutateAsync: del, isPending } = useDeletePackage()

  async function handleDelete() {
    try {
      await del(pkg.id)
      toast.success('Paket silindi')
    } catch {
      toast.error('Silme başarısız')
    }
  }

  const perSession = pkg.sessions > 0 ? pkg.price / pkg.sessions : 0

  return (
    <div className="glass-card overflow-hidden flex flex-col">
      {/* Renk şeridi */}
      <div className="h-1.5 w-full" style={{ backgroundColor: pkg.service.color }} />

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${pkg.service.color}20` }}
            >
              <Package className="h-5 w-5" style={{ color: pkg.service.color }} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{pkg.name}</h3>
              <p className="text-xs text-gray-500 truncate">{pkg.service.name}</p>
            </div>
          </div>
          <Badge
            className={
              pkg.isActive
                ? 'bg-green-100 text-green-700 hover:bg-green-100 shrink-0'
                : 'bg-gray-100 text-gray-500 shrink-0'
            }
            variant="secondary"
          >
            {pkg.isActive ? 'Aktif' : 'Pasif'}
          </Badge>
        </div>

        {pkg.description && (
          <p className="text-xs text-gray-500 line-clamp-2">{pkg.description}</p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-purple-50 rounded-xl p-2.5 text-center">
            <div className="text-lg font-bold text-purple-700">{pkg.sessions}</div>
            <div className="text-xs text-purple-500">Seans</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <div className="text-lg font-bold text-gray-800">₺{pkg.price.toLocaleString('tr-TR')}</div>
            <div className="text-xs text-gray-400">Toplam</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>₺{perSession.toFixed(0)}/seans</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{pkg._count.customerPackages} aktif müşteri</span>
          </div>
        </div>

        {pkg.validDays && (
          <div className="text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1">
            Geçerlilik: {pkg.validDays} gün
          </div>
        )}

        <div className="pt-2 border-t border-gray-100 mt-auto flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(pkg)}
            className="flex-1 text-gray-500 hover:text-purple-600 hover:bg-purple-50"
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Düzenle
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                disabled={isPending}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50"
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
                <AlertDialogTitle>Paketi Sil?</AlertDialogTitle>
                <AlertDialogDescription>
                  <strong>{pkg.name}</strong> kalıcı olarak silinecek. Bu paketi satın alan
                  müşteriler etkilenebilir. Bu işlem geri alınamaz.
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
    </div>
  )
}

export default function PaketlerPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPkg, setEditingPkg] = useState<PackageFull | null>(null)

  const { data: packages = [], isLoading } = usePackages()

  const totalActiveCustomers = packages.reduce((s, p) => s + p._count.customerPackages, 0)

  function openNew() {
    setEditingPkg(null)
    setModalOpen(true)
  }

  function openEdit(pkg: PackageFull) {
    setEditingPkg(pkg)
    setModalOpen(true)
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Paketler</h1>
          <p className="text-sm text-gray-500 mt-1">
            {packages.length} paket · {totalActiveCustomers} aktif müşteri
          </p>
        </div>
        <Button onClick={openNew} className="bg-purple-600 hover:bg-purple-700 gap-2">
          <Plus className="h-4 w-4" />
          Yeni Paket
        </Button>
      </div>

      {/* İçerik */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card overflow-hidden animate-pulse">
              <div className="h-1.5 bg-purple-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-14 bg-gray-100 rounded-xl" />
                  <div className="h-14 bg-gray-100 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : packages.length === 0 ? (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-purple-300" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">Henüz paket yok</h3>
          <p className="text-sm text-gray-400 mb-5">
            Müşterilerinize seans paketi oluşturun
          </p>
          <Button onClick={openNew} className="bg-purple-600 hover:bg-purple-700 gap-2">
            <Plus className="h-4 w-4" />
            İlk Paketi Oluştur
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onEdit={openEdit} />
          ))}
        </div>
      )}

      <PackageModal
        pkg={editingPkg}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingPkg(null)
        }}
      />
    </div>
  )
}
