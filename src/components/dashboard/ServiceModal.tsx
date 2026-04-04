'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Loader2, Sparkles, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  useCreateService,
  useUpdateService,
  useDeleteService,
  type ServiceFull,
} from '@/hooks/useServices'

// --- Types ---
interface StaffOption {
  id: string
  name: string
  color: string
}

// --- Schema ---
const schema = z.object({
  name: z.string().min(1, 'Hizmet adı zorunlu'),
  description: z.string().optional(),
  duration: z.number().int().positive('Geçerli süre seçin'),
  price: z.number().positive('Geçerli fiyat girin'),
  color: z.string(),
  isActive: z.boolean(),
})

type FormData = z.infer<typeof schema>

const DURATION_OPTIONS = [
  { value: 15, label: '15 dakika' },
  { value: 30, label: '30 dakika' },
  { value: 45, label: '45 dakika' },
  { value: 60, label: '1 saat' },
  { value: 75, label: '1 saat 15 dk' },
  { value: 90, label: '1 saat 30 dk' },
  { value: 120, label: '2 saat' },
  { value: 150, label: '2 saat 30 dk' },
  { value: 180, label: '3 saat' },
]

const PRESET_COLORS = [
  '#7c3aed', '#6d28d9', '#db2777', '#e11d48',
  '#ea580c', '#ca8a04', '#16a34a', '#0891b2',
  '#1d4ed8', '#475569',
]

interface Props {
  service?: ServiceFull | null // null = yeni ekleme modu
  open: boolean
  onClose: () => void
}

export function ServiceModal({ service, open, onClose }: Props) {
  const isEdit = !!service
  const [staffList, setStaffList] = useState<StaffOption[]>([])
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([])

  const { mutateAsync: createService, isPending: isCreating } = useCreateService()
  const { mutateAsync: updateService, isPending: isUpdating } = useUpdateService()
  const { mutateAsync: deleteService, isPending: isDeleting } = useDeleteService()

  const isPending = isCreating || isUpdating

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      duration: 60,
      price: 0,
      color: '#7c3aed',
      isActive: true,
    },
  })

  useEffect(() => {
    if (!open) return

    // Personel listesini yükle
    axios
      .get<StaffOption[]>('/api/staff')
      .then((r) => setStaffList(r.data))
      .catch(() => {})

    if (service) {
      form.reset({
        name: service.name,
        description: service.description ?? '',
        duration: service.duration,
        price: service.price,
        color: service.color,
        isActive: service.isActive,
      })
      setSelectedStaffIds(service.staff.map((s) => s.id))
    } else {
      form.reset({
        name: '',
        description: '',
        duration: 60,
        price: 0,
        color: '#7c3aed',
        isActive: true,
      })
      setSelectedStaffIds([])
    }
  }, [open, service, form])

  function toggleStaff(id: string) {
    setSelectedStaffIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  async function onSubmit(data: FormData) {
    try {
      if (isEdit && service) {
        await updateService({
          id: service.id,
          ...data,
          staffIds: selectedStaffIds,
        })
        toast.success('Hizmet güncellendi')
      } else {
        await createService({
          ...data,
          staffIds: selectedStaffIds,
        })
        toast.success('Hizmet eklendi')
      }
      onClose()
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err)
          ? err.response?.data?.error ?? 'İşlem başarısız'
          : 'İşlem başarısız'
      toast.error(msg)
    }
  }

  async function handleDelete() {
    if (!service) return
    try {
      await deleteService(service.id)
      toast.success(`${service.name} silindi`)
      onClose()
    } catch {
      toast.error('Silme başarısız')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">
            {isEdit ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Hizmet Adı */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hizmet Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Saç Kesimi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Açıklama */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama <span className="text-gray-400 font-normal">(opsiyonel)</span></FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      placeholder="Kısa açıklama..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Süre + Fiyat */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Süre</FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Süre seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DURATION_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={String(opt.value)}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        placeholder="150"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Renk */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Renk</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => field.onChange(c)}
                        className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
                        style={{
                          backgroundColor: c,
                          borderColor: field.value === c ? '#111' : 'transparent',
                        }}
                      />
                    ))}
                    <input
                      type="color"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="h-7 w-7 rounded-full border cursor-pointer"
                      title="Özel renk"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Personeller */}
            {staffList.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">
                  Bu hizmeti yapabilecek personeller{' '}
                  <span className="text-gray-400 font-normal">(opsiyonel)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {staffList.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleStaff(s.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                        selectedStaffIds.includes(s.id)
                          ? 'text-white border-transparent'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                      }`}
                      style={
                        selectedStaffIds.includes(s.id)
                          ? { backgroundColor: s.color, borderColor: s.color }
                          : {}
                      }
                    >
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: selectedStaffIds.includes(s.id) ? '#fff' : s.color }}
                      />
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Aktif/Pasif */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mt-0 cursor-pointer">
                    {field.value ? 'Aktif' : 'Pasif'} hizmet
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Butonlar */}
            <div className="flex justify-between gap-2 pt-2 border-t border-gray-100">
              {isEdit ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      disabled={isDeleting || isPending}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Sil
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hizmeti Sil?</AlertDialogTitle>
                      <AlertDialogDescription>
                        <strong>{service?.name}</strong> kalıcı olarak silinecek. Bu hizmete ait
                        randevular etkilenebilir. Bu işlem geri alınamaz.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>İptal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sil'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <div />
              )}

              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Kaydediliyor...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" />{isEdit ? 'Kaydet' : 'Hizmet Ekle'}</>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
