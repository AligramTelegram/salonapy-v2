import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://hemensalon.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/ozellikler',
          '/fiyatlar',
          '/blog',
          '/blog/',
          '/iletisim',
          '/gizlilik',
          '/kullanim-sartlari',
          '/kvkk',
          '/giris',
          '/kayit',
        ],
        disallow: [
          '/api/',
          '/p/',
          '/b/',
          '/admin/',
          '/sifremi-unuttum',
          '/_next/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
