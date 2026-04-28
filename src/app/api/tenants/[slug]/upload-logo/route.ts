import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

async function getOwnerTenantId(slug: string): Promise<string | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { tenant: { select: { id: true, slug: true } } },
  })
  if (!dbUser || dbUser.tenant.slug !== slug) return null
  return dbUser.tenant.id
}

// POST /api/tenants/[slug]/upload-logo
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const tenantId = await getOwnerTenantId(params.slug)
    if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    let formData: FormData
    try {
      formData = await request.formData()
    } catch {
      return NextResponse.json({ error: 'Form verisi okunamadı' }, { status: 400 })
    }

    const file = formData.get('logo') as File | null
    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Sadece JPG, PNG ve WebP dosyaları desteklenir' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Dosya boyutu maksimum 2MB olabilir' },
        { status: 400 }
      )
    }

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const filename = `${tenantId}-${Date.now()}.${ext}`

    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)

    const adminClient = createAdminClient()

    // Bucket yoksa oluştur
    const { data: buckets } = await adminClient.storage.listBuckets()
    if (!buckets?.find(b => b.name === 'logos')) {
      await adminClient.storage.createBucket('logos', { public: true, fileSizeLimit: 2097152 })
    }

    const { error: uploadError } = await adminClient.storage
      .from('logos')
      .upload(filename, bytes, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('[upload-logo] Storage error:', uploadError)
      return NextResponse.json({ error: 'Yükleme başarısız: ' + uploadError.message }, { status: 500 })
    }

    const {
      data: { publicUrl },
    } = adminClient.storage.from('logos').getPublicUrl(filename)

    await prisma.tenant.update({
      where: { id: tenantId },
      data: { logo: publicUrl },
    })

    return NextResponse.json({ logo: publicUrl })
  } catch (err) {
    console.error('[POST /api/tenants/[slug]/upload-logo]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
