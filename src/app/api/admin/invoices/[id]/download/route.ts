import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const invoice = await prisma.invoice.findUnique({ where: { id: params.id } })
  if (!invoice) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const supabase = createAdminClient()
  const { data } = await supabase.storage.from('invoices').createSignedUrl(invoice.pdfUrl, 3600)

  return NextResponse.json({ url: data?.signedUrl ?? null })
}
