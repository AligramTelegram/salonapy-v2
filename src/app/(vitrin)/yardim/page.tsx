import type { Metadata } from 'next'
import Link from 'next/link'
import { Search, BookOpen, MessageCircle, Video, ArrowRight, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Yardım Merkezi - Hemensalon',
  description: 'Hemensalon kullanımıyla ilgili rehberler, sık sorulan sorular ve destek kaynakları.',
  openGraph: {
    title: 'Yardım Merkezi - Hemensalon',
    description: 'Hemensalon yardım ve destek merkezi.',
  },
}

const CATEGORIES = [
  {
    icon: BookOpen,
    title: 'Başlarken',
    desc: 'Hesap oluşturma, kurulum ve ilk adımlar.',
    color: 'bg-blue-50 text-blue-600',
    articles: ['Hesap nasıl oluşturulur?', 'İlk randevunuzu nasıl alırsınız?', 'Personel nasıl eklenir?', 'Hizmetler nasıl tanımlanır?'],
  },
  {
    icon: MessageCircle,
    title: 'SMS & Bildirimler',
    desc: 'SMS hatırlatmaları ve WhatsApp bildirimleri.',
    color: 'bg-green-50 text-green-600',
    articles: ['SMS gönderimi nasıl çalışır?', 'Otomatik hatırlatmalar nasıl kurulur?', 'SMS limitim bitti, ne yapmalıyım?', 'WhatsApp entegrasyonu nasıl aktifleştirilir?'],
  },
  {
    icon: BookOpen,
    title: 'Randevu Yönetimi',
    desc: 'Randevu alma, iptal ve yeniden zamanlama.',
    color: 'bg-purple-50 text-purple-600',
    articles: ['Randevu nasıl oluşturulur?', 'Müşteri randevuyu nasıl alır?', 'Randevu iptali nasıl yapılır?', 'Tekrarlayan randevular nasıl ayarlanır?'],
  },
  {
    icon: Video,
    title: 'Ödeme & Abonelik',
    desc: 'Plan değişikliği, faturalar ve ödeme yöntemleri.',
    color: 'bg-amber-50 text-amber-600',
    articles: ['Plan nasıl değiştirilir?', 'Fatura nasıl indirilir?', 'Abonelik nasıl iptal edilir?', 'Ödeme yöntemi nasıl güncellenir?'],
  },
]

const POPULAR_ARTICLES = [
  'Şifremi unuttum, nasıl sıfırlarım?',
  'Online randevu linkini nasıl paylaşırım?',
  'Müşteri listemi CSV olarak nasıl export ederim?',
  'Birden fazla şube yönetebilir miyim?',
  'Personele nasıl erişim yetkisi veririm?',
  'Tatil günlerini takvime nasıl eklerim?',
]

export default function YardimPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero + Search */}
      <section className="pb-12 pt-12 text-center bg-gradient-to-b from-purple-50/60 to-transparent">
        <div className="container-custom max-w-3xl">
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            Yardım Merkezi
          </span>
          <h1 className="mb-5 font-display text-4xl font-bold text-gray-900 md:text-5xl">
            Size nasıl yardımcı olabiliriz?
          </h1>
          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-purple-200 bg-white px-4 py-3 shadow-sm">
            <Search className="h-5 w-5 text-gray-400 shrink-0" />
            <span className="text-sm text-gray-400">Soru veya konu arayın...</span>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Örnek: "SMS nasıl gönderilir", "randevu iptal", "plan değiştir"
          </p>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="mb-8 font-display text-2xl font-bold text-gray-900">Konular</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <div key={cat.title} className="rounded-2xl border border-purple-100/60 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${cat.color}`}>
                  <cat.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1 font-display text-base font-bold text-gray-900">{cat.title}</h3>
                <p className="mb-4 text-xs text-gray-500">{cat.desc}</p>
                <ul className="space-y-2">
                  {cat.articles.map((a) => (
                    <li key={a} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <ChevronRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-purple-400" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popüler */}
      <section className="py-10 bg-gray-50/60">
        <div className="container-custom max-w-3xl">
          <h2 className="mb-6 font-display text-2xl font-bold text-gray-900">Popüler Sorular</h2>
          <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            {POPULAR_ARTICLES.map((article) => (
              <div key={article} className="flex items-center justify-between px-5 py-4 hover:bg-purple-50/40 transition-colors cursor-pointer">
                <span className="text-sm text-gray-700">{article}</span>
                <ArrowRight className="h-4 w-4 text-purple-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Canlı destek */}
      <section className="py-16">
        <div className="container-custom max-w-3xl">
          <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-violet-700 p-10 text-center text-white shadow-xl shadow-purple-300/30">
            <h2 className="mb-3 font-display text-2xl font-bold">Cevap bulamadınız mı?</h2>
            <p className="mb-6 text-purple-100 text-sm">Destek ekibimiz Pazartesi–Cuma 09:00–18:00 arası yanınızda.</p>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-purple-700 hover:bg-purple-50 transition-colors"
            >
              Destek Talebi Oluştur
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
