import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export const revalidate = 60

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  })
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    select: { title: true, excerpt: true, seo: true, coverImage: true },
  })
  if (!post) return {}
  const seo = post.seo as { title?: string; description?: string } | null
  return {
    title: seo?.title ?? `${post.title} - Salonapy Blog`,
    description: seo?.description ?? post.excerpt,
    openGraph: post.coverImage ? { images: [post.coverImage] } : undefined,
  }
}

const COVER_GRADIENT = 'from-purple-500 via-violet-500 to-indigo-600'

export default async function BlogDetailPage({ params }: Props) {
  const [post, related] = await Promise.all([
    prisma.blogPost.findUnique({ where: { slug: params.slug, published: true } }),
    prisma.blogPost.findMany({
      where: { published: true, NOT: { slug: params.slug } },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: { slug: true, title: true, publishedAt: true, coverImage: true },
    }),
  ])

  if (!post) notFound()

  const initials = post.author.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const dateStr = post.publishedAt ? format(new Date(post.publishedAt), 'd MMMM yyyy', { locale: tr }) : ''

  return (
    <div className="min-h-screen pb-24 pt-28">
      {/* Cover */}
      {post.coverImage ? (
        <div className="h-72 w-full md:h-96 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={`h-72 w-full bg-gradient-to-br ${COVER_GRADIENT} md:h-96`} />
      )}

      <div className="container-custom">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 mt-8 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-purple-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Tüm Yazılar
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          {/* Main content */}
          <article>
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="mb-6 font-display text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl lg:text-[2.5rem]">
              {post.title}
            </h1>

            {/* Meta row */}
            <div className="mb-8 flex flex-wrap items-center gap-5 border-b border-gray-100 pb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                  {initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{post.author}</div>
                </div>
              </div>
              {dateStr && (
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {dateStr}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {Math.max(1, Math.ceil(post.content.split(' ').length / 200))} dk okuma
                  </span>
                </div>
              )}
            </div>

            {/* HTML content */}
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* CTA */}
            <div className="mt-14 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 p-8 text-center">
              <h3 className="mb-2 font-display text-xl font-bold text-gray-900">
                Salonapy ile Hemen Başlayın
              </h3>
              <p className="mb-5 text-gray-500">
                Başlangıç paketinde 14 gün ücretsiz deneyin.
              </p>
              <Link
                href="/kayit"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200/60 transition-colors hover:bg-purple-700"
              >
                Ücretsiz Başla
              </Link>
            </div>
          </article>

          {/* Sidebar: Related posts */}
          {related.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <h3 className="mb-5 font-display text-base font-bold text-gray-900">İlgili Yazılar</h3>
                <div className="space-y-4">
                  {related.map((r, i) => {
                    const gradients = ['from-purple-500 to-violet-600', 'from-blue-500 to-cyan-500', 'from-amber-400 to-orange-500']
                    return (
                      <Link
                        key={r.slug}
                        href={`/blog/${r.slug}`}
                        className="group flex gap-3 rounded-xl border border-purple-50 bg-white p-3.5 shadow-sm transition-all hover:border-purple-100 hover:shadow-md"
                      >
                        <div className={`h-14 w-14 shrink-0 rounded-lg overflow-hidden ${r.coverImage ? '' : `bg-gradient-to-br ${gradients[i % gradients.length]}`}`}>
                          {r.coverImage && <img src={r.coverImage} alt={r.title} className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="mb-1 text-xs font-semibold leading-snug text-gray-800 transition-colors group-hover:text-purple-600 line-clamp-2">
                            {r.title}
                          </p>
                          {r.publishedAt && (
                            <p className="text-[11px] text-gray-400">
                              {format(new Date(r.publishedAt), 'd MMM yyyy', { locale: tr })}
                            </p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
