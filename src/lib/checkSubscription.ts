import { prisma } from '@/lib/prisma'

/**
 * Trial süresi veya aktif abonelik kontrolü.
 * Trial süresi dolmuş ve aktif abonelik yoksa SUBSCRIPTION_REQUIRED hatası fırlatır.
 * API route'larında POST/PUT/DELETE işlemlerinden önce çağrılmalıdır.
 */
export async function checkSubscription(tenantId: string): Promise<void> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      subscription: {
        select: {
          status: true,
          endDate: true,
        },
      },
    },
  })

  if (!tenant) throw new Error('SUBSCRIPTION_REQUIRED')

  const sub = tenant.subscription
  const now = new Date()
  const isTrialActive =
    sub?.status === 'TRIAL' && sub.endDate != null && new Date(sub.endDate) > now
  const hasActiveSubscription = sub?.status === 'ACTIVE'

  if (!isTrialActive && !hasActiveSubscription) {
    throw new Error('SUBSCRIPTION_REQUIRED')
  }
}
