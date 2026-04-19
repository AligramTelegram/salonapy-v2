'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Calendar, TrendingUp, Users, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STATS = [
  { value: '7.870+', label: 'İşletme' },
  { value: '50.341+', label: 'Randevu' },
  { value: '%98', label: 'Memnuniyet' },
]

const MOCK_APPOINTMENTS = [
  { name: 'Ayşe Kaya', service: 'Saç Kesim', time: '10:00', color: 'bg-purple-500' },
  { name: 'Mehmet Yıldız', service: 'Sakal Düzeltme', time: '11:30', color: 'bg-blue-500' },
  { name: 'Zeynep Demir', service: 'Manikür', time: '13:00', color: 'bg-pink-500' },
  { name: 'Can Arslan', service: 'Saç Boyama', time: '14:30', color: 'bg-amber-500' },
]

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay },
  }
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })

  const rotateX = useTransform(scrollYProgress, [0, 0.35], [18, 0])
  const scale = useTransform(scrollYProgress, [0, 0.35], [0.88, 1])
  const translateY = useTransform(scrollYProgress, [0, 0.35], [60, 0])

  return (
    <div ref={containerRef} className="relative">
      <section className="relative overflow-hidden pb-0 pt-28 md:pt-36">
        {/* Arkaplan */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-400/10 blur-3xl" />
          <div className="absolute -right-48 top-1/2 h-[400px] w-[400px] rounded-full bg-purple-300/10 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-[300px] w-[300px] rounded-full bg-blue-300/[0.08] blur-3xl" />
        </div>

        <div className="container-custom text-center">
          {/* Badge */}
          <motion.div
            {...fadeUp(0)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700"
          >
            <span className="flex h-2 w-2 rounded-full bg-purple-500" />
            3 gün ücretsiz deneme · Kredi kartı gerekmez
          </motion.div>

          {/* Başlık */}
          <motion.h1
            {...fadeUp(0.1)}
            className="mx-auto mb-5 max-w-3xl font-display text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl lg:text-[3.5rem]"
          >
            Randevunuzu{' '}
            <span className="relative text-purple-600">
              Otomatikleştirin
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 10" fill="none">
                <path d="M1 7C50 3 100 1 150 1C200 1 250 3 299 7" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
              </svg>
            </span>
            ,{' '}İşlerinizi büyütün
          </motion.h1>

          {/* Alt başlık */}
          <motion.p {...fadeUp(0.2)} className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-gray-500">
            Kuaför, berber, güzellik merkezi ve klinikler için akıllı randevu yönetimi.
            SMS hatırlatmaları, otomatik bildirimler ve detaylı raporlar.
          </motion.p>

          {/* CTA */}
          <motion.div {...fadeUp(0.3)} className="mb-10 flex flex-wrap justify-center gap-3">
            <Link href="/kayit" title="3 Gün Ücretsiz Deneme">
              <Button size="lg" className="h-12 bg-purple-600 px-6 text-base shadow-lg shadow-purple-200/60 hover:bg-purple-700">
                Ücretsiz Başla
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeUp(0.4)} className="mb-16 flex flex-wrap justify-center gap-10">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 3D Scroll Container */}
        <div className="relative flex items-center justify-center" style={{ perspective: '1000px' }}>
          <motion.div
            style={{ rotateX, scale, translateY }}
            className="relative w-full max-w-5xl mx-auto px-4 md:px-8"
          >
            {/* Floating badges */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-2 top-10 z-10 hidden md:flex items-center gap-3 rounded-xl border border-white/60 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-xl"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">Randevu Onaylandı</div>
                <div className="text-[12px] text-gray-500">Ayşe Kaya · 10:00</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -right-2 bottom-16 z-10 hidden md:flex items-center gap-3 rounded-xl border border-white/60 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-xl"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-green-600">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">SMS gönderildi</div>
                <div className="text-[12px] text-gray-500">Hatırlatma · 2 dk önce</div>
              </div>
            </motion.div>

            {/* Dashboard kartı */}
            <div className="glass-card overflow-hidden rounded-2xl border border-white/40 shadow-2xl">
              {/* Titlebar */}
              <div className="flex items-center justify-between border-b border-purple-100/40 bg-gradient-to-r from-white/90 to-white/70 px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400 shadow-sm" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400 shadow-sm" />
                  <div className="h-3 w-3 rounded-full bg-green-400 shadow-sm" />
                </div>
                <span className="text-xs font-semibold text-gray-600">Hemensalon Panel</span>
                <div className="h-5 w-5" />
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-px bg-gradient-to-b from-purple-50/60 to-transparent border-b border-purple-100/40">
                {[
                  { icon: Calendar, label: 'Bugün', value: '12', color: 'text-purple-600', bg: 'from-purple-50 to-purple-50/50', lightBg: 'bg-purple-100/60' },
                  { icon: TrendingUp, label: 'Gelir', value: '₺2.840', color: 'text-emerald-600', bg: 'from-emerald-50 to-emerald-50/50', lightBg: 'bg-emerald-100/60' },
                  { icon: Users, label: 'Müşteri', value: '8', color: 'text-blue-600', bg: 'from-blue-50 to-blue-50/50', lightBg: 'bg-blue-100/60' },
                ].map((s) => (
                  <div key={s.label} className={`bg-gradient-to-br ${s.bg} px-5 py-4 backdrop-blur-sm`}>
                    <div className={`mb-2 inline-flex rounded-lg p-2 ${s.lightBg}`}>
                      <s.icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                    <div className="font-display text-lg font-bold text-gray-900">{s.value}</div>
                    <div className="text-xs font-medium text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Appointment list */}
              <div className="bg-gradient-to-b from-white/90 to-white/70 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">Bugünkü Randevular</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-[11px] font-semibold text-purple-700">
                    <span className="font-display">{MOCK_APPOINTMENTS.length}</span>
                    <span>randevu</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {MOCK_APPOINTMENTS.map((apt, i) => (
                    <motion.div
                      key={apt.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="relative overflow-hidden rounded-lg border border-gray-100 bg-white/80 px-3.5 py-3 shadow-sm"
                    >
                      <div className={`absolute left-0 top-0 h-full w-1 ${apt.color}`} />
                      <div className="flex items-center justify-between gap-3 pl-1">
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-semibold text-gray-900">{apt.name}</div>
                          <div className="text-[11px] text-gray-500">{apt.service}</div>
                        </div>
                        <div className="shrink-0 rounded-lg bg-gray-50 px-2.5 py-1.5 text-[11px] font-semibold text-gray-700">{apt.time}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Alt gradient geçiş */}
        <div className="h-32 bg-gradient-to-b from-transparent to-white" />
      </section>
    </div>
  )
}
