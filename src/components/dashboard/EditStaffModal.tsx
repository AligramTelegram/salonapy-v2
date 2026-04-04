'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Loader2, Save, Trash2 } from 'lucide-react'
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
import { Switch } from '@/components/ui/switch'
import { useUpdateStaff, useDeleteStaff, type StaffFull } from '@/hooks/useStaff'

interface ServiceOption {
  id: string
  name: string
  color: string
}

const schema = z.object({
  name: z.string().min(2, 'Ad Soyad en az 2 karakter'),
  phone: z.string().optional(),
  title: z.string().optional(),
  color: z.string(),
  isActive: z.boolean(),
})

type FormData = z.infer<typeof schema>

const PRESET_COLORS = [
  '#7c3aed', '#6d28d9', '#db2777', '#e11d48',
  '#ea580c', '#ca8a04', '#16a34a', '#0891b2',
  '#1d4ed8', '#475569',
]

const DAY_NAMES = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']

interface WorkHour {
  dayOfWeek: number
  startTime: string
  endTime: string
  isWorking: boolean
}

interface Props {
  staff: StaffFull | null
  open: boolean
  onClose: () => void
  onDeleted?: () => void
}

export function EditStaffModal({ staff, open, onClose, onDeleted }: Props) {
  const [services, setServices] = useState<ServiceOption[]>([])
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])
  const [workHours, setWorkHours] = useState<WorkHour[]>([])

  const { mutateAsync: updateStaff, isPending: isUpdating } = useUpdateStaff()
  const { mutateAsync: deleteStaff, isPending: isDeleting } = useDeleteStaff()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      title: '',
      color: '#7c3aed',
      isActive: true,
    },
  })

  useEffect(() => {
    if (!open || !staff) return

    form.reset({
      name: staff.name,
      phone: staff.phone ?? '',
      title: staff.title ?? '',
      color: staff.color,
      isActive: staff.isActive,
    })
    setSelectedServiceIds(staff.services.map((s) => s.id))

    // Load full staff with work hours
    axios
      .get<{ workHours: WorkHour[] } & StaffFull>(`/api/staff/${staff.id}`)
      .then((r) => {
        const wh = r.data.workHours ?? []
        // Fill missing days
        const map = new Map(wh.map((h) => [h.dayOfWeek, h]))
        setWorkHours(
          DAY_NAMES.map((_, i) =>
            map.get(i) ?? { dayOfWeek: i, startTime: '09:00', endTime: '18:00', isWorking: i >= 1 && i <= 6 }
          )
        )
      })
      .catch(() => {
        setWorkHours(
          DAY_NAMES.map((_, i) => ({
            dayOfWeek: i, startTime: '09:00', endTime: '18:00', isWorking: i >= 1 && i <= 6,
          }))
        )
      })

    axios
      .get<ServiceOption[]>('/api/services')
      .then((r) => setServices(r.data))
      .catch(() => {})
  }, [open, staff, form])

  function toggleService(id: string) {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  function toggleWorkDay(dayOfWeek: number) {
    setWorkHours((prev) =>
      prev.map((wh) =>
        wh.dayOfWeek === dayOfWeek ? { ...wh, isWorking: !wh.isWorking } : wh
      )
    )
  }

  function updateWorkTime(dayOfWeek: number, field: 'startTime' | 'endTime', value: string) {
    setWorkHours((prev) =>
      prev.map((wh) => (wh.dayOfWeek === dayOfWeek ? { ...wh, [field]: value } : wh))
    )
  }

  async function onSubmit(data: FormData) {
    if (!staff) return
    try {
      await updateStaff({
        id: staff.id,
        ...data,
        serviceIds: selectedServiceIds,
        workHours,
      })
      toast.success('Çalışan güncellendi')
      onClose()
    } catch {
      toast.error('Güncelleme başarısız')
    }
  }

  async function handleDelete() {
    if (!staff) return
    try {
      await deleteStaff(staff.id)
      toast.success(`${staff.name} silindi`)
      onClose()
      onDeleted?.()
    } catch {
      toast.error('Silme başarısız')
    }
  }

  if (!staff) return null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">
            Çalışan Düzenle
          </DialogTitle>
        </DialogHeader>

        {/* Email - readonly */}
        <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-sm">
          <span className="text-gray-500 mr-2">Email (değiştirilemez):</span>
          <span className="font-medium text-gray-800">{staff.email}</span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Ad Soyad + Unvan */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Soyad</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unvan</FormLabel>
                    <FormControl><Input placeholder="Usta Kuaför" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Telefon */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl><Input placeholder="0532 000 0000" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Renk */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Takvim Rengi</FormLabel>
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
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    {field.value ? 'Aktif' : 'Pasif'} çalışan
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Hizmetler */}
            {services.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Hizmetler</p>
                <div className="flex flex-wrap gap-2">
                  {services.map((svc) => (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => toggleService(svc.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                        selectedServiceIds.includes(svc.id)
                          ? 'text-white border-transparent'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                      }`}
                      style={
                        selectedServiceIds.includes(svc.id)
                          ? { backgroundColor: svc.color, borderColor: svc.color }
                          : {}
                      }
                    >
                      {svc.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Çalışma Saatleri */}
            {workHours.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-3">Çalışma Saatleri</p>
                <div className="space-y-2">
                  {workHours.map((wh) => (
                    <div key={wh.dayOfWeek} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleWorkDay(wh.dayOfWeek)}
                        className={`w-10 text-xs font-semibold py-1 rounded-md transition-colors ${
                          wh.isWorking ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {DAY_NAMES[wh.dayOfWeek]}
                      </button>
                      {wh.isWorking ? (
                        <>
                          <input
                            type="time"
                            value={wh.startTime}
                            onChange={(e) => updateWorkTime(wh.dayOfWeek, 'startTime', e.target.value)}
                            className="text-sm border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                          />
                          <span className="text-gray-400 text-sm">—</span>
                          <input
                            type="time"
                            value={wh.endTime}
                            onChange={(e) => updateWorkTime(wh.dayOfWeek, 'endTime', e.target.value)}
                            className="text-sm border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                          />
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">Kapalı</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Butonlar */}
            <div className="flex justify-between gap-2 pt-2 border-t border-gray-100">
              {/* Sil butonu */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    disabled={isDeleting || isUpdating}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Sil
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Çalışanı Sil?</AlertDialogTitle>
                    <AlertDialogDescription>
                      <strong>{staff.name}</strong> kalıcı olarak silinecek. Bu çalışana ait
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

              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={onClose} disabled={isUpdating}>
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isUpdating ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Kaydediliyor...</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" />Kaydet</>
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
