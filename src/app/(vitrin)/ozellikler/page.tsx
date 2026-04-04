import type { Metadata } from 'next'
import { Features } from '@/components/vitrin/Features'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Özellikler - Salonapy',
  description:
    'Akıllı randevu, SMS hatırlatmaları, müşteri CRM, finansal raporlar ve daha fazlası. Salonapy\'nin tüm özellikleri.',
  openGraph: {
    title: 'Özellikler - Salonapy',
    description: 'Salonapy\'nin işletmenizi büyütecek tüm özellikleri tek platformda.',
  },
}

export default function OzelliklerPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <section className="pb-8 pt-12 text-center">
        <div className="container-custom">
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            Özellikler
          </span>
          <h1 className="mb-4 font-display text-4xl font-bold text-gray-900 md:text-5xl">
            İşletmeniz için ihtiyacınız olan
            <br />
            <span className="text-purple-600">her şey tek platformda</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-gray-500">
            Randevu yönetiminden finansal raporlara, SMS hatırlatmalarından müşteri CRM'ine
            kadar işletmenizi büyütecek tüm araçlar.
          </p>
          <Link
            href="/kayit"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200/60 transition-colors hover:bg-purple-700"
          >
            14 Gün Ücretsiz Dene
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Features grid (reuse component) */}
      <Features />

      {/* CTA */}
      <section className="pb-24">
        <div className="container-custom">
          <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-violet-700 p-12 text-center shadow-xl shadow-purple-300/30">
            <h2 className="mb-3 font-display text-3xl font-bold text-white">
              Hemen başlayın
            </h2>
            <p className="mb-8 text-purple-100">
              14 gün ücretsiz deneyin. Kredi kartı gerekmez.
            </p>
            <Link
              href="/kayit"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-bold text-purple-700 shadow-lg transition-colors hover:bg-purple-50"
            >
              Ücretsiz Başla
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
