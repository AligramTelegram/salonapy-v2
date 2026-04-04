'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/ozellikler', label: 'Özellikler' },
  { href: '/fiyatlar', label: 'Fiyatlar' },
  { href: '/blog', label: 'Blog' },
  { href: '/iletisim', label: 'İletişim' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Rota değişince menüyü kapat
  useEffect(() => setOpen(false), [pathname])

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
        <Link href="/" className="group flex items-center gap-2 select-none">
  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 shadow-md shadow-purple-200 transition-all group-hover:bg-purple-700 group-hover:scale-105">
    <span className="font-display text-sm font-bold text-white leading-none">S</span>
  </div>
          <span className="font-display text-lg font-bold text-gray-900">
            Salon<span className="text-purple-600">apy</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:text-purple-600',
                pathname === link.href
                  ? 'text-purple-600'
                  : 'text-gray-600'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/giris">
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-purple-600">
              Giriş Yap
            </Button>
          </Link>
          <Link href="/kayit">
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200/60"
            >
              Ücretsiz Dene
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 md:hidden"
          aria-label="Menüyü aç"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-purple-100/60 bg-white/95 backdrop-blur-xl md:hidden">
          <div className="container-custom py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link href="/giris">
                <Button variant="outline" className="w-full">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/kayit">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Ücretsiz Dene
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
