import type { AppLanguage } from './country-detect'

// ─── Hoşgeldin e-postası ──────────────────────────────────────────────────────

export function getWelcomeEmailContent(lang: AppLanguage, params: {
  ownerName: string
  tenantName: string
  slug: string
  isTrial: boolean
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hemensalon.com'
  const panelUrl = `${appUrl}/b/${params.slug}`

  const content = {
    tr: {
      subject: `Hoş geldiniz, ${params.tenantName}! Hemensalon'a başlayın`,
      heading: `Merhaba ${params.ownerName}!`,
      body: params.isTrial
        ? `${params.tenantName} işletmeniz Hemensalon'a kaydedildi. 3 günlük ücretsiz denemeniz başladı.`
        : `${params.tenantName} işletmeniz Hemensalon'a kaydedildi. Paneliniz hazır!`,
      btnLabel: 'Panele Git',
    },
    en: {
      subject: `Welcome, ${params.tenantName}! Get started with Hemensalon`,
      heading: `Hello ${params.ownerName}!`,
      body: params.isTrial
        ? `${params.tenantName} has been registered on Hemensalon. Your 3-day free trial has started.`
        : `${params.tenantName} has been registered on Hemensalon. Your dashboard is ready!`,
      btnLabel: 'Go to Dashboard',
    },
    de: {
      subject: `Willkommen, ${params.tenantName}! Starten Sie mit Hemensalon`,
      heading: `Hallo ${params.ownerName}!`,
      body: params.isTrial
        ? `${params.tenantName} wurde bei Hemensalon registriert. Ihre 3-tägige kostenlose Testphase hat begonnen.`
        : `${params.tenantName} wurde bei Hemensalon registriert. Ihr Dashboard ist bereit!`,
      btnLabel: 'Zum Dashboard',
    },
    ar: {
      subject: `مرحباً بك، ${params.tenantName}! ابدأ مع Hemensalon`,
      heading: `مرحباً ${params.ownerName}!`,
      body: params.isTrial
        ? `تم تسجيل ${params.tenantName} في Hemensalon. بدأت فترة التجربة المجانية لمدة 3 أيام.`
        : `تم تسجيل ${params.tenantName} في Hemensalon. لوحة التحكم جاهزة!`,
      btnLabel: 'الذهاب إلى لوحة التحكم',
    },
  }[lang]

  const isRTL = lang === 'ar'
  const dir = isRTL ? 'rtl' : 'ltr'

  return {
    subject: content.subject,
    html: buildEmailHtml({ ...content, panelUrl, dir, color: '#7c3aed' }),
  }
}

// ─── Deneme bitiş e-postası ───────────────────────────────────────────────────

export function getTrialEndingEmailContent(lang: AppLanguage, params: {
  ownerName: string
  tenantName: string
  slug: string
  daysLeft: number
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hemensalon.com'
  const panelUrl = `${appUrl}/b/${params.slug}`
  const days = params.daysLeft

  const content = {
    tr: {
      subject: `Deneme süreniz bitiyor — ${days} gün kaldı`,
      heading: `Merhaba ${params.ownerName}!`,
      body: `${params.tenantName} işletmenizin ${days} günlük ücretsiz deneme süresi bitiyor. Hizmetinize devam etmek için bir plan seçin.`,
      btnLabel: 'Planları İncele',
    },
    en: {
      subject: `Your trial is ending — ${days} day${days !== 1 ? 's' : ''} left`,
      heading: `Hello ${params.ownerName}!`,
      body: `Your free trial for ${params.tenantName} is ending in ${days} day${days !== 1 ? 's' : ''}. Choose a plan to continue.`,
      btnLabel: 'View Plans',
    },
    de: {
      subject: `Ihre Testphase endet — noch ${days} Tag${days !== 1 ? 'e' : ''}`,
      heading: `Hallo ${params.ownerName}!`,
      body: `Die kostenlose Testphase für ${params.tenantName} endet in ${days} Tag${days !== 1 ? 'en' : ''}. Wählen Sie einen Plan, um fortzufahren.`,
      btnLabel: 'Pläne ansehen',
    },
    ar: {
      subject: `تنتهي فترة التجربة — تبقى ${days} أيام`,
      heading: `مرحباً ${params.ownerName}!`,
      body: `تنتهي فترة التجربة المجانية لـ ${params.tenantName} خلال ${days} أيام. اختر خطة للمتابعة.`,
      btnLabel: 'عرض الخطط',
    },
  }[lang]

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return {
    subject: content.subject,
    html: buildEmailHtml({ ...content, panelUrl, dir, color: '#D97706' }),
  }
}

// ─── Personel karşılama e-postası ─────────────────────────────────────────────

export function getStaffWelcomeEmailContent(lang: AppLanguage, params: {
  staffName: string
  tenantName: string
  email: string
  password: string
  slug: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hemensalon.com'
  const panelUrl = `${appUrl}/b/${params.slug}`

  const content = {
    tr: {
      subject: `${params.staffName}, hesabınız hazır — Hemensalon`,
      heading: `Merhaba ${params.staffName}!`,
      body: `${params.tenantName} işletmesinde personel hesabınız oluşturuldu.\n\nE-posta: ${params.email}\nŞifre: ${params.password}`,
      btnLabel: 'Panele Giriş Yap',
    },
    en: {
      subject: `${params.staffName}, your account is ready — Hemensalon`,
      heading: `Hello ${params.staffName}!`,
      body: `Your staff account at ${params.tenantName} has been created.\n\nEmail: ${params.email}\nPassword: ${params.password}`,
      btnLabel: 'Login to Dashboard',
    },
    de: {
      subject: `${params.staffName}, Ihr Konto ist bereit — Hemensalon`,
      heading: `Hallo ${params.staffName}!`,
      body: `Ihr Mitarbeiterkonto bei ${params.tenantName} wurde erstellt.\n\nE-Mail: ${params.email}\nPasswort: ${params.password}`,
      btnLabel: 'Zum Dashboard anmelden',
    },
    ar: {
      subject: `${params.staffName}، حسابك جاهز — Hemensalon`,
      heading: `مرحباً ${params.staffName}!`,
      body: `تم إنشاء حساب موظفك في ${params.tenantName}.\n\nالبريد الإلكتروني: ${params.email}\nكلمة المرور: ${params.password}`,
      btnLabel: 'تسجيل الدخول إلى لوحة التحكم',
    },
  }[lang]

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return {
    subject: content.subject,
    html: buildEmailHtml({ ...content, panelUrl, dir, color: '#7c3aed' }),
  }
}

// ─── Ortak HTML builder ───────────────────────────────────────────────────────

function buildEmailHtml(params: {
  heading: string
  body: string
  btnLabel: string
  panelUrl: string
  dir: string
  color: string
}) {
  const bodyLines = params.body.split('\n').map(l => `<p style="margin:0 0 8px">${l}</p>`).join('')
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;direction:${params.dir}">
      <div style="background:${params.color};border-radius:16px 16px 0 0;padding:28px 24px;text-align:center">
        <h1 style="color:#fff;font-size:22px;margin:0;font-weight:900">Hemensalon</h1>
      </div>
      <div style="background:#fff;border-radius:0 0 16px 16px;padding:28px 24px;border:1px solid #e5e7eb;border-top:none">
        <h2 style="color:#111827;font-size:18px;font-weight:800;margin:0 0 16px">${params.heading}</h2>
        <div style="color:#4b5563;font-size:15px;line-height:1.6;margin-bottom:24px">${bodyLines}</div>
        <a href="${params.panelUrl}" style="display:inline-block;background:${params.color};color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px">${params.btnLabel}</a>
      </div>
      <p style="text-align:center;color:#9ca3af;font-size:11px;margin-top:16px">hemensalon.com</p>
    </div>
  `
}
