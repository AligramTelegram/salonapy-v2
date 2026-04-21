import type { Metadata } from 'next'
import { Hero } from '@/components/vitrin/Hero'
import { Analytics } from '@/components/vitrin/Analytics'
import { Features } from '@/components/vitrin/Features'
import { Pricing } from '@/components/vitrin/Pricing'
import { Testimonials } from '@/components/vitrin/Testimonials'
import { BlogPreview } from '@/components/vitrin/BlogPreview'
import { SectorGuide } from '@/components/vitrin/SectorGuide'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Hemensalon - Randevu Yönetim Platformu',
  description:
    'Kuaför, berber, güzellik merkezi ve klinikler için akıllı randevu yönetim sistemi. SMS hatırlatmaları, otomatik hatırlatmalar, 3 gün ücretsiz.',
  openGraph: {
    title: 'Hemensalon - Randevu Yönetim Platformu',
    description:
      'SMS hatırlatmaları, otomatik hatırlatmalar ve detaylı raporlar ile işletmenizi büyütün.',
    type: 'website',
  },
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
      <BlogPreview />
    </>
  )
}
