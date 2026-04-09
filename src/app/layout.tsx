import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import { TrackingHeadScripts, TrackingBodyScripts } from '@/components/TrackingScripts'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'
import { Providers } from '@/components/Providers'
import { Toaster } from 'sonner'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://salonapy.com'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Salonapy - Randevu Yönetim Platformu',
    template: '%s | Salonapy',
  },
  description:
    'Kuaför, berber, güzellik merkezi ve klinikler için akıllı randevu yönetim sistemi. WhatsApp bildirimleri, otomatik hatırlatmalar, 3 gün ücretsiz.',
  keywords: [
    'randevu sistemi',
    'randevu yönetimi',
    'kuaför yazılımı',
    'berber programı',
    'güzellik merkezi',
    'salon yönetimi',
    'WhatsApp randevu',
    'online randevu',
    'salonapy',
  ],
  authors: [{ name: 'Salonapy', url: APP_URL }],
  creator: 'Salonapy',
  publisher: 'Salonapy',
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
    siteName: 'Salonapy',
    title: 'Salonapy - Randevu Yönetim Platformu',
    description:
      'Kuaför, berber, güzellik merkezi ve klinikler için akıllı randevu yönetim sistemi. WhatsApp bildirimleri, otomatik hatırlatmalar, 3 gün ücretsiz.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Salonapy - Randevu Yönetim Platformu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@salonapy',
    creator: '@salonapy',
    title: 'Salonapy - Randevu Yönetim Platformu',
    description:
      'Kuaför, berber ve güzellik salonları için akıllı randevu sistemi. WhatsApp bildirimleri dahil.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/favicon.svg',
    apple: '/icons/favicon.svg',
  },
  alternates: {
    canonical: APP_URL,
  },
  category: 'business',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${sora.variable}`}>
      <head>
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
