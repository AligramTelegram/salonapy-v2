import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminSecret } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

// DELETE /api/admin/invoices/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = verifyAdminSecret(request)
  if (authError) return authError

  const invoice = await prisma.invoice.findUnique({ where: { id: params.id } })
  if (!invoice) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const supabase = createAdminClient()
  await supabase.storage.from('invoices').remove([invoice.pdfUrl])
  await prisma.invoice.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}
