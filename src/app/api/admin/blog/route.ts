import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/blog?page=1&filter=all|published|draft&q=
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const filter = searchParams.get('filter') ?? 'all'
    const q = searchParams.get('q')?.trim() ?? ''
    const limit = 10

    const where: Record<string, unknown> = {}
    if (filter === 'published') where.published = true
    if (filter === 'draft') where.published = false
    if (q) where.title = { contains: q, mode: 'insensitive' }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          published: true,
          publishedAt: true,
          author: true,
          tags: true,
          coverImage: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.blogPost.count({ where }),
    ])

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error('[GET /api/admin/blog]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// POST /api/admin/blog — create
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, coverImage, author, published, tags, seo } = body

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json({ error: 'Başlık, slug, özet ve içerik zorunlu' }, { status: 400 })
    }

    // Check slug uniqueness
    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'Bu slug zaten kullanımda' }, { status: 409 })
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || null,
        author: author || 'Hemensalon',
        published: published ?? false,
        publishedAt: published ? new Date() : null,
        tags: tags ?? [],
        seo: seo ?? null,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (err) {
    console.error('[POST /api/admin/blog]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
