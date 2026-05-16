import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { MobileAppLanding } from '@/components/vitrin/MobileAppLanding'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://hemensalon.com'

const titles: Record<string, string> = {
  tr: 'Hemensalon – Salonunuzu Avucunuzda Yönetin | iOS & Android',
  en: 'Hemensalon – Manage Your Salon From Your Pocket | iOS & Android',
  de: 'Hemensalon – Verwalten Sie Ihren Salon in der Tasche | iOS & Android',
  ar: 'هيمنسالون – أدِر صالونك من جيبك | iOS & Android',
}
const descs: Record<string, string> = {
  tr: 'Kuaför, berber ve güzellik salonları için mobil uygulama. Randevu, müşteri, personel, stok ve finans yönetimi. 3 gün ücretsiz.',
  en: 'Mobile app for hair salons, barbers and beauty studios. Appointment, customer, staff, inventory and finance management. 3-day free trial.',
  de: 'Mobile App für Friseursalons, Barbiere und Beauty-Studios. Termin-, Kunden-, Personal-, Lager- und Finanzverwaltung. 3 Tage kostenlos.',
  ar: 'تطبيق جوال لصالونات الشعر والحلاقة ومراكز التجميل. إدارة المواعيد والعملاء والموظفين والمخزون والمالية. 3 أيام مجانية.',
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: titles[locale] ?? titles.tr,
    description: descs[locale] ?? descs.tr,
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: { tr: `${BASE_URL}/tr`, en: `${BASE_URL}/en`, de: `${BASE_URL}/de`, ar: `${BASE_URL}/ar` },
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
  return <MobileAppLanding />
}
