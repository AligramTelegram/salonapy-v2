'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock } from 'lucide-react'
import { getAllPosts, formatDate } from '@/lib/blog'

export function BlogPreview() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <section className="py-24 md:py-32">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
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
        </motion.div>

        {/* Posts */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-purple-100/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100/40"
              >
                {/* Cover */}
                <div
                  className={`h-40 w-full bg-gradient-to-br ${post.coverGradient}`}
                />

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center gap-3 text-xs text-gray-400">
                    <span>{formatDate(post.date)}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime} dk
                    </span>
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
