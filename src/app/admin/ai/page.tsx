'use client'

import { useEffect, useState, useCallback } from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
  Bot, MessageCircle, Users, TrendingUp, ArrowLeft,
  CheckCircle2, AlertCircle, Clock, Loader2, RefreshCw,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface TenantAI {
  id: string
  name: string
  slug: string
  whatsappAIEnabled: boolean
  whatsappMessagesUsed: number
  whatsappMessagesLimit: number
  instagramAIEnabled: boolean
  instagramMessagesUsed: number
  instagramMessagesLimit: number
  integrations: Array<{ platform: string; status: string; phoneNumberId: string | null; instagramAccountId: string | null }>
  _count: { conversations: number }
}

interface Conversation {
  id: string
  platform: string
  platformUserId: string
  status: string
  lastMessageAt: string
  tenant: { name: string; slug: string }
  _count: { messages: number }
  messages: Array<{ content: string; direction: string }>
}

interface Message {
  id: string
  direction: string
  content: string
  aiGenerated: boolean
  createdAt: string
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminAIPage() {
  const [loading, setLoading] = useState(true)
  const [tenants, setTenants] = useState<TenantAI[]>([])
  const [totalConversations, setTotalConversations] = useState(0)
  const [totalMessages, setTotalMessages] = useState(0)

  const [selectedTenant, setSelectedTenant] = useState<TenantAI | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [convLoading, setConvLoading] = useState(false)

  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [msgLoading, setMsgLoading] = useState(false)

  const loadOverview = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/ai?view=overview')
      const data = await res.json()
      setTenants(data.tenants ?? [])
      setTotalConversations(data.totalConversations ?? 0)
      setTotalMessages(data.totalMessages ?? 0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadOverview() }, [loadOverview])

  async function openTenant(tenant: TenantAI) {
    setSelectedTenant(tenant)
    setSelectedConv(null)
    setMessages([])
    setConvLoading(true)
    try {
      const res = await fetch(`/api/admin/ai?view=conversations&tenantId=${tenant.id}`)
      const data = await res.json()
      setConversations(data.conversations ?? [])
    } finally {
      setConvLoading(false)
    }
  }

  async function openConversation(conv: Conversation) {
    setSelectedConv(conv)
    setMsgLoading(true)
    try {
      const res = await fetch(`/api/admin/ai?view=messages&conversationId=${conv.id}`)
      const data = await res.json()
      setMessages(data.messages ?? [])
    } finally {
      setMsgLoading(false)
    }
  }

  // ── Mesaj detayı ──
  if (selectedConv) {
    return (
      <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-4">
        <button onClick={() => setSelectedConv(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4" /> Konuşmalara dön
        </button>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${selectedConv.platform === 'WHATSAPP' ? 'bg-green-100' : 'bg-pink-100'}`}>
            <MessageCircle className={`h-5 w-5 ${selectedConv.platform === 'WHATSAPP' ? 'text-green-600' : 'text-pink-600'}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{selectedConv.tenant.name}</p>
            <p className="text-xs text-gray-500">{selectedConv.platform} · {selectedConv.platformUserId}</p>
          </div>
          <span className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            selectedConv.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {selectedConv.status}
          </span>
        </div>

        {msgLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.direction === 'OUTBOUND'
                    ? 'bg-purple-600 text-white rounded-br-sm'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <div className={`mt-1 flex items-center gap-1.5 ${msg.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'}`}>
                    {msg.aiGenerated && (
                      <span className="text-[10px] opacity-70 flex items-center gap-0.5">
                        <Bot className="h-2.5 w-2.5" /> AI
                      </span>
                    )}
                    <span className="text-[10px] opacity-60">
                      {format(new Date(msg.createdAt), 'HH:mm', { locale: tr })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">Mesaj yok</p>
            )}
          </div>
        )}
      </div>
    )
  }

