'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Loader2, Sparkles, TrendingUp, TrendingDown } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

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
import {
  useCreateTransaction,
  useUpdateTransaction,
  type Transaction,
} from '@/hooks/useTransactions'

const INCOME_CATEGORIES = ['Randevu', 'Ürün Satışı', 'Diğer']
const EXPENSE_CATEGORIES = ['Maaş', 'Kira', 'Malzeme', 'Fatura', 'Diğer']

const schema = z.object({
  type: z.enum(['GELIR', 'GIDER']),
  amount: z.number().positive('Tutar sıfırdan büyük olmalı'),
  category: z.string().min(1, 'Kategori zorunlu'),
  description: z.string().optional(),
  date: z.string().min(1, 'Tarih zorunlu'),
})

type FormData = z.infer<typeof schema>

interface Props {
  transaction?: Transaction | null
  defaultType?: 'GELIR' | 'GIDER'
  open: boolean
  onClose: () => void
}

export function TransactionModal({ transaction, defaultType = 'GELIR', open, onClose }: Props) {
  const isEdit = !!transaction
  const { mutateAsync: create, isPending: isCreating } = useCreateTransaction()
  const { mutateAsync: update, isPending: isUpdating } = useUpdateTransaction()
  const isPending = isCreating || isUpdating

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: defaultType,
      amount: 0,
      category: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  })

  const watchedType = form.watch('type')

  useEffect(() => {
    if (!open) return
    if (transaction) {
      form.reset({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description ?? '',
        date: format(new Date(transaction.date), 'yyyy-MM-dd'),
      })
    } else {
      form.reset({
        type: defaultType,
        amount: 0,
        category: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
      })
    }
  }, [open, transaction, defaultType, form])

  // Reset category when type changes
  useEffect(() => {
    form.setValue('category', '')
  }, [watchedType, form])

  async function onSubmit(data: FormData) {
    try {
      if (isEdit && transaction) {
        await update({ id: transaction.id, ...data })
        toast.success('İşlem güncellendi')
      } else {
        await create(data)
        toast.success(data.type === 'GELIR' ? 'Gelir eklendi' : 'Gider eklendi')
      }
      onClose()
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'İşlem başarısız'
        : 'İşlem başarısız'
      toast.error(msg)
    }
  }

  const categories = watchedType === 'GELIR' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">
            {isEdit ? 'İşlemi Düzenle' : 'Yeni İşlem Ekle'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Tip toggle */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İşlem Tipi</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => field.onChange('GELIR')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        field.value === 'GELIR'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <TrendingUp className="h-4 w-4" />
                      Gelir
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange('GIDER')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        field.value === 'GIDER'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <TrendingDown className="h-4 w-4" />
                      Gider
                    </button>
                  </div>
                </FormItem>
              )}
            />

            {/* Tutar */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tutar (₺)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kategori */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tarih */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarih</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <FormLabel>
                    Açıklama{' '}
                    <span className="text-gray-400 font-normal">(opsiyonel)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Notlar..." {...field} />
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
                className={
                  watchedType === 'GELIR'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isEdit ? 'Kaydet' : 'İşlem Ekle'}
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
