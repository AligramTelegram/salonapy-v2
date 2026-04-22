import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { CalendarDays, User, Tag } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Salon Yönetimi Rehberleri & İpuçları | Kuaför Blog – Hemensalon',
  description: 'Kuaför, berber ve güzellik salonu sahipleri için salon yönetimi rehberleri, online randevu ipuçları, personel yönetimi ve sektör haberleri.',
  keywords: 'kuaför blog, salon yönetimi rehberi, güzellik salonu ipuçları, online randevu ipuçları, salon yazılımı blog',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://hemensalon.com/blog' },
  openGraph: {
    title: 'Salon Yönetimi Rehberleri & İpuçları – Hemensalon Blog',
    description: 'Kuaför ve güzellik salonu sahipleri için pratik rehberler ve sektör haberleri.',
    url: 'https://hemensalon.com/blog',
    type: 'website',
  },
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      author: true,
      tags: true,
      publishedAt: true,
    },
  })

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="text-center pb-14 pt-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Blog
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Sektörden Haberler &amp; İpuçları
          </h1>
          <p className="text-lg text-gray-500">
            Salon yönetimi, müşteri ilişkileri ve güzellik sektörüne dair bilgi dolu içerikler.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="container mx-auto px-4 max-w-6xl">
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg">Henüz yayınlanmış blog yazısı yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Cover image */}
                <div className="h-48 bg-gradient-to-br from-purple-100 to-indigo-100 relative overflow-hidden">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl">✂️</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full"
                        >
                          <Tag className="h-2.5 w-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h2 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-purple-700 transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-gray-400 pt-3 border-t border-gray-50">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                    {post.publishedAt && (
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {format(new Date(post.publishedAt), 'd MMM yyyy', { locale: tr })}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
