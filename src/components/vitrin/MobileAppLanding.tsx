'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

/* ─── constants ─────────────────────────────────────────── */

const LOCALES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
]

/* Each feature section mirrors the App Store screenshots */
const SCREENS = [
  {
    id: 'home',
    img: '/images/screenshots/screen-home.jpg',
    gradientFrom: '#6d28d9',
    gradientTo: '#7c3aed',
    titleKey: 'screen1_title' as const,
    subtitleKey: 'screen1_sub' as const,
  },
  {
    id: 'appointments',
    img: '/images/screenshots/screen-appointments.jpg',
    gradientFrom: '#5b21b6',
    gradientTo: '#6d28d9',
    titleKey: 'screen2_title' as const,
    subtitleKey: 'screen2_sub' as const,
  },
  {
    id: 'calendar',
    img: '/images/screenshots/screen-calendar.jpg',
    gradientFrom: '#4c1d95',
    gradientTo: '#5b21b6',
    titleKey: 'screen3_title' as const,
    subtitleKey: 'screen3_sub' as const,
  },
  {
    id: 'customers',
    img: '/images/screenshots/screen-customers.jpg',
    gradientFrom: '#6d28d9',
    gradientTo: '#8b5cf6',
    titleKey: 'screen4_title' as const,
    subtitleKey: 'screen4_sub' as const,
  },
  {
    id: 'reports',
    img: '/images/screenshots/screen-reports.jpg',
    gradientFrom: '#5b21b6',
    gradientTo: '#7c3aed',
    titleKey: 'screen5_title' as const,
    subtitleKey: 'screen5_sub' as const,
  },
]

/* ─── main component ─────────────────────────────────────── */

