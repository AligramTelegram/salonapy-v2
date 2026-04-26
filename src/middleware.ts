import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Korumalı rotalar — giriş yapmadan erişilemez
 */
const PROTECTED_PREFIXES = ['/p/', '/b/']

/**
 * Auth rotaları — giriş yapılıyken açılmaz (/giris redirect eder)
 */
const AUTH_ROUTES = ['/giris', '/kayit', '/sifremi-unuttum']

/**
 * Admin email whitelist — ADMIN_EMAILS env değişkeninden okunur
 * Örnek: ADMIN_EMAILS=admin@hemensalon.com,dev@hemensalon.com
 */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Logout sonrası kalan Supabase cookie'lerini temizle
  if (pathname === '/logout') {
    const redirectResponse = NextResponse.redirect(new URL('/giris', request.url))
    // Tüm Supabase auth cookie'lerini response'ta sil
    request.cookies.getAll().forEach((cookie) => {
      if (cookie.name.startsWith('sb-')) {
        redirectResponse.cookies.set(cookie.name, '', { maxAge: 0, path: '/' })
      }
    })
    return redirectResponse
  }

  // ── 1. Admin giriş sayfası herkese açık, diğer admin rotaları korumalı ──────
  if (pathname.startsWith('/admin') && pathname !== '/admin/giris') {
    // Supabase session kontrolü admin rotalarında ayrıca yapılır (layout'ta)
    // Burada sadece /admin/giris dışındaki rotalar için geçiş izni ver
  }

  // ── 2. Supabase session yönetimi (token refresh) ──────────────────────────
  // x-pathname'i request header'a ekle — server component'lar headers() ile okur.
  // NextResponse.next({ request: { headers } }) formatı zorunlu; response.headers.set()
  // yalnızca response header'ı ayarlar ve server component'lara ulaşmaz.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Request cookie'lerini güncelle
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          // Yeni response oluştururken requestHeaders'ı koru
          response = NextResponse.next({ request: { headers: requestHeaders } })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() hem token'ı doğrular hem de expire yakınsa refresh eder
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ── 3. Korumalı rota → giriş yoksa /giris'e yönlendir ─────────────────────
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  if (isProtected && !user) {
    const loginUrl = new URL('/giris', request.url)
    // Giriş sonrası geri dönmek için orijinal URL'yi sakla
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ── 4. Auth rotası → zaten giriş yapılmışsa panele yönlendir ──────────────
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/api/auth/redirect', request.url))
  }

  // ── 5. Slug izolasyonu için user id'yi header'a ekle ──────────────────────
  if (user) {
    response.headers.set('x-user-id', user.id)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Şu path'leri ATLA:
     *  - _next/static  (statik dosyalar)
     *  - _next/image   (image optimizasyon)
     *  - favicon.ico
     *  - public klasörü (png, jpg, svg, webp...)
     * Geri kalanı middleware'den geçir.
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
