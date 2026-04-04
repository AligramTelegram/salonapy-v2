'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  name: z.string().min(2, 'Ad Soyad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir email girin'),
  phone: z.string().optional(),
  subject: z.enum(['satis', 'destek', 'diger'], { message: 'Konu seçin' }),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalı'),
})

type FormValues = z.infer<typeof schema>

const SUBJECTS = [
  { value: 'satis', label: 'Satış & Fiyatlandırma' },
  { value: 'destek', label: 'Teknik Destek' },
  { value: 'diger', label: 'Diğer' },
]

export function IletisimForm() {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormValues) {
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Bir hata oluştu')
      }

      toast.success('Mesajınız alındı!', {
        description: 'En kısa sürede size geri döneceğiz.',
      })
      reset()
    } catch (err) {
      toast.error('Gönderilemedi', {
        description: err instanceof Error ? err.message : 'Lütfen tekrar deneyin.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card p-8">
      <h2 className="mb-6 font-display text-xl font-bold text-gray-900">
        Mesaj Gönderin
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <Label htmlFor="name" className="mb-1.5 text-sm font-medium text-gray-700">
            Ad Soyad <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Ahmet Yılmaz"
            className={errors.name ? 'border-red-400 focus-visible:ring-red-400' : ''}
            {...register('name')}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="email" className="mb-1.5 text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="ahmet@example.com"
              className={errors.email ? 'border-red-400 focus-visible:ring-red-400' : ''}
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone" className="mb-1.5 text-sm font-medium text-gray-700">
              Telefon <span className="text-gray-400 text-xs font-normal">(opsiyonel)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+90 500 000 00 00"
              {...register('phone')}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="subject" className="mb-1.5 text-sm font-medium text-gray-700">
            Konu <span className="text-red-500">*</span>
          </Label>
          <select
            id="subject"
            defaultValue=""
            className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-0 ${
              errors.subject ? 'border-red-400 focus:ring-red-400' : 'border-input'
            }`}
            {...register('subject')}
          >
            <option value="" disabled>Konu seçin...</option>
            {SUBJECTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          {errors.subject && (
            <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="message" className="mb-1.5 text-sm font-medium text-gray-700">
            Mesaj <span className="text-red-500">*</span>
          </Label>
          <textarea
            id="message"
            rows={5}
            placeholder="Mesajınızı buraya yazın..."
            className={`w-full resize-none rounded-md border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-0 ${
              errors.message ? 'border-red-400 focus:ring-red-400' : 'border-input'
            }`}
            {...register('message')}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full gap-2 bg-purple-600 py-3 text-sm font-semibold shadow-lg shadow-purple-200/60 hover:bg-purple-700 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Gönderiliyor...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Mesaj Gönder
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
