'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Edit2, Trash2, Loader2, Bell, BellOff, ChevronLeft, ChevronRight,
  Info, AlertTriangle, CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface AnnouncementRow {
  id: string
  title: string
  content: string
  type: 'INFO' | 'WARNING' | 'SUCCESS'
  isActive: boolean
  targetPlan: string | null
  expiresAt: string | null
  createdAt: string
  _count: { dismissals: number }
}

const TYPE_CONFIG = {
  INFO: { label: 'Bilgi', color: 'bg-blue-100 text-blue-700', icon: Info, iconColor: 'text-blue-500' },
  WARNING: { label: 'Uyarı', color: 'bg-amber-100 text-amber-700', icon: AlertTriangle, iconColor: 'text-amber-500' },
  SUCCESS: { label: 'Başarı', color: 'bg-green-100 text-green-700', icon: CheckCircle2, iconColor: 'text-green-500' },
}

const PLAN_LABELS: Record<string, string> = {
  BASLANGIC: 'Başlangıç',
  PROFESYONEL: 'Profesyonel',
  ISLETME: 'İşletme',
}

const emptyForm = {
  title: '',
  content: '',
  type: 'INFO' as 'INFO' | 'WARNING' | 'SUCCESS',
  isActive: true,
  targetPlan: '',
  expiresAt: '',
}

export default function DuyurularPage() {
  const [rows, setRows] = useState<AnnouncementRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AnnouncementRow | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/announcements?page=${page}`)
      const data = await res.json()
      setRows(data.announcements ?? [])
      setTotal(data.total ?? 0)
      setTotalPages(data.totalPages ?? 1)
    } catch {
      toast.error('Duyurular yüklenemedi')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(row: AnnouncementRow) {
    setEditing(row)
    setForm({
      title: row.title,
      content: row.content,
      type: row.type,
      isActive: row.isActive,
      targetPlan: row.targetPlan ?? '',
      expiresAt: row.expiresAt ? row.expiresAt.slice(0, 10) : '',
    })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Başlık ve içerik zorunlu')
      return
    }
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        content: form.content,
        type: form.type,
        isActive: form.isActive,
        targetPlan: form.targetPlan || null,
        expiresAt: form.expiresAt || null,
      }

      const res = editing
        ? await fetch(`/api/admin/announcements/${editing.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/admin/announcements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

      if (!res.ok) throw new Error()
      toast.success(editing ? 'Duyuru güncellendi' : 'Duyuru oluşturuldu')
      setModalOpen(false)
      load()
    } catch {
      toast.error('Kaydedilemedi')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(row: AnnouncementRow) {
    try {
      const res = await fetch(`/api/admin/announcements/${row.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !row.isActive }),
      })
      if (!res.ok) throw new Error()
      toast.success(row.isActive ? 'Duyuru pasife alındı' : 'Duyuru aktif edildi')
      load()
    } catch {
      toast.error('Güncellenemedi')
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Duyuru silindi')
      load()
    } catch {
      toast.error('Silinemedi')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Duyuru Yönetimi</h1>
          <p className="text-sm text-gray-400 mt-0.5">{total} duyuru</p>
        </div>
        <Button onClick={openNew} className="bg-purple-600 hover:bg-purple-700 gap-2">
          <Plus className="h-4 w-4" />
          Yeni Duyuru
        </Button>
      </div>

      {/* List */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="h-10 w-10 text-gray-600 mb-3" />
            <p className="text-gray-400">Henüz duyuru yok</p>
            <Button onClick={openNew} variant="ghost" className="mt-3 text-purple-400 hover:text-purple-300">
              İlk duyuruyu oluştur
            </Button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-700">
              {rows.map((row) => {
                const cfg = TYPE_CONFIG[row.type]
                const TypeIcon = cfg.icon
                return (
                  <div key={row.id} className="flex items-start gap-4 p-4 hover:bg-gray-750 transition-colors">
                    <div className={cn('mt-0.5 p-2 rounded-lg bg-gray-700')}>
                      <TypeIcon className={cn('h-4 w-4', cfg.iconColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white truncate">{row.title}</span>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', cfg.color)}>
                          {cfg.label}
                        </span>
                        {!row.isActive && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-400 font-medium">
                            Pasif
                          </span>
                        )}
                        {row.expiresAt && new Date(row.expiresAt) < new Date() && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/60 text-red-400 font-medium">
                            Süresi Doldu
                          </span>
                        )}
                        {row.targetPlan && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 font-medium">
                            {PLAN_LABELS[row.targetPlan] ?? row.targetPlan}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">{row.content}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{format(new Date(row.createdAt), 'd MMM yyyy', { locale: tr })}</span>
                        <span>{row._count.dismissals} kez kapatıldı</span>
                        {row.expiresAt && (
                          <span>Bitiş: {format(new Date(row.expiresAt), 'd MMM yyyy', { locale: tr })}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        title={row.isActive ? 'Pasife Al' : 'Aktif Et'}
                        onClick={() => toggleActive(row)}
                      >
                        {row.isActive ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        onClick={() => openEdit(row)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-gray-400 hover:text-red-400"
                            disabled={deletingId === row.id}
                          >
                            {deletingId === row.id
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Duyuruyu sil?</AlertDialogTitle>
                            <AlertDialogDescription>
                              &quot;{row.title}&quot; duyurusu kalıcı olarak silinecek.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleDelete(row.id)}
                            >
                              Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
                <span className="text-sm text-gray-400">Toplam {total}</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon" variant="ghost"
                    className="h-8 w-8 text-gray-400"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-300">{page} / {totalPages}</span>
                  <Button
                    size="icon" variant="ghost"
                    className="h-8 w-8 text-gray-400"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Duyuruyu Düzenle' : 'Yeni Duyuru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Başlık *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Duyuru başlığı"
              />
            </div>
            <div className="space-y-1.5">
              <Label>İçerik *</Label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Duyuru içeriği..."
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tür</Label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as typeof form.type }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="INFO">Bilgi</option>
                  <option value="WARNING">Uyarı</option>
                  <option value="SUCCESS">Başarı</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Hedef Plan</Label>
                <select
                  value={form.targetPlan}
                  onChange={(e) => setForm((f) => ({ ...f, targetPlan: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Tüm Planlar</option>
                  <option value="BASLANGIC">Başlangıç</option>
                  <option value="PROFESYONEL">Profesyonel</option>
                  <option value="ISLETME">İşletme</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Bitiş Tarihi (opsiyonel)</Label>
              <Input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                id="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="isActive" className="cursor-pointer">Aktif (hemen yayınla)</Label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
                Vazgeç
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? 'Güncelle' : 'Oluştur'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
