import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Pricing } from '@/components/vitrin/Pricing'
import { Testimonials } from '@/components/vitrin/Testimonials'
import { ArrowRight, HelpCircle } from 'lucide-react'

const FAQ = [
  {
    q: 'Deneme süresi bittikten sonra ne olur?',
    a: '3 günlük deneme süresinin sonunda bir plan seçmeniz istenir. Seçmezseniz hesabınız pasife alınır, verileriniz 30 gün daha saklanır.',
  },
  {
    q: 'İstediğim zaman plan değiştirebilir miyim?',
    a: 'Evet, istediğiniz zaman plan yükseltebilir veya düşürebilirsiniz.',
  },
  {
    q: 'SMS limitini aşarsam ne olur?',
    a: 'Limit aşıldığında SMS gönderimleri duraklar ve bildirim alırsınız. Ek 250 SMS paketi (+₺300) satın alabilirsiniz.',
  },
  {
    q: 'Kredi kartı olmadan ödeme yapabilir miyim?',
    a: 'Evet, banka havalesi ve EFT ile ödeme yapabilirsiniz.',
  },
  {
    q: 'Verilerimi export edebilir miyim?',
    a: 'Evet, müşteri, randevu ve finansal verilerinizi CSV formatında dışa aktarabilirsiniz.',
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pricing')
  return {
    title: `${t('title')} ${t('title_highlight')} – Hemensalon`,
    description: t('subtitle'),
  }
}

export default async function FiyatlarPage() {
  const t = await getTranslations('pricing')

  return (
    <div className="min-h-screen pt-24">
      <section className="pb-4 pt-12 text-center">
        <div className="container-custom">
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            {t('badge')}
          </span>
          <h1 className="mb-4 font-display text-4xl font-bold text-gray-900 md:text-5xl">
            {t('title')}
            <br />
            <span className="text-purple-600">{t('title_highlight')}</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-gray-500">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <Pricing />

      <section className="pb-20">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl font-bold text-gray-900 md:text-3xl">
              Sık Sorulan Sorular
            </h2>
          </div>
          <div className="mx-auto max-w-2xl space-y-4">
            {FAQ.map((item) => (
              <div key={item.q} className="rounded-xl border border-purple-100/60 bg-white p-5 shadow-sm">
                <div className="mb-2 flex items-start gap-3">
                  <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" />
                  <h3 className="font-display text-sm font-bold text-gray-900">{item.q}</h3>
                </div>
                <p className="pl-7 text-sm leading-relaxed text-gray-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
    </div>
  )
}
