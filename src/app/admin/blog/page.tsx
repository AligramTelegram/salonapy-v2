'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Plus, Search, Edit2, Trash2, Eye, FileText,
  ChevronLeft, ChevronRight, Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface BlogRow {
  id: string
  title: string
  slug: string
  excerpt: string
  published: boolean
  publishedAt: string | null
  author: string
  tags: string[]
  createdAt: string
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), filter, q: search })
      const res = await fetch(`/api/admin/blog?${params}`)
      const data = await res.json()
      setPosts(data.posts ?? [])
      setTotal(data.total ?? 0)
      setTotalPages(data.totalPages ?? 1)
    } catch {
      toast.error('Blog yazıları yüklenemedi')
    } finally {
      setLoading(false)
    }
  }, [page, filter, search])

  useEffect(() => { load() }, [load])

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/blog/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Blog yazısı silindi')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Silme başarısız')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Blog Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} yazı</p>
        </div>
        <Link href="/admin/blog/yeni">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
            <Plus className="h-4 w-4" />
            Yeni Yazı
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Başlık ara..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
          />
        </div>
        <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1">
          {(['all', 'published', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1) }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                filter === f ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
              )}
            >
              {f === 'all' ? 'Tümü' : f === 'published' ? 'Yayında' : 'Taslak'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FileText className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm">Henüz blog yazısı yok</p>
            <Link href="/admin/blog/yeni" className="mt-3 text-purple-600 hover:underline text-sm font-medium">
              İlk yazıyı ekle
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 font-semibold">Başlık</th>
                  <th className="px-5 py-3 font-semibold">Slug</th>
                  <th className="px-5 py-3 font-semibold">Durum</th>
                  <th className="px-5 py-3 font-semibold">Yayın Tarihi</th>
                  <th className="px-5 py-3 font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-semibold text-gray-900 line-clamp-1">{post.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{post.excerpt}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">{post.slug}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      )}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', post.published ? 'bg-green-500' : 'bg-gray-400')} />
                        {post.published ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">
                      {post.publishedAt
                        ? format(new Date(post.publishedAt), 'd MMM yyyy', { locale: tr })
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        {post.published && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Önizle"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        )}
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                          title="Düzenle"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(post.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{total} yazıdan {((page - 1) * 10) + 1}–{Math.min(page * 10, total)} gösteriliyor</span>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Blog Yazısını Sil</DialogTitle>
            <DialogDescription className="text-gray-500">
              Bu işlem geri alınamaz. Blog yazısı kalıcı olarak silinecek.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="border-gray-200 text-gray-600">
              İptal
            </Button>
            <Button onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700 text-white">
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sil
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
