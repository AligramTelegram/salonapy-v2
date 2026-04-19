import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTenantId } from '@/lib/getTenantId'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

// GET /api/tenants/[slug]/invoices
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const tenant = await prisma.tenant.findFirst({
    where: { slug: params.slug, id: tenantId },
    select: { id: true },
  })
  if (!tenant) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const invoices = await prisma.invoice.findMany({
    where: { tenantId },
    orderBy: { issuedAt: 'desc' },
    select: { id: true, title: true, amount: true, issuedAt: true, pdfUrl: true },
  })

  // Her fatura için 1 saatlik signed URL üret
  const supabase = createAdminClient()
  const result = await Promise.all(
    invoices.map(async (inv) => {
      const { data } = await supabase.storage
        .from('invoices')
        .createSignedUrl(inv.pdfUrl, 3600)
      return { ...inv, downloadUrl: data?.signedUrl ?? null }
    })
  )

  return NextResponse.json({ invoices: result })
}
