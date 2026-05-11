import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils/generateSlug'
import { z } from 'zod'
import { sendSms } from '@/lib/netgsm'
import { isTurkishPhone, detectLanguageFromPhone } from '@/lib/country-detect'
import { getStaffWelcomeEmailContent } from '@/lib/email-i18n'
import { Resend } from 'resend'
import { getLimit } from '@/lib/plan-features'
import { checkSubscription } from '@/lib/checkSubscription'
import { getTenantIdFromRequest } from '@/lib/getTenantId'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const CreateStaffSchema = z.object({
  name: z.string().min(2, 'Ad Soyad zorunlu'),
  email: z.string().email('Geçerli email girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter').optional(),
  phone: z.string().optional(),
  title: z.string().optional(),
  color: z.string().default('#7c3aed'),
  serviceIds: z.array(z.string()).optional(),
  workHours: z
    .array(
      z.object({
        dayOfWeek: z.number().int().min(0).max(6),
        startTime: z.string(),
        endTime: z.string(),
        isWorking: z.boolean(),
      })
    )
    .optional(),
})

export async function POST(request: NextRequest) {
  const tenantId = await getTenantIdFromRequest(request)
  if (!tenantId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { id: true, name: true, slug: true, plan: true },
  })
  if (!tenant) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  try {
    await checkSubscription(tenantId)
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'SUBSCRIPTION_REQUIRED') {
      return NextResponse.json({ error: 'Paket yükseltmesi gerekli' }, { status: 402 })
    }
    throw e
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const parsed = CreateStaffSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { name, email, phone, title, color, serviceIds, workHours } = parsed.data
  const password = parsed.data.password ?? Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase() + '!'

  // Plan limiti kontrolü
  const maxStaff = getLimit(tenant.plan, 'maxStaff')
  const currentStaffCount = await prisma.staff.count({ where: { tenantId, isActive: true } })
  if (currentStaffCount >= maxStaff) {
    return NextResponse.json(
      { error: `${tenant.plan === 'BASLANGIC' ? 'Başlangıç' : tenant.plan === 'PROFESYONEL' ? 'Profesyonel' : 'İşletme'} paketinde en fazla ${maxStaff} çalışan ekleyebilirsiniz. Daha fazlası için paketinizi yükseltin.` },
      { status: 403 }
    )
  }

  // Email çakışma kontrolü
  const existing = await prisma.staff.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Bu email adresi zaten kullanılıyor' }, { status: 409 })
  }

  // 1. Supabase Auth kullanıcısı oluştur (admin client gerekir)
  const adminSupabase = createAdminClient()
  const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: 'STAFF',
      name,
    },
  })

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: authError?.message ?? 'Auth kullanıcısı oluşturulamadı' },
      { status: 500 }
    )
  }

  // 2. Benzersiz slug oluştur
  let slug = generateSlug(name)
  // Çakışma varsa tekrar dene
  let slugExists = await prisma.staff.findUnique({ where: { slug } })
  let attempts = 0
  while (slugExists && attempts < 5) {
    slug = generateSlug(name)
    slugExists = await prisma.staff.findUnique({ where: { slug } })
    attempts++
  }

  // 3. Staff kaydı oluştur
  try {
    const staff = await prisma.staff.create({
      data: {
        tenantId,
        supabaseId: authData.user.id,
        name,
        email,
        phone,
        title,
        color,
        slug,
        ...(serviceIds?.length
          ? { services: { connect: serviceIds.map((id) => ({ id })) } }
          : {}),
        ...(workHours?.length
          ? {
              workHours: {
                create: workHours.map((wh) => ({
                  dayOfWeek: wh.dayOfWeek,
                  startTime: wh.startTime,
                  endTime: wh.endTime,
                  isWorking: wh.isWorking,
                })),
              },
            }
          : {}),
      },
      include: {
        services: { select: { id: true, name: true } },
        workHours: true,
      },
    })

    // Giriş bilgilerini SMS ile gönder — sadece Türkiye numarası için
    if (phone && isTurkishPhone(phone)) {
      sendSms({
        phone,
        message: `Hemensalon personel girisi: E-posta: ${email} Sifre: ${password} Uygulama: hemensalon.com`,
      }).catch((err) => console.error('[staff/create] SMS failed:', err))
    }

    // Personel hoşgeldin e-postası — dile göre içerik
    const lang = detectLanguageFromPhone(phone)
    if (process.env.RESEND_API_KEY) {
      const { subject, html } = getStaffWelcomeEmailContent(lang, {
        staffName: name,
        tenantName: tenant.name,
        slug: tenant.slug,
        email,
        password,
      })
      const resend = new Resend(process.env.RESEND_API_KEY)
      resend.emails.send({ from: 'Hemensalon <noreply@hemensalon.com>', to: email, subject, html })
        .catch((err: unknown) => console.error('[staff/create] Welcome email failed:', err))
    }

    return NextResponse.json(staff, { status: 201 })
  } catch (err) {
    // Prisma hatası durumunda Supabase Auth kullanıcısını temizle
    await adminSupabase.auth.admin.deleteUser(authData.user.id)
    console.error('Staff create error:', err)
    return NextResponse.json({ error: 'Çalışan kaydedilemedi' }, { status: 500 })
  }
}
