'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Ayşe Yılmaz',
    business: 'Kuaför Ayşe - İstanbul',
    avatar: 'AY',
    avatarBg: 'bg-purple-100',
    avatarColor: 'text-purple-700',
    rating: 5,
    text: 'Hemensalon ile randevu yönetimimiz tamamen değişti. SMS hatırlatmaları sayesinde müşterilerim artık randevularını unutmuyor. Aylık 30% daha az iptal yaşıyoruz.',
  },
  {
    name: 'Mehmet Karaoğlu',
    business: 'Berber Mehmet - Ankara',
    avatar: 'MK',
    avatarBg: 'bg-blue-100',
    avatarColor: 'text-blue-700',
    rating: 5,
    text: 'Kurulumu 5 dakikada tamamladım, teknik bilgim olmadan. Personelimi ekledim, hizmetlerimi tanımladım ve hemen kullanmaya başladım. Müşteri memnuniyetim gözle görülür arttı.',
  },
  {
    name: 'Zeynep Demir',
    business: 'Beauty Studio Zeynep - İzmir',
    avatar: 'ZD',
    avatarBg: 'bg-pink-100',
    avatarColor: 'text-pink-700',
    rating: 5,
    text: 'Finansal raporlar özelliği harika. Hangi hizmetimin daha karlı olduğunu, personelimin performansını artık net görüyorum. Fiyatımı buna göre güncelledim.',
  },
]

export function Testimonials() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            Müşteri Yorumları
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold text-gray-900 md:text-4xl">
            7.870+ işletme
            <br />
            <span className="text-purple-600">bizi tercih ediyor</span>
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-gray-500">
            Türkiye'nin dört bir yanından işletme sahipleri Hemensalon ile işlerini büyütüyor.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <TestimonialCard testimonial={t} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: (typeof TESTIMONIALS)[number] }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="glass-card flex h-full flex-col p-6"
    >
      {/* Quote icon */}
      <Quote className="mb-4 h-7 w-7 text-purple-200" />

      {/* Stars */}
      <div className="mb-4 flex gap-0.5">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>

      {/* Text */}
      <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-600">"{testimonial.text}"</p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${testimonial.avatarBg} ${testimonial.avatarColor}`}
        >
          {testimonial.avatar}
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">{testimonial.name}</div>
          <div className="text-xs text-gray-500">{testimonial.business}</div>
        </div>
      </div>
    </motion.div>
  )
}
