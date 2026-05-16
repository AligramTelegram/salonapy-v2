'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'

/* ─── constants ─── */
const LOCALES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
]

const MARQUEE_ITEMS = [
  '📅 Randevu Yönetimi', '👥 Müşteri CRM', '📊 Finans Raporları',
  '📦 Stok Takibi', '👤 Personel Yönetimi', '🔔 Bildirimler',
  '💳 Ödeme Takibi', '📱 iOS & Android', '🌍 4 Dil Desteği',
]

/* ─── main ─── */
export function MobileAppLanding() {
  const t = useTranslations('landing')
  const locale = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const isRtl = locale === 'ar'

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#050508] text-white font-sans overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-5 mt-3">
          <div className="flex items-center justify-between h-12 px-5 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl shadow-black/20">
            <div className="flex items-center gap-2.5">
              <Image src="/icons/favicon.png" alt="Hemensalon" width={28} height={28} className="rounded-none" />
              <span className="font-black text-white text-base tracking-tight">Hemensalon</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/8 hover:bg-white/15 text-white/80 text-xs font-semibold transition">
                  {LOCALES.find(l => l.code === locale)?.flag}
                  <span className="hidden sm:inline">{LOCALES.find(l => l.code === locale)?.label}</span>
                  <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {menuOpen && (
                  <div className="absolute top-full mt-2 right-0 bg-[#111118] rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50 min-w-[150px]">
                    {LOCALES.map(l => (
                      <Link key={l.code} href={`/${l.code}`} onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-white/8 transition ${l.code === locale ? 'text-violet-400 font-bold bg-violet-500/10' : 'text-white/70'}`}>
                        <span className="text-base">{l.flag}</span><span>{l.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <a href="#download"
                className="px-4 py-1.5 text-xs font-black rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white transition shadow-lg shadow-violet-900/40">
                {t('nav_download')}
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <HeroSection t={t} />

      {/* ── MARQUEE ── */}
      <MarqueeBand />

      {/* ── BENTO GRID ── */}
      <BentoSection t={t} locale={locale} />

      {/* ── STATS ── */}
      <StatsSection t={t} />

      {/* ── CTA ── */}
      <CtaSection t={t} />

      {/* ── FOOTER ── */}
      <FooterSection t={t} locale={locale} />
    </div>
  )
}

/* ─────────────────── HERO ─────────────────── */
function HeroSection({ t }: { t: any }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-5 pt-24 pb-16 overflow-hidden">

      {/* Animated dot grid */}
      <div className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none">
        <div className="absolute inset-0 rounded-full bg-violet-600/20 blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <span className="inline-flex items-center gap-2 text-xs font-bold text-violet-300 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur mb-8">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
            {t('hero_badge')}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="text-6xl sm:text-7xl md:text-8xl font-black leading-[0.95] tracking-tighter mb-6"
        >
          <span className="text-white">{t('hero_title').split(' ').slice(0, 2).join(' ')}</span>
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            {t('hero_title').split(' ').slice(2).join(' ')}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-white/45 text-lg max-w-lg mx-auto mb-10 leading-relaxed"
        >
          {t('hero_subtitle')}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          id="download"
          className="flex flex-col sm:flex-row gap-3 justify-center mb-5"
        >
          <StoreBtn store="apple" />
          <StoreBtn store="google" />
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-white/30 text-sm">✨ {t('hero_free')}</motion.p>
      </div>

      {/* Floating phones */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, type: 'spring', stiffness: 50 }}
        className="relative z-10 mt-16 flex justify-center items-end gap-4 pointer-events-none select-none"
      >
        {/* Left phone */}
        <div className="hidden sm:block translate-y-8 opacity-50 scale-[0.82]">
          <PhoneFrame img="/images/screenshots/2.jpeg" glow={false} />
        </div>
        {/* Center main phone */}
        <div className="relative">
          <div className="absolute -inset-6 bg-violet-500/20 rounded-full blur-3xl" />
          <PhoneFrame img="/images/screenshots/1.jpeg" glow />
        </div>
        {/* Right phone */}
        <div className="hidden md:block translate-y-8 opacity-50 scale-[0.82]">
          <PhoneFrame img="/images/screenshots/4.jpeg" glow={false} />
        </div>
      </motion.div>
    </section>
  )
}

/* ─────────────────── MARQUEE ─────────────────── */
function MarqueeBand() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className="relative py-5 border-y border-white/5 overflow-hidden bg-white/[0.02]">
      <div className="flex gap-6 animate-marquee whitespace-nowrap"
        style={{ animation: 'marquee 30s linear infinite' }}>
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-sm font-semibold text-white/40 px-4 py-1.5 rounded-full border border-white/8 bg-white/3 flex-shrink-0">
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

/* ─────────────────── BENTO ─────────────────── */
function BentoSection({ t, locale }: { t: any; locale: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-28 px-5">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-black uppercase tracking-[0.2em] text-violet-400 mb-4">Platform</span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            <span className="text-white">{t('feat_title')}</span>
          </h2>
          <p className="text-white/40 text-lg max-w-md mx-auto">{t('feat_subtitle')}</p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">

          {/* BIG card — appointments */}
          <BentoCard delay={0} className="sm:col-span-2 lg:col-span-2 row-span-2 min-h-[420px]" inView={inView}
            gradient="from-violet-600/20 via-purple-600/10 to-transparent">
            <div className="flex flex-col h-full">
              <div className="mb-5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xl mb-4 shadow-lg shadow-violet-900/40">📅</div>
                <h3 className="text-2xl font-black text-white mb-2">{t('feat1_title' as any)}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{t('feat1_desc' as any)}</p>
              </div>
              <div className="flex-1 flex items-end justify-center overflow-hidden rounded-2xl">
                <div className="w-full max-w-[240px] mx-auto">
                  <PhoneFrame img="/images/screenshots/2.jpeg" glow size="sm" />
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Small card — CRM */}
          <BentoCard delay={0.1} inView={inView} gradient="from-blue-600/20 to-transparent">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-xl mb-4 shadow-lg">👥</div>
            <h3 className="text-lg font-black text-white mb-2">{t('feat2_title' as any)}</h3>
            <p className="text-white/45 text-sm leading-relaxed">{t('feat2_desc' as any)}</p>
          </BentoCard>

          {/* Small card — Finance */}
          <BentoCard delay={0.15} inView={inView} gradient="from-emerald-600/20 to-transparent">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl mb-4 shadow-lg">📊</div>
            <h3 className="text-lg font-black text-white mb-2">{t('feat3_title' as any)}</h3>
            <p className="text-white/45 text-sm leading-relaxed">{t('feat3_desc' as any)}</p>
          </BentoCard>

          {/* Medium card — customers phone */}
          <BentoCard delay={0.2} className="lg:col-span-1 row-span-2 min-h-[380px]" inView={inView}
            gradient="from-pink-600/20 to-transparent">
            <div className="flex flex-col h-full">
              <div className="mb-5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-xl mb-4 shadow-lg">👤</div>
                <h3 className="text-lg font-black text-white mb-2">{t('feat5_title' as any)}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{t('feat5_desc' as any)}</p>
              </div>
              <div className="flex-1 flex items-end justify-center overflow-hidden">
                <div className="w-full max-w-[180px] mx-auto">
                  <PhoneFrame img="/images/screenshots/5.jpeg" glow={false} size="sm" />
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Small card — Stock */}
          <BentoCard delay={0.25} inView={inView} gradient="from-orange-600/20 to-transparent">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-xl mb-4 shadow-lg">📦</div>
            <h3 className="text-lg font-black text-white mb-2">{t('feat4_title' as any)}</h3>
            <p className="text-white/45 text-sm leading-relaxed">{t('feat4_desc' as any)}</p>
          </BentoCard>

          {/* Small card — Notifications */}
          <BentoCard delay={0.3} inView={inView} gradient="from-red-600/20 to-transparent">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-xl mb-4 shadow-lg">🔔</div>
            <h3 className="text-lg font-black text-white mb-2">{t('feat6_title' as any)}</h3>
            <p className="text-white/45 text-sm leading-relaxed">{t('feat6_desc' as any)}</p>
          </BentoCard>

          {/* Wide card — reports */}
          <BentoCard delay={0.35} className="sm:col-span-2 min-h-[260px]" inView={inView}
            gradient="from-violet-800/25 via-indigo-700/15 to-transparent">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 h-full">
              <div className="flex-1">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl mb-4 shadow-lg">📊</div>
                <h3 className="text-2xl font-black text-white mb-2">{t('screen5_title' as any)}</h3>
                <p className="text-white/45 text-sm leading-relaxed max-w-sm">{t('screen5_sub' as any)}</p>
              </div>
              <div className="flex-shrink-0 pointer-events-none select-none">
                <PhoneFrame img="/images/screenshots/6.jpeg" glow size="sm" />
              </div>
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  )
}

/* ─────────────────── STATS ─────────────────── */
function StatsSection({ t }: { t: any }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const stats = [
    { value: '500+', key: 'stats_business', icon: '🏪' },
    { value: '50K+', key: 'stats_appointments', icon: '📅' },
    { value: '98%', key: 'stats_satisfaction', icon: '⭐' },
  ]
  return (
    <section ref={ref} className="py-20 px-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-950/50 via-purple-950/50 to-indigo-950/50 pointer-events-none" />
      <div className="absolute inset-0 border-y border-white/5 pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="grid grid-cols-3 gap-6 sm:gap-12 text-center">
          {stats.map(({ value, key, icon }, i) => (
            <motion.div key={key}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}>
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-4xl sm:text-5xl font-black bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent mb-1">{value}</div>
              <div className="text-white/40 text-sm font-medium">{t(key as any)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────── CTA ─────────────────── */
function CtaSection({ t }: { t: any }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <section ref={ref} id="download" className="py-24 px-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto relative"
      >
        {/* glow behind card */}
        <div className="absolute -inset-4 bg-violet-600/15 rounded-3xl blur-2xl pointer-events-none" />
        <div className="relative rounded-3xl overflow-hidden border border-white/10 p-10 sm:p-16 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(109,40,217,0.15) 50%, rgba(16,16,32,0.9) 100%)', backdropFilter: 'blur(20px)' }}>
          {/* grid inside card */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative z-10">
            <div className="text-5xl mb-5">🚀</div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">{t('download_title')}</h2>
            <p className="text-white/45 mb-8 text-base">{t('download_subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <StoreBtn store="apple" />
              <StoreBtn store="google" outline />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

/* ─────────────────── FOOTER ─────────────────── */
function FooterSection({ t, locale }: { t: any; locale: string }) {
  const legalLinks = [
    { href: `/${locale}/gizlilik`,          label: locale === 'tr' ? 'Gizlilik'       : locale === 'de' ? 'Datenschutz'    : locale === 'ar' ? 'الخصوصية'    : 'Privacy' },
    { href: `/${locale}/kullanim-sartlari`, label: locale === 'tr' ? 'Kullanım Şartları' : locale === 'de' ? 'Nutzungsbedingungen' : locale === 'ar' ? 'الشروط'   : 'Terms' },
    { href: `/${locale}/cerez-politikasi`,  label: locale === 'tr' ? 'Çerez'          : locale === 'de' ? 'Cookies'         : locale === 'ar' ? 'الكوكيز'     : 'Cookies' },
    { href: `/${locale}/kvkk`,              label: locale === 'tr' ? 'KVKK'           : locale === 'de' ? 'DSGVO'           : locale === 'ar' ? 'حماية البيانات' : 'GDPR' },
    { href: `/${locale}/hesap-silme`,       label: locale === 'tr' ? 'Hesap Sil'      : locale === 'de' ? 'Konto löschen'   : locale === 'ar' ? 'حذف الحساب'  : 'Delete Account' },
  ]

  return (
    <footer className="border-t border-white/5 py-12 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/icons/favicon.png" alt="Hemensalon" width={26} height={26} className="rounded-none" />
              <span className="font-black text-white text-base">Hemensalon</span>
            </div>
            <p className="text-white/30 text-sm max-w-[200px] leading-relaxed">
              {locale === 'tr' ? 'Kuaför & güzellik salonları için akıllı randevu.' :
               locale === 'de' ? 'Intelligentes Terminsystem für Salons.' :
               locale === 'ar' ? 'نظام مواعيد ذكي للصالونات.' :
               'Smart appointment system for salons.'}
            </p>
          </div>
          {/* Legal */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/25 mb-3">
              {locale === 'tr' ? 'Yasal' : locale === 'de' ? 'Rechtliches' : locale === 'ar' ? 'قانوني' : 'Legal'}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {legalLinks.map(l => (
                <Link key={l.href} href={l.href} className="text-sm text-white/35 hover:text-violet-400 transition">{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
        {/* Bottom */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs">© {new Date().getFullYear()} Hemensalon. {t('footer_rights')}</p>
          <div className="flex gap-1.5">
            {LOCALES.map(l => (
              <Link key={l.code} href={`/${l.code}`}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition border ${l.code === locale ? 'border-violet-500/60 bg-violet-500/15 text-white' : 'border-white/8 bg-white/3 text-white/50 hover:bg-white/8'}`}
                title={l.label}>{l.flag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────── BENTO CARD ─────────────────── */
function BentoCard({ children, className = '', delay = 0, inView, gradient }:
  { children: React.ReactNode; className?: string; delay?: number; inView: boolean; gradient?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
      className={`relative rounded-3xl border border-white/8 overflow-hidden p-6 bg-white/[0.04] hover:bg-white/[0.07] transition-colors group ${className}`}
    >
      {/* gradient bg */}
      {gradient && <div className={`absolute inset-0 bg-gradient-to-br ${gradient} pointer-events-none`} />}
      {/* shimmer on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139,92,246,0.08), transparent 40%)' }} />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  )
}

/* ─────────────────── PHONE FRAME ─────────────────── */
function PhoneFrame({ img, glow = false, size = 'md' }: { img: string; glow?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const w = size === 'lg' ? 'w-[220px] sm:w-[260px]' : size === 'md' ? 'w-[180px] sm:w-[210px]' : 'w-[150px] sm:w-[180px]'
  return (
    <div className={`relative ${w} drop-shadow-2xl`}>
      {glow && <div className="absolute -inset-4 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />}
      <div className="relative rounded-[2.6rem]"
        style={{ background: 'linear-gradient(145deg, #2a2a3a, #111118)', padding: '3px', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08) inset' }}>
        {/* side buttons */}
        <div className="absolute left-[-3px] top-[80px] w-[3px] h-7 bg-white/15 rounded-l-full" />
        <div className="absolute left-[-3px] top-[116px] w-[3px] h-9 bg-white/15 rounded-l-full" />
        <div className="absolute left-[-3px] top-[156px] w-[3px] h-9 bg-white/15 rounded-l-full" />
        <div className="absolute right-[-3px] top-[106px] w-[3px] h-11 bg-white/15 rounded-r-full" />
        <div className="rounded-[2.4rem] overflow-hidden bg-black relative" style={{ aspectRatio: '9/19.5' }}>
          <Image src={img} alt="app screen" fill className="object-cover object-top" />
        </div>
      </div>
      <div className="absolute -bottom-3 left-10 right-10 h-4 bg-violet-500/20 blur-xl rounded-full pointer-events-none" />
    </div>
  )
}

/* ─────────────────── STORE BUTTON ─────────────────── */
function StoreBtn({ store, outline = false }: { store: 'apple' | 'google'; outline?: boolean }) {
  const isApple = store === 'apple'
  return (
    <a href={isApple ? 'https://apps.apple.com' : 'https://play.google.com'}
      target="_blank" rel="noopener noreferrer"
      className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold transition-all justify-center ${
        outline
          ? 'bg-white/8 hover:bg-white/15 text-white border border-white/15 backdrop-blur'
          : 'bg-white hover:bg-gray-100 text-gray-900 shadow-xl shadow-black/20'
      }`}>
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
        <div className={`text-[10px] font-medium leading-none ${outline ? 'text-white/50' : 'text-gray-400'}`}>
          {isApple ? 'Download on the' : 'Get it on'}
        </div>
        <div className="text-sm font-black leading-tight mt-0.5">{isApple ? 'App Store' : 'Google Play'}</div>
      </div>
    </a>
  )
}
