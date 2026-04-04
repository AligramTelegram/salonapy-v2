'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function OdemeBasarisizContent() {
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')

  const errorMessages: Record<string, string> = {
    'no-token': 'Ödeme oturumu bulunamadı.',
    'payment-failed': 'Ödeme işlemi başarısız oldu.',
    'invalid-conversation': 'Ödeme oturumu geçersiz.',
    'tenant-not-found': 'İşletme hesabı bulunamadı.',
  }
  const errorMessage = (reason && errorMessages[reason]) ?? 'Ödeme işlemi tamamlanamadı.'

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Failure card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
          {/* Icon */}
          <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ödeme Başarısız
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            {errorMessage}
          </p>

          {/* Error detail */}
          {reason && (
            <div className="bg-red-50 rounded-xl p-3 mb-6 border border-red-100">
              <p className="text-xs font-mono text-red-400">{reason}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Tekrar Dene
            </button>
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3 px-6 rounded-xl transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>

        {/* Support note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Yardım için:{' '}
          <a href="mailto:destek@salonapy.com" className="text-purple-600 hover:underline">
            destek@salonapy.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default function OdemeBasarisizPage() {
  return (
    <Suspense>
      <OdemeBasarisizContent />
    </Suspense>
  )
}
