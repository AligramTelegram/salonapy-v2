'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lightbulb, TrendingUp, Users, Star, Zap, Clock } from 'lucide-react'

const TIPS = [
  {
    icon: TrendingUp,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    title: 'Gelirini Artır',
    body: 'SMS hatırlatması açık işletmeler ortalama %30 daha az iptal yaşıyor. Ayarlardan aktif et!',
  },
  {
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    title: 'Müşteri Sadakati',
    body: 'Düzenli müşterilerine özel indirim teklif et — sadık müşteri, yeni müşteriden 5x daha karlı.',
  },
  {
    icon: Clock,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    title: 'Boş Saatleri Doldur',
    body: 'Bugün boş saatlerin var mı? Müşterilerine son dakika fırsat mesajı gönder.',
  },
  {
    icon: Star,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    title: 'Yorum Topla',
    body: 'Randevu sonrası müşterinden Google yorum istemek, yeni müşteri kazanmanın en kolay yolu.',
  },
  {
    icon: Zap,
    color: 'text-pink-500',
    bg: 'bg-pink-50',
    title: 'Hızlı İpucu',
    body: 'Hizmet sürelerini doğru girdiğinde sistem çakışmayı önler, günde 2-3 randevu daha alabilirsin.',
  },
  {
    icon: TrendingUp,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    title: 'Rapor İncele',
    body: 'En çok hangi hizmetin talep gördüğünü biliyor musun? Finans → Raporlar\'dan bugün kontrol et.',
  },
]

const STORAGE_KEY = 'growthTipLastShown'
const INTERVAL_MS = 60 * 60 * 1000 // 1 saat

export function GrowthTip() {
  const [visible, setVisible] = useState(false)
  const [tip, setTip] = useState(TIPS[0])
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const last = localStorage.getItem(STORAGE_KEY)
    const now = Date.now()

    if (!last || now - parseInt(last) > INTERVAL_MS) {
      const idx = Math.floor(Math.random() * TIPS.length)
      setTip(TIPS[idx])

      const timer = setTimeout(() => {
        setVisible(true)
        localStorage.setItem(STORAGE_KEY, String(now))
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!visible) return

    const duration = 12000
    const step = 100
    const interval = duration / step
    let current = 100

    const timer = setInterval(() => {
      current -= 1
      setProgress(current)
      if (current <= 0) {
        clearInterval(timer)
        setVisible(false)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [visible])

  const Icon = tip.icon

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 80, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 80 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-20 right-4 z-50 w-72 lg:bottom-6 lg:right-6"
        >
          <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/60">
            {/* Progress bar */}
            <div className="absolute top-0 left-0 h-0.5 bg-gray-100 w-full">
              <div
                className="h-full bg-purple-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="p-4 pt-5">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`shrink-0 rounded-xl p-2.5 ${tip.bg}`}>
                  <Icon className={`h-5 w-5 ${tip.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <Lightbulb className="h-3 w-3 text-amber-400" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Büyüme İpucu</span>
                    </div>
                    <button
                      onClick={() => setVisible(false)}
                      className="shrink-0 rounded-lg p-0.5 text-gray-300 hover:text-gray-500 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">{tip.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{tip.body}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
