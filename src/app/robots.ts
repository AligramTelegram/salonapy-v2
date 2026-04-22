import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://hemensalon.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ─── Genel kurallar ──────────────────────────────────────────────────
      {
        userAgent: '*',
        allow: [
          '/',
          '/ozellikler',
          '/fiyatlar',
          '/blog',
          '/blog/',
          '/iletisim',
          '/hakkimizda',
          '/entegrasyonlar',
          '/kariyer',
          '/yardim',
          '/gizlilik',
          '/kullanim-sartlari',
          '/kvkk',
        ],
        disallow: [
          '/api/',
          '/p/',
          '/b/',
          '/admin/',
          '/giris',
          '/kayit',
          '/sifremi-unuttum',
          '/auth/',
          '/_next/',
          '/cerez-politikasi',
          '/mesafeli-satis-sozlesmesi',
          '/iptal-iade',
          '/gizlilik-politikasi',
          '/durum',
        ],
      },
      // ─── GPTBot (OpenAI) — içerik izni yok ──────────────────────────────
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      // ─── Google-Extended (AI) — içerik izni yok ─────────────────────────
      {
        userAgent: 'Google-Extended',
        disallow: ['/'],
      },
      // ─── CCBot — Common Crawl ────────────────────────────────────────────
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
