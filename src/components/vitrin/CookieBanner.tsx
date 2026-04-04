'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'

const COOKIE_KEY = 'salonapy_cookie_consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY)
    if (!consent) {
      // Biraz bekleyerek göster — sayfa yüklenince hemen çıkmasın
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  function accept() {
    localStorage.setItem(COOKIE_KEY, 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(COOKIE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg md:left-auto md:right-6 md:max-w-sm">
      <div className="glass-card flex flex-col gap-4 p-5 shadow-2xl shadow-purple-200/30">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100">
              <Cookie className="h-4 w-4 text-purple-600" />
            </div>
            <span className="font-display text-sm font-bold text-gray-900">
              Çerez Bildirimi
            </span>
          </div>
          <button
            onClick={decline}
            className="shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Text */}
        <p className="text-xs leading-relaxed text-gray-500">
          Size daha iyi bir deneyim sunmak için çerezler kullanıyoruz.{' '}
          <Link
            href="/cerez-politikasi"
            className="text-purple-600 underline underline-offset-2 hover:text-purple-700"
          >
            Çerez politikamızı
          </Link>{' '}
          okuyabilirsiniz.
        </p>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-purple-600 text-xs hover:bg-purple-700"
            onClick={accept}
          >
            Kabul Et
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-purple-200 text-xs text-gray-600 hover:bg-purple-50"
            onClick={decline}
          >
            Reddet
          </Button>
        </div>
      </div>
    </div>
  )
}
