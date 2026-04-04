import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BlogForm } from '@/components/admin/BlogForm'

export default function YeniBlogPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Blog Listesi
        </Link>
        <h1 className="text-xl font-bold text-white">Yeni Blog Yazısı</h1>
      </div>
      <BlogForm mode="create" />
    </div>
  )
}
