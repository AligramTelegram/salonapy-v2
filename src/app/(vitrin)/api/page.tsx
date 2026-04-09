import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Terminal, Lock, Zap, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'API Dokümantasyonu - Salonapy',
  description: 'Salonapy REST API referansı. Randevu, müşteri ve hizmet verilerine programatik erişim sağlayın.',
  openGraph: {
    title: 'API Dokümantasyonu - Salonapy',
    description: 'Salonapy API dokümantasyonu.',
  },
}

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/v1/appointments',
    desc: 'İşletmenize ait randevuları listeler. Tarih aralığı ve personel filtresi desteklenir.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    method: 'POST',
    path: '/v1/appointments',
    desc: 'Yeni bir randevu oluşturur. Müşteri, hizmet, personel ve zaman dilimi zorunludur.',
    color: 'bg-green-100 text-green-700',
  },
  {
    method: 'PATCH',
    path: '/v1/appointments/:id',
    desc: 'Mevcut bir randevunun durumunu veya zamanını günceller.',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    method: 'GET',
    path: '/v1/customers',
    desc: 'Müşteri listesini sayfalı olarak döner. İsim veya telefon ile arama desteklenir.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    method: 'POST',
    path: '/v1/customers',
    desc: 'Yeni bir müşteri kaydı oluşturur.',
    color: 'bg-green-100 text-green-700',
  },
  {
    method: 'GET',
    path: '/v1/services',
    desc: 'İşletmenizin sunduğu hizmetleri ve fiyatlarını listeler.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    method: 'GET',
    path: '/v1/staff',
    desc: 'Personel listesini ve çalışma saatlerini döner.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    method: 'POST',
    path: '/v1/sms/send',
    desc: 'Belirtilen telefon numarasına SMS gönderir. SMS kredinizden düşer.',
    color: 'bg-green-100 text-green-700',
  },
]

const FEATURES = [
  { icon: Lock, title: 'API Key Kimlik Doğrulama', desc: 'Bearer token ile güvenli erişim.' },
  { icon: Zap, title: 'Rate Limiting', desc: 'Dakikada 100, saatte 2.000 istek.' },
  { icon: Terminal, title: 'JSON Yanıtlar', desc: 'Tüm endpoint\'ler standart JSON döner.' },
  { icon: BookOpen, title: 'Webhook Desteği', desc: 'Randevu olaylarını anlık bildirim ile alın.' },
]

export default function ApiPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="pb-12 pt-12 text-center">
        <div className="container-custom max-w-3xl">
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            API Dokümantasyonu
          </span>
          <h1 className="mb-5 font-display text-4xl font-bold text-gray-900 md:text-5xl">
            Salonapy'yi kendi{' '}
            <span className="text-purple-600">uygulamanıza entegre edin</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-gray-500">
            REST API ile randevu, müşteri ve hizmet verilerinize programatik erişin.
            Webhook desteğiyle anlık olayları takip edin.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200/60 hover:bg-purple-700 transition-colors"
            >
              API Erişimi İste
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Base URL */}
      <section className="py-8">
        <div className="container-custom max-w-4xl">
          <div className="rounded-2xl bg-gray-900 p-5">
            <p className="mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Base URL</p>
            <code className="text-sm text-green-400 font-mono">https://salonapy.com/api/v1</code>
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="py-8">
        <div className="container-custom max-w-4xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-purple-100/60 bg-white p-4 shadow-sm">
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100">
                  <f.icon className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">{f.title}</h3>
                <p className="mt-0.5 text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Endpoint listesi */}
      <section className="py-10 pb-20">
        <div className="container-custom max-w-4xl">
          <h2 className="mb-6 font-display text-2xl font-bold text-gray-900">Endpoint Listesi</h2>
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="divide-y divide-gray-50">
              {ENDPOINTS.map((ep) => (
                <div key={`${ep.method}-${ep.path}`} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">
                  <span className={`shrink-0 rounded-lg px-2.5 py-0.5 text-xs font-bold font-mono ${ep.color}`}>
                    {ep.method}
                  </span>
                  <code className="shrink-0 text-sm font-mono text-gray-700">{ep.path}</code>
                  <span className="text-sm text-gray-500">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <p className="text-sm text-amber-800">
              <strong>Not:</strong> API şu anda erken erişim aşamasındadır. Erişim için{' '}
              <Link href="/iletisim" className="text-amber-700 underline hover:text-amber-900">
                destek ekibiyle iletişime geçin
              </Link>
              . Tam dokümantasyon yakında yayınlanacaktır.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
