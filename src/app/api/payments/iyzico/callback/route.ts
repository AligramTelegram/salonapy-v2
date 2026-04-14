import { NextRequest, NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';
import { prisma } from '@/lib/prisma';

const iyzico = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY!,
  secretKey: process.env.IYZICO_SECRET_KEY!,
  uri: process.env.IYZICO_BASE_URL!
});

export async function POST(req: NextRequest) {
  try {
    console.log('İyzico callback triggered');
    
    const formData = await req.formData();
    const token = formData.get('token') as string;
    
    console.log('Token:', token);
    
    if (!token) {
      return NextResponse.redirect(
        new URL('/odeme-basarisiz?reason=Token+bulunamadı', req.url)
      );
    }
    
    // İyzico'dan ödeme sonucunu çek
    const result: any = await new Promise((resolve, reject) => {
      iyzico.checkoutForm.retrieve({ token }, (err, result) => {
        if (err) {
          console.error('İyzico retrieve error:', err);
          reject(err);
        } else {
          console.log('İyzico result:', result);
          resolve(result);
        }
      });
    });
    
    if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
      // Transaction bul - DÜZELTİLMİŞ YÖNTEM
      const allTransactions = await prisma.transaction.findMany({
        where: {
          status: 'PENDING'
        },
        include: { tenant: true }
      });

      const transaction = allTransactions.find(t => {
        if (!t.metadata || typeof t.metadata !== 'object') return false;
        const meta = t.metadata as Record<string, any>;
        return meta.iyzicoToken === token;
      });
      
      if (!transaction) {
        console.error('Transaction not found for token:', token);
        return NextResponse.redirect(
          new URL('/odeme-basarisiz?reason=Transaction+bulunamadı', req.url)
        );
      }
      
      console.log('Transaction found:', transaction.id);
      
      // Transaction güncelle
      const currentMeta = transaction.metadata as Record<string, any> || {};
      
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'COMPLETED',
          metadata: {
            ...currentMeta,
            iyzicoPaymentId: result.paymentId
          }
        }
      });
      
      // Tenant güncelle
      const newPlan = currentMeta.plan as string;
      
      await prisma.tenant.update({
        where: { id: transaction.tenantId },
        data: {
          plan: newPlan,
          subscriptionStatus: 'ACTIVE',
          subscriptionStartedAt: new Date(),
          subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          smsUsed: 0,
          smsResetAt: new Date()
        }
      });
      
      console.log('Tenant updated successfully');
      
      // Başarılı sayfaya yönlendir
      return NextResponse.redirect(
        new URL(`/b/${transaction.tenant.slug}?upgrade_success=true`, req.url)
      );
      
    } else {
      // Ödeme başarısız
      console.error('İyzico payment failed:', result);
      
      return NextResponse.redirect(
        new URL('/odeme-basarisiz?reason=Ödeme+alınamadı', req.url)
      );
    }
    
  } catch (error) {
    console.error('Callback error:', error);
    
    return NextResponse.redirect(
      new URL('/odeme-basarisiz?reason=Sistem+hatası', req.url)
    );
  }
}

// GET method (İyzico bazen GET kullanabilir)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  
  if (token) {
    // FormData oluştur ve POST'a yönlendir
    const formData = new FormData();
    formData.append('token', token);
    
    // POST metodunu çağır
    return POST(req);
  }
  
  return NextResponse.redirect(
    new URL('/odeme-basarisiz?reason=Token+eksik', req.url)
  );
}