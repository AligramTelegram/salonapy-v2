'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const LOCALES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
]

const FEATURES = [
  { key: 'feat1', icon: '📅', gradient: 'from-blue-500 to-indigo-600' },
  { key: 'feat2', icon: '👥', gradient: 'from-violet-500 to-purple-600' },
  { key: 'feat3', icon: '📊', gradient: 'from-emerald-500 to-teal-600' },
  { key: 'feat4', icon: '📦', gradient: 'from-orange-500 to-amber-600' },
  { key: 'feat5', icon: '👤', gradient: 'from-yellow-500 to-orange-500' },
  { key: 'feat6', icon: '🔔', gradient: 'from-rose-500 to-pink-600' },
]

const STATS = [
  { value: '500+', key: 'stats_business', suffix: '' },
  { value: '50K+', key: 'stats_appointments', suffix: '' },
  { value: '98%', key: 'stats_satisfaction', suffix: '' },
]

function useScrollReveal() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return { ref, inView }
}

export function MobileAppLanding() {
  const t = useTranslations('landing')
  const locale = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const isRtl = locale === 'ar'

  const featuresReveal = useScrollReveal()
  const statsReveal = useScrollReveal()
  const ctaReveal = useScrollReveal()

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#080812] text-white font-sans overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080812]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-900/40">
              <span className="text-white text-sm font-black">H</span>
            </div>
            <span className="font-black text-white text-lg tracking-tight">{t('nav_logo')}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Lang switcher */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/12 text-sm font-semibold text-white/80 transition border border-white/10"
              >
                <span>{LOCALES.find(l => l.code === locale)?.flag}</span>
                <span className="hidden sm:inline text-xs">{LOCALES.find(l => l.code === locale)?.label}</span>
                <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute top-full mt-2 right-0 bg-[#13131f] rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50 min-w-[150px]">
                  {LOCALES.map(l => (
                    <Link
                      key={l.code}
                      href={`/${l.code}`}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/8 transition ${l.code === locale ? 'bg-violet-500/15 font-bold text-violet-300' : 'text-white/70'}`}
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
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-purple-900/30"
            >
              {t('nav_download')}
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-5 overflow-hidden">
        {/* Mesh gradient bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-violet-700/20 blur-[120px]" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[100px]" />
          <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] rounded-full bg-purple-800/20 blur-[80px]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/8 text-violet-300 text-xs font-semibold px-4 py-2 rounded-full mb-8 border border-violet-500/20 backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              📱 {t('hero_badge')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6"
          >
            <span className="text-white">{t('hero_title').split(' ').slice(0, -2).join(' ')}</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {t('hero_title').split(' ').slice(-2).join(' ')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t('hero_subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            id="download"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
          >
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white text-gray-900 hover:bg-gray-100 px-6 py-3.5 rounded-2xl transition-all w-full sm:w-auto justify-center shadow-xl shadow-white/10"
            >
              <svg className="w-6 h-6 flex-shrink-0 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <div className="text-[10px] text-gray-500 font-medium">Download on the</div>
                <div className="text-base font-bold text-gray-900 -mt-0.5">App Store</div>
              </div>
            </a>

            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-white/15 text-white px-6 py-3.5 rounded-2xl transition-all w-full sm:w-auto justify-center backdrop-blur"
            >
              <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76c.28.15.6.19.93.09l11.44-6.59-2.54-2.54-9.83 9.04zm-1.81-20.6C1.12 3.46 1 3.82 1 4.23v15.54c0 .41.12.77.37 1.07l.06.06 8.7-8.71v-.21L1.43 3.1l-.06.06zm19.1 8.44l-2.5-1.44-2.81 2.81 2.81 2.81 2.52-1.45c.72-.41.72-1.31-.02-1.73zm-17.65 9.97l9.84-5.67-2.54-2.53-7.3 8.2z" />
              </svg>
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <div className="text-[10px] text-white/50 font-medium">Get it on</div>
                <div className="text-base font-bold -mt-0.5">Google Play</div>
              </div>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white/30 text-sm font-medium"
          >
            ✨ {t('hero_free')}
          </motion.p>
        </div>

        {/* Phone mockups */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative z-10 mt-16 flex justify-center items-end gap-4 pointer-events-none select-none"
        >
          {/* Secondary phone */}
          <div className="hidden sm:block mb-0 opacity-60 scale-90 translate-y-10">
            <PhoneMockup dark>
              <div className="bg-[#0f0f1a] h-full p-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 mb-3">
                  <div className="text-white text-xs font-bold mb-1">Müşteriler</div>
                  <div className="flex gap-1.5 mt-2">
                    {[['VIP','#FEF3C7','#D97706'],['Yeni','#EFF6FF','#2563EB'],['Kayıp','#FEF2F2','#DC2626']].map(([label,bg,color])=>(
                      <div key={label} className="rounded-lg px-2 py-1 text-[9px] font-black" style={{backgroundColor:bg+'22',color,border:`1px solid ${color}33`}}>{label}</div>
                    ))}
                  </div>
                </div>
                {[['Zeynep S.','VIP','#D97706'],['Ali R.','Yeni','#2563EB'],['Selin T.','Risk','#EA580C']].map(([name,tag,color])=>(
                  <div key={name as string} className="bg-white/5 border border-white/8 rounded-xl p-2.5 mb-2 flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-300 text-xs font-black">{(name as string)[0]}</div>
                    <div className="flex-1">
                      <div className="text-white text-[11px] font-bold">{name}</div>
                    </div>
                    <div className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{color,backgroundColor:color+'22'}}>{tag}</div>
                  </div>
                ))}
              </div>
            </PhoneMockup>
          </div>

          {/* Main phone */}
          <PhoneMockup dark glow>
            <div className="bg-[#0f0f1a] h-full p-3">
              <div className="bg-gradient-to-br from-violet-600 to-purple-800 rounded-2xl p-4 mb-3">
                <div className="text-white text-xs font-bold mb-1">Hemensalon</div>
                <div className="text-white/60 text-[10px]">Bugün</div>
                <div className="flex gap-2 mt-3">
                  {[['📅','12','Randevu'],['👥','48','Müşteri']].map(([icon,n,label])=>(
                    <div key={label as string} className="bg-white/15 rounded-xl flex-1 p-2 text-center backdrop-blur">
                      <div className="text-base">{icon}</div>
                      <div className="text-white font-black text-sm">{n}</div>
                      <div className="text-white/60 text-[9px]">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              {[['Ayşe K.','10:00','Saç Kesimi','✅'],['Mehmet A.','11:30','Sakal','⏳'],['Fatma Y.','13:00','Boya','📅']].map(([name,time,svc,status])=>(
                <div key={name as string} className="bg-white/5 border border-white/8 rounded-xl p-2.5 mb-2 flex items-center gap-2">
                  <div className="w-7 h-7 bg-violet-500/25 rounded-lg flex items-center justify-center text-violet-300 text-xs font-black">{(name as string)[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-[11px] font-bold truncate">{name}</div>
                    <div className="text-white/40 text-[9px]">{svc}</div>
                  </div>
                  <div className="text-violet-300 text-[10px] font-bold">{time}</div>
                </div>
              ))}
            </div>
          </PhoneMockup>

          {/* Third phone */}
          <div className="hidden md:block mb-0 opacity-60 scale-90 translate-y-10">
            <PhoneMockup dark>
              <div className="bg-[#0f0f1a] h-full p-3">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-4 mb-3">
                  <div className="text-white text-xs font-bold mb-1">Gelir Raporu</div>
                  <div className="text-white text-xl font-black mt-1">₺18,540</div>
                  <div className="text-white/60 text-[10px]">Bu ay</div>
                </div>
                {[['Saç Kesimi','₺8,200','44%'],['Boyama','₺6,100','33%'],['Bakım','₺4,240','23%']].map(([svc,amount,pct])=>(
                  <div key={svc as string} className="bg-white/5 border border-white/8 rounded-xl p-2.5 mb-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="text-white text-[10px] font-bold">{svc}</div>
                      <div className="text-emerald-400 text-[10px] font-black">{amount}</div>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{width:pct as string}} />
                    </div>
                  </div>
                ))}
              </div>
            </PhoneMockup>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section ref={statsReveal.ref} className="py-16 px-5 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {STATS.map(({ value, key }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                animate={statsReveal.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {value}
                </div>
                <div className="text-white/40 text-sm font-medium">{t(key as any)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section ref={featuresReveal.ref} className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresReveal.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-400 mb-4 px-3 py-1 bg-violet-500/10 rounded-full border border-violet-500/20">
              Features
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
              {t('feat_title')}
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">{t('feat_subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {FEATURES.map(({ key, icon, gradient }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresReveal.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative bg-white/[0.04] hover:bg-white/[0.07] border border-white/8 hover:border-white/15 rounded-2xl p-6 transition-all cursor-default"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl mb-5 shadow-lg`}>
                  {icon}
                </div>
                <h3 className="font-bold text-white mb-2 text-base">{t(`${key}_title` as any)}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{t(`${key}_desc` as any)}</p>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 70%)' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Download CTA ── */}
      <section ref={ctaReveal.ref} className="py-16 px-5 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={ctaReveal.inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto relative rounded-3xl overflow-hidden"
        >
          {/* bg glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-purple-900/80 to-indigo-900/80" />
          <div className="absolute inset-0 border border-white/10 rounded-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 p-10 sm:p-14 text-center">
            <div className="text-4xl mb-5">🚀</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">{t('download_title')}</h2>
            <p className="text-white/50 mb-8 text-base">{t('download_subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white text-gray-900 hover:bg-gray-100 px-6 py-3.5 rounded-2xl transition-all justify-center font-bold shadow-xl shadow-black/30"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                App Store
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/12 hover:bg-white/18 border border-white/20 text-white px-6 py-3.5 rounded-2xl transition-all justify-center font-bold"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.28.15.6.19.93.09l11.44-6.59-2.54-2.54-9.83 9.04zm-1.81-20.6C1.12 3.46 1 3.82 1 4.23v15.54c0 .41.12.77.37 1.07l.06.06 8.7-8.71v-.21L1.43 3.1l-.06.06zm19.1 8.44l-2.5-1.44-2.81 2.81 2.81 2.81 2.52-1.45c.72-.41.72-1.31-.02-1.73zm-17.65 9.97l9.84-5.67-2.54-2.53-7.3 8.2z" />
                </svg>
                Google Play
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <span className="text-white text-xs font-black">H</span>
            </div>
            <span className="font-bold text-white/70">Hemensalon</span>
          </div>

          <p className="text-white/25 text-sm">
            © {new Date().getFullYear()} Hemensalon. {t('footer_rights')}
          </p>

          <div className="flex gap-1.5">
            {LOCALES.map(l => (
              <Link
                key={l.code}
                href={`/${l.code}`}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition ${
                  l.code === locale
                    ? 'bg-violet-500/20 ring-1 ring-violet-500/50'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
                title={l.label}
              >
                {l.flag}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

function PhoneMockup({
  children,
  dark = false,
  glow = false,
}: {
  children: React.ReactNode
  dark?: boolean
  glow?: boolean
}) {
  return (
    <div className={`relative w-44 sm:w-52 rounded-[2.8rem] p-[3px] shadow-2xl ${
      glow ? 'shadow-violet-900/60' : ''
    }`}>
      {glow && (
        <div className="absolute -inset-4 bg-violet-600/15 rounded-full blur-2xl pointer-events-none" />
      )}
      <div className={`relative rounded-[2.6rem] p-2 ${dark ? 'bg-gray-950' : 'bg-gray-900'}`}
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Dynamic island */}
        <div className="h-5 flex items-center justify-center mb-1">
          <div className="w-20 h-[14px] bg-black rounded-full" />
        </div>
        <div className="rounded-[2rem] overflow-hidden" style={{ height: 380 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
