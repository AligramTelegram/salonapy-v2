import { prisma } from './prisma'

const PLAN_LIMITS: Record<string, number> = {
  BASLANGIC: 200,
  PROFESYONEL: 600,
  ISLETME: 1500,
}

/**
 * Tenant'ın SMS gönderebileceğini kontrol eder.
 * Aylık plan limiti + ek kredileri birlikte değerlendirir.
 */
export async function checkSmsLimit(tenantId: string): Promise<boolean> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { plan: true, smsUsed: true, smsCredits: true },
  })

  if (!tenant) return false

  const monthlyLimit = PLAN_LIMITS[tenant.plan] ?? 0
  const totalAvailable = monthlyLimit + (tenant.smsCredits ?? 0)

  return tenant.smsUsed < totalAvailable
}

/**
 * SMS sayacını artırır.
 * Aylık limit dolmuşsa smsCredits'ten düşer, dolmamışsa smsUsed artırır.
 */
export async function incrementSms(tenantId: string): Promise<void> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { plan: true, smsUsed: true, smsCredits: true },
  })
  if (!tenant) return

  const monthlyLimit = PLAN_LIMITS[tenant.plan] ?? 0

  if (tenant.smsUsed < monthlyLimit) {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { smsUsed: { increment: 1 } },
    })
  } else if ((tenant.smsCredits ?? 0) > 0) {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { smsCredits: { decrement: 1 } },
    })
  }
}
