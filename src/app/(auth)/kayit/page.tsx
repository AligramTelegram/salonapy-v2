'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, CheckCircle, Sparkles, Shield, Zap, Lock, ArrowRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'
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

export const dynamic = 'force-dynamic'

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

export default function KayitPage() {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white to-gray-50 backdrop-blur-xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 border border-green-200"
            >
              <CheckCircle className="h-8 w-8 text-green-600" />
            </motion.div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Email Gönderildi!</h2>
            <p className="text-gray-700 mb-6">
              <strong className="text-gray-900">{form.getValues('email')}</strong> adresine doğrulama linki gönderdik. Email kutunuzu kontrol edin.
            </p>
            <Link href="/giris">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-500">
                Giriş Sayfasına Dön
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950">
      {/* Background Elements */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl"
        >
          {/* Split Card */}
          <div className="grid gap-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl md:grid-cols-2">
            {/* Left Side - Benefits Section */}
            <div className="relative hidden items-center justify-center bg-gradient-to-br from-purple-600 via-purple-500 to-purple-600 p-12 md:flex">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white blur-[100px]" />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative z-10"
              >
                <h2 className="font-display text-4xl font-bold text-white mb-2">
                  Hemen Başlayın
                </h2>
                <p className="text-lg text-white/90 mb-12">
                  {selectedPlan
                    ? `${PLAN_LABELS[selectedPlan]} plan ile başlayın`
                    : '14 gün ücretsiz, kredi kartı gerekmez'}
                </p>

                {/* Features */}
                <div className="space-y-6">
                  {[
                    { icon: Sparkles, title: 'Kurulum Yok', desc: '5 dakikada hazır' },
                    { icon: Zap, title: 'Hızlı & Güvenli', desc: 'Enterprise-grade' },
                    { icon: Shield, title: 'Veriler Korunuyor', desc: 'KVKK uyumlu' },
                    { icon: Lock, title: 'SSL Şifrelemesi', desc: 'Tüm işlemler güvenli' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{item.title}</div>
                        <div className="text-sm text-white/70">{item.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-white/20">
                  <p className="text-sm text-white/70">
                    ✓ Kaydolarak <Link href="/kullanim-sartlari" className="underline hover:text-white">Kullanım Şartları</Link>'nı kabul edersiniz
                  </p>
                </div>

                <Link href="/" className="mt-8 inline-flex items-center justify-center w-full gap-2 text-sm text-white/70 hover:text-white transition-colors">
                  <Home className="h-4 w-4" />
                  Anasayfaya Dön
                </Link>
              </motion.div>
            </div>

            {/* Right Side - Form Section */}
            <div className="flex items-center justify-center bg-gradient-to-br from-white to-gray-50 p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full max-w-sm"
              >
                {/* Logo for Mobile */}
                <div className="mb-8 md:hidden text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-purple-500">
                    <span className="font-display text-lg font-bold text-white">S</span>
                  </div>
                  <h1 className="font-display text-2xl font-bold text-gray-900">Salonapy</h1>
                </div>

                {/* Form Title */}
                <div className="mb-8">
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">Hesap Oluştur</h3>
                  <p className="text-sm text-gray-600">
                    {selectedPlan
                      ? `${PLAN_LABELS[selectedPlan]} planı ile kayıt ol`
                      : '14 gün ücretsiz denemeye başla'}
                  </p>
                  <Link href="/" className="mt-3 inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 transition-colors md:hidden">
                    <Home className="h-3 w-3" />
                    Anasayfaya dön
                  </Link>
                </div>

                {/* Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">İşletme Adı</FormLabel>
                          <FormControl>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                              <Input
                                placeholder="Güzellik Salonu, Berber, Klinik..."
                                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                                {...field}
                              />
                            </motion.div>
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Ad Soyad</FormLabel>
                          <FormControl>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                              <Input
                                placeholder="Ahmet Yılmaz"
                                autoComplete="name"
                                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                                {...field}
                              />
                            </motion.div>
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Email</FormLabel>
                          <FormControl>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                              <Input
                                type="email"
                                placeholder="ornek@isletme.com"
                                autoComplete="email"
                                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                                {...field}
                              />
                            </motion.div>
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Telefon <span className="text-gray-500 text-xs">(opsiyonel)</span>
                          </FormLabel>
                          <FormControl>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                              <Input
                                type="tel"
                                placeholder="0555 123 45 67"
                                autoComplete="tel"
                                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                                {...field}
                              />
                            </motion.div>
                          </FormControl>
                          <FormMessage className="text-red-600" />
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
                              <motion.div whileFocus={{ scale: 1.02 }} className="relative">
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
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                  tabIndex={-1}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </motion.div>
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
                              <motion.div whileFocus={{ scale: 1.02 }}>
                                <Input
                                  type={showPassword ? 'text' : 'password'}
                                  placeholder="••••••••"
                                  autoComplete="new-password"
                                  className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                                  {...field}
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage className="text-red-600 text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700"
                      >
                        {error}
                      </motion.div>
                    )}

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-2.5 rounded-lg shadow-lg shadow-purple-500/20"
                        disabled={loading}
                      >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
                      </Button>
                    </motion.div>
                  </form>
                </Form>

                {/* Sign In Link */}
                <p className="mt-6 text-center text-sm text-gray-600">
                  Zaten hesabınız var mı?{' '}
                  <Link
                    href="/giris"
                    className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    Giriş yapın
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 text-center text-sm text-gray-500"
          >
            
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
