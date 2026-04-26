'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, CheckCircle, Sparkles, Shield, Zap, Lock, Home } from 'lucide-react'
import { registerWithSupabase } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const schema = z
  .object({
    businessName: z.string().min(2, 'İşletme adı en az 2 karakter olmalı'),
    name: z.string().min(2, 'Adınız en az 2 karakter olmalı'),
    email: z.string().email('Geçerli bir email adresi girin'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
    passwordConfirm: z.string(),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: 'Şifreler eşleşmiyor',
    path: ['passwordConfirm'],
  })

type FormData = z.infer<typeof schema>

const PAID_PLANS = ['PROFESYONEL', 'ISLETME'] as const
type PaidPlan = (typeof PAID_PLANS)[number]

const PLAN_LABELS: Record<string, string> = {
  PROFESYONEL: 'Profesyonel',
  ISLETME: 'İşletme',
}

const FEATURES = [
  { icon: Sparkles, title: 'Kurulum Yok', desc: '5 dakikada hazır' },
  { icon: Zap, title: 'Hızlı & Güvenli', desc: 'Enterprise-grade' },
  { icon: Shield, title: 'Veriler Korunuyor', desc: 'KVKK uyumlu' },
  { icon: Lock, title: 'SSL Şifrelemesi', desc: 'Tüm işlemler güvenli' },
]

function KayitContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planParam = searchParams.get('plan')?.toUpperCase() ?? ''
  const isPaidPlan = PAID_PLANS.includes(planParam as PaidPlan)
  const selectedPlan: PaidPlan | null = isPaidPlan ? (planParam as PaidPlan) : null

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessName: '',
      name: '',
      email: '',
      phone: '',
      password: '',
      passwordConfirm: '',
    },
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError(null)
    try {
      const authData = await registerWithSupabase(data.email, data.password, data.name)

      if (!authData.user) {
        setEmailSent(true)
        return
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseId: authData.user.id,
          email: data.email,
          name: data.name,
          businessName: data.businessName,
          phone: data.phone || null,
          plan: selectedPlan ?? 'BASLANGIC',
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Hesap oluşturulamadı')

      if (selectedPlan) {
        router.push(`/odeme-yap?plan=${selectedPlan}&slug=${json.tenantSlug}`)
      } else {
        router.push(`/b/${json.tenantSlug}`)
      }
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Kayıt oluşturulamadı'
      if (message.includes('User already registered')) {
        setError('Bu email adresi zaten kayıtlı. Giriş yapmayı deneyin.')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 border border-green-200">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Email Gönderildi!</h2>
          <p className="text-gray-600 mb-6">
            <strong className="text-gray-900">{form.getValues('email')}</strong> adresine doğrulama linki gönderdik.
          </p>
          <Link href="/giris">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Giriş Sayfasına Dön</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl animate-fade-in">
        {/* Split Card */}
        <div className="grid overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:grid-cols-2">

          {/* Sol panel — sadece masaüstünde */}
          <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-purple-700 via-purple-600 to-purple-700 p-12">
            <h2 className="font-display text-4xl font-bold text-white mb-2">Hemen Başlayın</h2>
            <p className="text-white/80 mb-10">
              {selectedPlan
                ? `${PLAN_LABELS[selectedPlan]} plan ile başlayın`
                : '3 gün ücretsiz, kredi kartı gerekmez'}
            </p>
            <div className="space-y-5">
              {FEATURES.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{item.title}</div>
                    <div className="text-xs text-white/70">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-white/20">
              <p className="text-xs text-white/60">
                ✓ Kaydolarak{' '}
                <Link href="/kullanim-sartlari" className="underline hover:text-white">
                  Kullanım Şartları
                </Link>
                &apos;nı kabul edersiniz
              </p>
            </div>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              <Home className="h-4 w-4" />
              Anasayfaya Dön
            </Link>
          </div>

          {/* Sağ panel — form */}
          <div className="flex items-center justify-center bg-white p-8 md:p-10">
            <div className="w-full max-w-sm">
              {/* Mobil logo */}
              <div className="mb-7 md:hidden text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-purple-500">
                  <span className="font-display text-lg font-bold text-white">S</span>
                </div>
                <h1 className="font-display text-xl font-bold text-gray-900">Hemensalon</h1>
                <Link href="/" className="mt-2 inline-flex items-center gap-1 text-xs text-purple-600">
                  <Home className="h-3 w-3" />
                  Anasayfaya dön
                </Link>
              </div>

              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-1">Hesap Oluştur</h3>
                <p className="text-sm text-gray-500">
                  {selectedPlan
                    ? `${PLAN_LABELS[selectedPlan]} planı ile kayıt ol`
                    : '3 gün ücretsiz denemeye başla'}
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-sm">İşletme Adı</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Güzellik Salonu, Berber, Klinik..."
                            className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-sm">Ad Soyad</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ahmet Yılmaz"
                            autoComplete="name"
                            className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-sm">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="ornek@isletme.com"
                            autoComplete="email"
                            className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-sm">Şifre</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Min. 6 karakter"
                                autoComplete="new-password"
                                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-600 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="passwordConfirm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-sm">Tekrar</FormLabel>
                          <FormControl>
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="••••••••"
                              autoComplete="new-password"
                              className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-md shadow-purple-200"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
                  </Button>
                </form>
              </Form>

              <p className="mt-5 text-center text-sm text-gray-500">
                Zaten hesabınız var mı?{' '}
                <Link href="/giris" className="font-medium text-purple-600 hover:text-purple-700 transition-colors">
                  Giriş yapın
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function KayitPage() {
  return (
    <Suspense>
      <KayitContent />
    </Suspense>
  )
}
