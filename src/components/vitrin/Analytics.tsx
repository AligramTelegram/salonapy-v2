'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Smile, Star } from 'lucide-react'

const STATS = [
  {
    icon: Users,
    value: '7.870+',
    label: 'Aktif İşletme',
    description: 'Güvenilen platform',
    gradient: 'from-purple-600 to-purple-500',
    lightGradient: 'from-purple-50 to-purple-100/50',
    color: 'text-purple-600',
    iconBg: 'bg-purple-100',
  },
  {
    icon: TrendingUp,
    value: '503.341+',
    label: 'Aylık Randevu',
    description: 'İşlem hacmi',
    gradient: 'from-blue-600 to-blue-500',
    lightGradient: 'from-blue-50 to-blue-100/50',
    color: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
  {
    icon: Smile,
    value: '%98',
    label: 'Memnuniyet',
    description: 'Müşteri tatminiyeti',
    gradient: 'from-emerald-600 to-emerald-500',
    lightGradient: 'from-emerald-50 to-emerald-100/50',
    color: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
  },
  {
    icon: Star,
    value: '4.9/5',
    label: 'Ortalama Puan',
    description: 'İşletme puanı',
    gradient: 'from-amber-600 to-amber-500',
    lightGradient: 'from-amber-50 to-amber-100/50',
    color: 'text-amber-600',
    iconBg: 'bg-amber-100',
  },
]

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay },
  }
}

export function Analytics() {
  return (
    <section className="relative overflow-hidden py-12 md:py-16 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-300/20 via-transparent to-blue-300/20 blur-3xl" />
      </div>

      <div className="container-custom">
        {/* Başlık */}
        <motion.div {...fadeUp(0)} className="mb-8 text-center">
          <h2 className="mb-2 font-display text-2xl font-extrabold text-gray-900 md:text-3xl">
            Türkiye&apos;nin Lider Online Randevu Sistemi
          </h2>
          <p className="mx-auto max-w-2xl text-sm md:text-base text-gray-600">
            Binlerce kuaför, berber ve güzellik salonu tarafından tercih edilen platform
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={i}
                {...fadeUp(0.1 + i * 0.08)}
                whileHover={{ y: -3 }}
                className="group relative h-full"
              >
                {/* Card Background Gradient */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.lightGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                {/* Card Border */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Card Content */}
                <div className="relative rounded-xl border border-white/30 bg-white/40 px-4 py-5 md:px-5 md:py-6 backdrop-blur-sm transition-all duration-300 group-hover:border-white/60 group-hover:bg-white/50">
                  {/* Top Area - Icon */}
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`rounded-lg ${stat.iconBg} p-2.5 transition-all duration-300 group-hover:scale-110`}
                    >
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${stat.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                  </div>

                  {/* Value */}
                  <div className="mb-1">
                    <p
                      className={`text-2xl font-display font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </p>
                  </div>

                  {/* Label */}
                  <h3 className="mb-0.5 text-sm font-semibold text-gray-900">{stat.label}</h3>

                  {/* Description */}
                  <p className="text-xs text-gray-500">{stat.description}</p>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent blur-xl" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          {...fadeUp(0.5)}
          className="mt-6 text-center"
        >
          <p className="text-xs md:text-sm text-gray-600">
            Siz de{' '}
            <span className="font-semibold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
              7.870+
            </span>
            {' '}işletmeden biri olun
          </p>
        </motion.div>
      </div>
    </section>
  )
}
