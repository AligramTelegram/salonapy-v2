export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { BlogForm } from '@/components/admin/BlogForm'

interface Props {
  params: { id: string }
}

export default async function DuzenleBlogPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } })
  if (!post) notFound()

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Blog Listesi
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Blog Yazısını Düzenle</h1>
          {post.published && (
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Yayını Görüntüle →
            </a>
          )}
        </div>
      </div>
      <BlogForm
        mode="edit"
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage ?? '',
          author: post.author,
          tags: post.tags,
          seo: post.seo as { title?: string; description?: string; keywords?: string } | null,
        }}
      />
    </div>
  )
}
