'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useInView, useMotionValue, useMotionTemplate, useSpring } from 'framer-motion'

/* ─── constants ─── */
const LOCALES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
]

const FEATURES = [
  { key: 'feat1', icon: '📅', color: ['#7c3aed', '#6d28d9'], size: 'large', img: '/images/screenshots/2.jpeg' },
  { key: 'feat2', icon: '👥', color: ['#2563eb', '#1d4ed8'], size: 'small' },
  { key: 'feat3', icon: '📊', color: ['#059669', '#047857'], size: 'small' },
  { key: 'feat5', icon: '👤', color: ['#db2777', '#be185d'], size: 'tall', img: '/images/screenshots/5.jpeg' },
  { key: 'feat4', icon: '📦', color: ['#d97706', '#b45309'], size: 'small' },
  { key: 'feat6', icon: '🔔', color: ['#dc2626', '#b91c1c'], size: 'small' },
  { key: 'feat3', icon: '💹', color: ['#0891b2', '#0e7490'], size: 'wide', img: '/images/screenshots/6.jpeg' },
] as const

/* ─────── MAIN ─────── */
export function MobileAppLanding() {
  const t = useTranslations('landing')
  const locale = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const isRtl = locale === 'ar'

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#02020a] text-white font-sans overflow-x-hidden selection:bg-violet-500/30">

      {/* ── Navbar ── */}
      <Navbar locale={locale} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* ── Hero ── */}
      <HeroSection t={t} />

      {/* ── Logos / trust band ── */}
      <TrustBand t={t} />

      {/* ── Bento Features ── */}
      <BentoFeatures t={t} />

      {/* ── Phone showcase ── */}
      <ShowcaseSection t={t} />

      {/* ── Stats ── */}
      <StatsSection t={t} />

      {/* ── CTA ── */}
      <CtaSection t={t} />

      {/* ── Footer ── */}
      <FooterSection t={t} locale={locale} />
    </div>
  )
}

