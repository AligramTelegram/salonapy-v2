'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, ChevronDown, ChevronUp, Image as ImageIcon, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { generateBlogSlug } from '@/lib/utils/generateSlug'
import { RichTextEditor } from './RichTextEditor'
import { cn } from '@/lib/utils'

const AVAILABLE_TAGS = ['Randevu', 'WhatsApp', 'Otomasyon', 'İpuçları', 'Yönetim', 'Dijitalleşme', 'KVKK', 'Müşteri Deneyimi', 'Raporlar']

const schema = z.object({
  title: z.string().min(5, 'En az 5 karakter'),
  slug: z.string().min(3, 'En az 3 karakter').regex(/^[a-z0-9-]+$/, 'Sadece küçük harf, rakam ve tire'),
  excerpt: z.string().min(20, 'En az 20 karakter').max(300, 'En fazla 300 karakter'),
  content: z.string().min(50, 'En az 50 karakter'),
  author: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface BlogFormProps {
  initialData?: Partial<FormData> & { id?: string; seo?: { title?: string; description?: string; keywords?: string } | null }
  mode: 'create' | 'edit'
}

export function BlogForm({ initialData, mode }: BlogFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [seoOpen, setSeoOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  const seo = initialData?.seo as { title?: string; description?: string; keywords?: string } | null | undefined

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title ?? '',
      slug: initialData?.slug ?? '',
      excerpt: initialData?.excerpt ?? '',
      content: initialData?.content ?? '',
      author: initialData?.author ?? 'Salonapy',
      coverImage: initialData?.coverImage ?? '',
      tags: initialData?.tags ?? [],
      seoTitle: seo?.title ?? '',
      seoDescription: seo?.description ?? '',
      seoKeywords: seo?.keywords ?? '',
    },
  })

  const watchTitle = form.watch('title')
  const watchTags = form.watch('tags')

  function handleTitleBlur() {
    if (!initialData?.slug && watchTitle && !form.getValues('slug')) {
      form.setValue('slug', generateBlogSlug(watchTitle), { shouldValidate: true })
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      form.setValue('coverImage', json.url)
      toast.success('Görsel yüklendi')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Yükleme başarısız')
    } finally {
      setUploading(false)
    }
  }

  async function save(published: boolean) {
    const valid = await form.trigger()
    if (!valid) return

    const values = form.getValues()
    const payload = {
      title: values.title,
      slug: values.slug,
      excerpt: values.excerpt,
      content: values.content,
      coverImage: values.coverImage,
      author: values.author ?? 'Salonapy',
      published,
      tags: values.tags ?? [],
      seo: {
        title: values.seoTitle,
        description: values.seoDescription,
        keywords: values.seoKeywords,
      },
    }

    if (published) setPublishing(true); else setSaving(true)

    try {
      const url = mode === 'edit' && initialData?.id
        ? `/api/admin/blog/${initialData.id}`
        : '/api/admin/blog'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      toast.success(published ? 'Yazı yayınlandı!' : 'Taslak kaydedildi')
      router.push('/admin/blog')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Kayıt başarısız')
    } finally {
      setSaving(false)
      setPublishing(false)
    }
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      {/* Title */}
      <div>
        <Label className="text-gray-300 mb-1.5">Başlık *</Label>
        <Input
          {...form.register('title')}
          onBlur={handleTitleBlur}
          placeholder="Blog yazısı başlığı"
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
        />
        {form.formState.errors.title && (
          <p className="text-red-400 text-xs mt-1">{form.formState.errors.title.message}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <Label className="text-gray-300 mb-1.5">Slug *</Label>
        <Input
          {...form.register('slug')}
          placeholder="blog-yazisi-basligi"
          className="bg-gray-800 border-gray-700 text-white font-mono text-sm placeholder:text-gray-500"
        />
        {form.formState.errors.slug && (
          <p className="text-red-400 text-xs mt-1">{form.formState.errors.slug.message}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">Başlık girilince otomatik oluşur. Düzenleyebilirsiniz.</p>
      </div>

      {/* Excerpt */}
      <div>
        <Label className="text-gray-300 mb-1.5">Özet *</Label>
        <textarea
          {...form.register('excerpt')}
          rows={3}
          placeholder="Blog yazısının kısa özeti (listede görünür)"
          className="w-full rounded-xl border border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {form.formState.errors.excerpt && (
          <p className="text-red-400 text-xs mt-1">{form.formState.errors.excerpt.message}</p>
        )}
      </div>

      {/* Content */}
      <div>
        <Label className="text-gray-300 mb-1.5">İçerik *</Label>
        <Controller
          control={form.control}
          name="content"
          render={({ field }) => (
            <RichTextEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {form.formState.errors.content && (
          <p className="text-red-400 text-xs mt-1">{form.formState.errors.content.message}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Cover image */}
        <div>
          <Label className="text-gray-300 mb-1.5">Kapak Görseli</Label>
          <Controller
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <div className="space-y-2">
                {field.value ? (
                  <div className="relative rounded-xl overflow-hidden bg-gray-700 aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={field.value} alt="Cover" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => field.onChange('')}
                      className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-700 bg-gray-800 p-6 cursor-pointer hover:border-gray-600 transition-colors">
                    {uploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-500">{uploading ? 'Yükleniyor...' : 'Görsel yükle (JPG, PNG, WebP, max 5MB)'}</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} disabled={uploading} />
                  </label>
                )}
              </div>
            )}
          />
        </div>

        {/* Author + Tags */}
        <div className="space-y-4">
          <div>
            <Label className="text-gray-300 mb-1.5">Yazar</Label>
            <Input
              {...form.register('author')}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300 mb-1.5">Etiketler</Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    const current = watchTags ?? []
                    if (current.includes(tag)) {
                      form.setValue('tags', current.filter((t) => t !== tag))
                    } else {
                      form.setValue('tags', [...current, tag])
                    }
                  }}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                    (watchTags ?? []).includes(tag)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <button
          type="button"
          onClick={() => setSeoOpen(!seoOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-750 transition-colors"
        >
          SEO Ayarları
          {seoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {seoOpen && (
          <div className="p-4 space-y-4 bg-gray-800/50">
            <div>
              <Label className="text-gray-400 text-xs mb-1.5">Meta Title</Label>
              <Input {...form.register('seoTitle')} placeholder="Varsayılan: başlık" className="bg-gray-800 border-gray-700 text-white text-sm" />
            </div>
            <div>
              <Label className="text-gray-400 text-xs mb-1.5">Meta Description</Label>
              <textarea
                {...form.register('seoDescription')}
                rows={2}
                placeholder="Varsayılan: özet"
                className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white text-sm px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label className="text-gray-400 text-xs mb-1.5">Keywords (virgülle ayırın)</Label>
              <Input {...form.register('seoKeywords')} placeholder="randevu, salon, kuaför" className="bg-gray-800 border-gray-700 text-white text-sm" />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => save(false)}
          disabled={saving || publishing}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Taslak Kaydet
        </Button>
        <Button
          type="button"
          onClick={() => save(true)}
          disabled={saving || publishing}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {publishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'edit' ? 'Güncelle ve Yayınla' : 'Yayınla'}
        </Button>
      </div>
    </form>
  )
}
