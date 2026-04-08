'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { format, addMinutes, parse } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Loader2, Plus, AlertTriangle, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCreateAppointment, type CreateAppointmentInput } from '@/hooks/useAppointments'
import { useCustomerPackages } from '@/hooks/usePackages'

// --- Types ---
interface ServiceOption {
  id: string
  name: string
  duration: number
  price: number
  color: string
}

interface StaffOption {
  id: string
  name: string
  color: string
  title?: string
}

interface CustomerOption {
  id: string
  name: string
  phone: string
}

// --- Schema ---
const schema = z.object({
  customerId: z.string().min(1, 'Müşteri seçin'),
  serviceId: z.string().min(1, 'Hizmet seçin'),
  staffId: z.string().min(1, 'Personel seçin'),
  date: z.string().min(1, 'Tarih girin'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'SS:DD formatı'),
  price: z.number().positive('Geçerli fiyat girin'),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

// Saat listesi 08:00 - 21:30 arası 15dk aralık
function buildTimeSlots(): string[] {
  const slots: string[] = []
  for (let h = 8; h <= 21; h++) {
    for (const m of [0, 15, 30, 45]) {
      if (h === 21 && m > 30) break
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return slots
}
const TIME_SLOTS = buildTimeSlots()

function calcEndTime(startTime: string, durationMin: number): string {
  try {
    const base = parse(startTime, 'HH:mm', new Date())
    return format(addMinutes(base, durationMin), 'HH:mm')
  } catch {
    return startTime
  }
}

interface LimitError {
  limit: number
  used: number
  resetAt: string
  plan: string
}

interface Props {
  open: boolean
  onClose: () => void
  slug: string
  defaultDate?: string // "2025-03-26"
  initialCustomerId?: string
}

export function NewAppointmentModal({ open, onClose, slug, defaultDate, initialCustomerId }: Props) {
  const [services, setServices] = useState<ServiceOption[]>([])
  const [staffList, setStaffList] = useState<StaffOption[]>([])
  const [customers, setCustomers] = useState<CustomerOption[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [paymentType, setPaymentType] = useState<'normal' | 'package'>('normal')
  const [selectedPackageId, setSelectedPackageId] = useState('')
  const [limitError, setLimitError] = useState<LimitError | null>(null)

  const { mutateAsync: createAppointment, isPending } = useCreateAppointment()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerId: '',
      serviceId: '',
      staffId: '',
      date: defaultDate ?? format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      price: 0,
      notes: '',
    },
  })

  const watchCustomerId = form.watch('customerId')
  const { data: customerPackages = [] } = useCustomerPackages(watchCustomerId || null)

  // Reset package selection when customer changes
  useEffect(() => {
    setSelectedPackageId('')
    setPaymentType('normal')
  }, [watchCustomerId])

  // Modal açıldığında veya defaultDate/initialCustomerId değiştiğinde formu güncelle
  useEffect(() => {
    if (!open) return
    form.reset({
      ...form.getValues(),
      customerId: initialCustomerId ?? '',
      date: defaultDate ?? format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      price: 0,
      notes: '',
    })
  }, [open, defaultDate, initialCustomerId, form])

  // Form açılınca seçenekleri yükle
  useEffect(() => {
    if (!open) return
    setLoadingOptions(true)
    Promise.all([
      axios.get<ServiceOption[]>('/api/services'),
      axios.get<StaffOption[]>('/api/staff'),
      axios.get<CustomerOption[]>('/api/customers'),
    ]).then(([s, st, c]) => {
      setServices(s.data)
      setStaffList(st.data)
      setCustomers(c.data)
    }).catch(() => {
      toast.error('Veriler yüklenemedi')
    }).finally(() => setLoadingOptions(false))
  }, [open])

  // Hizmet seçilince fiyatı otomatik doldur
  const watchServiceId = form.watch('serviceId')
  useEffect(() => {
    const svc = services.find((s) => s.id === watchServiceId)
    if (svc) form.setValue('price', svc.price)
  }, [watchServiceId, services, form])

  async function onSubmit(data: FormData) {
    const svc = services.find((s) => s.id === data.serviceId)
    const endTime = svc ? calcEndTime(data.startTime, svc.duration) : data.startTime

    if (paymentType === 'package' && !selectedPackageId) {
      toast.error('Paket seçin')
      return
    }

    try {
      const payload: CreateAppointmentInput = {
        customerId: data.customerId,
        serviceId: data.serviceId,
        staffId: data.staffId,
        date: data.date,
        startTime: data.startTime,
        endTime,
        price: paymentType === 'package' ? 0 : data.price,
        notes: data.notes,
        customerPackageId: paymentType === 'package' ? selectedPackageId : undefined,
      }
      await createAppointment(payload)
      toast.success('Randevu oluşturuldu')
      form.reset()
      setPaymentType('normal')
      setSelectedPackageId('')
      onClose()
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data
        if (err.response?.status === 403 && data?.code === 'APPOINTMENT_LIMIT_REACHED') {
          setLimitError(data as LimitError)
        } else if (err.response?.status === 409 && data?.code === 'APPOINTMENT_CONFLICT') {
          toast.error(data.error, { duration: 5000 })
        } else {
          toast.error(data?.error ?? 'Randevu oluşturulamadı')
        }
      } else {
        toast.error('Randevu oluşturulamadı')
      }
    }
  }

  const resetDate = limitError
    ? new Date(limitError.resetAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); setLimitError(null) } }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">
            Yeni Randevu
          </DialogTitle>
        </DialogHeader>

        {/* Limit doldu ekranı */}
        {limitError && (
          <div className="flex flex-col items-center text-center py-4 gap-4">
            <div className="h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-gray-900 mb-1">
                Aylık Randevu Limitine Ulaştınız
              </h3>
              <p className="text-sm text-gray-500">
                Bu ay <span className="font-semibold text-gray-700">{limitError.used}</span> / <span className="font-semibold text-gray-700">{limitError.limit}</span> randevu oluşturdunuz.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Limit <span className="font-semibold text-amber-600">{resetDate}</span> tarihinde sıfırlanacak.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full pt-2">
              <Link
                href={`/b/${slug}/upgrade`}
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                Paketini Yükselt
              </Link>
              <button
                onClick={() => { setLimitError(null); onClose() }}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        )}

        {!limitError && loadingOptions ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
          </div>
        ) : !limitError ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Müşteri */}
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Müşteri</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Müşteri seçin..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.length === 0 && (
                          <div className="px-3 py-2 text-sm text-gray-400">Müşteri bulunamadı</div>
                        )}
                        {customers.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name} — {c.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hizmet */}
              <FormField
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hizmet</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Hizmet seçin..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name} — {s.duration}dk — ₺{s.price.toLocaleString('tr-TR')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Personel */}
              <FormField
                control={form.control}
                name="staffId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personel</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Personel seçin..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {staffList.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            <span className="flex items-center gap-2">
                              <span
                                className="inline-block h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: s.color }}
                              />
                              {s.name}{s.title ? ` — ${s.title}` : ''}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tarih + Saat */}
              <div className="flex flex-col sm:flex-row gap-3">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Tarih</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Saat</FormLabel>
                      <FormControl>
                        <select
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          {TIME_SLOTS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Ödeme Tipi */}
              <div>
                <p className="text-sm font-medium mb-2">Ödeme Tipi</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType('normal')}
                    className={`py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                      paymentType === 'normal'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType('package')}
                    disabled={!watchCustomerId}
                    className={`py-2 rounded-xl border-2 text-sm font-medium transition-all disabled:opacity-40 ${
                      paymentType === 'package'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    Paket
                  </button>
                </div>
              </div>

              {/* Paket seçimi */}
              {paymentType === 'package' && (
                <div>
                  <p className="text-sm font-medium mb-1.5">Aktif Paket</p>
                  {customerPackages.filter((cp) => cp.isActive).length === 0 ? (
                    <p className="text-sm text-gray-400 py-2">Bu müşterinin aktif paketi yok</p>
                  ) : (
                    <div className="space-y-2">
                      {customerPackages
                        .filter((cp) => cp.isActive)
                        .map((cp) => (
                          <button
                            key={cp.id}
                            type="button"
                            onClick={() => setSelectedPackageId(cp.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border-2 text-left transition-all ${
                              selectedPackageId === cp.id
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-purple-200'
                            }`}
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-800">{cp.package.name}</p>
                              <p className="text-xs text-gray-500">{cp.package.service.name}</p>
                            </div>
                            <span className="text-sm font-bold text-purple-600 shrink-0">
                              {cp.remainingSessions} seans
                            </span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Fiyat */}
              {paymentType === 'normal' && (
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
              )}

              {/* Notlar */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notlar <span className="text-gray-400 font-normal">(opsiyonel)</span></FormLabel>
                    <FormControl>
                      <Textarea
                        rows={2}
                        placeholder="Müşteri notu veya özel istek..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Butonlar */}
              <div className="flex justify-end gap-2 pt-2 pb-4 sm:pb-0">
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
                    <><Plus className="mr-2 h-4 w-4" />Randevu Oluştur</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
