'use client'

import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Loader2, MessageCircle, ChevronDown, ChevronUp, Send, Trash2, RefreshCw, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Ticket {
  id: string
  subject: string
  message: string
  status: string
  priority: string
  adminReply: string | null
  repliedAt: string | null
  createdAt: string
  tenant: { id: string; name: string; slug: string; plan: string; email: string | null }
}

const STATUS_OPTIONS = [
  { key: 'all',         label: 'Tümü' },
  { key: 'OPEN',        label: 'Bekleyen' },
  { key: 'IN_PROGRESS', label: 'İşlemde' },
  { key: 'CLOSED',      label: 'Kapalı' },
]

const STATUS_STYLE: Record<string, string> = {
  OPEN:        'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  CLOSED:      'bg-green-100 text-green-700',
}

const STATUS_LABEL: Record<string, string> = {
  OPEN:        'Bekliyor',
  IN_PROGRESS: 'İşlemde',
  CLOSED:      'Kapalı',
}

const PRIORITY_STYLE: Record<string, string> = {
  LOW:    'bg-gray-100 text-gray-600',
  NORMAL: 'bg-purple-100 text-purple-700',
  HIGH:   'bg-red-100 text-red-700',
}

const PRIORITY_LABEL: Record<string, string> = {
  LOW: 'Düşük', NORMAL: 'Normal', HIGH: 'Yüksek',
}

const PLAN_LABEL: Record<string, string> = {
  BASLANGIC: 'Başlangıç', PROFESYONEL: 'Profesyonel', ISLETME: 'İşletme',
}

export default function AdminDestekPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [openCount, setOpenCount] = useState(0)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)

  const fetchTickets = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/support?status=${statusFilter}&page=1`)
      if (!res.ok) return
      const data = await res.json()
      setTickets(data.tickets)
      setOpenCount(data.openCount)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => { fetchTickets() }, [fetchTickets])

  async function updateTicket(id: string, payload: Record<string, unknown>) {
    setSaving(id)
    try {
      const res = await fetch(`/api/admin/support/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      toast.success('Kaydedildi')
      fetchTickets()
    } catch {
      toast.error('Kaydedilemedi')
    } finally {
      setSaving(null)
    }
  }

  async function deleteTicket(id: string) {
    if (!confirm('Bu talebi silmek istiyor musunuz?')) return
    try {
      await fetch(`/api/admin/support/${id}`, { method: 'DELETE' })
      toast.success('Silindi')
      setTickets((prev) => prev.filter((t) => t.id !== id))
    } catch {
      toast.error('Silinemedi')
    }
  }

  async function sendReply(ticket: Ticket) {
    const reply = replyDraft[ticket.id]?.trim()
    if (!reply) return
    await updateTicket(ticket.id, { adminReply: reply, status: 'CLOSED' })
    setReplyDraft((prev) => ({ ...prev, [ticket.id]: '' }))
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Destek Talepleri</h1>
          <p className="text-sm text-gray-500 mt-1">İşletmelerden gelen destek mesajları</p>
        </div>
        <div className="flex items-center gap-3">
          {openCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              {openCount} açık talep
            </span>
          )}
          <button
            onClick={fetchTickets}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* Filtre */}
      <div className="flex flex-wrap gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setStatusFilter(opt.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              statusFilter === opt.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
          <MessageCircle className="h-12 w-12 text-gray-200 mb-3" />
          <p className="text-sm text-gray-400">Bu filtrede talep yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => {
            const isOpen = expanded === t.id
            return (
              <div key={t.id} className="glass-card overflow-hidden">
                {/* Başlık satırı */}
                <button
                  onClick={() => setExpanded(isOpen ? null : t.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[t.status]}`}>
                        {STATUS_LABEL[t.status]}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLE[t.priority]}`}>
                        {PRIORITY_LABEL[t.priority]}
                      </span>
                      <span className="text-xs text-gray-400">{PLAN_LABEL[t.tenant.plan]}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 truncate">{t.subject}</p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {t.tenant.name}
                      {t.tenant.email && <span>· {t.tenant.email}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-gray-400">
                      {format(new Date(t.createdAt), 'd MMM yyyy HH:mm', { locale: tr })}
                    </span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                  </div>
                </button>

                {/* Detay */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-5 space-y-5">
                    {/* Mesaj */}
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-400 mb-1 font-medium">İşletme mesajı</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{t.message}</p>
                    </div>

                    {/* Mevcut cevap */}
                    {t.adminReply && (
                      <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                        <p className="text-xs text-purple-500 mb-1 font-medium">
                          Cevabınız — {t.repliedAt ? format(new Date(t.repliedAt), 'd MMM yyyy HH:mm', { locale: tr }) : ''}
                        </p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{t.adminReply}</p>
                      </div>
                    )}

                    {/* Status güncelle */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">Durum:</span>
                      {['OPEN', 'IN_PROGRESS', 'CLOSED'].map((s) => (
                        <button
                          key={s}
                          disabled={t.status === s || saving === t.id}
                          onClick={() => updateTicket(t.id, { status: s })}
                          className={cn(
                            'rounded-lg px-3 py-1 text-xs font-medium border transition-colors',
                            t.status === s
                              ? `${STATUS_STYLE[s]} border-transparent`
                              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                          )}
                        >
                          {STATUS_LABEL[s]}
                        </button>
                      ))}
                    </div>

                    {/* Cevap yaz */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        {t.adminReply ? 'Cevabı Güncelle' : 'Cevap Yaz'}
                      </label>
                      <textarea
                        rows={4}
                        value={replyDraft[t.id] ?? t.adminReply ?? ''}
                        onChange={(e) => setReplyDraft((prev) => ({ ...prev, [t.id]: e.target.value }))}
                        placeholder="İşletmeye cevabınızı yazın..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">Cevap gönderince talep otomatik kapatılır.</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => deleteTicket(t.id)}
                            className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Sil
                          </button>
                          <button
                            onClick={() => sendReply(t)}
                            disabled={saving === t.id || !replyDraft[t.id]?.trim()}
                            className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-purple-700 transition-colors disabled:opacity-60"
                          >
                            {saving === t.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                            Gönder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
