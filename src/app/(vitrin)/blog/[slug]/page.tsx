import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { CalendarDays, User, Tag, ArrowLeft } from 'lucide-react'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://hemensalon.com'

export const revalidate = 3600 // Saatte bir yeniden oluştur

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true },
    })
    return posts.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, published: true },
    select: { title: true, excerpt: true, coverImage: true },
  })
  if (!post) return {}
  const url = `${BASE_URL}/blog/${params.slug}`
  return {
    title: `${post.title} - Hemensalon Blog`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: 'article',
      siteName: 'Hemensalon',
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    },
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, published: true },
  })

  if (!post) notFound()

  // İlgili yazılar: aynı tag'lardan en fazla 3 farklı yazı
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      published: true,
      slug: { not: params.slug },
      tags: { hasSome: post.tags },
    },
    select: { slug: true, title: true, excerpt: true, tags: true, publishedAt: true },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Hemensalon',
      url: BASE_URL,
    },
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt?.toISOString() ?? post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    ...(post.coverImage ? { image: post.coverImage } : {}),
    keywords: post.tags.join(', '),
    inLanguage: 'tr-TR',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${post.slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="min-h-screen pt-24 pb-20">
      {/* Back link */}
      <div className="container mx-auto px-4 max-w-3xl mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Tüm yazılar
        </Link>
      </div>

      {/* Header */}
      <article className="container mx-auto px-4 max-w-3xl">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs font-semibold bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        <p className="text-lg text-gray-500 mb-6">{post.excerpt}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {post.author}
          </span>
          {post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {format(new Date(post.publishedAt), 'd MMMM yyyy', { locale: tr })}
            </span>
          )}
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-10">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="blog-content text-gray-700 leading-relaxed text-base space-y-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_a]:text-purple-600 [&_a]:underline [&_strong]:font-semibold [&_strong]:text-gray-900 [&_blockquote]:border-l-4 [&_blockquote]:border-purple-300 [&_blockquote]:pl-4 [&_blockquote]:text-gray-600 [&_blockquote]:italic [&_blockquote]:my-4 [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_img]:rounded-xl [&_img]:my-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer CTA */}
        <div className="mt-14 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-500 mb-4">Hemensalon ile salonunuzu dijitalleştirin.</p>
          <Link
            href="/fiyatlar"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Ücretsiz Dene
          </Link>
        </div>

        {/* İlgili Yazılar */}
        {relatedPosts.length > 0 && (
          <div className="mt-14 pt-8 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">İlgili Yazılar</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group block rounded-2xl border border-gray-100 bg-gray-50 hover:border-purple-200 hover:bg-purple-50 p-5 transition-colors"
                >
                  <div className="flex flex-wrap gap-1 mb-3">
                    {related.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs font-medium bg-white text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-2 mb-2">
                    {related.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{related.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
    </>
  )
}
