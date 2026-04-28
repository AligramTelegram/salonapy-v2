import type { Metadata } from 'next'
import { Mail, Phone, MapPin } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { IletisimForm } from './IletisimForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'İletişim | Hemensalon Destek & Müşteri Hizmetleri',
  description:
    'Hemensalon destek ekibine ulaşın. Salon yazılımı hakkında sorularınız için e-posta, telefon veya iletişim formu ile bize yazın. Ortalama yanıt süresi 2 saat.',
  keywords: 'hemensalon iletişim, salon yazılımı destek, kuaför programı yardım, online randevu destek',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://hemensalon.com/iletisim' },
  openGraph: {
    title: 'İletişim – Hemensalon Destek',
    description: 'Sorularınız için bizimle iletişime geçin. Hızlı yanıt garantisi.',
    url: 'https://hemensalon.com/iletisim',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'İletişim – Hemensalon Destek',
    description: 'Sorularınız için bizimle iletişime geçin.',
  },
}

async function getContactSettings() {
  const keys = [
    'contact_email',
    'contact_phone',
    'contact_address',
    'social_instagram',
    'social_twitter',
    'social_linkedin',
    'social_facebook',
  ]
  const rows = await prisma.siteSetting.findMany({ where: { key: { in: keys } } })
  const map: Record<string, string> = {}
  for (const row of rows) map[row.key] = row.value
  return map
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Hemensalon',
  url: 'https://hemensalon.com',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    availableLanguage: 'Turkish',
    email: 'destek@hemensalon.com',
  },
  sameAs: [
    'https://instagram.com/hemensalon',
    'https://twitter.com/hemensalon',
  ],
}

export default async function IletisimPage() {
  const s = await getContactSettings()

  const email = s.contact_email || ''
  const phone = s.contact_phone || ''
  const address = s.contact_address || ''
  const instagram = s.social_instagram || ''
  const twitter = s.social_twitter || ''
  const linkedin = s.social_linkedin || ''

  const infoItems = [
    email && { icon: Mail, label: 'Email', value: email, href: `mailto:${email}` },
    phone && { icon: Phone, label: 'Telefon', value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
    address && { icon: MapPin, label: 'Adres', value: address, href: null },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href: string | null }[]

  const socialLinks = [
    instagram && {
      href: instagram,
      label: 'Instagram',
      svg: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    twitter && {
      href: twitter,
      label: 'X (Twitter)',
      svg: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zM17.083 19.77h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    linkedin && {
      href: linkedin,
      label: 'LinkedIn',
      svg: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ].filter(Boolean) as { href: string; label: string; svg: React.ReactNode }[]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
    <div className="min-h-screen pt-24">
      {/* Header */}
      <section className="pb-8 pt-12 text-center">
        <div className="container-custom">
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            İletişim
          </span>
          <h1 className="mb-4 font-display text-4xl font-bold text-gray-900 md:text-5xl">
            Bizimle
            <br />
            <span className="text-purple-600">iletişime geçin</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-gray-500">
            Sorularınız için buradayız. Ortalama yanıt süremiz 2 saattir.
          </p>
        </div>
      </section>

      {/* 2-col layout */}
      <section className="pb-24">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Form — 3 cols */}
            <div className="lg:col-span-3">
              <IletisimForm />
            </div>

            {/* Info sidebar — 2 cols */}
            <div className="flex flex-col gap-5 lg:col-span-2">
              {/* Contact info cards */}
              {infoItems.map((item) => {
                const Icon = item.icon
                const inner = (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                      <Icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="mb-0.5 text-xs font-medium text-gray-400 uppercase tracking-wide">
                        {item.label}
                      </p>
                      <p className="text-sm font-medium text-gray-800">{item.value}</p>
                    </div>
                  </div>
                )
                return (
                  <div key={item.label} className="glass-card p-5">
                    {item.href ? (
                      <a href={item.href} className="group block">{inner}</a>
                    ) : (
                      inner
                    )}
                  </div>
                )
              })}

              {/* Social media card */}
              {socialLinks.length > 0 && (
                <div className="glass-card p-5">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Sosyal Medya
                  </p>
                  <div className="flex gap-3">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-colors hover:bg-purple-200"
                        aria-label={link.label}
                      >
                        {link.svg}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Response time badge */}
              <div className="rounded-xl border border-purple-100 bg-purple-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600">
                    <span className="text-xs font-bold text-white">2s</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Hızlı Yanıt</p>
                    <p className="text-xs text-gray-500">Ortalama yanıt süremiz 2 saattir.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
