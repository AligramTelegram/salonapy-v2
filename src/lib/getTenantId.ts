import { createClient } from '@/lib/supabase/server'
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
  })
  if (!res.ok) return null
  const data = await res.json()
  return data?.id ? { id: data.id } : null
}

/** Cookie-based auth — also checks Authorization header (mobile Bearer token) */
export async function getTenantId(): Promise<string | null> {
  try {
    const headersList = headers()
    const authHeader = headersList.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const user = await resolveUserFromToken(authHeader.slice(7))
      if (user) return userToTenantId(user.id)
    }
  } catch { /* outside request context */ }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return userToTenantId(user.id)
}

/** Request-based auth — preferred in API route handlers */
export async function getTenantIdFromRequest(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const user = await resolveUserFromToken(authHeader.slice(7))
    if (user) return userToTenantId(user.id)
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return userToTenantId(user.id)
}
