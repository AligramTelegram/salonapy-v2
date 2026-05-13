import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { headers } from 'next/headers'

function decodeJwtSub(token: string): string | null {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
    return payload?.sub ?? null
  } catch { return null }
}

async function tenantIdFromUserId(userId: string): Promise<string | null> {
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

/** Cookie-based (web) + x-mobile-token header (mobile) */
export async function getTenantId(): Promise<string | null> {
  try {
    const h = headers()
    const token = h.get('x-mobile-token')
    if (token) {
      const sub = decodeJwtSub(token)
      if (sub) return tenantIdFromUserId(sub)
    }
  } catch { /* outside request context */ }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return tenantIdFromUserId(user.id)
}

/** Preferred in API route handlers */
export async function getTenantIdFromRequest(request: NextRequest): Promise<string | null> {
  const token = request.headers.get('x-mobile-token')
  if (token) {
    const sub = decodeJwtSub(token)
    if (sub) return tenantIdFromUserId(sub)
  }
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return tenantIdFromUserId(user.id)
}

/** For staff-specific routes: resolves authenticated staff from x-mobile-token header or cookie */
export async function getAuthenticatedStaffFromRequest(
  request: NextRequest
): Promise<{ id: string; tenantId: string } | null> {
  let userId: string | null = null

  const token = request.headers.get('x-mobile-token')
  if (token) {
    userId = decodeJwtSub(token)
  }

  if (!userId) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    userId = user?.id ?? null
  }

  if (!userId) return null

  return prisma.staff.findUnique({
    where: { supabaseId: userId },
    select: { id: true, tenantId: true },
  })
}
