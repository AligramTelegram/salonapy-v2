import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const PROTECTED_PREFIXES = ['/p/', '/b/']
const AUTH_ROUTES = ['/giris', '/kayit', '/sifremi-unuttum']

// Bu prefix'ler locale routing'e tabi DEĞİL
const BYPASS_LOCALE = ['/p/', '/b/', '/api/', '/admin/', '/_next/', '/favicon', '/icons/', '/images/', '/manifest', '/account-deletion']

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Logout
  if (pathname === '/logout') {
    const redirectResponse = NextResponse.redirect(new URL('/tr', request.url))
    request.cookies.getAll().forEach((cookie) => {
      if (cookie.name.startsWith('sb-')) {
        redirectResponse.cookies.set(cookie.name, '', { maxAge: 0, path: '/' })
      }
    })
    return redirectResponse
  }

  // Locale routing bypass — uygulama ve API rotaları
  const shouldBypass = BYPASS_LOCALE.some((prefix) => pathname.startsWith(prefix))
  if (!shouldBypass) {
    // Auth rotaları artık / ye yönleniyor (web pivot), locale routing yapsın
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/tr', request.url))
    }

    // Vitrin rotaları için next-intl middleware
    return intlMiddleware(request)
  }

  // ── Uygulama rotaları: Supabase session yönetimi ──────────────────────────
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)
  const authHeader = request.headers.get('authorization')
  if (authHeader) requestHeaders.set('authorization', authHeader)

  let response = NextResponse.next({ request: { headers: requestHeaders } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request: { headers: requestHeaders } })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  if (isProtected && !user) {
    const loginUrl = new URL('/tr', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (user) {
    response.headers.set('x-user-id', user.id)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
