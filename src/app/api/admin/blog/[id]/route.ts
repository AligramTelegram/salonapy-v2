import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/blog/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.blogPost.findUnique({ where: { id: params.id } })
    if (!post) return NextResponse.json({ error: 'Blog yazısı bulunamadı' }, { status: 404 })
    return NextResponse.json(post)
  } catch (err) {
    console.error('[GET /api/admin/blog/[id]]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// PUT /api/admin/blog/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, coverImage, author, published, tags, seo } = body

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json({ error: 'Başlık, slug, özet ve içerik zorunlu' }, { status: 400 })
    }

    // Check slug uniqueness (exclude self)
    const existing = await prisma.blogPost.findFirst({
      where: { slug, NOT: { id: params.id } },
    })
    if (existing) {
      return NextResponse.json({ error: 'Bu slug zaten kullanımda' }, { status: 409 })
    }

    const current = await prisma.blogPost.findUnique({
      where: { id: params.id },
      select: { published: true, publishedAt: true },
    })
    if (!current) return NextResponse.json({ error: 'Blog yazısı bulunamadı' }, { status: 404 })

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || null,
        author: author || 'Salonapy',
        published: published ?? false,
        // Set publishedAt only when first publishing
        publishedAt: published && !current.publishedAt ? new Date() : current.publishedAt,
        tags: tags ?? [],
        seo: seo ?? null,
      },
    })

    return NextResponse.json(post)
  } catch (err) {
    console.error('[PUT /api/admin/blog/[id]]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// DELETE /api/admin/blog/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.blogPost.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/blog/[id]]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
