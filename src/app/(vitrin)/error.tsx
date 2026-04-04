'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function VitrinError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Vitrin] Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8ff] p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Sayfa yüklenemedi</h1>
        <p className="text-gray-500 text-sm mb-6">
          Sayfa yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <div className="flex gap-3">
          <Button onClick={reset} className="flex-1 bg-purple-600 hover:bg-purple-700">
            Tekrar Dene
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/">Ana Sayfa</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
