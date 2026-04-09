import type { Metadata } from 'next'
import { CheckCircle, AlertCircle, Clock, Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sistem Durumu - Salonapy',
  description: 'Salonapy hizmetlerinin anlık durum bilgisi. Kesintiler, bakım pencereleri ve geçmiş olaylar.',
  openGraph: {
    title: 'Sistem Durumu - Salonapy',
    description: 'Salonapy sistem durumu sayfası.',
  },
}

const SERVICES = [
  { name: 'Web Uygulaması (Panel)', status: 'operational', uptime: '99.98%' },
  { name: 'API (v1)', status: 'operational', uptime: '99.95%' },
  { name: 'SMS Gönderimi', status: 'operational', uptime: '99.97%' },
  { name: 'WhatsApp Bildirimleri', status: 'operational', uptime: '99.90%' },
  { name: 'E-posta Servisi', status: 'operational', uptime: '99.99%' },
  { name: 'Ödeme İşlemleri (iyzico)', status: 'operational', uptime: '99.95%' },
  { name: 'Ödeme İşlemleri (Stripe)', status: 'operational', uptime: '99.99%' },
  { name: 'Veritabanı', status: 'operational', uptime: '99.99%' },
  { name: 'CDN & Medya Depolama', status: 'operational', uptime: '99.98%' },
]

const INCIDENTS: { date: string; title: string; status: string; duration: string; detail: string }[] = [
  {
    date: '10 Mar 2026',
    title: 'SMS Gönderiminde Gecikme',
    status: 'Çözüldü',
    duration: '42 dk',
    detail: 'Netgsm altyapısında yaşanan yoğunluk nedeniyle SMS teslimatlarında 5-10 dakikalık gecikme yaşandı. Sorun sağlayıcı tarafından giderildi.',
  },
  {
    date: '22 Şub 2026',
    title: 'Panel Yavaşlığı',
    status: 'Çözüldü',
    duration: '18 dk',
    detail: 'Veritabanı bağlantı havuzu tükenmesi nedeniyle bazı kullanıcılar yavaş yanıt süreleri yaşadı. Kapasite artırımı ile çözüldü.',
  },
]

const STATUS_CONFIG = {
  operational: {
    icon: CheckCircle,
    label: 'Çalışıyor',
    color: 'text-green-600',
    dot: 'bg-green-500',
  },
  degraded: {
    icon: AlertCircle,
    label: 'Yavaş',
    color: 'text-amber-600',
    dot: 'bg-amber-500',
  },
  outage: {
    icon: AlertCircle,
    label: 'Kesinti',
    color: 'text-red-600',
    dot: 'bg-red-500',
  },
}

const allOperational = SERVICES.every((s) => s.status === 'operational')

export default function DurumPage() {
  return (
    <div className="min-h-screen pt-24">
      <section className="pb-6 pt-12 text-center">
        <div className="container-custom max-w-3xl">
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            Sistem Durumu
          </span>
          <h1 className="mb-4 font-display text-4xl font-bold text-gray-900 md:text-5xl">
            Tüm Sistemler
          </h1>
          <div className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold ${
            allOperational ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            <span className={`h-2.5 w-2.5 rounded-full ${allOperational ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
            {allOperational ? 'Tüm sistemler normal çalışıyor' : 'Bazı sistemlerde sorun var'}
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </section>

      {/* Servis listesi */}
      <section className="py-10">
        <div className="container-custom max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3 bg-gray-50/50">
              <Activity className="h-4 w-4 text-purple-500" />
              <h2 className="text-sm font-semibold text-gray-700">Bileşen Durumları</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {SERVICES.map((service) => {
                const cfg = STATUS_CONFIG[service.status as keyof typeof STATUS_CONFIG]
                const Icon = cfg.icon
                return (
                  <div key={service.name} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                      <span className="text-sm text-gray-700">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-400">{service.uptime} uptime</span>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${cfg.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Geçmiş olaylar */}
      <section className="py-10 pb-20">
        <div className="container-custom max-w-3xl">
          <h2 className="mb-6 font-display text-xl font-bold text-gray-900">Geçmiş Olaylar</h2>
          {INCIDENTS.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400 shadow-sm">
              Son 90 günde kayıt edilmiş olay yok.
            </div>
          ) : (
            <div className="space-y-4">
              {INCIDENTS.map((inc) => (
                <div key={inc.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs text-gray-400">{inc.date}</span>
                      <h3 className="font-display text-sm font-bold text-gray-900">{inc.title}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">Süre: {inc.duration}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        <CheckCircle className="h-3 w-3" />
                        {inc.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{inc.detail}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Sorun mu yaşıyorsunuz?{' '}
              <a href="mailto:destek@salonapy.com" className="text-purple-600 hover:underline">
                destek@salonapy.com
              </a>{' '}
              adresinden bildirin.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
