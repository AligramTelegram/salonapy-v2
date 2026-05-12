import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import lazy from 'next/dynamic'
import { Hero } from '@/components/vitrin/Hero'
import { Features } from '@/components/vitrin/Features'
import { BlogPreview } from '@/components/vitrin/BlogPreview'

const SectorGuide = lazy(() => import('@/components/vitrin/SectorGuide').then(m => ({ default: m.SectorGuide })))
const Pricing = lazy(() => import('@/components/vitrin/Pricing').then(m => ({ default: m.Pricing })))
const Testimonials = lazy(() => import('@/components/vitrin/Testimonials').then(m => ({ default: m.Testimonials })))
const Analytics = lazy(() => import('@/components/vitrin/Analytics').then(m => ({ default: m.Analytics })))
const FaqSection = lazy(() => import('@/components/vitrin/FaqSection').then(m => ({ default: m.FaqSection })))

export const revalidate = 60

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://hemensalon.com'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations('hero')

  const titles: Record<string, string> = {
    tr: 'Online Randevu Sistemi | Kuaför, Berber ve Güzellik Salonu Yazılımı – Hemensalon',
    en: 'Online Booking System | Hair Salon & Beauty Software – Hemensalon',
    de: 'Online-Buchungssystem | Friseur & Beauty-Salon Software – Hemensalon',
    ar: 'نظام الحجز الإلكتروني | برنامج صالون الحلاقة والتجميل – Hemensalon',
  }
  const descs: Record<string, string> = {
    tr: "Kuaför, berber, güzellik merkezi ve klinikler için Türkiye'nin lider online randevu sistemi. SMS hatırlatmaları, personel yönetimi, WhatsApp bildirimleri. 3 gün ücretsiz.",
    en: 'The leading online booking system for hair salons, barbers, beauty centers and clinics. SMS reminders, staff management, WhatsApp notifications. 3-day free trial.',
    de: 'Das führende Online-Buchungssystem für Friseursalons, Barbiere und Beauty-Center. SMS-Erinnerungen, Personalverwaltung, WhatsApp-Benachrichtigungen. 3 Tage kostenlos.',
    ar: 'نظام الحجز الإلكتروني الرائد لصالونات الحلاقة ومراكز التجميل والعيادات. تذكيرات SMS، إدارة الموظفين، إشعارات واتساب. تجربة مجانية 3 أيام.',
  }

  return {
    title: titles[locale] ?? titles.tr,
    description: descs[locale] ?? descs.tr,
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        'tr': `${BASE_URL}/tr`,
        'en': `${BASE_URL}/en`,
        'de': `${BASE_URL}/de`,
        'ar': `${BASE_URL}/ar`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'tr' ? 'tr_TR' : locale === 'de' ? 'de_DE' : locale === 'ar' ? 'ar_SA' : 'en_US',
      url: `${BASE_URL}/${locale}`,
      siteName: 'Hemensalon',
      title: titles[locale] ?? titles.tr,
      description: descs[locale] ?? descs.tr,
    },
  }
}

export default function HomePage() {
  return (
    <>
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
