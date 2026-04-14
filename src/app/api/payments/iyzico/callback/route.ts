import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { retrieveCheckoutForm, parseConversationId } from '@/lib/iyzico';

async function handleCallback(
  req: NextRequest,
  token: string | null,
  conversationIdOverride?: string | null
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;

  if (!token) {
    console.error('[Callback] Token eksik');
    return NextResponse.redirect(`${baseUrl}/odeme-basarisiz?reason=Token+bulunamad%C4%B1`);
  }

  console.log('[Callback] Token:', token);

  let result;
  try {
    result = await retrieveCheckoutForm(token);
  } catch (err) {
    console.error('[Callback] retrieveCheckoutForm error:', err);
    return NextResponse.redirect(`${baseUrl}/odeme-basarisiz?reason=Sistem+hatas%C4%B1`);
  }

  console.log('[Callback] Status:', result.status, '| PaymentStatus:', result.paymentStatus);

  if (result.status !== 'success' || result.paymentStatus !== 'SUCCESS') {
    console.error('[Callback] Ödeme başarısız:', result.errorMessage ?? result.errorCode);
    return NextResponse.redirect(
      `${baseUrl}/odeme-basarisiz?reason=${encodeURIComponent(result.errorMessage ?? 'Ödeme alınamadı')}`
    );
  }

  // conversationId: gerçek İyzico'dan result içinde gelir; mock modda URL param'dan alınır
  const rawConversationId = result.conversationId ?? conversationIdOverride;
  console.log('[Callback] ConversationId:', rawConversationId);

  const parsed = rawConversationId ? parseConversationId(rawConversationId) : null;

  if (!parsed) {
    console.error('[Callback] ConversationId parse edilemedi:', rawConversationId);
    return NextResponse.redirect(`${baseUrl}/odeme-basarisiz?reason=%C4%B0%C5%9Flem+verisi+bulunamad%C4%B1`);
  }

  const { tenantId, plan } = parsed;
  console.log('[Callback] TenantId:', tenantId, '| Plan:', plan);

  // Tenant'ı çek (slug için)
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { id: true, slug: true },
  });

  if (!tenant) {
    console.error('[Callback] Tenant bulunamadı:', tenantId);
    return NextResponse.redirect(`${baseUrl}/odeme-basarisiz?reason=%C4%B0%C5%9Fletme+bulunamad%C4%B1`);
  }

  const now = new Date();
  const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const amount = result.paidPrice ? parseFloat(result.paidPrice) : 0;
  const currency = result.currency ?? 'TRY';
  const paymentId = result.paymentId ?? null;

  try {
    await prisma.$transaction([
      // Tenant: plan ve sms güncelle
      prisma.tenant.update({
        where: { id: tenantId },
        data: {
          plan: plan as 'BASLANGIC' | 'PROFESYONEL' | 'ISLETME',
          planStartedAt: now,
          planEndsAt: endDate,
          smsUsed: 0,
          smsResetAt: now,
        },
      }),
      // Subscription: upsert ile oluştur veya güncelle
      prisma.subscription.upsert({
        where: { tenantId },
        create: {
          tenantId,
          plan: plan as 'BASLANGIC' | 'PROFESYONEL' | 'ISLETME',
          amount,
          currency,
          paymentProvider: 'iyzico',
          paymentId,
          status: 'ACTIVE',
          startDate: now,
          endDate,
          autoRenew: true,
        },
        update: {
          plan: plan as 'BASLANGIC' | 'PROFESYONEL' | 'ISLETME',
          amount,
          currency,
          paymentProvider: 'iyzico',
          paymentId,
          status: 'ACTIVE',
          startDate: now,
          endDate,
          autoRenew: true,
          updatedAt: now,
        },
      }),
    ]);

    console.log('[Callback] Tenant ve Subscription güncellendi:', tenantId, plan);
  } catch (err) {
    console.error('[Callback] DB güncelleme hatası:', err);
    return NextResponse.redirect(`${baseUrl}/odeme-basarisiz?reason=Veritaban%C4%B1+hatas%C4%B1`);
  }

  return NextResponse.redirect(`${baseUrl}/b/${tenant.slug}?upgrade_success=true`);
}

// POST — İyzico gerçek callback (form-data ile token gönderir)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const token = formData.get('token') as string | null;
    return handleCallback(req, token);
  } catch (error) {
    console.error('[Callback] POST error:', error);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;
    return NextResponse.redirect(`${baseUrl}/odeme-basarisiz?reason=Sistem+hatas%C4%B1`);
  }
}

// GET — Mock mod ve bazı gateway fallback'leri
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const cid = searchParams.get('cid'); // mock modda conversationId buradan gelir
  return handleCallback(req, token, cid ? decodeURIComponent(cid) : null);
}
