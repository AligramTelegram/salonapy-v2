import type { Metadata } from 'next'
import { Features } from '@/components/vitrin/Features'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kuaför & Salon Yazılımı Özellikleri | Online Randevu, SMS, CRM – Hemensalon',
  description:
    'Hemensalon kuaför ve salon yazılımı özellikleri: online randevu sistemi, SMS & WhatsApp hatırlatmaları, müşteri CRM, personel yönetimi, finansal raporlar. Tümü tek platformda.',
  keywords: 'kuaför yazılımı özellikleri, salon randevu sistemi, SMS hatırlatma, müşteri CRM, personel yönetimi, finansal rapor',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://hemensalon.com/ozellikler' },
  openGraph: {
    title: 'Kuaför & Salon Yazılımı Özellikleri – Hemensalon',
    description: 'Online randevu sistemi, SMS hatırlatmaları, müşteri CRM ve finansal raporlar tek platformda.',
    url: 'https://hemensalon.com/ozellikler',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kuaför & Salon Yazılımı Özellikleri – Hemensalon',
    description: 'Online randevu sistemi, SMS hatırlatmaları, müşteri CRM ve finansal raporlar tek platformda.',
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
            Kuaför &amp; Salon Yazılımında
            <br />
            <span className="text-purple-600">ihtiyacınız olan her şey tek platformda</span>
          </h1>
          <p className="mx-auto mb-6 max-w-xl text-lg leading-relaxed text-gray-500">
            Online randevu sisteminden finansal raporlara, SMS hatırlatmalarından müşteri CRM'ine
            kadar kuaför ve güzellik salonunuzu büyütecek tüm araçlar.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <Link
              href="/kayit"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200/60 transition-colors hover:bg-purple-700"
            >
              3 Gün Ücretsiz Dene
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/fiyatlar"
              className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-6 py-3 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-50"
            >
              Fiyat Planlarını Gör
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <Link
            href="/kayit"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200/60 transition-colors hover:bg-purple-700"
          >
            3 Gün Ücretsiz Dene
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
              Kuaför ve salon yazılımını bugün deneyin
            </h2>
            <p className="mb-8 text-purple-100">
              3 gün ücretsiz deneyin. Kredi kartı gerekmez. İstediğiniz zaman iptal.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/kayit"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-bold text-purple-700 shadow-lg transition-colors hover:bg-purple-50"
              >
                Ücretsiz Başla
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
              >
                Rehberleri Oku
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
