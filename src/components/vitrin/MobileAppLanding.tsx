'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const LOCALES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
]

const SCREENS = [
  { img: '/images/screenshots/1.jpeg', titleKey: 'screen1_title', subtitleKey: 'screen1_sub' },
  { img: '/images/screenshots/2.jpeg', titleKey: 'screen2_title', subtitleKey: 'screen2_sub' },
  { img: '/images/screenshots/4.jpeg', titleKey: 'screen3_title', subtitleKey: 'screen3_sub' },
  { img: '/images/screenshots/5.jpeg', titleKey: 'screen4_title', subtitleKey: 'screen4_sub' },
  { img: '/images/screenshots/6.jpeg', titleKey: 'screen5_title', subtitleKey: 'screen5_sub' },
] as const

export function MobileAppLanding() {
  const t = useTranslations('landing')
  const locale = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const isRtl = locale === 'ar'

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen font-sans overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#7c3aed]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/icons/favicon.png" alt="Hemensalon" width={30} height={30} className="rounded-none" />
            <span className="font-black text-white text-lg tracking-tight">{t('nav_logo')}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Lang */}
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-semibold transition">
                <span>{LOCALES.find(l => l.code === locale)?.flag}</span>
                <span className="hidden sm:inline text-xs">{LOCALES.find(l => l.code === locale)?.label}</span>
                <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {menuOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[150px] border border-gray-100">
                  {LOCALES.map(l => (
                    <Link key={l.code} href={`/${l.code}`} onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-violet-50 transition ${l.code === locale ? 'bg-violet-50 font-bold text-violet-700' : 'text-gray-700'}`}>
                      <span className="text-base">{l.flag}</span><span>{l.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <a href="#download"
              className="px-4 py-2 bg-white text-[#7c3aed] text-sm font-black rounded-xl hover:bg-violet-50 transition shadow-lg shadow-black/10">
              {t('nav_download')}
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-start pt-32 pb-0 overflow-hidden text-center"
        style={{ background: 'linear-gradient(175deg, #8b5cf6 0%, #7c3aed 35%, #6d28d9 65%, #c4b5fd 100%)' }}>

        {/* decorative circles */}
        <div className="absolute top-20 -left-32 w-80 h-80 rounded-full bg-white/8 blur-3xl pointer-events-none" />
        <div className="absolute top-40 -right-20 w-64 h-64 rounded-full bg-violet-400/20 blur-3xl pointer-events-none" />

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-5 py-2.5 rounded-full mb-7 border border-white/30 backdrop-blur shadow-inner">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            📱 {t('hero_badge')}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.02] tracking-tight px-4 mb-5 max-w-3xl"
        >
          {t('hero_title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-white/70 max-w-lg px-6 mb-10 leading-relaxed"
        >
          {t('hero_subtitle')}
        </motion.p>

        {/* Store buttons */}
        <motion.div id="download"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 mb-4 px-4">
          <StoreBtn store="apple" />
          <StoreBtn store="google" />
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-white/50 text-sm mb-16">✨ {t('hero_free')}</motion.p>

        {/* Hero phone — positioned to hang off bottom */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, type: 'spring', stiffness: 60 }}
          className="relative select-none pointer-events-none"
        >
          <Phone img="/images/screenshots/1.jpeg" size="lg" />
          {/* fade out bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#c4b5fd] to-transparent pointer-events-none" />
        </motion.div>
      </section>

      {/* ── FEATURE SCREENS ── */}
      {SCREENS.slice(1).map((s, i) => (
        <FeatureBlock key={s.img} screen={s} index={i} t={t} />
      ))}

      {/* ── STATS ── */}
      <StatsSection t={t} />

      {/* ── DOWNLOAD CTA ── */}
      <CtaSection t={t} />

      {/* ── FOOTER ── */}
      <footer className="bg-[#f3f0ff] border-t border-violet-100 py-12 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image src="/icons/favicon.png" alt="Hemensalon" width={26} height={26} className="rounded-none" />
                <span className="font-black text-gray-800 text-base">Hemensalon</span>
              </div>
              <p className="text-gray-400 text-sm max-w-[220px] leading-relaxed">
                {locale === 'tr' ? 'Kuaför ve güzellik salonları için akıllı randevu sistemi.' :
                 locale === 'de' ? 'Intelligentes Terminsystem für Friseursalons.' :
                 locale === 'ar' ? 'نظام مواعيد ذكي لصالونات الشعر.' :
                 'Smart appointment system for hair salons.'}
              </p>
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-4">
                {locale === 'tr' ? 'Yasal' : locale === 'de' ? 'Rechtliches' : locale === 'ar' ? 'قانوني' : 'Legal'}
              </div>
              <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-8 gap-y-2.5">
                {[
                  { href: `/${locale}/gizlilik`,          label: locale === 'tr' ? 'Gizlilik Politikası'  : locale === 'de' ? 'Datenschutzrichtlinie' : locale === 'ar' ? 'سياسة الخصوصية'             : 'Privacy Policy' },
                  { href: `/${locale}/kullanim-sartlari`, label: locale === 'tr' ? 'Kullanım Şartları'    : locale === 'de' ? 'Nutzungsbedingungen'    : locale === 'ar' ? 'شروط الخدمة'                : 'Terms of Service' },
                  { href: `/${locale}/cerez-politikasi`,  label: locale === 'tr' ? 'Çerez Politikası'     : locale === 'de' ? 'Cookie-Richtlinie'      : locale === 'ar' ? 'سياسة ملفات تعريف الارتباط' : 'Cookie Policy' },
                  { href: `/${locale}/kvkk`,              label: locale === 'tr' ? 'KVKK'                 : locale === 'de' ? 'DSGVO / Datenschutz'    : locale === 'ar' ? 'حماية البيانات'             : 'GDPR / Data Protection' },
                  { href: `/${locale}/hesap-silme`,       label: locale === 'tr' ? 'Hesap Silme'          : locale === 'de' ? 'Konto löschen'          : locale === 'ar' ? 'حذف الحساب'                 : 'Account Deletion' },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-violet-600 transition">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-violet-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Hemensalon. {t('footer_rights')}</p>
            <div className="flex gap-1.5">
              {LOCALES.map(l => (
                <Link key={l.code} href={`/${l.code}`}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-base border transition ${l.code === locale ? 'bg-violet-100 border-violet-400 ring-1 ring-violet-400' : 'bg-white border-gray-200 hover:bg-violet-50'}`}
                  title={l.label}>{l.flag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ── Feature block ── */
function FeatureBlock({ screen, index, t }: { screen: typeof SCREENS[number]; index: number; t: any }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const BG_COLORS = [
    { bg: '#f5f3ff', accent: '#7c3aed' },
    { bg: '#ede9fe', accent: '#6d28d9' },
    { bg: '#f5f3ff', accent: '#7c3aed' },
    { bg: '#ede9fe', accent: '#6d28d9' },
  ]
  const colors = BG_COLORS[index % BG_COLORS.length]
  const isEven = index % 2 === 0

  return (
    <section ref={ref} className="py-20 px-5 overflow-hidden" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
        {/* Phone */}
        <motion.div
          className={`flex-shrink-0 ${isEven ? 'md:order-1' : 'md:order-2'}`}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, type: 'spring', stiffness: 70 }}
        >
          <Phone img={screen.img} size="md" />
        </motion.div>

        {/* Text */}
        <motion.div
          className={`${isEven ? 'md:order-2' : 'md:order-1'} text-center md:text-left`}
          initial={{ opacity: 0, x: isEven ? 30 : -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            0{index + 2} — Feature
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-5">
            {t(screen.titleKey as any)}
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-md">
            {t(screen.subtitleKey as any)}
          </p>
          <div className="mt-8 flex flex-wrap gap-2 justify-center md:justify-start">
            {([t('badge_fast'), t('badge_simple'), t('badge_secure')] as string[]).map(b => (
              <span key={b} className="px-3 py-1.5 bg-white rounded-full text-sm font-semibold text-gray-600 border border-gray-200 shadow-sm">{b}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Stats ── */
function StatsSection({ t }: { t: any }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref}
      className="py-20 px-5 text-center"
      style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)' }}>
      <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8">
        {[{ v: '500+', k: 'stats_business' }, { v: '50K+', k: 'stats_appointments' }, { v: '98%', k: 'stats_satisfaction' }].map(({ v, k }, i) => (
          <motion.div key={k}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.12 }}>
            <div className="text-4xl sm:text-5xl font-black text-white mb-1">{v}</div>
            <div className="text-white/60 text-sm font-medium">{t(k as any)}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ── CTA ── */
function CtaSection({ t }: { t: any }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} id="download" className="py-24 px-5 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="text-5xl mb-6">🚀</div>
        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3 tracking-tight">{t('download_title')}</h2>
        <p className="text-gray-400 mb-10 text-lg">{t('download_subtitle')}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <StoreBtn store="apple" dark />
          <StoreBtn store="google" dark />
        </div>
      </motion.div>
    </section>
  )
}

/* ── Store button ── */
function StoreBtn({ store, dark = false }: { store: 'apple' | 'google'; dark?: boolean }) {
  const isApple = store === 'apple'
  return (
    <a href={isApple ? 'https://apps.apple.com' : 'https://play.google.com'}
      target="_blank" rel="noopener noreferrer"
      className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all justify-center shadow-lg ${
        dark
          ? 'bg-gray-900 hover:bg-black text-white shadow-gray-200'
          : 'bg-white hover:bg-gray-50 text-gray-900 shadow-black/15'
      }`}>
      {isApple ? (
        <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      ) : (
        <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 512 512" fill="none">
          <path d="M48 28.9C34.3 36.4 25 51 25 68.2v375.6c0 17.2 9.3 31.8 23 39.3l210-241.1L48 28.9z" fill="#4FC3F7"/>
          <path d="M338.9 174.1L97.3 28.3 48 28.9l210 213L338.9 174.1z" fill="#81D4FA"/>
          <path d="M338.9 337.9L258 242l-210 213 49.3.6 241.6-117.7z" fill="#0288D1"/>
          <path d="M463 222.7l-124.1-48.6L258 242l80.9 95.9L463 289.3c19.8-11.4 19.8-55.2 0-66.6z" fill="#FFC107"/>
        </svg>
      )}
      <div className="text-left">
        <div className={`text-[10px] font-medium leading-none ${dark ? 'text-white/50' : 'text-gray-400'}`}>
          {isApple ? 'Download on the' : 'Get it on'}
        </div>
        <div className="text-sm font-black leading-tight mt-0.5">
          {isApple ? 'App Store' : 'Google Play'}
        </div>
      </div>
    </a>
  )
}

/* ── iPhone frame ── */
function Phone({ img, size }: { img: string; size: 'sm' | 'md' | 'lg' }) {
  const w = size === 'lg' ? 'w-[220px] sm:w-[260px]' : size === 'md' ? 'w-[180px] sm:w-[210px]' : 'w-[150px] sm:w-[170px]'
  return (
    <div className={`relative ${w} drop-shadow-2xl`}>
      <div className="relative rounded-[2.8rem]"
        style={{ background: '#111', padding: '3px', boxShadow: '0 40px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.12) inset' }}>
        {/* buttons */}
        <div className="absolute left-[-3px] top-[76px] w-[3px] h-7 bg-gray-600 rounded-l-full" />
        <div className="absolute left-[-3px] top-[112px] w-[3px] h-9 bg-gray-600 rounded-l-full" />
        <div className="absolute left-[-3px] top-[152px] w-[3px] h-9 bg-gray-600 rounded-l-full" />
        <div className="absolute right-[-3px] top-[106px] w-[3px] h-11 bg-gray-600 rounded-r-full" />
        <div className="rounded-[2.6rem] overflow-hidden bg-black relative" style={{ aspectRatio: '9/19.5' }}>
          <Image src={img} alt="app screen" fill className="object-cover object-top" />
        </div>
      </div>
      <div className="absolute -bottom-4 left-8 right-8 h-6 bg-violet-400/20 blur-2xl rounded-full pointer-events-none" />
    </div>
  )
}
