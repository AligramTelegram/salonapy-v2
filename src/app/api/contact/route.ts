import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'

const contactSchema = z.object({
  name: z.string().min(2, 'Ad Soyad en az 2 karakter olmalı').max(100),
  email: z.string().email('Geçerli bir email girin').max(255),
  phone: z.string().max(20).optional(),
  subject: z.enum(['satis', 'destek', 'diger']),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalı').max(2000),
})

const SUBJECT_LABELS: Record<string, string> = {
  satis: 'Satış',
  destek: 'Destek',
  diger: 'Diğer',
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Geçersiz form verisi', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { name, email, phone, subject, message } = parsed.data

    // Save to database
    await prisma.contactMessage.create({
      data: { name, email, phone: phone ?? null, subject, message },
    })

    // Send via Resend if configured
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Salonapy <noreply@salonapy.com>',
        to: 'destek@salonapy.com',
        replyTo: email,
        subject: `İletişim: ${SUBJECT_LABELS[subject] ?? subject} — ${name}`,
        html: `
          <h2>Yeni İletişim Formu</h2>
          <p><strong>Ad Soyad:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone ?? '-'}</p>
          <p><strong>Konu:</strong> ${SUBJECT_LABELS[subject] ?? subject}</p>
          <hr/>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/contact]', err)
    return NextResponse.json({ error: 'Bir hata oluştu, lütfen tekrar deneyin' }, { status: 500 })
  }
}
