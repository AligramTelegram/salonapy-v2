import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// POST /api/admin/upload
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Sadece JPG, PNG, WebP destekleniyor' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Dosya 5MB\'dan büyük olamaz' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const ext = file.name.split('.').pop() ?? 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Bucket yoksa oluştur
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some((b) => b.name === 'blog-images')
    if (!bucketExists) {
      await supabase.storage.createBucket('blog-images', { public: true })
    }

    const { error } = await supabase.storage
      .from('blog-images')
      .upload(filename, buffer, { contentType: file.type, upsert: false })

    if (error) {
      console.error('[Upload] Supabase Storage error:', error)
      return NextResponse.json({ error: 'Yükleme başarısız: ' + error.message }, { status: 500 })
    }

    const { data: publicData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filename)

    return NextResponse.json({ url: publicData.publicUrl })
  } catch (err) {
    console.error('[POST /api/admin/upload]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
