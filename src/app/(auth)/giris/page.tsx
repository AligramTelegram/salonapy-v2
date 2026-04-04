'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Calendar, Users, TrendingUp, ArrowRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'
import { login, getRedirectPath } from '@/lib/auth'
import { createClient } from '@/lib/supabase/client'
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

const schema = z.object({
  email: z.string().email('Geçerli bir email adresi girin'),
  password: z.string().min(1, 'Şifre gerekli'),
})

type FormData = z.infer<typeof schema>

export default function GirisPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Client-side fallback: zaten giriş yapmışsa doğru panele yönlendir
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        getRedirectPath()
          .then((path) => router.replace(path))
          .catch(() => router.replace('/'))
      }
    })
  }, [router])

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError(null)
    try {
      await login(data.email, data.password)
      const redirectPath = await getRedirectPath()
      router.push(redirectPath)
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Giriş yapılamadı'
      if (message.includes('Invalid login credentials')) {
        setError('Email veya şifre hatalı')
      } else if (message.includes('Email not confirmed')) {
        setError('Email adresinizi doğrulamanız gerekiyor. Lütfen email kutunuzu kontrol edin.')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
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
            {/* Left Side - Welcome Section */}
            <div className="relative hidden items-center justify-center bg-gradient-to-br from-purple-600 via-purple-500 to-purple-600 p-12 md:flex">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white blur-[100px]" />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative z-10 text-center"
              >
                <div className="mb-8">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-xl">
                    <Calendar className="h-12 w-12 text-white" />
                  </div>
                </div>

                <h2 className="font-display text-4xl font-bold text-white mb-4">
                  Hoş Geldiniz!
                </h2>
                <p className="text-lg text-white/90 mb-8">
                  Operasyonlarınızı yönetmeye başlayın
                </p>

                {/* Stats */}
                <div className="space-y-4 pt-8">
                  {[
                    { icon: Calendar, label: 'Randevu Yönetimi', text: 'Otomasyonla devam' },
                    { icon: Users, label: 'Müşteri Paneli', text: 'Detaylı raporlar' },
                    { icon: TrendingUp, label: 'Mali Anlık Görünüm', text: 'Gelir takibi' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3 text-white/80"
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <div className="text-left">
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-white/60">{item.text}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 flex items-center justify-center gap-2 text-white/70 text-sm">
                  <span>14 gün ücretsiz denemeye başlayın</span>
                  <ArrowRight className="h-4 w-4" />
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
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">Giriş Yap</h3>
                  <p className="text-sm text-gray-600">Dashboard'a erişmek için giriş yapın</p>
                  <Link href="/" className="mt-3 inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 transition-colors md:hidden">
                    <Home className="h-3 w-3" />
                    Anasayfaya dön
                  </Link>
                </div>

                {/* Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Email Adresi</FormLabel>
                          <FormControl>
                            <motion.div
                              whileFocus={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                            >
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
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-gray-700">Şifre</FormLabel>
                            <Link
                              href="/sifremi-unuttum"
                              className="text-xs text-purple-600 hover:text-purple-700 transition-colors"
                            >
                              Şifremi unuttum
                            </Link>
                          </div>
                          <FormControl>
                            <motion.div
                              whileFocus={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                              className="relative"
                            >
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />

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
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg shadow-purple-500/20"
                        disabled={loading}
                      >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                      </Button>
                    </motion.div>
                  </form>
                </Form>

                {/* Sign Up Link */}
                <p className="mt-8 text-center text-sm text-gray-600">
                  Hesabınız yok mu?{' '}
                  <Link
                    href="/kayit"
                    className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    Ücretsiz başlayın
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
