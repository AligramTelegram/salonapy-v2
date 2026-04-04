import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils/generateSlug'
import { z } from 'zod'
import { sendStaffWelcomeEmail } from '@/lib/resend'

export const dynamic = 'force-dynamic'

const CreateStaffSchema = z.object({
  name: z.string().min(2, 'Ad Soyad zorunlu'),
  email: z.string().email('Geçerli email girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter'),
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

async function getOwnerTenant(): Promise<{ id: string; name: string; slug: string } | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { tenant: { select: { id: true, name: true, slug: true } } },
  })
  return dbUser?.tenant ?? null
}

export async function POST(request: NextRequest) {
  const tenant = await getOwnerTenant()
  if (!tenant) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  const tenantId = tenant.id

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

  const { name, email, password, phone, title, color, serviceIds, workHours } = parsed.data

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

    // Send staff welcome email (fire-and-forget)
    sendStaffWelcomeEmail({
      to: email,
      staffName: name,
      tenantName: tenant.name,
      slug: tenant.slug,
      email,
      password,
    }).catch((err) => console.error('[staff/create] Welcome email failed:', err))

    return NextResponse.json(staff, { status: 201 })
  } catch (err) {
    // Prisma hatası durumunda Supabase Auth kullanıcısını temizle
    await adminSupabase.auth.admin.deleteUser(authData.user.id)
    console.error('Staff create error:', err)
    return NextResponse.json({ error: 'Çalışan kaydedilemedi' }, { status: 500 })
  }
}
