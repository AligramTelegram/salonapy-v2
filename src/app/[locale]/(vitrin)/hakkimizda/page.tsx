import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ArrowRight, Target, Heart, Zap, Users } from 'lucide-react'

const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL ?? '#'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('hakkimizda')
  return {
    title: t('h1') + ' – Hemensalon',
    description: t('subtitle'),
  }
}

const VALUES_ICONS = [Target, Heart, Zap, Users]
const VALUES_TR = [
  { title: 'Odaklı Çözüm', desc: 'Sadece güzellik ve bakım sektörüne odaklanıyoruz.' },
  { title: 'Müşteri Önce', desc: 'Her kararımızı kullanıcı geri bildirimleri ile şekillendiriyoruz.' },
  { title: 'Sürekli Gelişim', desc: 'Haftalık güncellemeler ve yeni özelliklerle platformu sürekli iyileştiriyoruz.' },
  { title: 'Güçlü Topluluk', desc: 'Türkiye genelinde binlerce salon sahibinden oluşan aktif bir kullanıcı topluluğumuz var.' },
]

const MILESTONES = [
  { year: '2023', event: 'Hemensalon fikri doğdu, ilk prototip geliştirildi.' },
  { year: '2024 Q1', event: 'Beta sürümü 50 pilot salon ile test edildi.' },
  { year: '2024 Q3', event: 'Resmi lansman, ilk 500 işletme kaydı.' },
  { year: '2025', event: '5.000+ aktif işletme, SMS + WhatsApp entegrasyonu.' },
  { year: '2026', event: '7.800+ işletme, çoklu dil ve para birimi desteği.' },
]

export default async function HakkimizdaPage() {
  const t = await getTranslations('hakkimizda')

  return (
    <div className="min-h-screen pt-24">
      <section className="pb-16 pt-12 text-center">
        <div className="container-custom max-w-3xl">
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            {t('badge')}
          </span>
          <h1 className="mb-5 font-display text-4xl font-bold text-gray-900 md:text-5xl">
            {t('h1')}
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-500">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16 bg-purple-50/40">
        <div className="container-custom max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="mb-4 font-display text-3xl font-bold text-gray-900">{t('mission_title')}</h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Türkiye&apos;deki 200.000+ güzellik salonu ve berber dükkanının çoğu hâlâ telefon ve kağıt
                defterleriyle randevu yönetiyor. Bu işletmeler her gün saatlerce telefonla uğraşıyor.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Hemensalon olarak bu işletmelere, mobil uyumlu, hızlı kurulumlu ve uygun fiyatlı bir dijital yönetim platformu sunuyoruz.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-violet-700 p-8 text-white">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '7.800+', label: 'Aktif İşletme' },
                  { value: '500K+', label: 'Aylık Randevu' },
                  { value: '%98', label: 'Müşteri Memnuniyeti' },
                  { value: '3 dk', label: 'Ortalama Kurulum' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="font-display text-3xl font-bold text-white">{s.value}</div>
                    <div className="text-sm text-purple-200 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <h2 className="mb-10 text-center font-display text-3xl font-bold text-gray-900">{t('values_title')}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES_TR.map((v, i) => {
              const Icon = VALUES_ICONS[i]
              return (
                <div key={v.title} className="rounded-2xl border border-purple-100/60 bg-white p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                    <Icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="mb-2 font-display text-base font-bold text-gray-900">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50/60">
        <div className="container-custom max-w-2xl">
          <h2 className="mb-10 text-center font-display text-3xl font-bold text-gray-900">{t('journey_title')}</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-purple-200" />
            <div className="space-y-8 pl-12">
              {MILESTONES.map((m) => (
                <div key={m.year} className="relative">
                  <div className="absolute -left-8 top-1 h-4 w-4 rounded-full border-2 border-purple-500 bg-white shadow-sm" />
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">{m.year}</span>
                  <p className="mt-1 text-sm text-gray-600">{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom">
          <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-violet-700 p-12 text-center shadow-xl shadow-purple-300/30">
            <h2 className="mb-3 font-display text-3xl font-bold text-white">{t('cta_title')}</h2>
            <p className="mb-8 text-purple-100">{t('cta_subtitle')}</p>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-bold text-purple-700 shadow-lg transition-colors hover:bg-purple-50"
            >
              {t('cta_download')}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
