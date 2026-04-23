'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Calendar, Users, TrendingUp, Home } from 'lucide-react'
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

const schema = z.object({
  email: z.string().email('Geçerli bir email adresi girin'),
  password: z.string().min(1, 'Şifre gerekli'),
})

type FormData = z.infer<typeof schema>

const URL_ERRORS: Record<string, string> = {
  'staff-inactive': 'Hesabınız devre dışı bırakılmış. Lütfen işletmenizle iletişime geçin.',
  'not-staff': 'Bu hesapla personel paneline erişim yetkiniz yok.',
}

function GirisForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError && URL_ERRORS[urlError]) {
      setError(URL_ERRORS[urlError])
    }
  }, [searchParams])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const from = searchParams.get('from')
        if (from && from.startsWith('/')) {
          router.replace(from)
        } else {
          getRedirectPath()
            .then((path) => router.replace(path))
            .catch(() => router.replace('/'))
        }
      }
    })
  }, [router, searchParams])

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError(null)
    try {
      await login(data.email, data.password)
      const from = searchParams.get('from')
      if (from && from.startsWith('/')) {
        router.push(from)
      } else {
        const redirectPath = await getRedirectPath()
        router.push(redirectPath)
      }
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
    <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl animate-fade-in">
        {/* Split Card */}
        <div className="grid overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:grid-cols-2">

          {/* Sol panel — sadece masaüstünde göster */}
          <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 via-purple-600 to-purple-700 p-12 text-center">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20">
              <Calendar className="h-10 w-10 text-white" />
            </div>
            <h2 className="font-display text-4xl font-bold text-white mb-3">Hoş Geldiniz!</h2>
            <p className="text-white/80 mb-10">Operasyonlarınızı yönetmeye başlayın</p>
            <div className="w-full space-y-4 text-left">
              {[
                { icon: Calendar, label: 'Randevu Yönetimi', text: 'Otomasyon ile kolaylaştır' },
                { icon: Users, label: 'Müşteri Paneli', text: 'Detaylı raporlar' },
                { icon: TrendingUp, label: 'Mali Görünüm', text: 'Gelir takibi' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-white/80">
                  <item.icon className="h-5 w-5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-white/60">{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/"
              className="mt-12 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              <Home className="h-4 w-4" />
              Anasayfaya Dön
            </Link>
          </div>

          {/* Sağ panel — form */}
          <div className="flex items-center justify-center bg-white p-8 md:p-12">
            <div className="w-full max-w-sm">
              {/* Mobil logo */}
              <div className="mb-8 md:hidden text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-purple-500">
                  <span className="font-display text-lg font-bold text-white">S</span>
                </div>
                <h1 className="font-display text-xl font-bold text-gray-900">Hemensalon</h1>
                <Link href="/" className="mt-2 inline-flex items-center gap-1 text-xs text-purple-600">
                  <Home className="h-3 w-3" />
                  Anasayfaya dön
                </Link>
              </div>

              <div className="mb-7">
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-1">Giriş Yap</h3>
                <p className="text-sm text-gray-500">Dashboard'a erişmek için giriş yapın</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Email Adresi</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="ornek@isletme.com"
                            autoComplete="email"
                            className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                            {...field}
                          />
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
                          <div className="relative">
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
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                              tabIndex={-1}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

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
                    {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                  </Button>
                </form>
              </Form>

              <p className="mt-7 text-center text-sm text-gray-500">
                Hesabınız yok mu?{' '}
                <Link href="/kayit" className="font-medium text-purple-600 hover:text-purple-700 transition-colors">
                  Ücretsiz başlayın
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GirisPage() {
  return (
    <Suspense fallback={null}>
      <GirisForm />
    </Suspense>
  )
}
