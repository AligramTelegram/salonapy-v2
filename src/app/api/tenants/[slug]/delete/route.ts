import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

async function getOwnerTenant(slug: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { tenant: { select: { id: true, slug: true, name: true, isActive: true } } },
  })
  if (!dbUser || dbUser.tenant.slug !== slug) return null
  return { tenant: dbUser.tenant, userId: user.id }
}

const DeleteSchema = z.object({
  confirmName: z.string().min(1),
})

// DELETE /api/tenants/[slug]/delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const result = await getOwnerTenant(params.slug)
    if (!result) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const { tenant } = result

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
    }

    const parsed = DeleteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
    }

    if (parsed.data.confirmName.trim() !== tenant.name) {
      return NextResponse.json(
        { error: 'İşletme adı eşleşmiyor. Lütfen doğru adı girin.' },
        { status: 400 }
      )
    }

    // Soft delete — set isActive = false
    await prisma.tenant.update({
      where: { id: tenant.id },
      data: { isActive: false },
    })

    // Sign out
    const supabase = createClient()
    await supabase.auth.signOut()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/tenants/[slug]/delete]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
