import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

async function getOwnerTenantId(slug: string): Promise<string | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { tenant: { select: { id: true, slug: true } } },
  })
  if (!dbUser || dbUser.tenant.slug !== slug) return null
  return dbUser.tenant.id
}

const UpdateSchema = z.object({
  // İşletme bilgileri
  name: z.string().min(1).optional(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  address: z.string().optional().nullable(),
  timezone: z.string().optional(),
  // İşletme sahibi / Fatura bilgileri
  ownerName: z.string().optional().nullable(),
  ownerPhone: z.string().optional().nullable(),
  ownerEmail: z.string().email().optional().nullable(),
  ownerIdNumber: z.string().optional().nullable(),
  ownerAddress: z.string().optional().nullable(),
  ownerCity: z.string().optional().nullable(),
  taxNumber: z.string().optional().nullable(),
  taxOffice: z.string().optional().nullable(),
  onboardingCompleted: z.boolean().optional(),
})

// PATCH /api/tenants/[slug]/update
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const tenantId = await getOwnerTenantId(params.slug)
    if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
    }

    const parsed = UpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
    }

    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: parsed.data,
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PATCH /api/tenants/[slug]/update]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
