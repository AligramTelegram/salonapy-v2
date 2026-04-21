import Link from 'next/link'
import { ArrowRight, Clock, User } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

const COVER_GRADIENTS = [
  'from-purple-500 via-violet-500 to-indigo-600',
  'from-blue-500 via-cyan-500 to-teal-500',
  'from-amber-400 via-orange-500 to-rose-500',
  'from-rose-400 via-pink-500 to-purple-600',
  'from-emerald-400 via-green-500 to-teal-600',
]

export async function BlogPreview() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      author: true,
      tags: true,
      publishedAt: true,
    },
  })

  if (posts.length === 0) return null

  return (
    <section className="py-24 md:py-32">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
              Blog
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900 md:text-4xl">
              Salon yönetimi
              <br />
              <span className="text-purple-600">rehberleri</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 transition-colors hover:text-purple-700"
          >
            Tüm Yazılar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Posts */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-purple-100/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100/40"
            >
              {/* Cover */}
              <div className={`h-40 w-full bg-gradient-to-br ${COVER_GRADIENTS[i % COVER_GRADIENTS.length]}`} />

              {/* Body */}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center gap-3 text-xs text-gray-400">
                  {post.publishedAt && (
                    <span>{format(new Date(post.publishedAt), 'd MMM yyyy', { locale: tr })}</span>
                  )}
                  {post.tags[0] && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        {post.tags[0]}
                      </span>
                    </>
                  )}
                </div>

                <h3 className="mb-2 font-display text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-purple-600 line-clamp-2">
                  {post.title}
                </h3>

                <p className="mb-4 flex-1 text-xs leading-relaxed text-gray-500 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-1 text-xs font-medium text-purple-600">
                  Devamını Oku
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
