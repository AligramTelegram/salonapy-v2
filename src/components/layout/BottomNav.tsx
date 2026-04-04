'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  UserCircle,
  DollarSign,
  BarChart2,
  Settings,
  Package,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const BOTTOM_ITEMS = [
  { href: '', label: 'Ana Sayfa', icon: LayoutDashboard },
  { href: '/randevular', label: 'Randevular', icon: Calendar },
  { href: '/calisanlar', label: 'Çalışanlar', icon: Users },
  { href: '/hizmetler', label: 'Hizmetler', icon: Briefcase },
  { href: '/musteriler', label: 'Müşteriler', icon: UserCircle },
  { href: '/paketler', label: 'Paketler', icon: Package },
  { href: '/finans', label: 'Finans', icon: DollarSign },
  { href: '/raporlar', label: 'Raporlar', icon: BarChart2 },
  { href: '/ayarlar', label: 'Ayarlar', icon: Settings },
]

interface BottomNavProps {
  slug: string
}

export function BottomNav({ slug }: BottomNavProps) {
  const pathname = usePathname()
  const base = `/b/${slug}`

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-purple-100/60 shadow-[0_-4px_20px_rgba(124,58,237,0.08)]">
      <div className="overflow-x-auto">
        <div className="flex items-center gap-1 px-2 py-2 safe-area-inset-bottom min-w-max">
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => {
          const fullHref = `${base}${href}`
          const isActive =
            href === ''
              ? pathname === base
              : pathname.startsWith(fullHref)

          return (
            <Link
              key={href}
              href={fullHref}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 min-w-[56px] transition-all duration-200',
                isActive ? 'text-purple-600' : 'text-gray-400 hover:text-purple-500'
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200',
                  isActive && 'bg-purple-100'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className={cn('text-[10px] font-semibold leading-none', isActive ? 'text-purple-600' : 'text-gray-400')}>
                {label}
              </span>
            </Link>
          )
        })}
        </div>
      </div>
    </nav>
  )
}
