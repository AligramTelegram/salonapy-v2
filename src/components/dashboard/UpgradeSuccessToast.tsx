'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

/**
 * Ödeme başarılı sayfasından gelen ?upgrade_success=true parametresini
 * okuyup başarı toastı gösterir. Dashboard'a Suspense içinde eklenmeli.
 */
export function UpgradeSuccessToast() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('upgrade_success') === 'true') {
      toast.success('Paket yükseltme başarılı! Tüm özellikler aktif.')
    }
  }, [searchParams])

  return null
}
