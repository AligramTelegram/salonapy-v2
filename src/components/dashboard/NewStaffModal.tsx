'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Loader2, UserPlus, Eye, EyeOff } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCreateStaff, type CreateStaffInput } from '@/hooks/useStaff'

// --- Types ---
interface ServiceOption {
  id: string
  name: string
  color: string
}

// --- Schema ---
const schema = z.object({
  name: z.string().min(2, 'Ad Soyad en az 2 karakter'),
  email: z.string().email('Geçerli email girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter'),
  phone: z.string().optional(),
  title: z.string().optional(),
  color: z.string(),
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

function defaultWorkHours(): WorkHour[] {
  return DAY_NAMES.map((_, i) => ({
    dayOfWeek: i,
    startTime: '09:00',
    endTime: '18:00',
    isWorking: i >= 1 && i <= 6, // Pzt-Cmt açık
  }))
}

interface Props {
  open: boolean
  onClose: () => void
}

export function NewStaffModal({ open, onClose }: Props) {
  const [services, setServices] = useState<ServiceOption[]>([])
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])
  const [workHours, setWorkHours] = useState<WorkHour[]>(defaultWorkHours())
  const [showPassword, setShowPassword] = useState(false)
  const [loadingServices, setLoadingServices] = useState(false)

  const { mutateAsync: createStaff, isPending } = useCreateStaff()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      title: '',
      color: '#7c3aed',
    },
  })

  useEffect(() => {
    if (!open) return
    setLoadingServices(true)
    axios
      .get<ServiceOption[]>('/api/services')
      .then((r) => setServices(r.data))
      .catch(() => toast.error('Hizmetler yüklenemedi'))
      .finally(() => setLoadingServices(false))
  }, [open])

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
    try {
      const payload: CreateStaffInput = {
        ...data,
        serviceIds: selectedServiceIds,
        workHours,
      }
      await createStaff(payload)
      toast.success(`${data.name} çalışan olarak eklendi`)
      form.reset()
      setSelectedServiceIds([])
      setWorkHours(defaultWorkHours())
      onClose()
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err)
          ? err.response?.data?.error ?? 'Çalışan eklenemedi'
          : 'Çalışan eklenemedi'
      toast.error(msg)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">
            Yeni Çalışan Ekle
          </DialogTitle>
        </DialogHeader>

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
                    <FormControl>
                      <Input placeholder="Ayşe Yılmaz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unvan <span className="text-gray-400 font-normal">(opsiyonel)</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Usta Kuaför" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email + Telefon */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email <span className="text-xs text-gray-400">(giriş için)</span></FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="ayse@salon.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon <span className="text-gray-400 font-normal">(opsiyonel)</span></FormLabel>
                    <FormControl>
                      <Input placeholder="0532 000 0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Şifre */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifre <span className="text-xs text-gray-400">(çalışan bu şifreyle giriş yapar)</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="En az 6 karakter"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Renk seçici */}
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
                      title="Özel renk"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hizmetler */}
            {!loadingServices && services.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Hizmetler <span className="text-gray-400 font-normal">(opsiyonel)</span></p>
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
            <div>
              <p className="text-sm font-medium mb-3">Çalışma Saatleri</p>
              <div className="space-y-2">
                {workHours.map((wh) => (
                  <div key={wh.dayOfWeek} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleWorkDay(wh.dayOfWeek)}
                      className={`w-10 text-xs font-semibold py-1 rounded-md transition-colors ${
                        wh.isWorking
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-400'
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

            {/* Butonlar */}
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
                İptal
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Ekleniyor...</>
                ) : (
                  <><UserPlus className="mr-2 h-4 w-4" />Çalışan Ekle</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
