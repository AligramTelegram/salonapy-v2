'use client'

import { useState, useEffect, useCallback } from 'react'
import { Mail, MailOpen, Trash2, Loader2, RefreshCw, Circle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SUBJECT_LABELS: Record<string, string> = {
  satis: 'Satış & Fiyatlandırma',
  destek: 'Teknik Destek',
  diger: 'Diğer',
}

interface Message {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

interface ApiResponse {
  messages: Message[]
  total: number
  unreadCount: number
  page: number
  pageSize: number
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export default function AdminMesajlarPage() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Message | null>(null)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [actionId, setActionId] = useState<string | null>(null)

  const load = useCallback(async (p = page, unread = unreadOnly) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/messages?page=${p}&unread=${unread}`)
      const json: ApiResponse = await res.json()
      setData(json)
    } catch {
      toast.error('Mesajlar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }, [page, unreadOnly])

  useEffect(() => { load() }, [load])

  async function openMessage(msg: Message) {
    setSelected(msg)
    if (!msg.isRead) await markRead(msg.id, true)
  }

  async function markRead(id: string, isRead: boolean) {
    setActionId(id)
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead }),
      })
      setData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          unreadCount: prev.unreadCount + (isRead ? -1 : 1),
          messages: prev.messages.map((m) => m.id === id ? { ...m, isRead } : m),
        }
      })
      if (selected?.id === id) setSelected((s) => s ? { ...s, isRead } : s)
    } catch {
      toast.error('İşlem başarısız')
    } finally {
      setActionId(null)
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return
    setActionId(id)
    try {
      await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
      toast.success('Mesaj silindi')
      if (selected?.id === id) setSelected(null)
      setData((prev) => {
        if (!prev) return prev
        const msg = prev.messages.find((m) => m.id === id)
        return {
          ...prev,
          total: prev.total - 1,
          unreadCount: msg && !msg.isRead ? prev.unreadCount - 1 : prev.unreadCount,
          messages: prev.messages.filter((m) => m.id !== id),
        }
      })
    } catch {
      toast.error('Silme başarısız')
    } finally {
      setActionId(null)
    }
  }

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">İletişim Mesajları</h1>
          {data && (
            <p className="text-sm text-gray-500 mt-0.5">
              {data.total} mesaj
              {data.unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-purple-600 px-2 py-0.5 text-xs text-white font-medium">
                  {data.unreadCount} okunmamış
                </span>
              )}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setUnreadOnly((v) => {
                const next = !v
                setPage(1)
                load(1, next)
                return next
              })
            }}
            className={cn(
              'border-gray-200 text-gray-600 hover:bg-gray-50',
              unreadOnly && 'border-purple-300 text-purple-600 bg-purple-50'
            )}
          >
            {unreadOnly ? 'Tümünü Göster' : 'Sadece Okunmamış'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => load()}
            className="border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : !data || data.messages.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">
                {unreadOnly ? 'Okunmamış mesaj yok' : 'Henüz mesaj yok'}
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {data.messages.map((msg) => (
                  <li key={msg.id}>
                    <button
                      onClick={() => openMessage(msg)}
                      className={cn(
                        'w-full text-left px-4 py-3.5 hover:bg-gray-50 transition-colors',
                        selected?.id === msg.id && 'bg-purple-50'
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 shrink-0">
                          {msg.isRead ? (
                            <MailOpen className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Mail className="h-4 w-4 text-purple-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className={cn(
                              'truncate text-sm',
                              msg.isRead ? 'text-gray-600 font-normal' : 'text-gray-900 font-semibold'
                            )}>
                              {msg.name}
                            </span>
                            {!msg.isRead && (
                              <Circle className="h-2 w-2 shrink-0 fill-purple-500 text-purple-500" />
                            )}
                          </div>
                          <p className="truncate text-xs text-gray-500 mt-0.5">
                            {SUBJECT_LABELS[msg.subject] ?? msg.subject}
                          </p>
                          <p className="truncate text-xs text-gray-400 mt-0.5">
                            {msg.message}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {formatDate(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => { setPage((p) => p - 1); load(page - 1) }}
                  className="border-gray-200 text-gray-500 hover:bg-gray-50"
                >
                  Önceki
                </Button>
                <span className="text-xs text-gray-400">{page} / {totalPages}</span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => { setPage((p) => p + 1); load(page + 1) }}
                  className="border-gray-200 text-gray-500 hover:bg-gray-50"
                >
                  Sonraki
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                  {SUBJECT_LABELS[selected.subject] ?? selected.subject}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actionId === selected.id}
                    onClick={() => markRead(selected.id, !selected.isRead)}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 text-xs"
                  >
                    {selected.isRead ? (
                      <><Mail className="h-3.5 w-3.5 mr-1" /> Okunmadı İşaretle</>
                    ) : (
                      <><MailOpen className="h-3.5 w-3.5 mr-1" /> Okundu İşaretle</>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actionId === selected.id}
                    onClick={() => deleteMessage(selected.id)}
                    className="border-red-200 text-red-500 hover:bg-red-50 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="mb-5 space-y-1">
                <h2 className="text-lg font-semibold text-gray-900">{selected.name}</h2>
                <a href={`mailto:${selected.email}`} className="text-sm text-purple-600 hover:underline">
                  {selected.email}
                </a>
                {selected.phone && (
                  <p className="text-sm text-gray-500">{selected.phone}</p>
                )}
                <p className="text-xs text-gray-400">{formatDate(selected.createdAt)}</p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                  {selected.message}
                </p>
              </div>

              <div className="mt-4">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${SUBJECT_LABELS[selected.subject] ?? selected.subject}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Email ile Yanıtla
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 py-24 text-center">
              <Mail className="mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-400">Detay görmek için bir mesaj seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
