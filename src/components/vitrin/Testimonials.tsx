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
    <section className="relative overflow-hidden py-24 md:py-32" style={{ background: 'linear-gradient(135deg, #3b0764 0%, #581c87 50%, #4c1d95 100%)' }}>
      {/* Dekoratif daireler */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-purple-300/10 blur-3xl" />
      </div>
      <div className="container-custom relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-purple-200">
            Müşteri Yorumları
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
            7.870+ işletme
            <br />
            <span className="text-purple-300">bizi tercih ediyor</span>
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-purple-200/80">
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
      className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm"
    >
      {/* Quote icon */}
      <Quote className="mb-4 h-7 w-7 text-purple-300/60" />

      {/* Stars */}
      <div className="mb-4 flex gap-0.5">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>

      {/* Text */}
      <p className="mb-6 flex-1 text-sm leading-relaxed text-white/80">"{testimonial.text}"</p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
          {testimonial.avatar}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{testimonial.name}</div>
          <div className="text-xs text-purple-200/70">{testimonial.business}</div>
        </div>
      </div>
    </motion.div>
  )
}
