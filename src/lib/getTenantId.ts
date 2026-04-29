import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

/**
 * Returns the tenantId for the currently authenticated user.
 * Checks both the User table (owners/admins) and the Staff table (staff members).
 * Supports both cookie-based (web) and Bearer token (mobile) auth.
 */
export async function getTenantId(): Promise<string | null> {
  let user: { id: string } | null = null

  // Try Bearer token from Authorization header (mobile app)
  const headersList = headers()
  const authHeader = headersList.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data } = await supabase.auth.getUser(token)
    user = data.user
  }

  // Fall back to cookie-based auth (web)
  if (!user) {
    const supabase = createClient()
    const { data: { user: u } } = await supabase.auth.getUser()
    user = u
  }

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
