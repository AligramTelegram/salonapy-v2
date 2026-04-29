import { NextRequest, NextResponse } from 'next/server'
import { getTenantIdFromRequest } from '@/lib/getTenantId'
import { prisma } from '@/lib/prisma'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const { data, error } = await supabase.auth.getUser(token)
  console.log('getUser result:', JSON.stringify({ userId: data.user?.id, error: error?.message }))
  if (error || !data.user) return NextResponse.json({ error: error?.message || 'user null' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: data.user.id },
    select: {
      name: true,
      role: true,
      tenant: { select: { slug: true, name: true, plan: true, phone: true, email: true } },
    },
  })

  if (!dbUser) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })

  return NextResponse.json({ user: { ...dbUser, email: data.user.email } })
}
