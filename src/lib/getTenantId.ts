import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

/**
 * Returns the tenantId for the currently authenticated user.
 * Checks both the User table (owners/admins) and the Staff table (staff members).
 */
export async function getTenantId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Check User table first (owners/admins)
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { tenantId: true },
  })
  if (dbUser) return dbUser.tenantId

  // Fall back to Staff table (staff members with their own Supabase account)
  const staff = await prisma.staff.findUnique({
    where: { supabaseId: user.id },
    select: { tenantId: true },
  })
  return staff?.tenantId ?? null
}