export function MobileAppLanding() {
  const t = useTranslations('landing')
  const locale = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const isRtl = locale === 'ar'

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* ── Sticky Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-md shadow-purple-200">
              <span className="text-white text-sm font-black">H</span>
            </div>
            <span className="font-black text-gray-900 text-lg tracking-tight">{t('nav_logo')}</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-semibold text-gray-600 transition border border-gray-200"
              >
                <span>{LOCALES.find(l => l.code === locale)?.flag}</span>
                <span className="hidden sm:inline text-xs">{LOCALES.find(l => l.code === locale)?.label}</span>
                <svg className="w-3 h-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute top-full mt-1.5 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 min-w-[148px]">
                  {LOCALES.map(l => (
                    <Link
                      key={l.code}
                      href={`/${l.code}`}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-violet-50 transition ${l.code === locale ? 'bg-violet-50 font-bold text-violet-700' : 'text-gray-700'}`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a
              href="#download"
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-bold rounded-xl transition shadow-md shadow-purple-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t('nav_download')}
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <HeroSection t={t} isRtl={isRtl} />

      {/* ── Feature Screens ── */}
      {SCREENS.map((screen, i) => (
        <FeatureSection key={screen.id} screen={screen} index={i} t={t} />
      ))}

      {/* ── Stats band ── */}
      <StatsBand t={t} />

      {/* ── Download CTA ── */}
      <DownloadCTA t={t} id="download" />

      {/* ── Footer ── */}
      <footer className="bg-gray-950 py-10 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <span className="text-white text-xs font-black">H</span>
            </div>
            <span className="font-bold text-white/60 text-sm">Hemensalon</span>
          </div>
          <p className="text-white/25 text-sm">© {new Date().getFullYear()} Hemensalon. {t('footer_rights')}</p>
          <div className="flex gap-1.5">
            {LOCALES.map(l => (
              <Link key={l.code} href={`/${l.code}`}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-white/5 hover:bg-white/10 transition"
                title={l.label}>{l.flag}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ─── Hero ─────────────────────────────────────────────────── */

function HeroSection({ t, isRtl }: { t: any; isRtl: boolean }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-0 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #7c3aed 0%, #9333ea 40%, #c084fc 80%, #ede9fe 100%)' }}>

      {/* soft blobs */}
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-48 h-48 rounded-full bg-violet-900/20 blur-2xl pointer-events-none" />

      {/* Text */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-8 border border-white/30 backdrop-blur">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            📱 {t('hero_badge')}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
        >
          {t('hero_title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-white/75 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          {t('hero_subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-5"
        >
          <StoreButton store="apple" />
          <StoreButton store="google" dark />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-white/50 text-sm"
        >
          ✨ {t('hero_free')}
        </motion.p>
      </div>

      {/* Hero phone — floats at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, type: 'spring', stiffness: 80 }}
        className="relative z-10 mt-14 flex justify-center pointer-events-none select-none"
      >
        <IPhoneFrame>
          <Image
            src="/images/screenshots/screen-home.jpg"
            alt="Hemensalon app home screen"
            fill
            className="object-cover object-top"
            priority
          />
        </IPhoneFrame>
      </motion.div>
    </section>
  )
}

/* ─── Feature section ────────────────────────────────────────── */

function FeatureSection({
  screen,
  index,
  t,
}: {
  screen: typeof SCREENS[0]
  index: number
  t: any
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const isEven = index % 2 === 0

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 px-5"
      style={{
        background: `linear-gradient(155deg, ${screen.gradientFrom} 0%, ${screen.gradientTo} 50%, #c4b5fd 100%)`,
      }}
    >
      {/* blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-52 h-52 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
        {/* Phone — left on even, right on odd */}
        <motion.div
          className={`flex-shrink-0 ${isEven ? 'md:order-1' : 'md:order-2'}`}
          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, type: 'spring', stiffness: 70 }}
        >
          <IPhoneFrame>
            <Image
              src={screen.img}
              alt={`Hemensalon ${screen.id} screen`}
              fill
              className="object-cover object-top"
            />
          </IPhoneFrame>
        </motion.div>

        {/* Text */}
        <motion.div
          className={`text-white ${isEven ? 'md:order-2 text-left' : 'md:order-1 text-left md:text-right'}`}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">
            0{index + 1} — Feature
          </div>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-5">
            {t(screen.titleKey)}
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-md">
            {t(screen.subtitleKey)}
          </p>

          {/* Mini badges */}
          <div className="flex flex-wrap gap-2 mt-8">
            {[t('badge_fast'), t('badge_simple'), t('badge_secure')].map((b: string) => (
              <span key={b} className="px-3 py-1.5 bg-white/15 rounded-full text-white/90 text-xs font-semibold border border-white/20 backdrop-blur">
                {b}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Stats band ─────────────────────────────────────────────── */

function StatsBand({ t }: { t: any }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const STATS = [
    { value: '500+', key: 'stats_business' },
    { value: '50K+', key: 'stats_appointments' },
    { value: '98%', key: 'stats_satisfaction' },
  ]

  return (
    <section ref={ref} className="bg-gray-950 py-20 px-5">
      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
        {STATS.map(({ value, key }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {value}
            </div>
            <div className="text-white/40 text-sm font-medium">{t(key as any)}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ─── Download CTA ───────────────────────────────────────────── */

function DownloadCTA({ t, id }: { t: any; id: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} id={id} className="bg-gray-950 py-20 px-5 pb-28">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center"
      >
        {/* gradient card */}
        <div className="relative rounded-3xl overflow-hidden p-10 sm:p-14"
          style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #9333ea 100%)' }}>
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 30% 20%, #fff 0%, transparent 50%), radial-gradient(circle at 70% 80%, #a78bfa 0%, transparent 50%)',
            }} />
          <div className="relative z-10">
            <div className="text-5xl mb-5">🚀</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">{t('download_title')}</h2>
            <p className="text-white/60 mb-8">{t('download_subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <StoreButton store="apple" />
              <StoreButton store="google" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

/* ─── Store button ───────────────────────────────────────────── */

function StoreButton({ store, dark = false }: { store: 'apple' | 'google'; dark?: boolean }) {
  const isApple = store === 'apple'
  return (
    <a
      href={isApple ? 'https://apps.apple.com' : 'https://play.google.com'}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all justify-center font-bold shadow-lg ${
        dark
          ? 'bg-gray-900 hover:bg-gray-800 text-white'
          : 'bg-white hover:bg-gray-50 text-gray-900 shadow-white/25'
      }`}
    >
      {isApple ? (
        <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      ) : (
        <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3.18 23.76c.28.15.6.19.93.09l11.44-6.59-2.54-2.54-9.83 9.04zm-1.81-20.6C1.12 3.46 1 3.82 1 4.23v15.54c0 .41.12.77.37 1.07l.06.06 8.7-8.71v-.21L1.43 3.1l-.06.06zm19.1 8.44l-2.5-1.44-2.81 2.81 2.81 2.81 2.52-1.45c.72-.41.72-1.31-.02-1.73zm-17.65 9.97l9.84-5.67-2.54-2.53-7.3 8.2z" />
        </svg>
      )}
      <div className="text-left">
        <div className={`text-[10px] font-medium ${dark ? 'text-white/50' : 'text-gray-400'}`}>
          {isApple ? 'Download on the' : 'Get it on'}
        </div>
        <div className="text-sm font-black -mt-0.5 leading-none">
          {isApple ? 'App Store' : 'Google Play'}
        </div>
      </div>
    </a>
  )
}

/* ─── iPhone frame ───────────────────────────────────────────── */

function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[220px] sm:w-[260px]">
      {/* outer frame */}
      <div
        className="relative rounded-[3rem] overflow-hidden shadow-2xl"
        style={{
          background: '#1a1a2e',
          padding: '3px',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.15) inset, 0 8px 24px rgba(109,40,217,0.3)',
        }}
      >
        {/* side buttons (decorative) */}
        <div className="absolute left-[-4px] top-[88px] w-[3px] h-8 bg-gray-600 rounded-l-full" />
        <div className="absolute left-[-4px] top-[128px] w-[3px] h-10 bg-gray-600 rounded-l-full" />
        <div className="absolute left-[-4px] top-[170px] w-[3px] h-10 bg-gray-600 rounded-l-full" />
        <div className="absolute right-[-4px] top-[120px] w-[3px] h-12 bg-gray-600 rounded-r-full" />

        {/* screen area */}
        <div className="rounded-[2.8rem] overflow-hidden bg-gray-900 relative" style={{ aspectRatio: '9/19.5' }}>
          {/* status bar */}
          <div className="absolute top-0 left-0 right-0 z-20 h-10 flex items-start justify-between px-6 pt-3">
            <span className="text-white text-[10px] font-bold">10:19</span>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              </svg>
              <svg className="w-3.5 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.5 8.5a13 13 0 0121 0M5 12a9 9 0 0114 0M8.5 15.5a5 5 0 017 0M12 19h.01" stroke="currentColor" strokeWidth={2} strokeLinecap="round" fill="none" />
              </svg>
              <div className="flex items-center gap-0.5">
                {[3,3,3,2].map((h, i) => (
                  <div key={i} className={`w-0.5 bg-white rounded-sm`} style={{ height: h * 2 + 2, opacity: i < 3 ? 1 : 0.4 }} />
                ))}
              </div>
              <div className="flex items-center gap-0.5 ml-0.5">
                <div className="w-5 h-2.5 border border-white/60 rounded-sm relative">
                  <div className="absolute inset-0.5 left-0.5 right-1 bg-white rounded-sm" />
                  <div className="absolute right-[-3px] top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-white/60 rounded-r-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-24 h-7 bg-black rounded-full" />

          {/* Screenshot */}
          <div className="absolute inset-0">{children}</div>
        </div>
      </div>

      {/* reflection */}
      <div
        className="absolute -bottom-6 left-4 right-4 h-8 rounded-full blur-xl opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #7c3aed 0%, transparent 70%)' }}
      />
    </div>
  )
}
