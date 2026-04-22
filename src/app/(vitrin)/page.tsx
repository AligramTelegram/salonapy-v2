import type { Metadata } from 'next'
import lazy from 'next/dynamic'
// Above-fold: senkron yükle (LCP için kritik)
import { Hero } from '@/components/vitrin/Hero'
import { Features } from '@/components/vitrin/Features'
import { BlogPreview } from '@/components/vitrin/BlogPreview'
// Below-fold: lazy yükle (TBT düşürür, JS chunk splitting)
const SectorGuide = lazy(() => import('@/components/vitrin/SectorGuide').then(m => ({ default: m.SectorGuide })))
const Pricing = lazy(() => import('@/components/vitrin/Pricing').then(m => ({ default: m.Pricing })))
const Testimonials = lazy(() => import('@/components/vitrin/Testimonials').then(m => ({ default: m.Testimonials })))
const Analytics = lazy(() => import('@/components/vitrin/Analytics').then(m => ({ default: m.Analytics })))
const FaqSection = lazy(() => import('@/components/vitrin/FaqSection').then(m => ({ default: m.FaqSection })))

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://hemensalon.com'

export const metadata: Metadata = {
  title: 'Online Randevu Sistemi | Kuaför, Berber ve Güzellik Salonu Yazılımı – Hemensalon',
  description:
    'Kuaför, berber, güzellik merkezi ve klinikler için Türkiye\'nin lider online randevu sistemi. SMS hatırlatmaları, personel yönetimi, WhatsApp bildirimleri ve finansal raporlar. 3 gün ücretsiz deneyin, kredi kartı gerekmez.',
  keywords: [
    'online randevu sistemi',
    'kuaför randevu programı',
    'berber yazılımı',
    'güzellik salonu yönetim programı',
    'salon yazılımı',
    'kuaför programı',
    'randevu yönetimi',
    'SMS hatırlatma',
    'güzellik merkezi yazılımı',
    'klinik randevu sistemi',
    'online randevu al',
    'kuaför online randevu',
    'salon yönetim yazılımı',
    'berber randevu sistemi',
    'hemensalon',
  ].join(', '),
  authors: [{ name: 'Hemensalon', url: BASE_URL }],
  creator: 'Hemensalon',
  publisher: 'Hemensalon',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: { 'tr-TR': BASE_URL },
  },
  openGraph: {
    title: 'Online Randevu Sistemi | Kuaför & Güzellik Salonu Yazılımı – Hemensalon',
    description:
      'Kuaför, berber ve güzellik salonları için Türkiye\'nin lider online randevu sistemi. SMS hatırlatmaları, WhatsApp bildirimleri, personel yönetimi. 3 gün ücretsiz.',
    type: 'website',
    locale: 'tr_TR',
    url: BASE_URL,
    siteName: 'Hemensalon',
    images: [
      {
        url: `${BASE_URL}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Hemensalon — Online Randevu Sistemi Kuaför ve Güzellik Salonu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Randevu Sistemi | Kuaför & Güzellik Salonu Yazılımı – Hemensalon',
    description:
      'Kuaför, berber ve güzellik salonları için online randevu sistemi. SMS hatırlatmaları, WhatsApp bildirimleri. 3 gün ücretsiz.',
    images: [`${BASE_URL}/images/og-image.png`],
  },
  other: {
    'geo.region': 'TR',
    'geo.placename': 'Türkiye',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'Hemensalon',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/logo.png`,
        width: 200,
        height: 60,
      },
      description:
        'Türkiye\'nin lider kuaför ve güzellik salonu randevu yönetim yazılımı. Online randevu, SMS hatırlatma, personel yönetimi.',
      foundingDate: '2023',
      areaServed: 'TR',
      serviceType: [
        'Online Randevu Sistemi',
        'Kuaför Yazılımı',
        'Güzellik Salonu Yönetim Programı',
        'SMS Hatırlatma Servisi',
      ],
      sameAs: [
        'https://www.instagram.com/hemensalon',
        'https://twitter.com/hemensalon',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'Hemensalon',
      description: 'Kuaför, berber ve güzellik salonları için online randevu sistemi',
      publisher: { '@id': `${BASE_URL}/#organization` },
      inLanguage: 'tr-TR',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/blog?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${BASE_URL}/#app`,
      name: 'Hemensalon',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      description:
        'Kuaför, berber, güzellik merkezi ve klinikler için online randevu yönetim yazılımı. SMS hatırlatmaları, WhatsApp bildirimleri, personel yönetimi, finansal raporlar.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'TRY',
        description: '3 gün ücretsiz deneme, kredi kartı gerekmez',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '7870',
        bestRating: '5',
        worstRating: '1',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Hemensalon online randevu sistemi ücretsiz mi?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Evet, Hemensalon 3 gün ücretsiz deneme sunar. Kredi kartı gerekmez. Deneme süresinin ardından aylık abonelik planlarından birini seçebilirsiniz.',
          },
        },
        {
          '@type': 'Question',
          name: 'Kuaförüm için online randevu sistemi nasıl kurulur?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Hemensalon ile kurulum 5 dakikadan kısa sürer. Ücretsiz hesap açın, işletmenizi tanımlayın, hizmetlerinizi ve çalışanlarınızı ekleyin. Randevu linkiniz anında hazır olur.',
          },
        },
        {
          '@type': 'Question',
          name: 'SMS hatırlatma özelliği nasıl çalışıyor?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Randevu alındığında otomatik onay SMS\'i gönderilir. Randevudan 24 saat ve 2 saat önce hatırlatma mesajları müşteriye ulaşır. Bu sayede iptal oranı ortalama %30 düşer.',
          },
        },
        {
          '@type': 'Question',
          name: 'WhatsApp entegrasyonu nasıl çalışıyor?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'WhatsApp Business API entegrasyonu ile randevu onayı, hatırlatma ve teşekkür mesajları otomatik gönderilir. AI asistan özelliği ile WhatsApp üzerinden gelen mesajlara otomatik yanıt verilir ve randevu oluşturulur.',
          },
        },
        {
          '@type': 'Question',
          name: 'Hangi sektörler Hemensalon kullanabilir?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Kuaför, berber, güzellik merkezi, nail art stüdyosu, güzellik kliniği, masaj salonu, dövme stüdyosu ve benzer hizmet sektörlerindeki tüm işletmeler Hemensalon kullanabilir.',
          },
        },
      ],
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Features />
      <SectorGuide />
      <Pricing />
      <Testimonials />
      <Analytics />
      <FaqSection />
      <BlogPreview />
    </>
  )
}
