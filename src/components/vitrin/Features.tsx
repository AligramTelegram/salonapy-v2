'use client'

import { motion, type Variants } from 'framer-motion'
import {
  Calendar,
  Bell,
  TrendingUp,
  Shield,
  Zap,
  Bot,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Calendar,
    title: 'Online Randevu Sistemi',
    description:
      'Müşterileriniz 7/24 online randevu alabilir. Çakışma önleme, personel takvimi ve boşluk yönetimi tek ekranda — telefon trafiği sıfıra iner.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    glow: 'rgba(124,58,237,0.12)',
    gradient: 'from-purple-200/60 via-white to-purple-100/40',
    badge: null,
  },
  {
    icon: Bot,
    title: 'AI Randevu Asistanı',
    description:
      'WhatsApp ve Instagram mesajlarına yapay zeka otomatik yanıt verir, müsait saatleri gösterir ve randevu oluşturur. Siz uyurken sistem çalışır.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    glow: 'rgba(139,92,246,0.12)',
    gradient: 'from-violet-200/60 via-white to-violet-100/40',
    badge: 'Yakında',
  },
  {
    icon: Bell,
    title: 'SMS & WhatsApp Hatırlatma',
    badge: null,
    description:
      'Randevu onayı, 24 saat ve 2 saat öncesi hatırlatmalar otomatik iletilir. İptal oranı ortalama %30 düşer, gelir artışı ilk ayda hissedilir.',
    color: 'text-green-600',
    bg: 'bg-green-50',
    glow: 'rgba(34,197,94,0.12)',
    gradient: 'from-green-200/60 via-white to-green-100/40',
  },
  {
    icon: TrendingUp,
    title: 'Finansal Raporlar & Analiz',
    badge: null,
    description:
      'Günlük, haftalık ve aylık gelir/gider takibi. Personel bazında performans, en çok tercih edilen hizmetler — veriye dayalı karar alın.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    glow: 'rgba(245,158,11,0.12)',
    gradient: 'from-amber-200/60 via-white to-amber-100/40',
  },
  {
    icon: Shield,
    title: 'KVKK Uyumlu & Güvenli',
    badge: null,
    description:
      'Müşteri verileri Türkiye\'nin KVKK yasasına ve GDPR\'a uygun, şifreli altyapıda saklanır. Güvenlik sertifikası dahil, ek ücret yok.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    glow: 'rgba(244,63,94,0.12)',
    gradient: 'from-rose-200/60 via-white to-rose-100/40',
  },
  {
    icon: Zap,
    title: '5 Dakikada Hazır',
    badge: null,
    description:
      'Kuaför veya salon yazılımına geçiş bu kadar kolay: işletmenizi tanımlayın, hizmetleri ekleyin, linki paylaşın. Teknik bilgi gerekmez.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    glow: 'rgba(99,102,241,0.12)',
    gradient: 'from-indigo-200/60 via-white to-indigo-100/40',
  },
]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function Features() {
  return (
    <section id="ozellikler" className="py-24 md:py-32">
      <div className="container-custom">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            Özellikler
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold text-gray-900 md:text-4xl">
            Kuaför ve Salon Yazılımında
            <br />
            <span className="text-purple-600">ihtiyacınız olan her şey tek platformda</span>
          </h2>
          <p className="mx-auto max-w-xl text-base text-gray-500 leading-relaxed">
            Online randevu sisteminden finansal raporlara, SMS hatırlatmalarından müşteri CRM'ine
            kadar — kuaför, berber ve güzellik salonunuzu büyütecek tüm araçlar.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <FeatureCard feature={feature} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function FeatureCard({
  feature,
}: {
  feature: (typeof FEATURES)[number]
}) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: `0 20px 60px ${feature.glow}` }}
      transition={{ duration: 0.25 }}
      className={`relative rounded-2xl bg-gradient-to-br p-px ${feature.gradient} cursor-default`}
    >
      {/* Inner white card */}
      <div className="h-full rounded-[15px] bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className={`inline-flex rounded-xl p-3 ${feature.bg}`}>
            <feature.icon className={`h-6 w-6 ${feature.color}`} />
          </div>
          {feature.badge && (
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
              {feature.badge}
            </span>
          )}
        </div>
        <h3 className="mb-2 font-display text-base font-bold text-gray-900">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-gray-500">{feature.description}</p>
      </div>
    </motion.div>
  )
}
