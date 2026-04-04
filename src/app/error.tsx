'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8ff] p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bir şeyler ters gitti
        </h1>

        <p className="text-gray-500 mb-6 text-sm">
          Üzgünüz, beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
        </p>

        {error.digest && (
          <p className="text-xs text-gray-400 mb-4 font-mono">
            Hata kodu: {error.digest}
          </p>
        )}

        <div className="flex gap-3">
          <Button onClick={reset} className="flex-1 bg-purple-600 hover:bg-purple-700">
            Tekrar Dene
          </Button>
          <Button
            onClick={() => { window.location.href = '/' }}
            variant="outline"
            className="flex-1"
          >
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    </div>
  )
}
