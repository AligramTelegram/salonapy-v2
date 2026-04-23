'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, Search, Settings, LogOut, User, Calendar, Loader2, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { LogoIcon } from '@/components/ui/LogoIcon'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface DashboardHeaderProps {
  slug: string
  tenantName: string
  tenantLogo?: string | null
  userName: string
  userEmail: string
  userAvatarUrl?: string | null
  className?: string
}

// --- Bildirim tipleri ---
interface NotificationItem {
  id: string
  customerName: string
  serviceName: string
  status: string
  statusLabel: string
  startTime: string
  date: string
  timeAgo: string
  isNew: boolean
}

const STATUS_COLORS: Record<string, string> = {
  BEKLIYOR: 'bg-yellow-400',
  ONAYLANDI: 'bg-blue-400',
  TAMAMLANDI: 'bg-green-400',
  IPTAL: 'bg-gray-300',
  GELMEDI: 'bg-red-400',
}

// --- Arama tipleri ---
interface SearchResults {
  customers: { id: string; name: string; phone: string }[]
  appointments: {
    id: string
    customerName: string
    serviceName: string
    date: string
    startTime: string
    status: string
  }[]
  services: { id: string; name: string; duration: number; price: number }[]
}

export function DashboardHeader({
  slug,
  tenantName,
  tenantLogo,
  userName,
  userEmail,
  userAvatarUrl,
  className,
}: DashboardHeaderProps) {
  const router = useRouter()
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  // ── Bildirimler ─────────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [notifLoading, setNotifLoading] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [hasNew, setHasNew] = useState(false)

  async function fetchNotifications() {
    if (notifications.length > 0) return // cache for session
    setNotifLoading(true)
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data: NotificationItem[] = await res.json()
        setNotifications(data)
        setHasNew(data.some((n) => n.isNew))
      }
    } finally {
      setNotifLoading(false)
    }
  }

  function handleNotifOpen(open: boolean) {
    setNotifOpen(open)
    if (open) {
      fetchNotifications()
      setHasNew(false)
    }
  }

  // ── Arama ────────────────────────────────────────────────────────────────────
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchOpen])

  useEffect(() => {
    if (!searchOpen) {
      setQuery('')
      setSearchResults(null)
    }
  }, [searchOpen])

  function handleQueryChange(val: string) {
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.length < 2) {
      setSearchResults(null)
      return
    }
    setSearchLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(val)}`)
        if (res.ok) setSearchResults(await res.json())
      } finally {
        setSearchLoading(false)
      }
    }, 300)
  }

  const hasResults =
    searchResults &&
    (searchResults.customers.length > 0 ||
      searchResults.appointments.length > 0 ||
      searchResults.services.length > 0)

  // ── Çıkış ────────────────────────────────────────────────────────────────────
  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-30 flex h-16 items-center justify-between gap-4 bg-white border-b border-purple-100/60 px-4 lg:px-6',
          className
        )}
      >
        {/* Sol */}
        <div className="flex items-center gap-3">
          <div className="flex lg:hidden items-center gap-2">
            {tenantLogo ? (
              <Image
                src={tenantLogo}
                alt={tenantName}
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg object-cover"
              />
            ) : (
              <LogoIcon size={32} />
            )}
            <span className="font-display text-base font-bold text-gray-900 truncate max-w-[140px]">
              {tenantName}
            </span>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-gray-900">{tenantName}</p>
            <p className="text-xs text-gray-400">İşletme Paneli</p>
          </div>
        </div>

        {/* Sağ */}
        <div className="flex items-center gap-1.5">
          {/* Arama butonu */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="h-9 w-9 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-50"
            aria-label="Ara"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Bildirim dropdown */}
          <DropdownMenu open={notifOpen} onOpenChange={handleNotifOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                aria-label="Bildirimler"
              >
                <Bell className="h-4 w-4" />
                {hasNew && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-purple-500 ring-2 ring-white" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-900">Son Aktiviteler</span>
                <Link
                  href={`/b/${slug}/randevular`}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                  onClick={() => setNotifOpen(false)}
                >
                  Tümünü gör
                </Link>
              </div>

              {notifLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Henüz aktivite yok</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={`/b/${slug}/randevular`}
                      onClick={() => setNotifOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-purple-50/60 transition-colors"
                    >
                      <span
                        className={cn(
                          'mt-1.5 h-2 w-2 rounded-full shrink-0',
                          STATUS_COLORS[n.status] ?? 'bg-gray-300'
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {n.customerName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{n.serviceName} · {n.startTime}</p>
                        <p className="text-xs text-gray-300 mt-0.5">{n.timeAgo}</p>
                      </div>
                      <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        {n.statusLabel}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 ring-2 ring-purple-100 cursor-pointer hover:ring-purple-300 transition-all">
                {userAvatarUrl && <AvatarImage src={userAvatarUrl} alt={userName} />}
                <AvatarFallback className="bg-purple-600 text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl">
              <DropdownMenuLabel className="pb-2">
                <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-400 font-normal truncate">{userEmail}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/b/${slug}/ayarlar`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <User className="h-4 w-4 text-gray-400" />
                  Profil &amp; Ayarlar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/b/${slug}/randevular`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="h-4 w-4 text-gray-400" />
                  Randevular
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Arama modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false) }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Müşteri, randevu veya hizmet ara..."
                className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
              />
              {searchLoading && <Loader2 className="h-4 w-4 animate-spin text-purple-400 shrink-0" />}
              <button
                onClick={() => setSearchOpen(false)}
                className="text-gray-400 hover:text-gray-600 shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sonuçlar */}
            <div className="max-h-[60vh] overflow-y-auto">
              {!query || query.length < 2 ? (
                <div className="py-10 text-center text-sm text-gray-400">
                  En az 2 karakter girin
                </div>
              ) : !hasResults && !searchLoading ? (
                <div className="py-10 text-center text-sm text-gray-400">
                  &ldquo;{query}&rdquo; için sonuç bulunamadı
                </div>
              ) : (
                <>
                  {/* Müşteriler */}
                  {searchResults && searchResults.customers.length > 0 && (
                    <div>
                      <p className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">
                        Müşteriler
                      </p>
                      {searchResults.customers.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            router.push(`/b/${slug}/musteriler`)
                            setSearchOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors text-left"
                        >
                          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-purple-600">
                              {c.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{c.name}</p>
                            <p className="text-xs text-gray-400">{c.phone}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Randevular */}
                  {searchResults && searchResults.appointments.length > 0 && (
                    <div>
                      <p className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">
                        Randevular
                      </p>
                      {searchResults.appointments.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => {
                            router.push(`/b/${slug}/randevular`)
                            setSearchOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors text-left"
                        >
                          <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">{a.customerName}</p>
                            <p className="text-xs text-gray-400">
                              {a.serviceName} ·{' '}
                              {format(new Date(a.date), 'd MMM', { locale: tr })} {a.startTime}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Hizmetler */}
                  {searchResults && searchResults.services.length > 0 && (
                    <div>
                      <p className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">
                        Hizmetler
                      </p>
                      {searchResults.services.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            router.push(`/b/${slug}/hizmetler`)
                            setSearchOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors text-left"
                        >
                          <Settings className="h-4 w-4 text-gray-400 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">{s.name}</p>
                            <p className="text-xs text-gray-400">
                              {s.duration} dk · ₺{s.price.toLocaleString('tr-TR')}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50">
              <p className="text-[11px] text-gray-400">
                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px] font-mono">Esc</kbd>{' '}
                kapatır
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
