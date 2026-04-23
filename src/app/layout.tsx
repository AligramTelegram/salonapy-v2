import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import { TrackingHeadScripts, TrackingBodyScripts } from '@/components/TrackingScripts'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'
import { Providers } from '@/components/Providers'
import { Toaster } from 'sonner'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { prisma } from '@/lib/prisma'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://hemensalon.com'

export async function generateMetadata(): Promise<Metadata> {
  let ogImage = '/og-image.png'

  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'seo_og_image' } })
    if (setting?.value) ogImage = setting.value
  } catch {
    // DB erişim hatası — statik fallback kullan
  }

  return {
    metadataBase: new URL(APP_URL),
    title: {
      default: 'Online Randevu Sistemi | Kuaför & Güzellik Salonu Yazılımı – Hemensalon',
      template: '%s – Hemensalon',
    },
    description:
      'Kuaför, berber, güzellik merkezi ve klinikler için Türkiye\'nin lider online randevu sistemi. SMS & WhatsApp hatırlatmaları, personel yönetimi, finansal raporlar. 3 gün ücretsiz.',
    keywords: [
      'online randevu sistemi',
      'kuaför randevu programı',
      'berber yazılımı',
      'güzellik salonu yönetim programı',
      'salon yazılımı',
      'kuaför programı',
      'randevu yönetimi',
      'SMS hatırlatma',
      'WhatsApp randevu',
      'güzellik merkezi yazılımı',
      'hemensalon',
    ],
    authors: [{ name: 'Hemensalon', url: APP_URL }],
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
    openGraph: {
      type: 'website',
      locale: 'tr_TR',
      url: APP_URL,
      siteName: 'Hemensalon',
      title: 'Hemensalon - Randevu Yönetim Platformu',
      description:
        'Kuaför, berber, güzellik merkezi ve klinikler için akıllı randevu yönetim sistemi. WhatsApp bildirimleri, otomatik hatırlatmalar, 3 gün ücretsiz.',
      images: [{ url: ogImage, width: 1200, height: 630, alt: 'Hemensalon - Randevu Yönetim Platformu' }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@hemensalon',
      creator: '@hemensalon',
      title: 'Hemensalon - Randevu Yönetim Platformu',
      description:
        'Kuaför, berber ve güzellik salonları için akıllı randevu sistemi. WhatsApp bildirimleri dahil.',
      images: [ogImage],
    },
    manifest: '/manifest.webmanifest',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icons/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: '/icons/favicon.svg',
    },
    alternates: {
      canonical: APP_URL,
    },
    category: 'business',
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${sora.variable}`}>
      <head>
        {/* next/font self-host ediyor — GTM için dns-prefetch yeterli */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        <TrackingHeadScripts />
      </head>
      <body className="font-sans antialiased bg-[#faf8ff]">
        <TrackingBodyScripts />
        <Providers>{children}</Providers>
        <ServiceWorkerRegister />
        <Toaster position="bottom-right" richColors />
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
