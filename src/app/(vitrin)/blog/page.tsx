import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export const revalidate = 60 // ISR: revalidate every 60s

export const metadata: Metadata = {
  title: 'Blog - Salonapy',
  description:
    'Salon yönetimi, randevu sistemleri ve işletme büyütme konularında ipuçları ve rehberler.',
}

const COVER_GRADIENTS = [
  'from-purple-500 via-violet-500 to-indigo-600',
  'from-blue-500 via-cyan-500 to-teal-500',
  'from-amber-400 via-orange-500 to-rose-500',
  'from-rose-400 via-pink-500 to-purple-600',
  'from-green-400 via-emerald-500 to-cyan-600',
  'from-yellow-400 via-amber-500 to-orange-600',
]

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      tags: true,
      publishedAt: true,
      coverImage: true,
      author: true,
    },
  })

  return (
    <section className="min-h-screen pb-24 pt-32">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            Blog
          </span>
          <h1 className="mb-4 font-display text-4xl font-bold text-gray-900 md:text-5xl">
            Salon işletmeciliği
            <br />
            <span className="text-purple-600">rehberleri ve ipuçları</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-gray-500">
            Salonunuzu büyütmek, verimliliği artırmak ve müşteri memnuniyetini
            yükseltmek için pratik içerikler.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-400 py-16">Henüz blog yazısı yok.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => {
              const gradient = COVER_GRADIENTS[i % COVER_GRADIENTS.length]
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-purple-100/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100/40"
                >
                  {/* Cover */}
                  <div className={`h-44 w-full relative overflow-hidden ${post.coverImage ? '' : `bg-gradient-to-br ${gradient}`}`}>
                    {post.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                    ) : null}
                    {/* Tag chips */}
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center gap-3 text-xs text-gray-400">
                      <span>
                        {post.publishedAt
                          ? format(new Date(post.publishedAt), 'd MMMM yyyy', { locale: tr })
                          : ''}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {Math.max(1, Math.ceil(post.excerpt.length / 200))} dk okuma
                      </span>
                    </div>
                    <h2 className="mb-2 font-display text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-purple-600">
                      {post.title}
                    </h2>
                    <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-500 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-purple-600">
                      Devamını Oku
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
