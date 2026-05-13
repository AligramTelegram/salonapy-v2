// Appointment reminder email — sent 24h or 1h before appointment

export type EmailLocale = 'tr' | 'en' | 'de' | 'ar'
export type ReminderType = '24h' | '1h'

const STRINGS: Record<EmailLocale, {
  badge: (type: ReminderType) => string
  title: (type: ReminderType) => string
  greeting: (name: string) => string
  body: (type: ReminderType, time: string, tenant: string) => string
  timeLabel: string
  serviceLabel: string
  staffLabel: string
  contactLabel: string
  note: string
}> = {
  tr: {
    badge: (t) => t === '24h' ? '⏰ Yarın Randevunuz Var' : '🔔 1 Saat Kaldı!',
    title: (t) => t === '24h' ? 'Randevu Hatırlatması' : 'Az Kaldı!',
    greeting: (name) => `Merhaba <strong style="color:#111827;">${name}</strong> 👋`,
    body: (t, time, tenant) =>
      t === '24h'
        ? `Yarın saat <strong>${time}</strong> itibarıyla <strong>${tenant}</strong> salonunda randevunuz bulunmaktadır. Randevunuzu kaçırmamak için bu mesajı aldığınızda hazırlıklarınıza başlayabilirsiniz.`
        : `<strong>${tenant}</strong> salonundaki randevunuza <strong>1 saat</strong> kaldı. Sizi bekliyoruz!`,
    timeLabel: 'Randevu Saati',
    serviceLabel: 'Hizmet',
    staffLabel: 'Uzman',
    contactLabel: 'İşletme İletişim',
    note: 'İptal veya değişiklik için lütfen işletmeyle iletişime geçin.',
  },
  en: {
    badge: (t) => t === '24h' ? '⏰ Appointment Tomorrow' : '🔔 1 Hour to Go!',
    title: (t) => t === '24h' ? 'Appointment Reminder' : 'Almost Time!',
    greeting: (name) => `Hello <strong style="color:#111827;">${name}</strong> 👋`,
    body: (t, time, tenant) =>
      t === '24h'
        ? `You have an appointment at <strong>${tenant}</strong> tomorrow at <strong>${time}</strong>. We look forward to seeing you!`
        : `Your appointment at <strong>${tenant}</strong> is in <strong>1 hour</strong>. See you soon!`,
    timeLabel: 'Appointment Time',
    serviceLabel: 'Service',
    staffLabel: 'Staff',
    contactLabel: 'Business Contact',
    note: 'Please contact the business to cancel or reschedule.',
  },
  de: {
    badge: (t) => t === '24h' ? '⏰ Termin Morgen' : '🔔 Noch 1 Stunde!',
    title: (t) => t === '24h' ? 'Terminerinnerung' : 'Gleich ist es soweit!',
    greeting: (name) => `Hallo <strong style="color:#111827;">${name}</strong> 👋`,
    body: (t, time, tenant) =>
      t === '24h'
        ? `Morgen um <strong>${time}</strong> Uhr haben Sie einen Termin bei <strong>${tenant}</strong>. Wir freuen uns auf Sie!`
        : `Ihr Termin bei <strong>${tenant}</strong> beginnt in <strong>1 Stunde</strong>. Bis gleich!`,
    timeLabel: 'Terminzeit',
    serviceLabel: 'Dienstleistung',
    staffLabel: 'Mitarbeiter',
    contactLabel: 'Geschäftskontakt',
    note: 'Bitte kontaktieren Sie das Unternehmen für Absagen oder Änderungen.',
  },
  ar: {
    badge: (t) => t === '24h' ? '⏰ موعدك غداً' : '🔔 ساعة واحدة فقط!',
    title: (t) => t === '24h' ? 'تذكير بالموعد' : 'اقترب وقت موعدك!',
    greeting: (name) => `مرحباً <strong style="color:#111827;">${name}</strong> 👋`,
    body: (t, time, tenant) =>
      t === '24h'
        ? `لديك موعد غداً الساعة <strong>${time}</strong> في <strong>${tenant}</strong>. نتطلع إلى رؤيتك!`
        : `موعدك في <strong>${tenant}</strong> بعد <strong>ساعة واحدة</strong>. نراك قريباً!`,
    timeLabel: 'وقت الموعد',
    serviceLabel: 'الخدمة',
    staffLabel: 'الموظف',
    contactLabel: 'تواصل مع النشاط',
    note: 'يرجى التواصل مع النشاط التجاري للإلغاء أو التعديل.',
  },
}

const ACCENT: Record<ReminderType, { gradient: string; color: string; light: string; border: string }> = {
  '24h': {
    gradient: 'linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#ec4899 100%)',
    color: '#7c3aed',
    light: '#faf5ff',
    border: '#e9d5ff',
  },
  '1h': {
    gradient: 'linear-gradient(135deg,#ea580c 0%,#f97316 50%,#fbbf24 100%)',
    color: '#ea580c',
    light: '#fff7ed',
    border: '#fed7aa',
  },
}

