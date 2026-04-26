import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { parseISO, startOfMonth, endOfMonth, format } from 'date-fns'
import { tr } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

async function getOwnerTenantId(): Promise<string | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { tenantId: true },
  })
  return dbUser?.tenantId ?? null
}

const STATUS_LABELS: Record<string, string> = {
  BEKLIYOR: 'Bekliyor',
  ONAYLANDI: 'Onaylandı',
  TAMAMLANDI: 'Tamamlandı',
  IPTAL: 'İptal',
  GELMEDI: 'Gelmedi',
}

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

// GET /api/reports/export?startDate=2025-01-01&endDate=2025-01-31
export async function GET(request: NextRequest) {
  try {
    const tenantId = await getOwnerTenantId()
    if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const { searchParams } = request.nextUrl
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    const today = new Date()
    const startDate = startDateParam ? parseISO(startDateParam) : startOfMonth(today)
    const endDate = endDateParam ? parseISO(endDateParam) : endOfMonth(today)

    const appointments = await prisma.appointment.findMany({
      where: {
        tenantId,
        date: { gte: startDate, lte: endDate },
      },
      include: {
        service: { select: { name: true } },
        staff: { select: { name: true } },
        customer: { select: { name: true, phone: true } },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    })

    // Transaction (finans) hareketlerini çek
    // 'Randevu' kategorisi appointment tamamlandığında otomatik oluşur ve
    // zaten yukarıdaki appointment satırlarında gösterilir — hariç tut.
    const transactions = await prisma.transaction.findMany({
      where: {
        tenantId,
        date: { gte: startDate, lte: endDate },
        NOT: { category: 'Randevu' },
      },
      orderBy: [{ date: 'asc' }],
    })

    // CSV başlıkları
    const headers = [
      'Tür',
      'Tarih',
      'Saat Başlangıç',
      'Saat Bitiş',
      'Müşteri',
      'Telefon',
      'Hizmet/Kategori',
      'Personel',
      'Durum/Açıklama',
      'Tutar (₺)',
    ]

    // Randevu satırları
    const appointmentRows = appointments.map((a) => [
      'Randevu',
      format(new Date(a.date), 'd MMMM yyyy', { locale: tr }),
      a.startTime,
      a.endTime,
      a.customer?.name ?? a.guestName ?? 'Misafir',
      a.customer?.phone ?? a.guestPhone ?? '',
      a.service.name,
      a.staff.name,
      STATUS_LABELS[a.status] ?? a.status,
      a.price.toFixed(2),
    ])

    // Transaction satırları (Tüm GELIR ve GIDER kategorileri dinamik)
    const transactionRows = transactions.map((t) => [
      t.type === 'GELIR' ? 'Gelir' : 'Gider',
      format(new Date(t.date), 'd MMMM yyyy', { locale: tr }),
      '', // Saat Başlangıç
      '', // Saat Bitiş
      '', // Müşteri
      '', // Telefon
      t.category,
      '', // Personel
      t.description || '',
      t.amount.toFixed(2),
    ])

    // Tüm satırları birleştirip tarihe göre sırala
    const allRows = [...appointmentRows, ...transactionRows]
    allRows.sort((a, b) => {
      // Tarih karşılaştırması (2. kolon)
      const d1 = new Date(a[1].split(' ').reverse().join('-'))
      const d2 = new Date(b[1].split(' ').reverse().join('-'))
      return d1.getTime() - d2.getTime()
    })

    const csvLines = [
      headers.map(escapeCsvField).join(','),
      ...allRows.map((row) => row.map(escapeCsvField).join(',')),
    ]

    // BOM prefix for Turkish character support in Excel
    const csv = '\uFEFF' + csvLines.join('\r\n')
    const filename = `raporlar-${format(startDate, 'yyyy-MM-dd')}-${format(endDate, 'yyyy-MM-dd')}.csv`

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error('[GET /api/reports/export]', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
