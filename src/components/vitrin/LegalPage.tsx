import Link from 'next/link'
import Image from 'next/image'

export interface LegalSection {
  heading: string
  body: string
}

export interface LegalContent {
  title: string
  subtitle?: string
  updated: string
  sections: LegalSection[]
}

const LOCALE_LABELS: Record<string, string> = {
  tr: 'Türkçe 🇹🇷',
  en: 'English 🇬🇧',
  de: 'Deutsch 🇩🇪',
  ar: 'العربية 🇸🇦',
}

const FOOTER_LINKS: Record<string, { label: string; links: { href: string; label: string }[] }[]> = {
  tr: [
    {
      label: 'Yasal',
      links: [
        { href: '/tr/gizlilik', label: 'Gizlilik Politikası' },
        { href: '/tr/kullanim-sartlari', label: 'Kullanım Şartları' },
        { href: '/tr/cerez-politikasi', label: 'Çerez Politikası' },
        { href: '/tr/kvkk', label: 'KVKK' },
        { href: '/tr/hesap-silme', label: 'Hesap Silme' },
      ],
    },
  ],
  en: [
    {
      label: 'Legal',
      links: [
        { href: '/en/gizlilik', label: 'Privacy Policy' },
        { href: '/en/kullanim-sartlari', label: 'Terms of Service' },
        { href: '/en/cerez-politikasi', label: 'Cookie Policy' },
        { href: '/en/kvkk', label: 'KVKK / GDPR' },
        { href: '/en/hesap-silme', label: 'Account Deletion' },
      ],
    },
  ],
  de: [
    {
      label: 'Rechtliches',
      links: [
        { href: '/de/gizlilik', label: 'Datenschutzrichtlinie' },
        { href: '/de/kullanim-sartlari', label: 'Nutzungsbedingungen' },
        { href: '/de/cerez-politikasi', label: 'Cookie-Richtlinie' },
        { href: '/de/kvkk', label: 'DSGVO / KVKK' },
        { href: '/de/hesap-silme', label: 'Konto löschen' },
      ],
    },
  ],
  ar: [
    {
      label: 'قانوني',
      links: [
        { href: '/ar/gizlilik', label: 'سياسة الخصوصية' },
        { href: '/ar/kullanim-sartlari', label: 'شروط الخدمة' },
        { href: '/ar/cerez-politikasi', label: 'سياسة ملفات تعريف الارتباط' },
        { href: '/ar/kvkk', label: 'حماية البيانات' },
        { href: '/ar/hesap-silme', label: 'حذف الحساب' },
      ],
    },
  ],
}

export function LegalPage({
  content,
  locale,
}: {
  content: LegalContent
  locale: string
}) {
  const isRtl = locale === 'ar'
  const footerLinks = FOOTER_LINKS[locale] ?? FOOTER_LINKS.en

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Image src="/icons/favicon.png" alt="Hemensalon" width={28} height={28} className="rounded-none" />
            <span className="font-black text-gray-900 text-base">Hemensalon</span>
          </Link>
          <div className="flex gap-1">
            {Object.entries(LOCALE_LABELS).map(([code, label]) => (
              <Link key={code} href={`/${code}`}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${code === locale ? 'bg-violet-100 text-violet-700' : 'text-gray-400 hover:text-gray-700'}`}>
                {label.split(' ')[1]}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-5 py-14">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href={`/${locale}`} className="hover:text-violet-600 transition">Hemensalon</Link>
          <span>/</span>
          <span className="text-gray-600">{content.title}</span>
        </div>

        <div className="mb-10">
          <span className="inline-block bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
            {locale === 'tr' ? 'Yasal' : locale === 'de' ? 'Rechtliches' : locale === 'ar' ? 'قانوني' : 'Legal'}
          </span>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{content.title}</h1>
          {content.subtitle && <p className="text-gray-500 text-lg mb-2">{content.subtitle}</p>}
          <p className="text-sm text-gray-400">{content.updated}</p>
        </div>

        <div className="space-y-10">
          {content.sections.map((section) => (
            <div key={section.heading} className="pb-8 border-b border-gray-100 last:border-0">
              <h2 className="text-lg font-bold text-gray-800 mb-3">{section.heading}</h2>
              <p className="whitespace-pre-line text-gray-600 leading-relaxed text-[15px]">{section.body}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-10 px-5 mt-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-8 justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image src="/icons/favicon.png" alt="Hemensalon" width={24} height={24} className="rounded-none" />
                <span className="font-black text-gray-800 text-sm">Hemensalon</span>
              </div>
              <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
                {locale === 'tr' ? 'Kuaför ve güzellik salonları için akıllı randevu sistemi.' :
                 locale === 'de' ? 'Intelligentes Terminsystem für Friseure und Schönheitssalons.' :
                 locale === 'ar' ? 'نظام مواعيد ذكي لصالونات الشعر والتجميل.' :
                 'Smart appointment system for hair salons and beauty studios.'}
              </p>
            </div>
            {footerLinks.map(group => (
              <div key={group.label}>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{group.label}</div>
                <ul className="space-y-2">
                  {group.links.map(link => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-gray-500 hover:text-violet-600 transition">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-400 text-xs">© {new Date().getFullYear()} Hemensalon. All rights reserved.</p>
            <div className="flex gap-1.5">
              {Object.keys(LOCALE_LABELS).map(code => (
                <Link key={code} href={`/${code}`}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border transition ${code === locale ? 'bg-violet-50 border-violet-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                  {LOCALE_LABELS[code].split(' ')[1]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
