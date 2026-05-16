'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'

const LOCALES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
]

const FEATURES = [
  { key: 'feat1', icon: '📅', color: '#EFF6FF', iconBg: '#2563EB' },
  { key: 'feat2', icon: '👥', color: '#F5F3FF', iconBg: '#7C3AED' },
  { key: 'feat3', icon: '📊', color: '#ECFDF5', iconBg: '#059669' },
  { key: 'feat4', icon: '📦', color: '#FFF7ED', iconBg: '#EA580C' },
  { key: 'feat5', icon: '👤', color: '#FEF3C7', iconBg: '#D97706' },
  { key: 'feat6', icon: '🔔', color: '#FEF2F2', iconBg: '#DC2626' },
]

export function MobileAppLanding() {
  const t = useTranslations('landing')
  const locale = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const isRtl = locale === 'ar'

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#faf8ff] font-sans">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-purple-100">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center">
              <span className="text-white text-sm font-black">H</span>
            </div>
            <span className="font-black text-gray-900 text-lg">{t('nav_logo')}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Lang switcher */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700 transition"
              >
                <span>{LOCALES.find(l => l.code === locale)?.flag}</span>
                <span className="hidden sm:inline">{LOCALES.find(l => l.code === locale)?.label}</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {menuOpen && (
                <div className="absolute top-full mt-1 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 min-w-[140px]">
                  {LOCALES.map(l => (
                    <Link
                      key={l.code}
                      href={`/${l.code}`}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-purple-50 transition ${l.code === locale ? 'bg-purple-50 font-bold text-purple-700' : 'text-gray-700'}`}
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
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition"
            >
              {t('nav_download')}
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-600 pt-20 pb-32">
        {/* deco */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-5 text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur">
            📱 {t('hero_badge')}
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            {t('hero_title')}
          </h1>

          <p className="text-lg text-purple-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('hero_subtitle')}
          </p>

          {/* Download buttons */}
          <div id="download" className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black hover:bg-gray-900 text-white px-6 py-3.5 rounded-2xl transition w-full sm:w-auto justify-center"
            >
              <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <div className="text-xs opacity-75">{t('hero_appstore').split(' ').slice(0, -2).join(' ') || 'Download on the'}</div>
                <div className="text-base font-bold -mt-0.5">App Store</div>
              </div>
            </a>

            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black hover:bg-gray-900 text-white px-6 py-3.5 rounded-2xl transition w-full sm:w-auto justify-center"
            >
              <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76c.28.15.6.19.93.09l11.44-6.59-2.54-2.54-9.83 9.04zm-1.81-20.6C1.12 3.46 1 3.82 1 4.23v15.54c0 .41.12.77.37 1.07l.06.06 8.7-8.71v-.21L1.43 3.1l-.06.06zm19.1 8.44l-2.5-1.44-2.81 2.81 2.81 2.81 2.52-1.45c.72-.41.72-1.31-.02-1.73zm-17.65 9.97l9.84-5.67-2.54-2.53-7.3 8.2z"/>
              </svg>
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <div className="text-xs opacity-75">{t('hero_playstore').split(' ').slice(0, -2).join(' ') || 'Get it on'}</div>
                <div className="text-base font-bold -mt-0.5">Google Play</div>
              </div>
            </a>
          </div>

          <p className="text-purple-200 text-sm font-medium">✨ {t('hero_free')}</p>
        </div>

        {/* Phone mockup area */}
        <div className="max-w-5xl mx-auto px-5 mt-16 flex justify-center gap-4 pointer-events-none select-none">
          <PhoneMockup>
            <div className="bg-[#F4F4F8] h-full p-3">
              <div className="bg-purple-600 rounded-2xl p-4 mb-3">
                <div className="text-white text-xs font-bold mb-1">Hemensalon</div>
                <div className="text-white/70 text-[10px]">Ana Sayfa</div>
                <div className="flex gap-2 mt-3">
                  {[['📅','12','Randevu'],['👥','48','Müşteri']].map(([icon,n,label])=>(
                    <div key={label} className="bg-white/20 rounded-xl flex-1 p-2 text-center">
                      <div className="text-base">{icon}</div>
                      <div className="text-white font-black text-sm">{n}</div>
                      <div className="text-white/70 text-[9px]">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              {[['Ayşe K.','10:00','Saç Kesimi'],['Mehmet A.','11:30','Sakal'],['Fatma Y.','13:00','Boya']].map(([name,time,svc])=>(
                <div key={name} className="bg-white rounded-xl p-2.5 mb-2 flex items-center gap-2">
                  <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 text-xs font-black">{(name as string)[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-800 text-[11px] font-bold truncate">{name}</div>
                    <div className="text-gray-400 text-[9px]">{svc}</div>
                  </div>
                  <div className="text-purple-600 text-[10px] font-bold">{time}</div>
                </div>
              ))}
            </div>
          </PhoneMockup>

          <PhoneMockup className="hidden sm:block translate-y-8 opacity-80 scale-90">
            <div className="bg-[#F4F4F8] h-full p-3">
              <div className="bg-blue-600 rounded-2xl p-4 mb-3">
                <div className="text-white text-xs font-bold mb-1">Müşteriler</div>
                <div className="flex gap-2 mt-2">
                  {[['VIP','#FEF3C7','#D97706'],['Yeni','#EFF6FF','#2563EB'],['Kayıp','#FEF2F2','#DC2626']].map(([label,bg,color])=>(
                    <div key={label} className="rounded-lg px-2 py-1 text-[9px] font-black" style={{backgroundColor:bg,color}}>{label}</div>
                  ))}
                </div>
              </div>
              {[['Zeynep S.','VIP','#D97706'],['Ali R.','Yeni','#2563EB'],['Selin T.','Risk','#EA580C']].map(([name,tag,color])=>(
                <div key={name} className="bg-white rounded-xl p-2.5 mb-2 flex items-center gap-2">
                  <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 text-xs font-black">{(name as string)[0]}</div>
                  <div className="flex-1">
                    <div className="text-gray-800 text-[11px] font-bold">{name}</div>
                  </div>
                  <div className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{color,backgroundColor:color+'20'}}>{tag}</div>
                </div>
              ))}
            </div>
          </PhoneMockup>
        </div>
      </section>

      {/* wave */}
      <div className="h-12 bg-gradient-to-b from-indigo-600 to-[#faf8ff]" />

      {/* ── Stats ── */}
      <section className="max-w-5xl mx-auto px-5 py-12">
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: '500+', key: 'stats_business', color: '#7C3AED' },
            { value: '50K+', key: 'stats_appointments', color: '#2563EB' },
            { value: '98%', key: 'stats_satisfaction', color: '#059669' },
          ].map(({ value, key, color }) => (
            <div key={key} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-black mb-1" style={{ color }}>{value}</div>
              <div className="text-gray-500 text-sm font-medium">{t(key as any)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-5 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-3">{t('feat_title')}</h2>
          <p className="text-gray-500 text-lg">{t('feat_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {FEATURES.map(({ key, icon, color, iconBg }) => (
            <div
              key={key}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ backgroundColor: color }}
              >
                {icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-base">{t(`${key}_title` as any)}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t(`${key}_desc` as any)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Download CTA ── */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <div className="bg-gradient-to-br from-purple-700 to-indigo-600 rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <h2 className="text-3xl font-black text-white mb-3 relative z-10">{t('download_title')}</h2>
          <p className="text-purple-200 mb-8 relative z-10">{t('download_subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black hover:bg-gray-900 text-white px-6 py-3.5 rounded-2xl transition justify-center"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="font-bold">App Store</span>
            </a>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black hover:bg-gray-900 text-white px-6 py-3.5 rounded-2xl transition justify-center"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76c.28.15.6.19.93.09l11.44-6.59-2.54-2.54-9.83 9.04zm-1.81-20.6C1.12 3.46 1 3.82 1 4.23v15.54c0 .41.12.77.37 1.07l.06.06 8.7-8.71v-.21L1.43 3.1l-.06.06zm19.1 8.44l-2.5-1.44-2.81 2.81 2.81 2.81 2.52-1.45c.72-.41.72-1.31-.02-1.73zm-17.65 9.97l9.84-5.67-2.54-2.53-7.3 8.2z"/>
              </svg>
              <span className="font-bold">Google Play</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-black">H</span>
            </div>
            <span className="font-bold text-gray-700">Hemensalon</span>
          </div>
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Hemensalon. {t('footer_rights')}</p>
          <div className="flex gap-2">
            {LOCALES.map(l => (
              <Link
                key={l.code}
                href={`/${l.code}`}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition ${l.code === locale ? 'bg-purple-100 ring-2 ring-purple-400' : 'bg-gray-100 hover:bg-gray-200'}`}
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

function PhoneMockup({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-44 sm:w-52 bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl ${className}`}>
      {/* notch */}
      <div className="bg-gray-900 h-5 flex items-center justify-center mb-1">
        <div className="w-16 h-3 bg-gray-800 rounded-full" />
      </div>
      <div className="bg-white rounded-[2rem] overflow-hidden" style={{ height: 380 }}>
        {children}
      </div>
    </div>
  )
}
