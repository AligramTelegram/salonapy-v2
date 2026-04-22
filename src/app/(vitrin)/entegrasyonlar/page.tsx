import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Entegrasyonlar | SMS, WhatsApp, iyzico – Hemensalon Salon Yazılımı',
  description: 'Hemensalon salon yazılımı entegrasyonları: SMS servisleri, WhatsApp Business, iyzico ödeme, Google Takvim ve daha fazlası. Tek platform, çoklu entegrasyon.',
  keywords: 'salon yazılımı entegrasyon, WhatsApp randevu, SMS entegrasyon, iyzico ödeme entegrasyon, Google Takvim senkronizasyon',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://hemensalon.com/entegrasyonlar' },
  openGraph: {
    title: 'Entegrasyonlar | SMS, WhatsApp, iyzico – Hemensalon',
    description: 'SMS, WhatsApp, iyzico ve Google Takvim entegrasyonları ile salon yönetimini kolaylaştırın.',
    url: 'https://hemensalon.com/entegrasyonlar',
  },
}

const INTEGRATIONS = [
  {
    category: 'Ödeme',
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    items: [
      { name: 'iyzico', desc: 'Türkiye\'nin lider ödeme altyapısı ile güvenli tahsilat.', status: 'Aktif' },
      { name: 'Stripe', desc: 'Uluslararası kart ödemeleri ve abonelik yönetimi.', status: 'Aktif' },
    ],
  },
  {
    category: 'Bildirim & İletişim',
    color: 'bg-green-50 border-green-100',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    items: [
      { name: 'SMS (Netgsm)', desc: 'Randevu hatırlatmaları için yüksek iletim oranlı SMS servisi.', status: 'Aktif' },
      { name: 'WhatsApp Business', desc: 'Randevu onayı ve hatırlatma mesajları WhatsApp üzerinden.', status: 'Aktif' },
      { name: 'E-posta (Resend)', desc: 'İşlem e-postaları ve kampanya bildirimleri.', status: 'Aktif' },
    ],
  },
  {
    category: 'Takvim & Planlama',
    color: 'bg-amber-50 border-amber-100',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    items: [
      { name: 'Google Takvim', desc: 'Randevuları Google Takvim\'e otomatik ekleyin.', status: 'Yakında' },
      { name: 'Apple Takvim (iCal)', desc: 'iCal feed ile Apple Takvim senkronizasyonu.', status: 'Yakında' },
    ],
  },
  {
    category: 'Muhasebe & Finans',
    color: 'bg-purple-50 border-purple-100',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    items: [
      { name: 'Logo & Mikro', desc: 'Muhasebe yazılımlarına fatura aktarımı.', status: 'Yakında' },
      { name: 'e-Fatura / e-Arşiv', desc: 'Yasal e-fatura kesimi ve arşivleme.', status: 'Yakında' },
    ],
  },
]

export default function EntegrasyonlarPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="pb-12 pt-12 text-center">
        <div className="container-custom max-w-3xl">
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            Entegrasyonlar
          </span>
          <h1 className="mb-5 font-display text-4xl font-bold text-gray-900 md:text-5xl">
            Kullandığınız araçlarla{' '}
            <span className="text-purple-600">sorunsuz çalışır</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-gray-500">
            Hemensalon, ödeme sistemlerinden SMS sağlayıcılarına, muhasebe yazılımlarından
            takvim uygulamalarına kadar geniş bir ekosisteme entegre olur.
          </p>
        </div>
      </section>

      {/* Entegrasyon kartları */}
      <section className="py-12 pb-20">
        <div className="container-custom max-w-4xl space-y-10">
          {INTEGRATIONS.map((group) => (
            <div key={group.category}>
              <h2 className="mb-5 font-display text-xl font-bold text-gray-800">{group.category}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {group.items.map((item) => (
                  <div key={item.name} className={`rounded-2xl border ${group.color} bg-white p-5 shadow-sm`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${group.iconBg}`}>
                        <span className={`text-base font-bold ${group.iconColor}`}>
                          {item.name[0]}
                        </span>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        item.status === 'Aktif'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-base font-bold text-gray-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    {item.status === 'Aktif' && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-green-600">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Kullanıma hazır
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Talep */}
          <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/50 p-8 text-center">
            <h3 className="mb-2 font-display text-lg font-bold text-gray-900">Başka bir entegrasyon mu arıyorsunuz?</h3>
            <p className="mb-5 text-sm text-gray-500">
              Kullandığınız araç listede yoksa bize bildirin, öncelik sırasına ekleyelim.
            </p>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
            >
              Entegrasyon Talep Et
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
