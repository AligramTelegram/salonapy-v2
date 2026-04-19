import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

// GET /api/admin/invoices?tenantId=xxx
export async function GET(request: NextRequest) {
  const tenantId = request.nextUrl.searchParams.get('tenantId')

  const invoices = await prisma.invoice.findMany({
    where: tenantId ? { tenantId } : undefined,
    include: { tenant: { select: { id: true, name: true, slug: true } } },
    orderBy: { issuedAt: 'desc' },
    take: 200,
  })

  return NextResponse.json({ invoices })
}

// POST /api/admin/invoices — multipart/form-data: file + title + tenantId + amount? + issuedAt?
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string | null
    const tenantId = formData.get('tenantId') as string | null
    const amountRaw = formData.get('amount') as string | null
    const issuedAtRaw = formData.get('issuedAt') as string | null

    if (!file || !title || !tenantId) {
      return NextResponse.json({ error: 'file, title ve tenantId zorunlu' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Sadece PDF destekleniyor' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Dosya 10MB\'dan büyük olamaz' }, { status: 400 })
    }

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId }, select: { id: true } })
    if (!tenant) return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 404 })

    const supabase = createAdminClient()
    const filename = `${tenantId}/${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`
    const buffer = new Uint8Array(await file.arrayBuffer())

    const { data: buckets } = await supabase.storage.listBuckets()
    if (!buckets?.some((b) => b.name === 'invoices')) {
      await supabase.storage.createBucket('invoices', { public: false })
    }

    const { error: uploadError } = await supabase.storage
      .from('invoices')
      .upload(filename, buffer, { contentType: 'application/pdf', upsert: false })

    if (uploadError) {
      console.error('[Invoice Upload]', uploadError)
      return NextResponse.json({ error: 'PDF yüklenemedi: ' + uploadError.message }, { status: 500 })
    }

    const invoice = await prisma.invoice.create({
      data: {
        tenantId,
        title: title.trim(),
        amount: amountRaw ? parseFloat(amountRaw) : null,
        pdfUrl: filename,
        issuedAt: issuedAtRaw ? new Date(issuedAtRaw) : new Date(),
      },
    })

    return NextResponse.json({ invoice })
  } catch (err) {
    console.error('[POST /api/admin/invoices]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
