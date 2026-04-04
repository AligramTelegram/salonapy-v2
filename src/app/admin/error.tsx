'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Admin] Error:', error)
  }, [error])

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
        <div className="mb-5 flex justify-center">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Admin Paneli Hatası</h2>
        <p className="text-gray-500 text-sm mb-6">
          Admin panelinde beklenmeyen bir sorun oluştu.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-400 mb-4 font-mono">Kod: {error.digest}</p>
        )}
        <Button onClick={reset} className="w-full bg-purple-600 hover:bg-purple-700">
          Tekrar Dene
        </Button>
      </div>
    </div>
  )
}
