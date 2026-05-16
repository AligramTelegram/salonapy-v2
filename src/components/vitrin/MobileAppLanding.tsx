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
  { img: '/images/screenshots/1.jpeg', titleKey: 'screen1_title', subtitleKey: 'screen1_sub', from: '#7c3aed', to: '#9333ea' },
  { img: '/images/screenshots/2.jpeg', titleKey: 'screen2_title', subtitleKey: 'screen2_sub', from: '#5b21b6', to: '#7c3aed' },
  { img: '/images/screenshots/4.jpeg', titleKey: 'screen3_title', subtitleKey: 'screen3_sub', from: '#4c1d95', to: '#6d28d9' },
  { img: '/images/screenshots/5.jpeg', titleKey: 'screen4_title', subtitleKey: 'screen4_sub', from: '#6d28d9', to: '#8b5cf6' },
  { img: '/images/screenshots/6.jpeg', titleKey: 'screen5_title', subtitleKey: 'screen5_sub', from: '#5b21b6', to: '#7c3aed' },
] as const

export function MobileAppLanding() {
  const t = useTranslations('landing')
  const locale = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const isRtl = locale === 'ar'

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/icons/favicon.png" alt="Hemensalon" width={32} height={32} className="rounded-none" />
            <span className="font-black text-gray-900 text-lg tracking-tight">{t('nav_logo')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-semibold text-gray-600 transition border border-gray-200"
              >
                <span>{LOCALES.find(l => l.code === locale)?.flag}</span>
                <span className="hidden sm:inline text-xs">{LOCALES.find(l => l.code === locale)?.label}</span>
                <svg className="w-3 h-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {menuOpen && (
                <div className="absolute top-full mt-1.5 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 min-w-[148px]">
                  {LOCALES.map(l => (
                    <Link key={l.code} href={`/${l.code}`} onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-violet-50 transition ${l.code === locale ? 'bg-violet-50 font-bold text-violet-700' : 'text-gray-700'}`}>
                      <span>{l.flag}</span><span>{l.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <a href="#download" className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-bold rounded-xl transition shadow-md shadow-purple-200">
              {t('nav_download')}
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-14 overflow-hidden" style={{ background: 'linear-gradient(160deg,#7c3aed 0%,#9333ea 45%,#c084fc 80%,#ede9fe 100%)' }}>
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-14 pb-0 flex flex-col md:flex-row items-center gap-8">
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-5 border border-white/30">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              📱 {t('hero_badge')}
            </motion.span>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              {t('hero_title')}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base text-white/75 mb-8 leading-relaxed max-w-md mx-auto md:mx-0">
              {t('hero_subtitle')}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mb-4">
              <StoreButton store="apple" />
              <StoreButton store="google" dark />
            </motion.div>
            <p className="text-white/50 text-sm">✨ {t('hero_free')}</p>
          </div>

          {/* Hero phone */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 70 }}
            className="flex-shrink-0 pointer-events-none select-none">
            <IPhoneFrame size="md">
              <Image src="/images/screenshots/1.jpeg" alt="Hemensalon" fill className="object-cover object-top" priority />
            </IPhoneFrame>
          </motion.div>
        </div>
      </section>

      {/* Feature sections — compact */}
      {SCREENS.slice(1).map((screen, i) => (
        <FeatureSection key={screen.img} screen={screen} index={i} t={t} />
      ))}

      {/* Stats */}
      <StatsBand t={t} />

      {/* CTA */}
      <DownloadCTA t={t} />

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 justify-between mb-10">
            {/* Brand */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <Image src="/icons/favicon.png" alt="Hemensalon" width={28} height={28} className="rounded-none" />
                <span className="font-black text-gray-800">Hemensalon</span>
              </div>
              <p className="text-gray-400 text-sm max-w-[200px] leading-relaxed">
                {locale === 'tr' ? 'Kuaför ve güzellik salonları için akıllı randevu sistemi.' :
                 locale === 'de' ? 'Intelligentes Terminsystem für Friseursalons.' :
                 locale === 'ar' ? 'نظام مواعيد ذكي لصالونات الشعر.' :
                 'Smart appointment system for hair salons.'}
              </p>
            </div>
            {/* Legal links */}
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                {locale === 'tr' ? 'Yasal' : locale === 'de' ? 'Rechtliches' : locale === 'ar' ? 'قانوني' : 'Legal'}
              </div>
              <ul className="space-y-2.5">
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
          {/* Bottom */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Hemensalon. {t('footer_rights')}</p>
            <div className="flex gap-1.5">
              {LOCALES.map(l => (
                <Link key={l.code} href={`/${l.code}`}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-base border transition ${l.code === locale ? 'bg-violet-50 border-violet-300 ring-1 ring-violet-400' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
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

/* ── Feature section ── */
function FeatureSection({ screen, index, t }: { screen: typeof SCREENS[number]; index: number; t: any }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const isEven = index % 2 === 0

  return (
    <section ref={ref} className="relative overflow-hidden py-16 px-5"
      style={{ background: `linear-gradient(145deg, ${screen.from} 0%, ${screen.to} 55%, #c4b5fd 100%)` }}>
      <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-white/8 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <motion.div
          className={`flex-shrink-0 ${isEven ? 'md:order-1' : 'md:order-2'}`}
          initial={{ opacity: 0, x: isEven ? -40 : 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}>
          <IPhoneFrame size="sm">
            <Image src={screen.img} alt="Hemensalon screen" fill className="object-cover object-top" />
          </IPhoneFrame>
        </motion.div>

        <motion.div
          className={`text-white ${isEven ? 'md:order-2' : 'md:order-1 md:text-right'}`}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}>
          <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">0{index + 2} — Feature</div>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight mb-4">{t(screen.titleKey as any)}</h2>
          <p className="text-white/65 text-base leading-relaxed max-w-sm">{t(screen.subtitleKey as any)}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {([t('badge_fast'), t('badge_simple'), t('badge_secure')] as string[]).map((b) => (
              <span key={b} className="px-3 py-1.5 bg-white/15 rounded-full text-white/90 text-xs font-semibold border border-white/20">{b}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Stats ── */
function StatsBand({ t }: { t: any }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} className="bg-gray-950 py-16 px-5">
      <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
        {[{ v: '500+', k: 'stats_business' }, { v: '50K+', k: 'stats_appointments' }, { v: '98%', k: 'stats_satisfaction' }].map(({ v, k }, i) => (
          <motion.div key={k} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}>
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-1">{v}</div>
            <div className="text-white/40 text-sm">{t(k as any)}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ── Download CTA ── */
function DownloadCTA({ t }: { t: any }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} id="download" className="bg-gray-950 pb-20 px-5">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto rounded-3xl overflow-hidden relative p-10 sm:p-14 text-center"
        style={{ background: 'linear-gradient(135deg,#6d28d9 0%,#7c3aed 50%,#9333ea 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, #fff 0%, transparent 50%)' }} />
        <div className="relative z-10">
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{t('download_title')}</h2>
          <p className="text-white/55 mb-7 text-sm">{t('download_subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <StoreButton store="apple" light />
            <StoreButton store="google" light />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

/* ── Store button ── */
function StoreButton({ store, dark = false, light = false }: { store: 'apple' | 'google'; dark?: boolean; light?: boolean }) {
  const isApple = store === 'apple'
  let cls = 'bg-white hover:bg-gray-50 text-gray-900 shadow-white/20'
  if (dark) cls = 'bg-gray-900 hover:bg-gray-800 text-white border border-white/10'
  if (light) cls = 'bg-white hover:bg-gray-100 text-gray-900'
  const subColor = dark ? 'text-white/50' : 'text-gray-400'
  return (
    <a href={isApple ? 'https://apps.apple.com' : 'https://play.google.com'} target="_blank" rel="noopener noreferrer"
      className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all justify-center font-bold shadow-lg ${cls}`}>
      {isApple ? (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 512 512" fill="none">
          <path d="M48 28.9C34.3 36.4 25 51 25 68.2v375.6c0 17.2 9.3 31.8 23 39.3l210-241.1L48 28.9z" fill="#4FC3F7"/>
          <path d="M338.9 174.1L97.3 28.3 48 28.9l210 213L338.9 174.1z" fill="#81D4FA"/>
          <path d="M338.9 337.9L258 242l-210 213 49.3.6 241.6-117.7z" fill="#0288D1"/>
          <path d="M463 222.7l-124.1-48.6L258 242l80.9 95.9L463 289.3c19.8-11.4 19.8-55.2 0-66.6z" fill="#FFC107"/>
        </svg>
      )}
      <div className="text-left">
        <div className={`text-[10px] font-medium leading-none ${subColor}`}>{isApple ? 'Download on the' : 'Get it on'}</div>
        <div className="text-sm font-black leading-tight">{isApple ? 'App Store' : 'Google Play'}</div>
      </div>
    </a>
  )
}

/* ── iPhone frame ── */
function IPhoneFrame({ children, size = 'md' }: { children: React.ReactNode; size?: 'sm' | 'md' }) {
  const w = size === 'sm' ? 'w-[140px] sm:w-[160px]' : 'w-[160px] sm:w-[190px]'
  return (
    <div className={`relative ${w}`}>
      {/* outer bezel */}
      <div className="relative rounded-[2.8rem]"
        style={{ background: '#1a1a1a', padding: '3px', boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset, 0 6px 20px rgba(109,40,217,0.3)' }}>
        {/* side buttons */}
        <div className="absolute left-[-3px] top-[80px] w-[3px] h-7 bg-gray-600 rounded-l-full" />
        <div className="absolute left-[-3px] top-[116px] w-[3px] h-9 bg-gray-600 rounded-l-full" />
        <div className="absolute left-[-3px] top-[156px] w-[3px] h-9 bg-gray-600 rounded-l-full" />
        <div className="absolute right-[-3px] top-[110px] w-[3px] h-11 bg-gray-600 rounded-r-full" />

        {/* screen — screenshot fills 100%, no overlays */}
        <div className="rounded-[2.6rem] overflow-hidden bg-black relative" style={{ aspectRatio: '9/19.5' }}>
          <div className="absolute inset-0">{children}</div>
        </div>
      </div>
      {/* glow */}
      <div className="absolute -bottom-5 left-6 right-6 h-6 rounded-full blur-xl opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #7c3aed 0%, transparent 70%)' }} />
    </div>
  )
}
