'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Users, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '', label: 'Bugün', icon: Home },
  { href: '/takvim', label: 'Takvim', icon: Calendar },
  { href: '/musteriler', label: 'Müşteriler', icon: Users },
  { href: '/ayarlar', label: 'Ayarlar', icon: Settings },
]

interface StaffBottomNavProps {
  slug: string
}

export function StaffBottomNav({ slug }: StaffBottomNavProps) {
  const pathname = usePathname()
  const base = `/p/${slug}`

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-100 pb-safe">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const fullHref = `${base}${href}`
          const isActive =
            href === '' ? pathname === base : pathname.startsWith(fullHref)

          return (
            <Link
              key={href}
              href={fullHref}
              className={cn(
                'flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-colors',
                isActive ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 transition-transform',
                  isActive && 'scale-110'
                )}
              />
              <span
                className={cn(
                  'text-[10px] font-medium',
                  isActive ? 'font-semibold' : ''
                )}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
