'use client'

import Link from 'next/link'
import { Clock, ArrowRight, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface TrialBannerProps {
  daysLeft: number
  slug: string
}

export function TrialBanner({ daysLeft, slug }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const isUrgent = daysLeft <= 3

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-4 py-2.5 text-sm',
        isUrgent
          ? 'bg-red-600 text-white'
          : 'bg-amber-500 text-white'
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Clock className="h-4 w-4 shrink-0" />
        <span className="truncate">
          {daysLeft === 0
            ? 'Deneme süreniz bugün sona eriyor!'
            : `Deneme sürenizden ${daysLeft} gün kaldı.`}
          {' '}Bir plan seçerek devam edin.
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={`/b/${slug}/ayarlar?tab=abonelik`}
          className={cn(
            'inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold transition-colors',
            isUrgent
              ? 'bg-white text-red-600 hover:bg-red-50'
              : 'bg-white text-amber-700 hover:bg-amber-50'
          )}
        >
          Plan Seç
          <ArrowRight className="h-3 w-3" />
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="opacity-80 hover:opacity-100 transition-opacity"
          aria-label="Kapat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
