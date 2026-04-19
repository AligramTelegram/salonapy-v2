import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { LogoIcon } from '@/components/ui/LogoIcon'

const FOOTER_LINKS = [
  {
    title: 'Ürün',
    links: [
      { href: '/ozellikler', label: 'Özellikler', title: 'Özellikler' },
      { href: '/fiyatlar', label: 'Fiyatlar', title: 'Fiyatlandırma' },
{ href: '/entegrasyonlar', label: 'Entegrasyonlar', title: 'Entegrasyonlar' },
    ],
  },
  {
    title: 'Şirket',
    links: [
      { href: '/hakkimizda', label: 'Hakkımızda', title: 'Hakkımızda' },
      { href: '/iletisim', label: 'İletişim', title: 'İletişim' },
      { href: '/kariyer', label: 'Kariyer', title: 'Kariyer Fırsatları' },
    ],
  },
  {
    title: 'Destek',
    links: [
      { href: '/yardim', label: 'Yardım Merkezi', title: 'Yardım Merkezi' },
      { href: '/durum', label: 'Sistem Durumu', title: 'Sistem Durumu' },
      { href: '/api', label: 'API Dokümantasyon', title: 'API Dokümantasyonu' },
      { href: '/iletisim', label: 'Destek Talebi', title: 'Destek Talebi' },
    ],
  },
  {
    title: 'Hukuki',
    links: [
      { href: '/gizlilik', label: 'Gizlilik Politikası', title: 'Gizlilik Politikası' },
      { href: '/kullanim-sartlari', label: 'Kullanım Şartları', title: 'Kullanım Şartları' },
      { href: '/kvkk', label: 'KVKK', title: 'KVKK Aydınlatma Metni' },
      { href: '/cerez-politikasi', label: 'Çerez Politikası', title: 'Çerez Politikası' },
      { href: '/iptal-iade', label: 'İptal ve İade', title: 'İptal ve İade Politikası' },
      { href: '/mesafeli-satis-sozlesmesi', label: 'Mesafeli Satış', title: 'Mesafeli Satış Sözleşmesi' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-purple-100/60 bg-white/60">
      <div className="container-custom py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-1">
  <Link href="/" title="Hemensalon Ana Sayfa" className="group mb-5 flex items-center gap-2.5 select-none w-fit">
    <LogoIcon size={40} className="transition-transform duration-300 group-hover:scale-110" />
              <span className="font-display text-lg font-bold text-gray-900">
                Hemen<span className="text-purple-600">salon</span>
              </span>
            </Link>
            <p className="mb-5 text-sm leading-relaxed text-gray-500">
              Kuaför, berber ve güzellik salonları için akıllı randevu yönetim sistemi.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              <SocialLink href="https://instagram.com/hemensalon" label="Instagram">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://twitter.com/hemensalon" label="X (Twitter)">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://linkedin.com/company/hemensalon" label="LinkedIn">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      title={link.title}
                      className="text-sm text-gray-500 transition-colors hover:text-purple-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment logos */}
        <div className="border-t border-purple-100/60 pt-8 mt-14">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Güvenli Ödeme:</span>
              <div className="flex gap-3 items-center">
                <img src="/images/payment/visa.svg" alt="Visa" className="h-8 rounded" />
                <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-8 rounded" />
                <img src="/images/payment/iyzico.svg" alt="iyzico" className="h-8 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-purple-100/60 pt-8 sm:flex-row">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Hemensalon x Cihanbey. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-gray-400">
            Türkiye'de ❤️ ile yapılmıştır · KVKK Uyumlu
          </p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-100 text-gray-400 transition-colors hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
    >
      {children}
    </a>
  )
}
