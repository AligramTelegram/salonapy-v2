'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BarChart3, Building2, CreditCard, MessageSquare, Activity, FileText, Settings, Inbox, Bell, LifeBuoy, Receipt } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3, exact: true },
  { href: '/admin/isletmeler', label: 'İşletmeler', icon: Building2 },
  { href: '/admin/abonelikler', label: 'Abonelikler', icon: CreditCard },
  { href: '/admin/sms', label: 'SMS İzleme', icon: MessageSquare },
  { href: '/admin/sistem', label: 'Sistem', icon: Activity },
  { href: '/admin/mesajlar', label: 'İletişim Mesajları', icon: Inbox, badge: 'messages' },
  { href: '/admin/destek', label: 'Destek Talepleri', icon: LifeBuoy, badge: 'support' },
  { href: '/admin/duyurular', label: 'Duyurular', icon: Bell },
  { href: '/admin/faturalar', label: 'Faturalar', icon: Receipt },
  { href: '/admin/blog', label: 'Blog Yönetimi', icon: FileText },
  { href: '/admin/ayarlar', label: 'Site Ayarları', icon: Settings },
]

export function AdminNav() {
  const pathname = usePathname()
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [openTickets, setOpenTickets] = useState(0)

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [msgRes, ticketRes] = await Promise.all([
          fetch('/api/admin/messages?page=1'),
          fetch('/api/admin/support?status=all&page=1'),
        ])
        if (msgRes.ok) {
          const json = await msgRes.json()
          setUnreadMessages(json.unreadCount ?? 0)
        }
        if (ticketRes.ok) {
          const json = await ticketRes.json()
          setOpenTickets(json.openCount ?? 0)
        }
      } catch { /* ignore */ }
    }
    fetchCounts()
    const interval = setInterval(fetchCounts, 60_000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (pathname.startsWith('/admin/mesajlar')) setUnreadMessages(0)
    if (pathname.startsWith('/admin/destek')) setOpenTickets(0)
  }, [pathname])

  return (
    <nav className="flex-1 p-3 space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
        const count = item.badge === 'messages' ? unreadMessages
          : item.badge === 'support' ? openTickets
          : 0
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
              active
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {count > 0 && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-600 px-1.5 text-xs font-bold text-white">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