export interface AppointmentReminderProps {
  customerName: string
  serviceName: string
  staffName: string
  date: string
  startTime: string
  endTime: string
  tenantName: string
  tenantPhone?: string
  tenantEmail?: string
  locale?: EmailLocale
  reminderType: ReminderType
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://hemensalon.com'

export function renderAppointmentReminder(props: AppointmentReminderProps): string {
  const {
    customerName,
    serviceName,
    staffName,
    date,
    startTime,
    endTime,
    tenantName,
    tenantPhone,
    tenantEmail,
    locale = 'tr',
    reminderType,
  } = props

  const s = STRINGS[locale]
  const a = ACCENT[reminderType]
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${s.title(reminderType)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ff;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ff;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <a href="${APP_URL}" style="text-decoration:none;">
                <span style="font-size:22px;font-weight:800;color:#7c3aed;letter-spacing:-0.5px;">hemen<span style="color:#111827;">salon</span></span>
              </a>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(124,58,237,0.10);">

              <!-- Hero -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:${a.gradient};padding:48px 40px 36px;text-align:center;">
                    <div style="display:inline-block;background:rgba(255,255,255,0.18);border:2px solid rgba(255,255,255,0.4);border-radius:50px;padding:8px 20px;font-size:15px;color:#fff;font-weight:700;margin-bottom:20px;">${s.badge(reminderType)}</div>
                    <h1 style="margin:0 0 6px;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.3px;">${s.title(reminderType)}</h1>
                    <p style="margin:0;color:rgba(255,255,255,0.85);font-size:15px;font-weight:500;">${tenantName}</p>
                  </td>
                </tr>
              </table>

              <!-- Greeting -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:32px 40px 8px;">
                    <p style="margin:0;color:#374151;font-size:16px;line-height:1.7;">
                      ${s.greeting(customerName)}<br/>
                      ${s.body(reminderType, startTime, tenantName)}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Time highlight -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:20px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:${a.light};border:1.5px solid ${a.border};border-radius:16px;">
                      <tr>
                        <td style="padding:20px 24px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="40" style="vertical-align:middle;">
                                <div style="width:40px;height:40px;background:${a.gradient};border-radius:10px;text-align:center;line-height:40px;font-size:18px;">🕐</div>
                              </td>
                              <td style="padding-left:14px;vertical-align:middle;">
                                <p style="margin:0;color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">${s.timeLabel}</p>
                                <p style="margin:3px 0 0;color:${a.color};font-size:22px;font-weight:800;letter-spacing:-0.5px;">${startTime} <span style="color:#d1d5db;font-weight:400;">–</span> ${endTime}</p>
                              </td>
                              <td align="right" style="vertical-align:middle;">
                                <div style="background:${a.color};border-radius:10px;padding:8px 14px;display:inline-block;">
                                  <p style="margin:0;color:#ffffff;font-size:13px;font-weight:700;">${date}</p>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Details -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 40px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #f3f4f6;border-radius:16px;overflow:hidden;">
                      <tr>
                        <td style="padding:16px 20px;border-bottom:1px solid #f3f4f6;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:36px;height:36px;background:${a.light};border-radius:8px;text-align:center;vertical-align:middle;font-size:17px;">💅</td>
                              <td style="padding-left:12px;vertical-align:middle;">
                                <p style="margin:0;color:#9ca3af;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;">${s.serviceLabel}</p>
                                <p style="margin:2px 0 0;color:#111827;font-size:15px;font-weight:600;">${serviceName}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:16px 20px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:36px;height:36px;background:${a.light};border-radius:8px;text-align:center;vertical-align:middle;font-size:17px;">👩‍💼</td>
                              <td style="padding-left:12px;vertical-align:middle;">
                                <p style="margin:0;color:#9ca3af;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;">${s.staffLabel}</p>
                                <p style="margin:2px 0 0;color:#111827;font-size:15px;font-weight:600;">${staffName}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${tenantPhone || tenantEmail ? `
              <!-- Contact -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 40px 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:${a.light};border:1.5px solid ${a.border};border-radius:14px;padding:16px 20px;">
                      <tr>
                        <td>
                          <p style="margin:0 0 10px;color:${a.color};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;">${s.contactLabel}</p>
                          ${tenantPhone ? `<table cellpadding="0" cellspacing="0" style="margin-bottom:6px;"><tr><td style="font-size:15px;padding-right:8px;">📞</td><td><a href="tel:${tenantPhone}" style="color:${a.color};font-size:14px;font-weight:600;text-decoration:none;">${tenantPhone}</a></td></tr></table>` : ''}
                          ${tenantEmail ? `<table cellpadding="0" cellspacing="0"><tr><td style="font-size:15px;padding-right:8px;">✉️</td><td><a href="mailto:${tenantEmail}" style="color:${a.color};font-size:14px;font-weight:600;text-decoration:none;">${tenantEmail}</a></td></tr></table>` : ''}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>` : ''}

              <!-- Note -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0 40px 40px;">
                    <p style="margin:0;color:#9ca3af;font-size:13px;text-align:center;line-height:1.6;">${s.note}</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 0 8px;">
              <p style="margin:0;color:#a78bfa;font-size:12px;">
                © 2025 Hemensalon ·
                <a href="${APP_URL}" style="color:#a78bfa;text-decoration:none;">hemensalon.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