  // ── Konuşma listesi ──
  if (selectedTenant) {
    return (
      <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-4">
        <button onClick={() => { setSelectedTenant(null) }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4" /> İşletmelere dön
        </button>

        <div className="glass-card p-4">
          <h2 className="font-bold text-gray-900">{selectedTenant.name}</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {selectedTenant.whatsappAIEnabled && (
              <UsageBar label="WhatsApp" used={selectedTenant.whatsappMessagesUsed} limit={selectedTenant.whatsappMessagesLimit} color="green" />
            )}
            {selectedTenant.instagramAIEnabled && (
              <UsageBar label="Instagram" used={selectedTenant.instagramMessagesUsed} limit={selectedTenant.instagramMessagesLimit} color="pink" />
            )}
          </div>
        </div>

        {convLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="glass-card p-8 text-center text-sm text-gray-400">Henüz konuşma yok</div>
        ) : (
          <div className="space-y-2">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => openConversation(conv)}
                className="w-full glass-card p-4 flex items-center gap-3 hover:border-purple-200 transition-colors text-left"
              >
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${conv.platform === 'WHATSAPP' ? 'bg-green-100' : 'bg-pink-100'}`}>
                  <MessageCircle className={`h-4 w-4 ${conv.platform === 'WHATSAPP' ? 'text-green-600' : 'text-pink-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{conv.platformUserId}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {conv.messages[0]?.content ?? 'Mesaj yok'}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[11px] text-gray-400">{format(new Date(conv.lastMessageAt), 'd MMM HH:mm', { locale: tr })}</p>
                  <span className="text-[11px] text-gray-500">{conv._count.messages} mesaj</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── Genel bakış ──
  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">AI Konuşmaları</h1>
          <p className="text-sm text-gray-500 mt-1">Tüm işletmelerin AI asistan aktivitesi</p>
        </div>
        <button onClick={loadOverview} className="h-9 w-9 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center">
          <RefreshCw className={`h-4 w-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{tenants.length}</p>
            <p className="text-xs text-gray-500">AI Aktif İşletme</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalConversations}</p>
            <p className="text-xs text-gray-500">Toplam Konuşma</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalMessages}</p>
            <p className="text-xs text-gray-500">Toplam Mesaj</p>
          </div>
        </div>
      </div>

      {/* İşletme listesi */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
        </div>
      ) : tenants.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Bot className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Henüz AI paketi satın almış işletme yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tenants.map(tenant => (
            <button
              key={tenant.id}
              onClick={() => openTenant(tenant)}
              className="w-full glass-card p-5 hover:border-purple-200 transition-colors text-left"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{tenant.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{tenant._count.conversations} konuşma</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <PlatformBadge
                    label="WA"
                    enabled={tenant.whatsappAIEnabled}
                    connected={tenant.integrations.some(i => i.platform === 'WHATSAPP' && i.status === 'ACTIVE')}
                    color="green"
                  />
                  <PlatformBadge
                    label="IG"
                    enabled={tenant.instagramAIEnabled}
                    connected={tenant.integrations.some(i => i.platform === 'INSTAGRAM' && i.status === 'ACTIVE')}
                    color="pink"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {tenant.whatsappAIEnabled && (
                  <UsageBar label="WhatsApp" used={tenant.whatsappMessagesUsed} limit={tenant.whatsappMessagesLimit} color="green" />
                )}
                {tenant.instagramAIEnabled && (
                  <UsageBar label="Instagram" used={tenant.instagramMessagesUsed} limit={tenant.instagramMessagesLimit} color="pink" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Alt bileşenler ───────────────────────────────────────────────────────────

function PlatformBadge({
  label, enabled, connected, color,
}: { label: string; enabled: boolean; connected: boolean; color: 'green' | 'pink' }) {
  if (!enabled) return null
  const colorMap = {
    green: { bg: 'bg-green-100', text: 'text-green-700' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-700' },
  }
  const c = colorMap[color]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${c.bg} ${c.text}`}>
      {connected
        ? <CheckCircle2 className="h-3 w-3" />
        : <AlertCircle className="h-3 w-3 text-amber-500" />}
      {label}
    </span>
  )
}

function UsageBar({
  label, used, limit, color,
}: { label: string; used: number; limit: number; color: 'green' | 'pink' }) {
  const pct = Math.min(100, Math.round((used / limit) * 100))
  const barColor = color === 'green' ? 'bg-green-400' : 'bg-pink-400'
  const warnColor = pct > 80 ? 'bg-red-400' : barColor
  return (
    <div>
      <div className="flex justify-between text-[11px] text-gray-500 mb-1">
        <span>{label}</span>
        <span>{used}/{limit}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full ${warnColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
