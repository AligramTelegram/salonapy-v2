'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 flex flex-col items-center justify-center px-4 py-12">
      {/* Arka Plan Efektleri (Okunabilirliği bozmayacak şekilde optimize edildi) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]" />
        
        {/* Dekoratif Çapraz Çizgiler (Opaklığı düşürüldü) */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.03]" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="1000" y2="1000" stroke="white" strokeWidth="1" />
          <line x1="1000" y1="0" x2="0" y2="1000" stroke="white" strokeWidth="1" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl text-center"
      >
        {/* 404 Başlığı */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="mb-4"
        >
          <div className="relative inline-block">
            <h1 className="font-display text-9xl md:text-[160px] font-black tracking-tighter bg-gradient-to-b from-white via-purple-300 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
              404
            </h1>
          </div>
        </motion.div>

        {/* Ana Metinler */}
        <motion.div className="mb-8 space-y-4">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight">
            Sayfa Bulunamadı
          </h2>
          <p className="mx-auto max-w-md text-lg text-gray-400 font-medium">
            Aradığınız sayfa taşınmış veya silinmiş olabilir. Endişelenmeyin, sizi eve geri götürebiliriz.
          </p>
        </motion.div>

        {/* İpucu Kutusu (Görseldeki okunmama sorunu burada çözüldü) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-10 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-6 py-4 shadow-xl"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
            <Search className="h-4 w-4" />
          </div>
          <p className="text-sm md:text-base text-gray-200">
            <span className="font-bold text-purple-400">İpucu:</span> Giriş sayfasına dönüp işletmenizi tekrar arayın.
          </p>
        </motion.div>

        {/* Butonlar (Referans UX Güncellemesi) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => router.back()}
            variant="secondary"
            className="group h-14 w-full sm:w-44 rounded-2xl bg-white text-gray-950 hover:bg-gray-100 transition-all font-bold text-base shadow-lg"
          >
            <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Geri Dön
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              className="h-14 w-full sm:w-48 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base shadow-xl shadow-purple-600/20 transition-all active:scale-95"
            >
              <Home className="mr-2 h-5 w-5" />
              Anasayfaya Dön
            </Button>
          </Link>
        </div>

        {/* Alt Destek Kısmı */}
        <div className="mt-16 space-y-4 opacity-80">
          <p className="text-sm font-semibold tracking-widest uppercase text-gray-500">Sorun mu yaşıyorsunuz?</p>
          <div className="flex items-center justify-center gap-6">
            <Link href="/iletisim" className="text-sm font-bold text-white hover:text-purple-400 transition-colors">
              Destek Ekibi
            </Link>
            <div className="h-1 w-1 rounded-full bg-gray-700" />
            <a href="mailto:support@salonapy.com" className="text-sm font-bold text-white hover:text-purple-400 transition-colors">
              E-posta Gönder
            </a>
          </div>
        </div>
      </motion.div>

      {/* Yan Dekoratif Yazılar (Daha okunaklı opaklık) */}
      <div className="absolute left-10 top-1/2 -rotate-90 text-gray-800 font-display text-sm font-black tracking-[0.2em] opacity-20 hidden xl:block uppercase">
        Error Code 404
      </div>
      <div className="absolute right-10 top-1/2 rotate-90 text-gray-800 font-display text-sm font-black tracking-[0.2em] opacity-20 hidden xl:block uppercase">
        Salonapy App
      </div>
    </div>
  )
}