/* ─────── NAVBAR ─────── */
function Navbar({ locale, menuOpen, setMenuOpen }: any) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className={`flex items-center justify-between px-5 h-12 rounded-2xl transition-all duration-300 ${scrolled ? 'bg-black/60 backdrop-blur-2xl border border-white/8 shadow-2xl shadow-black/40' : 'bg-transparent'}`}>
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500/40 blur-md rounded-lg group-hover:bg-violet-500/60 transition" />
              <Image src="/icons/favicon.png" alt="Hemensalon" width={28} height={28} className="relative rounded-none" />
            </div>
            <span className="font-black text-white text-base tracking-tight">Hemensalon</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/6 hover:bg-white/12 text-white/70 text-xs font-semibold transition border border-white/8">
                <span className="text-sm">{LOCALES.find(l => l.code === locale)?.flag}</span>
                <span className="hidden sm:inline">{LOCALES.find(l => l.code === locale)?.label}</span>
                <svg className="w-3 h-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {menuOpen && (
                <div className="absolute top-full mt-2 right-0 bg-[#0d0d18] rounded-2xl shadow-2xl border border-white/8 overflow-hidden z-50 min-w-[152px]">
                  {LOCALES.map(l => (
                    <Link key={l.code} href={`/${l.code}`} onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/6 transition ${l.code === locale ? 'text-violet-400 font-bold bg-violet-500/8' : 'text-white/60'}`}>
                      <span>{l.flag}</span><span>{l.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Animated gradient border CTA */}
            <a href="#download" className="relative group px-4 py-1.5 rounded-xl text-xs font-black text-white overflow-hidden"
              style={{ background: 'linear-gradient(#0d0d18, #0d0d18) padding-box, linear-gradient(135deg, #7c3aed, #a855f7, #7c3aed) border-box', border: '1px solid transparent' }}>
              <span className="relative z-10">Download</span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

/* ─────── HERO ─────── */
function HeroSection({ t }: { t: any }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })
  const background = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(124,58,237,0.12), transparent 60%)`

  const handleMouse = useCallback((e: React.MouseEvent) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }, [mouseX, mouseY])

  return (
    <motion.section
      onMouseMove={handleMouse}
      className="relative min-h-screen flex flex-col items-center justify-center px-5 pt-28 pb-0 overflow-hidden"
    >
      {/* Mouse-follow radial glow */}
      <motion.div className="pointer-events-none fixed inset-0 z-0" style={{ background }} />

      {/* Retro grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 [perspective:200px]">
          <div className="absolute inset-0 origin-top"
            style={{ transform: 'rotateX(65deg)', transformOrigin: '50% 0%' }}>
            <div className="animate-retrogrid absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage: 'linear-gradient(rgba(124,58,237,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.4) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
                width: '600vw', height: '300vh',
                marginLeft: '-250vw',
              }} />
          </div>
        </div>
        {/* Fade bottom of grid */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#02020a] to-transparent" />
      </div>

      {/* Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-700/15 rounded-full blur-[80px]" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-60 h-60 bg-indigo-700/8 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">

        {/* Animated gradient badge */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <span className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-8 border border-violet-500/25 text-violet-300"
            style={{ background: 'linear-gradient(#02020a, #02020a) padding-box, linear-gradient(135deg, rgba(124,58,237,0.5), rgba(168,85,247,0.5)) border-box', border: '1px solid transparent' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
            </span>
            iOS & Android · {t('hero_badge')}
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
          <h1 className="text-6xl sm:text-7xl md:text-[90px] font-black leading-[0.92] tracking-[-0.04em] mb-6">
            <span className="block text-white">{t('hero_title').split(' ').slice(0, 2).join(' ')}</span>
            <span className="block" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundImage: 'linear-gradient(135deg, #a78bfa 0%, #c084fc 30%, #f0abfc 60%, #a78bfa 100%)', backgroundSize: '200% auto', animation: 'textshine 4s linear infinite' }}>
              {t('hero_title').split(' ').slice(2).join(' ')}
            </span>
          </h1>
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
          className="text-white/40 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed font-light">
          {t('hero_subtitle')}
        </motion.p>

        {/* CTA row */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4" id="download">
          <StoreBtnPremium store="apple" />
          <StoreBtnPremium store="google" ghost />
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-white/25 text-sm mb-20">✦ {t('hero_free')} · No credit card required</motion.p>
      </div>

      {/* Hero phones — cinematic 3-phone spread */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.55, type: 'spring', stiffness: 45, damping: 20 }}
        className="relative z-10 w-full max-w-4xl mx-auto flex justify-center items-end gap-3 sm:gap-6 select-none pointer-events-none"
      >
        {/* Left — rotated */}
        <motion.div className="hidden sm:block flex-shrink-0"
          style={{ transform: 'rotate(-8deg) translateY(30px)', transformOrigin: 'bottom center' }}>
          <div className="opacity-50 scale-[0.75] origin-bottom">
            <PremiumPhone img="/images/screenshots/4.jpeg" />
          </div>
        </motion.div>

        {/* Center — hero */}
        <div className="relative flex-shrink-0 z-10">
          <div className="absolute -inset-6 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute -inset-2 rounded-[3rem] opacity-60"
            style={{ background: 'conic-gradient(from 0deg, #7c3aed, #a855f7, #ec4899, #7c3aed)', filter: 'blur(20px)', animation: 'spin 6s linear infinite' }} />
          <PremiumPhone img="/images/screenshots/1.jpeg" featured />
        </div>

        {/* Right — rotated */}
        <motion.div className="hidden sm:block flex-shrink-0"
          style={{ transform: 'rotate(8deg) translateY(30px)', transformOrigin: 'bottom center' }}>
          <div className="opacity-50 scale-[0.75] origin-bottom">
            <PremiumPhone img="/images/screenshots/2.jpeg" />
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes textshine { to { background-position: 200% center; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes retrogrid { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } }
        .animate-retrogrid { animation: retrogrid 15s linear infinite; }
      `}</style>
    </motion.section>
  )
}

/* ─────── TRUST BAND ─────── */
function TrustBand({ t }: { t: any }) {
  const items = [
    '📅 Randevu Yönetimi', '⭐ 4.9 Rating', '🏪 500+ İşletme',
    '📱 iOS & Android', '🔒 KVKK Uyumlu', '💳 Ücretsiz Başla',
    '🌍 4 Dil', '⚡ Anında Kurulum', '📊 Detaylı Raporlar',
  ]
  const doubled = [...items, ...items]
  return (
    <div className="relative border-y border-white/5 py-4 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#02020a] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#02020a] to-transparent z-10" />
      <div className="flex gap-5 whitespace-nowrap" style={{ animation: 'marquee 25s linear infinite' }}>
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-xs font-semibold text-white/30 flex-shrink-0 px-3 py-1 rounded-full border border-white/6">
            {item}
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </div>
  )
}

/* ─────── BENTO FEATURES ─────── */
function BentoFeatures({ t }: { t: any }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-32 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16">
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-violet-400/80 mb-4">Platform Features</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5">
            <span className="text-white">{t('feat_title')}</span>
          </h2>
          <p className="text-white/35 text-lg max-w-md mx-auto font-light">{t('feat_subtitle')}</p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

          {/* LARGE — Appointments */}
          <GlassCard delay={0} inView={inView} className="sm:col-span-2 min-h-[400px]"
            accent={['#7c3aed', '#6d28d9']}>
            <div className="flex flex-col sm:flex-row h-full gap-8 items-start sm:items-end">
              <div className="flex-1 z-10">
                <FeatureIcon colors={['#7c3aed', '#6d28d9']}>📅</FeatureIcon>
                <h3 className="text-2xl font-black text-white mt-4 mb-2">{t('feat1_title' as any)}</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-xs">{t('feat1_desc' as any)}</p>
              </div>
              <div className="flex-shrink-0 pointer-events-none select-none z-10">
                <PremiumPhone img="/images/screenshots/2.jpeg" size="sm" />
              </div>
            </div>
          </GlassCard>

          {/* SMALL — CRM */}
          <GlassCard delay={0.1} inView={inView} accent={['#2563eb', '#1d4ed8']}>
            <FeatureIcon colors={['#2563eb', '#1d4ed8']}>👥</FeatureIcon>
            <h3 className="text-xl font-black text-white mt-4 mb-2">{t('feat2_title' as any)}</h3>
            <p className="text-white/40 text-sm leading-relaxed">{t('feat2_desc' as any)}</p>
          </GlassCard>

          {/* SMALL — Finance */}
          <GlassCard delay={0.15} inView={inView} accent={['#059669', '#047857']}>
            <FeatureIcon colors={['#059669', '#047857']}>📊</FeatureIcon>
            <h3 className="text-xl font-black text-white mt-4 mb-2">{t('feat3_title' as any)}</h3>
            <p className="text-white/40 text-sm leading-relaxed">{t('feat3_desc' as any)}</p>
          </GlassCard>

          {/* TALL — Staff w/ phone */}
          <GlassCard delay={0.2} inView={inView} className="row-span-2 min-h-[380px]" accent={['#db2777', '#be185d']}>
            <FeatureIcon colors={['#db2777', '#be185d']}>👤</FeatureIcon>
            <h3 className="text-xl font-black text-white mt-4 mb-2">{t('feat5_title' as any)}</h3>
            <p className="text-white/40 text-sm leading-relaxed mb-6">{t('feat5_desc' as any)}</p>
            <div className="flex justify-center pointer-events-none select-none mt-auto">
              <PremiumPhone img="/images/screenshots/5.jpeg" size="xs" />
            </div>
          </GlassCard>

          {/* SMALL — Inventory */}
          <GlassCard delay={0.25} inView={inView} accent={['#d97706', '#b45309']}>
            <FeatureIcon colors={['#d97706', '#b45309']}>📦</FeatureIcon>
            <h3 className="text-xl font-black text-white mt-4 mb-2">{t('feat4_title' as any)}</h3>
            <p className="text-white/40 text-sm leading-relaxed">{t('feat4_desc' as any)}</p>
          </GlassCard>

          {/* SMALL — Notifications */}
          <GlassCard delay={0.3} inView={inView} accent={['#dc2626', '#b91c1c']}>
            <FeatureIcon colors={['#dc2626', '#b91c1c']}>🔔</FeatureIcon>
            <h3 className="text-xl font-black text-white mt-4 mb-2">{t('feat6_title' as any)}</h3>
            <p className="text-white/40 text-sm leading-relaxed">{t('feat6_desc' as any)}</p>
          </GlassCard>

          {/* WIDE — Reports + phone */}
          <GlassCard delay={0.35} inView={inView} className="sm:col-span-2 min-h-[280px]" accent={['#0891b2', '#0e7490']}>
            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center h-full">
              <div className="flex-1">
                <FeatureIcon colors={['#0891b2', '#0e7490']}>📈</FeatureIcon>
                <h3 className="text-2xl font-black text-white mt-4 mb-2">{t('screen5_title' as any)}</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-sm">{t('screen5_sub' as any)}</p>
              </div>
              <div className="flex-shrink-0 pointer-events-none select-none">
                <PremiumPhone img="/images/screenshots/6.jpeg" size="sm" />
              </div>
            </div>
          </GlassCard>

        </div>
      </div>
    </section>
  )
}

/* ─────── SHOWCASE ─────── */
function ShowcaseSection({ t }: { t: any }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const screens = [
    { img: '/images/screenshots/1.jpeg', titleKey: 'screen1_title', subKey: 'screen1_sub' },
    { img: '/images/screenshots/4.jpeg', titleKey: 'screen3_title', subKey: 'screen3_sub' },
  ]
  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-violet-900/10 rounded-full blur-[120px]" />
      </div>
      <div className="max-w-6xl mx-auto">
        {screens.map((s, i) => {
          const isEven = i % 2 === 0
          return (
            <motion.div key={s.img}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className={`flex flex-col md:flex-row items-center gap-16 mb-28 last:mb-0 ${isEven ? '' : 'md:flex-row-reverse'}`}
            >
              {/* Phone */}
              <div className="flex-shrink-0 relative pointer-events-none select-none">
                <div className="absolute -inset-8 bg-violet-600/10 rounded-full blur-3xl" />
                <PremiumPhone img={s.img} featured />
              </div>
              {/* Text */}
              <div className={`flex-1 ${isEven ? '' : 'md:text-right'}`}>
                <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-violet-400/70 mb-5">
                  <span className="w-8 h-px bg-violet-500/50" />
                  0{i + 1} Feature
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
                  {t(s.titleKey as any)}
                </h2>
                <p className="text-white/40 text-lg leading-relaxed max-w-md font-light">
                  {t(s.subKey as any)}
                </p>
                <div className={`flex flex-wrap gap-2 mt-8 ${isEven ? '' : 'md:justify-end'}`}>
                  {(['⚡ Fast', '✦ Simple', '🔒 Secure'] as string[]).map(b => (
                    <span key={b} className="px-3 py-1.5 text-xs font-semibold text-white/50 rounded-full border border-white/8 bg-white/3">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

/* ─────── STATS ─────── */
function StatsSection({ t }: { t: any }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl border border-white/6 overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(16,16,40,0.8) 100%)', backdropFilter: 'blur(20px)' }}>
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="relative z-10 grid grid-cols-3 gap-px">
            {[
              { v: '500+', k: 'stats_business', icon: '🏪', sub: (l: string) => l === 'tr' ? 'Aktif İşletme' : 'Active Businesses' },
              { v: '50K+', k: 'stats_appointments', icon: '📅', sub: (l: string) => l === 'tr' ? 'Toplam Randevu' : 'Total Appointments' },
              { v: '98%', k: 'stats_satisfaction', icon: '⭐', sub: (l: string) => l === 'tr' ? 'Memnuniyet Oranı' : 'Satisfaction Rate' },
            ].map(({ v, k, icon, sub }, i) => (
              <motion.div key={k}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="p-8 sm:p-12 text-center border-r border-white/5 last:border-0 hover:bg-white/2 transition">
                <div className="text-3xl mb-3">{icon}</div>
                <div className="text-4xl sm:text-6xl font-black mb-1"
                  style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundImage: 'linear-gradient(to bottom, #fff 0%, rgba(255,255,255,0.5) 100%)' }}>
                  {v}
                </div>
                <div className="text-white/35 text-sm font-medium">{t(k as any)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────── CTA ─────── */
function CtaSection({ t }: { t: any }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <section ref={ref} id="download" className="py-28 px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto text-center relative">
        {/* outer glow */}
        <div className="absolute -inset-10 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

        {/* Shine border card */}
        <div className="relative rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(#0d0d1a, #0d0d1a) padding-box, linear-gradient(135deg, rgba(124,58,237,0.6), rgba(168,85,247,0.3), rgba(236,72,153,0.3), rgba(124,58,237,0.6)) border-box', border: '1px solid transparent', animation: 'shine-border 4s linear infinite' }}>
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative z-10 p-12 sm:p-20">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">{t('download_title')}</h2>
            <p className="text-white/35 text-lg mb-10 font-light">{t('download_subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <StoreBtnPremium store="apple" />
              <StoreBtnPremium store="google" ghost />
            </div>
          </div>
        </div>
        <style>{`
          @keyframes shine-border {
            0% { border-image-source: linear-gradient(135deg, rgba(124,58,237,0.8), rgba(168,85,247,0.4), rgba(236,72,153,0.4), rgba(124,58,237,0.8)); }
          }
        `}</style>
      </motion.div>
    </section>
  )
}

/* ─────── FOOTER ─────── */
function FooterSection({ t, locale }: { t: any; locale: string }) {
  const legal = [
    { href: `/${locale}/gizlilik`,          label: locale === 'tr' ? 'Gizlilik' : locale === 'de' ? 'Datenschutz' : locale === 'ar' ? 'الخصوصية' : 'Privacy' },
    { href: `/${locale}/kullanim-sartlari`, label: locale === 'tr' ? 'Kullanım Şartları' : locale === 'de' ? 'Nutzungsbedingungen' : locale === 'ar' ? 'الشروط' : 'Terms' },
    { href: `/${locale}/cerez-politikasi`,  label: locale === 'tr' ? 'Çerez' : locale === 'de' ? 'Cookies' : locale === 'ar' ? 'الكوكيز' : 'Cookies' },
    { href: `/${locale}/kvkk`,              label: locale === 'tr' ? 'KVKK' : locale === 'de' ? 'DSGVO' : locale === 'ar' ? 'حماية البيانات' : 'GDPR' },
    { href: `/${locale}/hesap-silme`,       label: locale === 'tr' ? 'Hesap Sil' : locale === 'de' ? 'Konto löschen' : locale === 'ar' ? 'حذف الحساب' : 'Delete Account' },
  ]
  return (
    <footer className="border-t border-white/5 py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/icons/favicon.png" alt="Hemensalon" width={26} height={26} className="rounded-none" />
              <span className="font-black text-white">Hemensalon</span>
            </div>
            <p className="text-white/25 text-sm max-w-[220px] leading-relaxed">
              {locale === 'tr' ? 'Kuaför & güzellik salonları için akıllı randevu sistemi.' :
               locale === 'de' ? 'Intelligentes Terminsystem für Friseursalons.' :
               locale === 'ar' ? 'نظام مواعيد ذكي للصالونات.' :
               'Smart appointment system for hair & beauty salons.'}
            </p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-white/20 mb-4">
              {locale === 'tr' ? 'Yasal' : locale === 'de' ? 'Rechtliches' : locale === 'ar' ? 'قانوني' : 'Legal'}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {legal.map(l => (
                <Link key={l.href} href={l.href} className="text-sm text-white/30 hover:text-violet-400 transition">{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/15 text-xs">© {new Date().getFullYear()} Hemensalon. {t('footer_rights')}</p>
          <div className="flex gap-1.5">
            {LOCALES.map(l => (
              <Link key={l.code} href={`/${l.code}`}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition border ${l.code === locale ? 'border-violet-500/50 bg-violet-500/12' : 'border-white/6 bg-white/2 hover:bg-white/6 hover:border-white/12'}`}>
                {l.flag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─────── GLASS CARD ─────── */
function GlassCard({ children, className = '', delay = 0, inView, accent }: {
  children: React.ReactNode; className?: string; delay?: number; inView: boolean; accent: [string, string]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }
  const bg = useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, ${accent[0]}18, transparent 70%)`

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseMove={handleMouse}
      className={`relative rounded-2xl border border-white/7 overflow-hidden group p-6 bg-white/[0.03] hover:border-white/14 transition-all duration-300 ${className}`}
    >
      {/* accent top glow */}
      <div className="absolute top-0 left-6 right-6 h-px opacity-30 pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${accent[0]}, transparent)` }} />
      {/* mouse follow glow */}
      <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: bg }} />
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </motion.div>
  )
}

