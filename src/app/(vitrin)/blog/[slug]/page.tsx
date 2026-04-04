export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function BlogDetailPage({ params: _params }: PageProps) {
  notFound()
}
