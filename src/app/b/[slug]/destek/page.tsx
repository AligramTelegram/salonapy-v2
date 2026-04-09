'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { MessageCircle, Send, Loader2, ChevronDown, ChevronUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface Ticket {
  id: string
  subject: string
  message: string
  status: string
  priority: string
  adminReply: string | null
  repliedAt: string | null
  createdAt: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  OPEN:        { label: 'Bekliyor',    color: 'bg-amber-100 text-amber-700',  icon: Clock },
  IN_PROGRESS: { label: 'İşlemde',     color: 'bg-blue-100 text-blue-700',    icon: AlertCircle },
  CLOSED:      { label: 'Cevaplandı',  color: 'bg-green-100 text-green-700',  icon: CheckCircle },
}

const SUBJECTS = [
  'Teknik Sorun',
  'Ödeme / Abonelik',
  'Özellik Talebi',
  'Hesap Ayarları',
  'Diğer',
]

export default function DestekPage() {
  const { slug } = useParams<{ slug: string }>()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState('NORMAL')

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch('/api/support')
      if (res.ok) setTickets(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTickets() }, [fetchTickets])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!subject || !message.trim()) {
      toast.error('Konu ve mesaj zorunludur')
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message, priority }),
      })
      if (!res.ok) throw new Error()
      toast.success('Mesajınız iletildi. En kısa sürede yanıt vereceğiz.')
      setSubject('')
      setMessage('')
      setPriority('NORMAL')
      fetchTickets()
    } catch {
      toast.error('Mesaj gönderilemedi')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-8">
      {/* Başlık */}
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Destek</h1>
        <p className="text-sm text-gray-500 mt-1">
          Sorunlarınızı, önerilerinizi veya sorularınızı bize iletin.
        </p>
      </div>

      {/* Yeni mesaj formu */}
      <div className="glass-card p-6">
        <h2 className="font-display text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-purple-500" />
          Yeni Destek Talebi
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Konu seçimi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Konu</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubject(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                    subject === s
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Öncelik */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Öncelik</label>
            <div className="flex gap-2">
              {[
                { val: 'LOW',    label: 'Düşük' },
                { val: 'NORMAL', label: 'Normal' },
                { val: 'HIGH',   label: 'Yüksek' },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setPriority(p.val)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                    priority === p.val
                      ? p.val === 'HIGH' ? 'bg-red-500 text-white border-red-500'
                        : p.val === 'LOW' ? 'bg-gray-500 text-white border-gray-500'
                        : 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mesaj */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mesajınız</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Sorununuzu veya talebinizi detaylı açıklayın..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={sending || !subject || !message.trim()}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors disabled:opacity-60"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Gönder
          </button>
        </form>
      </div>

      {/* Geçmiş talepler */}
      <div>
        <h2 className="font-display text-base font-bold text-gray-800 mb-4">Taleplerim</h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="glass-card p-10 text-center text-sm text-gray-400">
            Henüz destek talebi oluşturmadınız.
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => {
              const cfg = STATUS_CONFIG[t.status] ?? STATUS_CONFIG.OPEN
              const Icon = cfg.icon
              const isOpen = expanded === t.id
              return (
                <div key={t.id} className="glass-card overflow-hidden">
                  <button
                    onClick={() => setExpanded(isOpen ? null : t.id)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${cfg.color}`}>
                        <Icon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                      <span className="text-sm font-semibold text-gray-800 truncate">{t.subject}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-gray-400">
                        {format(new Date(t.createdAt), 'd MMM yyyy', { locale: tr })}
                      </span>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 px-5 py-4 space-y-4">
                      {/* Kullanıcı mesajı */}
                      <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs text-gray-400 mb-1">Talebiniz</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{t.message}</p>
                      </div>

                      {/* Admin cevabı */}
                      {t.adminReply ? (
                        <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                          <p className="text-xs text-purple-500 mb-1 font-medium">
                            Destek Ekibi cevapladı —{' '}
                            {t.repliedAt ? format(new Date(t.repliedAt), 'd MMM yyyy HH:mm', { locale: tr }) : ''}
                          </p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{t.adminReply}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Henüz cevap verilmedi, inceleniyor...</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
