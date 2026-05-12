'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import { Calendar, TrendingUp, Users, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL ?? '#'
const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? '#'

const MOCK_APPOINTMENTS = [
  { name: 'Ayşe Kaya', service: 'Saç Kesim', time: '10:00', color: 'bg-purple-500' },
  { name: 'Mehmet Yıldız', service: 'Sakal Düzeltme', time: '11:30', color: 'bg-blue-500' },
  { name: 'Zeynep Demir', service: 'Manikür', time: '13:00', color: 'bg-pink-500' },
  { name: 'Can Arslan', service: 'Saç Boyama', time: '14:30', color: 'bg-amber-500' },
]

function slideUp(delay = 0) {
  return {
    initial: { opacity: 1, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: [0.0, 0.0, 0.2, 1.0] as const },
  }
}

export function Hero() {
  const t = useTranslations('hero')
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const rotateX = useTransform(scrollYProgress, [0, 0.35], [18, 0])
  const scale = useTransform(scrollYProgress, [0, 0.35], [0.88, 1])
  const translateY = useTransform(scrollYProgress, [0, 0.35], [60, 0])

  const STATS = [
    { value: '7.870+', label: t('stat_business') },
    { value: '50.341+', label: t('stat_appointments') },
    { value: '%98', label: t('stat_satisfaction') },
  ]

  return (
    <div ref={containerRef} className="relative">
      <section className="relative overflow-hidden pb-0 pt-28 md:pt-36">
        {/* Arkaplan */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-24 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-400/10 blur-3xl" />
          <div className="absolute -right-48 top-1/2 h-[400px] w-[400px] rounded-full bg-purple-300/10 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-[300px] w-[300px] rounded-full bg-blue-300/[0.08] blur-3xl" />
        </div>

        <div className="container-custom text-center">
          <m.div
            {...slideUp(0)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700"
          >
            <span className="flex h-2 w-2 rounded-full bg-purple-500" aria-hidden="true" />
            {t('badge')}
          </m.div>

          <h1 className="mx-auto mb-5 max-w-3xl font-display text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl lg:text-[3.5rem]">
            {t('h1_1')}{' '}
            <span className="relative text-purple-600">
              {t('h1_highlight')}
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 10" fill="none" aria-hidden="true">
                <path d="M1 7C50 3 100 1 150 1C200 1 250 3 299 7" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
              </svg>
            </span>
            {t('h1_2') ? ` ${t('h1_2')}` : ''}
          </h1>

          <m.p
            {...slideUp(0.1)}
            className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-gray-500"
          >
            {t('subtitle')}
          </m.p>

          {/* CTA */}
          <m.div {...slideUp(0.15)} className="mb-10 flex flex-wrap justify-center gap-3">
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" title={t('appStoreDownload')}>
              <button className="flex items-center gap-3 rounded-xl bg-black px-5 py-3 text-white transition hover:bg-gray-900 shadow-lg">
                <svg className="h-7 w-7 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-none opacity-80">{t('appStoreDownload')}</div>
                  <div className="text-sm font-semibold leading-tight">{t('appStoreLabel')}</div>
                </div>
              </button>
            </a>
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" title={t('playStoreDownload')}>
              <button className="flex items-center gap-3 rounded-xl bg-black px-5 py-3 text-white transition hover:bg-gray-900 shadow-lg">
                <svg className="h-7 w-7 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.37.21.8.22 1.2.03l12.15-6.87-2.7-2.73-10.65 9.57zm-1.15-19.7A1.83 1.83 0 0 0 1.77 5.5v13c0 .54.22 1.02.58 1.36l.08.07 7.28-7.28v-.17L2.03 4.06zm18.04 8.47-2.6-1.47-2.99 3 2.99 2.99 2.62-1.49a1.84 1.84 0 0 0 0-3.03zM4.38.27L16.53 7.1l-2.7 2.7L3.18.27C3.59.07 4.02.08 4.38.27z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-none opacity-80">{t('playStoreDownload')}</div>
                  <div className="text-sm font-semibold leading-tight">{t('playStoreLabel')}</div>
                </div>
              </button>
            </a>
          </m.div>

          {/* Stats */}
          <m.div {...slideUp(0.2)} className="mb-16 flex flex-wrap justify-center gap-10">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </m.div>
        </div>

        {/* 3D Scroll Container */}
        <div className="relative flex items-center justify-center" style={{ perspective: '1000px' }}>
          <m.div
            style={{ rotateX, scale, translateY }}
            className="relative w-full max-w-5xl mx-auto px-4 md:px-8"
          >
            {/* Floating badges */}
            <m.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-2 top-10 z-10 hidden md:flex items-center gap-3 rounded-xl border border-white/60 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-xl"
              aria-hidden="true"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">{t('badge_confirmed')}</div>
                <div className="text-[12px] text-gray-500">Ayşe Kaya · 10:00</div>
              </div>
            </m.div>

            <m.div
              animate={{ y: [6, -6, 6] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -right-2 bottom-16 z-10 hidden md:flex items-center gap-3 rounded-xl border border-white/60 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-xl"
              aria-hidden="true"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-green-600" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">{t('badge_sms')}</div>
                <div className="text-[12px] text-gray-500">{t('badge_reminder')}</div>
              </div>
            </m.div>

            {/* Dashboard kartı */}
            <div className="glass-card overflow-hidden rounded-2xl border border-white/40 shadow-2xl">
              <div className="flex items-center justify-between border-b border-purple-100/40 bg-gradient-to-r from-white/90 to-white/70 px-6 py-4">
                <div className="flex items-center gap-2" aria-hidden="true">
                  <div className="h-3 w-3 rounded-full bg-red-400 shadow-sm" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400 shadow-sm" />
                  <div className="h-3 w-3 rounded-full bg-green-400 shadow-sm" />
                </div>
                <span className="text-xs font-semibold text-gray-600">{t('dashboard_title')}</span>
                <div className="h-5 w-5" aria-hidden="true" />
              </div>

              <div className="grid grid-cols-3 gap-px bg-gradient-to-b from-purple-50/60 to-transparent border-b border-purple-100/40">
                {[
                  { icon: Calendar, label: t('dashboard_today'), value: '12', color: 'text-purple-600', bg: 'from-purple-50 to-purple-50/50', lightBg: 'bg-purple-100/60' },
                  { icon: TrendingUp, label: t('dashboard_revenue'), value: '₺2.840', color: 'text-emerald-600', bg: 'from-emerald-50 to-emerald-50/50', lightBg: 'bg-emerald-100/60' },
                  { icon: Users, label: t('dashboard_customers'), value: '8', color: 'text-blue-600', bg: 'from-blue-50 to-blue-50/50', lightBg: 'bg-blue-100/60' },
                ].map((s) => (
                  <div key={s.label} className={`bg-gradient-to-br ${s.bg} px-5 py-4 backdrop-blur-sm`}>
                    <div className={`mb-2 inline-flex rounded-lg p-2 ${s.lightBg}`}>
                      <s.icon className={`h-4 w-4 ${s.color}`} aria-hidden="true" />
                    </div>
                    <div className="font-display text-lg font-bold text-gray-900">{s.value}</div>
                    <div className="text-xs font-medium text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-b from-white/90 to-white/70 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">{t('dashboard_appointments_title')}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-[11px] font-semibold text-purple-700">
                    <span className="font-display">{MOCK_APPOINTMENTS.length}</span>
                    <span>{t('dashboard_appointments_unit')}</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {MOCK_APPOINTMENTS.map((apt, i) => (
                    <m.div
                      key={apt.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="relative overflow-hidden rounded-lg border border-gray-100 bg-white/80 px-3.5 py-3 shadow-sm"
                    >
                      <div className={`absolute left-0 top-0 h-full w-1 ${apt.color}`} aria-hidden="true" />
                      <div className="flex items-center justify-between gap-3 pl-1">
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-semibold text-gray-900">{apt.name}</div>
                          <div className="text-[11px] text-gray-500">{apt.service}</div>
                        </div>
                        <div className="shrink-0 rounded-lg bg-gray-50 px-2.5 py-1.5 text-[11px] font-semibold text-gray-700">{apt.time}</div>
                      </div>
                    </m.div>
                  ))}
                </div>
              </div>
            </div>
          </m.div>
        </div>

        <div className="h-32 bg-gradient-to-b from-transparent to-white" aria-hidden="true" />
      </section>
    </div>
  )
}
