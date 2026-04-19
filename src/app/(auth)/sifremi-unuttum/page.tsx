'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, ArrowRight, Loader2, MailCheck, Clock, Shield, LockKeyhole } from 'lucide-react'
import { motion } from 'framer-motion'
import { resetPassword } from '@/lib/auth'
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
})

type FormData = z.infer<typeof schema>

export default function SifremiUnuttumPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError(null)
    try {
      await resetPassword(data.email)
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'İstek gönderilemedi')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
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
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 border border-purple-200"
            >
              <MailCheck className="h-8 w-8 text-purple-600" />
            </motion.div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Email Gönderildi!</h2>
            <p className="text-gray-700 mb-6">
              <strong className="text-gray-900">{form.getValues('email')}</strong> adresine şifre sıfırlama linki gönderdik. 
              Spam klasörünüzü de kontrol edin.
            </p>
            <Link href="/giris" className="inline-block w-full">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-500">
                <ArrowLeft className="mr-2 h-4 w-4" />
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
            {/* Left Side - Info Section */}
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
                    <MailCheck className="h-12 w-12 text-white" />
                  </div>
                </div>

                <div className="mb-12">
                  <h2 className="font-display text-3xl font-bold text-white mb-4">Şifrenizi Sıfırlayın</h2>
                  <p className="text-base text-white/80">Hesabınıza güvenli bir şekilde erişim sağlayın</p>
                </div>

                <div className="space-y-5 text-left">
                  {[
                    { icon: Clock, label: '5 Dakika', text: 'Hızlı sıfırlama' },
                    { icon: Shield, label: 'Güvenli', text: 'Şifreli bağlantı' },
                    { icon: LockKeyhole, label: 'Korumalı', text: 'Doğrulanmış işlem' },
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
                  <span>Güvenli bir şekilde erişim sağlayın</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
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
                  <h1 className="font-display text-2xl font-bold text-gray-900">Hemensalon</h1>
                </div>

                {/* Form Title */}
                <div className="mb-8">
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">Şifremi Unuttum</h3>
                  <p className="text-sm text-gray-600">Email adresinize sıfırlama linki göndereceğiz</p>
                </div>

                {/* Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Email Adresiniz</FormLabel>
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
                        {loading ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
                      </Button>
                    </motion.div>
                  </form>
                </Form>

                {/* Back Link */}
                <div className="mt-6 text-center">
                  <Link
                    href="/giris"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Giriş sayfasına dön
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
