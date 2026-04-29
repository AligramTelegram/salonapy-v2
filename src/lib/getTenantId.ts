import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

async function resolveUser(token: string | null): Promise<{ id: string } | null> {
  if (token) {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data } = await supabase.auth.getUser(token)
    if (data.user) return data.user
  }
  // Fall back to cookie-based auth
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

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

/** Cookie-based auth (web panels) */
export async function getTenantId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return userToTenantId(user.id)
}

/** Bearer token or cookie auth — use in API routes that serve both web and mobile */
export async function getTenantIdFromRequest(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  const user = await resolveUser(token)
  if (!user) return null
  return userToTenantId(user.id)
}
