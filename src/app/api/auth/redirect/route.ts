import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const base = request.nextUrl.origin

  if (!user) {
    return NextResponse.redirect(new URL('/giris', base))
  }

  // Staff mi?
  const staff = await prisma.staff.findUnique({
    where: { supabaseId: user.id },
    select: { slug: true },
  })
  if (staff) {
    return NextResponse.redirect(new URL(`/p/${staff.slug}`, base))
  }

  // İşletme sahibi mi?
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { tenant: { select: { slug: true } } },
  })
  if (dbUser?.tenant) {
    return NextResponse.redirect(new URL(`/b/${dbUser.tenant.slug}`, base))
  }

  return NextResponse.redirect(new URL('/giris', base))
}
