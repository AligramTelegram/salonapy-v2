'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  UserCircle,
  DollarSign,
  BarChart2,
  Settings,
  LogOut,
  Sparkles,
  Package,
  Lock,
  LifeBuoy,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { hasFeature, type FeatureKey } from '@/lib/plan-features'

const NAV_ITEMS: { href: string; label: string; icon: React.ElementType; feature?: FeatureKey }[] = [
  { href: '', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/randevular', label: 'Randevular', icon: Calendar },
  { href: '/calisanlar', label: 'Çalışanlar', icon: Users },
  { href: '/hizmetler', label: 'Hizmetler', icon: Briefcase },
  { href: '/musteriler', label: 'Müşteriler', icon: UserCircle },
  { href: '/paketler', label: 'Paketler', icon: Package, feature: 'packages' },
  { href: '/finans', label: 'Finans', icon: DollarSign },
  { href: '/raporlar', label: 'Raporlar', icon: BarChart2, feature: 'reports' },
  { href: '/ayarlar', label: 'Ayarlar', icon: Settings },
  { href: '/destek', label: 'Destek', icon: LifeBuoy },
]

const PLAN_LABELS: Record<string, string> = {
  BASLANGIC: 'Başlangıç',
  PROFESYONEL: 'Profesyonel',
  ISLETME: 'İşletme',
}

const SMS_LIMIT_DEFAULTS: Record<string, number> = {
  BASLANGIC: 200,
  PROFESYONEL: 600,
  ISLETME: 1500,
}

interface SidebarProps {
  slug: string
  tenantName: string
  plan: string
  smsUsed: number
  trialExpired?: boolean
}

export function Sidebar({ slug, tenantName, plan, smsUsed, trialExpired = false }: SidebarProps) {
  const pathname = usePathname()
  const base = `/b/${slug}`

  const [smsLimit, setSmsLimit] = useState(SMS_LIMIT_DEFAULTS[plan] ?? 200)

  useEffect(() => {
    fetch('/api/plans')
      .then((r) => r.json())
      .then((data) => {
        const limit = data[plan]?.smsLimit
        if (typeof limit === 'number') setSmsLimit(limit)
      })
      .catch(() => {/* fallback to default */})
  }, [plan])

  const planLabel = PLAN_LABELS[plan] ?? plan
  const smsPercent = Math.min(100, Math.round((smsUsed / smsLimit) * 100))
  const smsWarning = smsPercent >= 80

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 shrink-0">
      {/* Glass panel */}
      <div className="flex flex-col h-full m-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/90 shadow-[0_8px_40px_rgba(124,58,237,0.10)] overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-purple-100/60">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 shadow-md shadow-purple-200">
            <span className="font-display text-base font-bold text-white leading-none">S</span>
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm font-bold text-gray-900 truncate">{tenantName}</p>
            <p className="text-xs text-purple-500 font-medium">İşletme Paneli</p>
          </div>
        </div>

        {/* Trial süresi doldu uyarısı */}
        {trialExpired && (
          <div className="mx-3 mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-red-800">Deneme süreniz sona erdi</p>
            </div>
            <Button
              asChild
              size="sm"
              className="w-full h-7 text-xs bg-red-600 hover:bg-red-700 text-white"
            >
              <Link href={`/b/${slug}/upgrade`}>Paket Yükselt</Link>
            </Button>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon, feature }) => {
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
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isLocked
                    ? 'text-gray-400 hover:bg-gray-50'
                    : isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                )}
              >
                <Icon
                  className={cn(
                    'h-[18px] w-[18px] shrink-0 transition-transform duration-200',
                    isLocked
                      ? 'text-gray-300'
                      : isActive
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-purple-600 group-hover:scale-110'
                  )}
                />
                <span className="flex-1">{label}</span>
                {isLocked && <Lock className="h-3.5 w-3.5 text-gray-300 shrink-0" />}
              </Link>
            )
          })}
        </nav>

        {/* Plan rozeti + Çıkış */}
        <div className="px-3 pb-4 space-y-2 border-t border-purple-100/60 pt-3">
          <Link
            href={`/b/${slug}/ayarlar`}
            className={cn(
              'flex items-start gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-purple-100/60',
              smsWarning ? 'bg-amber-50' : 'bg-purple-50'
            )}
          >
            <Sparkles className={cn('h-4 w-4 shrink-0 mt-0.5', smsWarning ? 'text-amber-500' : 'text-purple-500')} />
            <div className="min-w-0 flex-1">
              <p className={cn('text-xs font-semibold truncate', smsWarning ? 'text-amber-700' : 'text-purple-700')}>
                {planLabel} Plan
              </p>
              <p className={cn('text-[11px]', smsWarning ? 'text-amber-500' : 'text-purple-400')}>
                {smsUsed.toLocaleString('tr-TR')} / {smsLimit.toLocaleString('tr-TR')} SMS
              </p>
              {/* Progress bar */}
              <div className="mt-1.5 h-1 w-full rounded-full bg-purple-200/60 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    smsWarning ? 'bg-amber-400' : 'bg-purple-400'
                  )}
                  style={{ width: `${smsPercent}%` }}
                />
              </div>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Çıkış Yap
          </button>
        </div>
      </div>
    </aside>
  )
}
