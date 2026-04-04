import { NextRequest, NextResponse } from 'next/server'

/**
 * Verifies the ADMIN_SECRET_KEY header for admin API routes.
 * Falls back to allowing the request if the key is not configured (dev convenience).
 * IP restriction is handled in middleware.
 */
export function verifyAdminSecret(request: NextRequest): NextResponse | null {
  const secretKey = process.env.ADMIN_SECRET_KEY
  if (!secretKey) return null // Not configured — allow (dev mode)

  const incoming = request.headers.get('x-admin-secret')
  if (!incoming || incoming !== secretKey) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }
  return null
}
