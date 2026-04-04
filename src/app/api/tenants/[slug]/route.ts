import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getOwnerTenant(slug: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { tenant: true },
  })
  if (!dbUser || dbUser.tenant.slug !== slug) return null
  return dbUser.tenant
}

// GET /api/tenants/[slug]
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const tenant = await getOwnerTenant(params.slug)
    if (!tenant) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    return NextResponse.json(tenant)
  } catch (err) {
    console.error('[GET /api/tenants/[slug]]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
