'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LogoIcon } from '@/components/ui/LogoIcon'
import { cn } from '@/lib/utils'
import { useTranslations, useLocale } from 'next-intl'

const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL ?? '#'
const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? '#'

const LOCALE_LABELS: Record<string, string> = { tr: 'TR', en: 'EN', de: 'DE', ar: 'AR' }
const ALL_LOCALES = ['tr', 'en', 'de', 'ar']

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const pathname = usePathname()
  const t = useTranslations('nav')
  const locale = useLocale()

  const navLinks = [
    { href: `/${locale}/ozellikler`, label: t('features') },
    { href: `/${locale}/fiyatlar`, label: t('pricing') },
    { href: `/${locale}/iletisim`, label: t('contact') },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false); setLangOpen(false) }, [pathname])

  // Mevcut sayfanın başka locale versiyonunu bul
  function switchLocaleHref(newLocale: string) {
    // /tr/ozellikler → /en/ozellikler
    const segments = pathname.split('/')
    segments[1] = newLocale
    return segments.join('/') || `/${newLocale}`
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-purple-100/60'
          : 'bg-transparent'
      )}
    >
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} title="Hemensalon Ana Sayfa" className="group flex items-center gap-2 select-none">
          <LogoIcon size={32} className="transition-transform group-hover:scale-105" />
          <span className="font-display text-lg font-bold text-gray-900">
            Hemen<span className="text-purple-600">salon</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:text-purple-600',
                pathname === link.href ? 'text-purple-600' : 'text-gray-600'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Dil seçici */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-semibold text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            >
              {LOCALE_LABELS[locale]}
              <svg className="h-3 w-3 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 rounded-xl border border-purple-100 bg-white shadow-lg overflow-hidden z-50">
                {ALL_LOCALES.map((l) => (
                  <Link
                    key={l}
                    href={switchLocaleHref(l)}
                    className={cn(
                      'block px-4 py-2 text-sm font-medium transition-colors hover:bg-purple-50 hover:text-purple-600',
                      l === locale ? 'text-purple-600 bg-purple-50' : 'text-gray-700'
                    )}
                  >
                    {LOCALE_LABELS[l]}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" title="App Store'dan İndir">
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-purple-600 gap-1.5">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              {t('appStore')}
            </Button>
          </Link>
          <Link href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" title="Google Play'den İndir">
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200/60 gap-1.5">
              <Smartphone className="h-4 w-4" />
              {t('downloadApp')}
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 md:hidden"
          aria-label={t('menuOpen')}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-purple-100/60 bg-white/95 backdrop-blur-xl md:hidden">
          <div className="container-custom py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600"
              >
                {link.label}
              </Link>
            ))}
            {/* Dil seçimi mobil */}
            <div className="flex gap-2 px-3 py-2">
              {ALL_LOCALES.map((l) => (
                <Link
                  key={l}
                  href={switchLocaleHref(l)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-bold transition-colors',
                    l === locale ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                  )}
                >
                  {LOCALE_LABELS[l]}
                </Link>
              ))}
            </div>
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  {t('appStore')}
                </Button>
              </Link>
              <Link href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 gap-2">
                  <Smartphone className="h-4 w-4" />
                  {t('downloadApp')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
