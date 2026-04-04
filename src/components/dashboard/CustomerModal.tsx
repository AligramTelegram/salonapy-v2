'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Loader2, Sparkles } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  useCreateCustomer,
  useUpdateCustomer,
  type CustomerRow,
} from '@/hooks/useCustomers'

const schema = z.object({
  name: z.string().min(1, 'Ad zorunlu'),
  phone: z.string().min(1, 'Telefon zorunlu'),
  email: z.string().email('Geçersiz e-posta').optional().or(z.literal('')),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  customer?: CustomerRow | null
  open: boolean
  onClose: () => void
}

export function CustomerModal({ customer, open, onClose }: Props) {
  const isEdit = !!customer
  const { mutateAsync: createCustomer, isPending: isCreating } = useCreateCustomer()
  const { mutateAsync: updateCustomer, isPending: isUpdating } = useUpdateCustomer()
  const isPending = isCreating || isUpdating

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', email: '', notes: '' },
  })

  useEffect(() => {
    if (!open) return
    if (customer) {
      form.reset({
        name: customer.name,
        phone: customer.phone,
        email: customer.email ?? '',
        notes: customer.notes ?? '',
      })
    } else {
      form.reset({ name: '', phone: '', email: '', notes: '' })
    }
  }, [open, customer, form])

  async function onSubmit(data: FormData) {
    try {
      if (isEdit && customer) {
        await updateCustomer({ id: customer.id, ...data })
        toast.success('Müşteri güncellendi')
      } else {
        await createCustomer(data)
        toast.success('Müşteri eklendi')
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">
            {isEdit ? 'Müşteriyi Düzenle' : 'Yeni Müşteri Ekle'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Ad Soyad */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Soyad</FormLabel>
                  <FormControl>
                    <Input placeholder="Ahmet Yılmaz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Telefon */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <Input placeholder="05XX XXX XX XX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* E-posta */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    E-posta{' '}
                    <span className="text-gray-400 font-normal">(opsiyonel)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="ahmet@örnek.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notlar */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Notlar{' '}
                    <span className="text-gray-400 font-normal">(opsiyonel)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Özel istekler, alerji vb..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isEdit ? 'Kaydet' : 'Müşteri Ekle'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
