'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function StaffError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Personel Paneli] Error:', error)
  }, [error])

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 max-w-sm w-full text-center">
        <div className="mb-4 flex justify-center">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="w-7 h-7 text-red-600" />
          </div>
        </div>
        <h2 className="text-base font-bold text-gray-900 mb-2">Bir hata oluştu</h2>
        <p className="text-gray-500 text-sm mb-5">
          Personel panelinde bir sorun oluştu. Lütfen tekrar deneyin.
        </p>
        <Button onClick={reset} className="w-full bg-purple-600 hover:bg-purple-700">
          Tekrar Dene
        </Button>
      </div>
    </div>
  )
}
