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
  Lock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { hasFeature, type FeatureKey } from '@/lib/plan-features'

const BOTTOM_ITEMS: { href: string; label: string; icon: React.ElementType; feature?: FeatureKey }[] = [
  { href: '', label: 'Ana Sayfa', icon: LayoutDashboard },
  { href: '/randevular', label: 'Randevular', icon: Calendar },
  { href: '/calisanlar', label: 'Çalışanlar', icon: Users },
  { href: '/hizmetler', label: 'Hizmetler', icon: Briefcase },
  { href: '/musteriler', label: 'Müşteriler', icon: UserCircle },
  { href: '/paketler', label: 'Paketler', icon: Package, feature: 'packages' },
  { href: '/finans', label: 'Finans', icon: DollarSign },
  { href: '/raporlar', label: 'Raporlar', icon: BarChart2, feature: 'reports' },
  { href: '/ayarlar', label: 'Ayarlar', icon: Settings },
]

interface BottomNavProps {
  slug: string
  plan: string
}

export function BottomNav({ slug, plan }: BottomNavProps) {
  const pathname = usePathname()
  const base = `/b/${slug}`

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-purple-100/60 shadow-[0_-4px_20px_rgba(124,58,237,0.08)]">
      <div className="overflow-x-auto">
        <div className="flex items-center gap-1 px-2 py-2 safe-area-inset-bottom min-w-max">
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon, feature }) => {
          const fullHref = `${base}${href}`
          const isActive =
            href === ''
              ? pathname === base
              : pathname.startsWith(fullHref)
          const isLocked = !!feature && !hasFeature(plan, feature)

          return (
            <Link
              key={href}
              href={isLocked ? `${base}/upgrade` : fullHref}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 min-w-[56px] transition-all duration-200',
                isLocked
                  ? 'text-gray-300'
                  : isActive
                    ? 'text-purple-600'
                    : 'text-gray-400 hover:text-purple-500'
              )}
            >
              <div
                className={cn(
                  'relative flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200',
                  isActive && !isLocked && 'bg-purple-100'
                )}
              >
                <Icon className="h-5 w-5" />
                {isLocked && (
                  <Lock className="absolute -top-1 -right-1 h-3 w-3 text-gray-300" />
                )}
              </div>
              <span className={cn('text-[10px] font-semibold leading-none', isActive && !isLocked ? 'text-purple-600' : isLocked ? 'text-gray-300' : 'text-gray-400')}>
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
