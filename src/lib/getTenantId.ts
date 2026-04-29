import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { headers } from 'next/headers'

function extractBearerToken(authHeader: string | null): string | null {
  return authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
}

function getAuthHeaderFromRequest(request: NextRequest): string | null {
  const direct = request.headers.get('authorization')
  if (direct) return direct
  try {
    const sc = request.headers.get('x-vercel-sc-headers')
    if (sc) {
      const parsed = JSON.parse(sc)
      return parsed['Authorization'] || parsed['authorization'] || null
    }
  } catch { /* ignore */ }
  return null
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

function resolveUserFromToken(token: string): { id: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'))
    if (!payload?.sub) return null
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return { id: payload.sub }
  } catch { return null }
}

/** Cookie-based auth — also checks Authorization header (mobile Bearer token) */
export async function getTenantId(): Promise<string | null> {
  try {
    const headersList = headers()
    const authHeader = headersList.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const user = resolveUserFromToken(authHeader.slice(7))
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
  const authHeader = getAuthHeaderFromRequest(request)
  const token = extractBearerToken(authHeader)
  if (token) {
    const user = resolveUserFromToken(token)
    if (user) return userToTenantId(user.id)
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return userToTenantId(user.id)
}
