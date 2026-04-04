import type { Metadata } from 'next'
import { Pricing } from '@/components/vitrin/Pricing'
import { Testimonials } from '@/components/vitrin/Testimonials'
import { ArrowRight, HelpCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Fiyatlar - Salonapy',
  description:
    'Salonapy fiyat planları: Başlangıç ₺450, Profesyonel ₺950, İşletme ₺1.450/ay. 14 gün ücretsiz deneme.',
  openGraph: {
    title: 'Fiyatlar - Salonapy',
    description: '14 gün ücretsiz deneyin. Kredi kartı gerekmez. İstediğiniz zaman iptal.',
  },
}

const FAQ = [
  {
    q: 'Deneme süresi bittikten sonra ne olur?',
    a: '14 günlük deneme süresinin sonunda bir plan seçmeniz istenir. Seçmezseniz hesabınız pasife alınır, verileriniz 30 gün daha saklanır.',
  },
  {
    q: 'İstediğim zaman plan değiştirebilir miyim?',
    a: 'Evet, istediğiniz zaman plan yükseltebilir veya düşürebilirsiniz. Fark tutarı bir sonraki faturanıza yansıtılır.',
  },
  {
    q: 'SMS limitini aşarsam ne olur?',
    a: 'Limit aşıldığında SMS gönderimleri duraklar ve bildirim alırsınız. Ek 250 SMS paketi (+₺300) satın alabilir veya bir üst plana geçebilirsiniz.',
  },
  {
    q: 'Kredi kartı olmadan ödeme yapabilir miyim?',
    a: 'Evet, banka havalesi ve EFT ile ödeme yapabilirsiniz. Fatura kesimi talep etmek için destek ekibimizle iletişime geçin.',
  },
  {
    q: 'Verilerimi export edebilir miyim?',
    a: 'Evet, müşteri, randevu ve finansal verilerinizi CSV formatında dışa aktarabilirsiniz.',
  },
]

export default function FiyatlarPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <section className="pb-4 pt-12 text-center">
        <div className="container-custom">
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            Fiyatlar
          </span>
          <h1 className="mb-4 font-display text-4xl font-bold text-gray-900 md:text-5xl">
            İşletmenize uygun
            <br />
            <span className="text-purple-600">planı seçin</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-gray-500">
            Tüm planlar 14 gün ücretsiz başlar. İstediğiniz zaman iptal edebilirsiniz.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <Pricing />

      {/* FAQ */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl font-bold text-gray-900 md:text-3xl">
              Sık Sorulan Sorular
            </h2>
          </div>
          <div className="mx-auto max-w-2xl space-y-4">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-purple-100/60 bg-white p-5 shadow-sm"
              >
                <div className="mb-2 flex items-start gap-3">
                  <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" />
                  <h3 className="font-display text-sm font-bold text-gray-900">{item.q}</h3>
                </div>
                <p className="pl-7 text-sm leading-relaxed text-gray-500">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="mb-4 text-sm text-gray-500">Başka sorularınız mı var?</p>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 rounded-xl border border-purple-200 px-5 py-2.5 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-50"
            >
              Bize Ulaşın
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </div>
  )
}
