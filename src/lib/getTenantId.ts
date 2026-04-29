import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { headers } from 'next/headers'

async function userToTenantId(userId: string): Promise<string | null> {
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: userId },
    select: { tenantId: true },
  })
  if (dbUser) return dbUser.tenantId

  const staff = await prisma.staff.findUnique({
    where: { supabaseId: userId },
    select: { tenantId: true },
  })
  return staff?.tenantId ?? null
}

async function resolveUserFromToken(token: string): Promise<{ id: string } | null> {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const { data } = await supabase.auth.getUser(token)
  return data.user
}

/** Cookie-based auth — also checks Authorization header via next/headers (works in all route handlers) */
export async function getTenantId(): Promise<string | null> {
  // Check Authorization header (mobile Bearer token)
  try {
    const headersList = headers()
    const authHeader = headersList.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7)
      const user = await resolveUserFromToken(token)
      if (user) return userToTenantId(user.id)
    }
  } catch {
    // headers() may throw outside request context — fall through
  }

  // Fall back to cookie-based auth (web)
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return userToTenantId(user.id)
}

/** Explicit request-based auth — preferred when request object is available */
export async function getTenantIdFromRequest(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const user = await resolveUserFromToken(token)
    if (user) return userToTenantId(user.id)
  }

  // Fall back to cookie-based auth
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return userToTenantId(user.id)
}
