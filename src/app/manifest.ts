import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  let siteName = 'Hemensalon'
  let siteDescription = 'Kuaför, berber ve güzellik salonları için akıllı randevu yönetim sistemi.'

  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ['site_name', 'site_slogan'] } },
      select: { key: true, value: true },
    })
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))
    if (map.site_name) siteName = map.site_name
    if (map.site_slogan) siteDescription = map.site_slogan
  } catch {
    // DB erişim hatası — statik fallback kullan
  }

  return {
    name: `${siteName} - Randevu Yönetim Platformu`,
    short_name: siteName,
    description: siteDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#faf8ff',
    theme_color: '#7c3aed',
    orientation: 'portrait-primary',
    lang: 'tr',
    categories: ['business', 'productivity'],
    icons: [
      {
        src: '/icons/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
