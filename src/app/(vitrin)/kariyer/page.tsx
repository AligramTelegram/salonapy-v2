import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Clock, ArrowRight, Briefcase } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kariyer - Salonapy',
  description: 'Salonapy ekibine katılın. Türkiye\'nin büyüyen SaaS girişiminde kariyer fırsatları.',
  openGraph: {
    title: 'Kariyer - Salonapy',
    description: 'Salonapy ekibine katılın.',
  },
}

const OPEN_ROLES = [
  {
    title: 'Full-Stack Yazılım Geliştirici',
    dept: 'Mühendislik',
    location: 'İstanbul / Remote',
    type: 'Tam Zamanlı',
    desc: 'Next.js, TypeScript ve Prisma ile ürün geliştirme süreçlerine katkıda bulunacak bir geliştirici arıyoruz.',
  },
  {
    title: 'Müşteri Başarı Uzmanı',
    dept: 'Satış & Destek',
    location: 'İstanbul',
    type: 'Tam Zamanlı',
    desc: 'Yeni müşterilerin Salonapy\'ye entegrasyonunu kolaylaştıracak ve onboarding süreçlerini yürütecek bir uzman arıyoruz.',
  },
  {
    title: 'Dijital Pazarlama Uzmanı',
    dept: 'Pazarlama',
    location: 'İstanbul / Remote',
    type: 'Tam Zamanlı',
    desc: 'SEO, içerik pazarlaması ve sosyal medya stratejilerini yönetecek deneyimli bir pazarlama uzmanı arıyoruz.',
  },
]

const PERKS = [
  { emoji: '🏠', label: 'Remote veya hibrit çalışma' },
  { emoji: '📚', label: 'Eğitim & konferans bütçesi' },
  { emoji: '💻', label: 'MacBook Pro veya eşdeğeri' },
  { emoji: '🏖️', label: '20 gün yıllık izin' },
  { emoji: '🩺', label: 'Özel sağlık sigortası' },
  { emoji: '📈', label: 'Şirket hissesi (stock option)' },
]

export default function KariyerPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="pb-12 pt-12 text-center">
        <div className="container-custom max-w-3xl">
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            Kariyer
          </span>
          <h1 className="mb-5 font-display text-4xl font-bold text-gray-900 md:text-5xl">
            Geleceği birlikte{' '}
            <span className="text-purple-600">inşa edelim</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-gray-500">
            Türkiye'nin güzellik sektörünü dijitalleştiren ekibimize katılın.
            Hızlı büyüyen bir SaaS girişiminde gerçek etki yaratın.
          </p>
        </div>
      </section>

      {/* Yan haklar */}
      <section className="py-12 bg-purple-50/40">
        <div className="container-custom max-w-4xl">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-gray-900">Neden Salonapy?</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PERKS.map((p) => (
              <div key={p.label} className="flex items-center gap-3 rounded-xl bg-white border border-purple-100/60 px-4 py-3 shadow-sm">
                <span className="text-2xl">{p.emoji}</span>
                <span className="text-sm text-gray-700 font-medium">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Açık pozisyonlar */}
      <section className="py-16">
        <div className="container-custom max-w-3xl">
          <h2 className="mb-8 font-display text-2xl font-bold text-gray-900">Açık Pozisyonlar</h2>
          <div className="space-y-4">
            {OPEN_ROLES.map((role) => (
              <div key={role.title} className="rounded-2xl border border-purple-100/60 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-purple-500" />
                      <span className="text-xs text-purple-600 font-medium">{role.dept}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-gray-900">{role.title}</h3>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">{role.desc}</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="h-3.5 w-3.5" /> {role.location}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3.5 w-3.5" /> {role.type}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`mailto:kariyer@salonapy.com?subject=${encodeURIComponent(role.title + ' Başvurusu')}`}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
                  >
                    Başvur
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Spontane */}
          <div className="mt-8 rounded-2xl border border-dashed border-purple-200 bg-purple-50/50 p-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Uygun pozisyon bulamadınız mı? Spontane başvurunuzu bekliyoruz.
            </p>
            <a
              href="mailto:kariyer@salonapy.com?subject=Spontane%20Başvuru"
              className="inline-flex items-center gap-2 rounded-xl border border-purple-200 px-5 py-2.5 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100"
            >
              kariyer@salonapy.com
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
