'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { FileText, Plus, Trash2, Download, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Tenant { id: string; name: string; slug: string }
interface Invoice {
  id: string; title: string; amount: number | null; issuedAt: string; pdfUrl: string
  tenant: { id: string; name: string; slug: string }
}

export default function AdminFaturalarPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Form state
  const [tenantId, setTenantId] = useState('')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [issuedAt, setIssuedAt] = useState(new Date().toISOString().split('T')[0])
  const [file, setFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [invRes, tenRes] = await Promise.all([
        fetch('/api/admin/invoices'),
        fetch('/api/admin/tenants?limit=200'),
      ])
      const invData = await invRes.json()
      const tenData = await tenRes.json()
      setInvoices(invData.invoices ?? [])
      setTenants(tenData.tenants ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !title || !tenantId) { toast.error('İşletme, başlık ve PDF zorunlu'); return }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('title', title)
      fd.append('tenantId', tenantId)
      if (amount) fd.append('amount', amount)
      fd.append('issuedAt', issuedAt)

      const res = await fetch('/api/admin/invoices', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? 'Hata'); return }
      toast.success('Fatura eklendi')
      setShowForm(false)
      setTitle(''); setAmount(''); setTenantId(''); setFile(null)
      if (fileRef.current) fileRef.current.value = ''
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Faturayı silmek istediğinize emin misiniz?')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/invoices/${id}`, { method: 'DELETE' })
      if (res.ok) { toast.success('Silindi'); setInvoices((prev) => prev.filter((i) => i.id !== id)) }
      else toast.error('Silinemedi')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Fatura Yönetimi
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">İşletmelere manuel fatura ekle</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
          <Plus className="h-4 w-4" /> Fatura Ekle
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Yeni Fatura</h2>
            <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-gray-400" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>İşletme</Label>
              <select
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                required
              >
                <option value="">Seçin...</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Fatura Başlığı</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ör: Ocak 2026 - Başlangıç Planı" required />
            </div>
            <div className="space-y-1.5">
              <Label>Tutar (₺) — opsiyonel</Label>
              <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="540.00" />
            </div>
            <div className="space-y-1.5">
              <Label>Fatura Tarihi</Label>
              <Input type="date" value={issuedAt} onChange={(e) => setIssuedAt(e.target.value)} required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>PDF Dosyası</Label>
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-purple-100 file:text-purple-700 file:font-medium hover:file:bg-purple-200"
                required
              />
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <Button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Ekle
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>İptal</Button>
            </div>
          </form>
        </div>
      )}

      {/* Fatura listesi */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Tüm Faturalar ({invoices.length})</h2>
        </div>
        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Yükleniyor...</div>
        ) : invoices.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Henüz fatura eklenmedi</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {invoices.map((inv) => (
              <div key={inv.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900 truncate">{inv.tenant.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{inv.title}</span>
                    {inv.amount != null && (
                      <span className="text-xs font-bold text-green-600">₺{inv.amount.toLocaleString('tr-TR')}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {format(new Date(inv.issuedAt), 'd MMMM yyyy', { locale: tr })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm" variant="outline"
                    className="border-gray-200 text-gray-600 gap-1.5 text-xs"
                    onClick={async () => {
                      const res = await fetch(`/api/admin/invoices/${inv.id}/download`)
                      const data = await res.json()
                      if (data.url) window.open(data.url, '_blank')
                      else toast.error('İndirme linki alınamadı')
                    }}
                  >
                    <Download className="h-3.5 w-3.5" /> İndir
                  </Button>
                  <Button
                    size="sm" variant="outline"
                    className={cn('border-red-200 text-red-500 gap-1.5 text-xs', deleting === inv.id && 'opacity-50')}
                    onClick={() => handleDelete(inv.id)}
                    disabled={deleting === inv.id}
                  >
                    {deleting === inv.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
