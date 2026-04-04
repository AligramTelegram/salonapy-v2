import { prisma } from '@/lib/prisma'

/**
 * Tüm tenant'ların aylık SMS kullanım sayacını sıfırlar.
 * Her ayın 1'inde çalıştırılmalıdır.
 */
export async function resetMonthlySmsUsage(): Promise<{ count: number }> {
  const result = await prisma.tenant.updateMany({
    where: { isActive: true },
    data: {
      smsUsed: 0,
      smsResetAt: new Date(),
    },
  })

  console.log(`[Cron] SMS kullanımı sıfırlandı: ${result.count} işletme`)
  return { count: result.count }
}