/* ─────── FEATURE ICON ─────── */
function FeatureIcon({ children, colors }: { children: React.ReactNode; colors: [string, string] }) {
  return (
    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-lg relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`, boxShadow: `0 8px 24px ${colors[0]}40` }}>
      {children}
    </div>
  )
}

/* ─────── PREMIUM PHONE ─────── */
function PremiumPhone({ img, featured = false, size = 'md' }: { img: string; featured?: boolean; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const widths = { xs: 'w-[130px]', sm: 'w-[160px] sm:w-[180px]', md: 'w-[190px] sm:w-[220px]', lg: 'w-[220px] sm:w-[260px]' }
  return (
    <div className={`relative ${widths[size]}`}>
      <div className="relative rounded-[2.8rem]"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
          padding: '2.5px',
          boxShadow: featured
            ? '0 50px 100px rgba(0,0,0,0.7), 0 20px 40px rgba(124,58,237,0.2), 0 0 0 1px rgba(255,255,255,0.1) inset'
            : '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06) inset',
        }}>
        {/* side buttons */}
        <div className="absolute left-[-3px] top-[80px] w-[3px] h-6 bg-white/12 rounded-l-full" />
        <div className="absolute left-[-3px] top-[114px] w-[3px] h-8 bg-white/12 rounded-l-full" />
        <div className="absolute left-[-3px] top-[152px] w-[3px] h-8 bg-white/12 rounded-l-full" />
        <div className="absolute right-[-3px] top-[106px] w-[3px] h-10 bg-white/12 rounded-r-full" />
        <div className="rounded-[2.6rem] overflow-hidden bg-black relative" style={{ aspectRatio: '9/19.5' }}>
          <Image src={img} alt="app" fill className="object-cover object-top" />
        </div>
      </div>
      {featured && (
        <div className="absolute -bottom-3 left-8 right-8 h-5 bg-violet-500/25 blur-xl rounded-full pointer-events-none" />
      )}
    </div>
  )
}

/* ─────── STORE BUTTON PREMIUM ─────── */
function StoreBtnPremium({ store, ghost = false }: { store: 'apple' | 'google'; ghost?: boolean }) {
  const isApple = store === 'apple'
  return (
    <a href={isApple ? 'https://apps.apple.com' : 'https://play.google.com'}
      target="_blank" rel="noopener noreferrer"
      className={`group flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold transition-all justify-center ${ghost
        ? 'border border-white/12 bg-white/4 hover:bg-white/8 hover:border-white/20 text-white'
        : 'bg-white hover:bg-gray-50 text-gray-900 shadow-2xl shadow-black/30 hover:shadow-violet-500/10 hover:-translate-y-0.5'
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
        <div className={`text-[10px] font-medium leading-none ${ghost ? 'text-white/40' : 'text-gray-400'}`}>
          {isApple ? 'Download on the' : 'Get it on'}
        </div>
        <div className="text-sm font-black leading-tight mt-0.5">{isApple ? 'App Store' : 'Google Play'}</div>
      </div>
    </a>
  )
}
