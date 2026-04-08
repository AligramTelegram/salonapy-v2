'use client'

import { useState, useEffect } from 'react'
import { X, Info, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Announcement {
  id: string
  title: string
  content: string
  type: 'INFO' | 'WARNING' | 'SUCCESS'
}

const TYPE_CONFIG = {
  INFO: {
    icon: Info,
    headerBg: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800',
    btnClass: 'bg-blue-600 hover:bg-blue-700',
  },
  WARNING: {
    icon: AlertTriangle,
    headerBg: 'bg-amber-50 border-amber-100',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    titleColor: 'text-amber-800',
    btnClass: 'bg-amber-600 hover:bg-amber-700',
  },
  SUCCESS: {
    icon: CheckCircle2,
    headerBg: 'bg-green-50 border-green-100',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    titleColor: 'text-green-800',
    btnClass: 'bg-green-600 hover:bg-green-700',
  },
}

export function AnnouncementPopup() {
  const [queue, setQueue] = useState<Announcement[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/announcements')
        if (!res.ok) return
        const data: Announcement[] = await res.json()
        if (data.length > 0) {
          setQueue(data)
          setOpen(true)
        }
      } catch {
        // sessizce geç
      }
    }
    load()
  }, [])

  const current = queue[0]

  async function dismiss() {
    if (!current) return
    // sunucuda dismiss kaydı oluştur (arka planda, hata olursa görme)
    fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ announcementId: current.id }),
    }).catch(() => {})

    const rest = queue.slice(1)
    if (rest.length > 0) {
      setQueue(rest)
    } else {
      setOpen(false)
      setQueue([])
    }
  }

  if (!current) return null

  const cfg = TYPE_CONFIG[current.type]
  const TypeIcon = cfg.icon

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) dismiss() }}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0">
        {/* Header */}
        <div className={cn('flex items-start gap-3 p-5 border-b', cfg.headerBg)}>
          <div className={cn('p-2 rounded-xl shrink-0', cfg.iconBg)}>
            <TypeIcon className={cn('h-5 w-5', cfg.iconColor)} />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <p className={cn('font-semibold text-base leading-tight', cfg.titleColor)}>
              {current.title}
            </p>
            {queue.length > 1 && (
              <p className="text-xs text-gray-400 mt-0.5">{queue.length} duyurudan 1.</p>
            )}
          </div>
          <button
            onClick={dismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 mt-0.5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {current.content}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-5 pb-5">
          <Button onClick={dismiss} className={cn('text-white', cfg.btnClass)}>
            {queue.length > 1 ? 'Sonraki →' : 'Tamam, Anladım'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
