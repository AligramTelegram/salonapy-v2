// Appointment confirmation email sent to customer

export interface AppointmentConfirmationProps {
  customerName: string
  serviceName: string
  staffName: string
  date: string      // e.g. "26 Mart 2025"
  startTime: string // e.g. "14:30"
  endTime: string   // e.g. "15:00"
  tenantName: string
  tenantPhone?: string
  tenantEmail?: string
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://hemensalon.com'

export function renderAppointmentConfirmation(props: AppointmentConfirmationProps): string {
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
  } = props

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Randevu Onayı</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#6d28d9);padding:36px 40px;text-align:center;">
              <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;">
                <span style="font-size:28px;">✓</span>
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Randevunuz Onaylandı</h1>
              <p style="margin:8px 0 0;color:#e9d5ff;font-size:14px;">${tenantName}</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                Merhaba <strong>${customerName}</strong>, randevunuz başarıyla oluşturuldu.
              </p>

              <!-- Appointment details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">
                    <p style="margin:0;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Hizmet</p>
                    <p style="margin:4px 0 0;color:#111827;font-size:15px;font-weight:600;">${serviceName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">
                    <p style="margin:0;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Uzman</p>
                    <p style="margin:4px 0 0;color:#111827;font-size:15px;font-weight:600;">${staffName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">
                    <p style="margin:0;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Tarih</p>
                    <p style="margin:4px 0 0;color:#111827;font-size:15px;font-weight:600;">${date}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Saat</p>
                    <p style="margin:4px 0 0;color:#111827;font-size:15px;font-weight:600;">${startTime} — ${endTime}</p>
                  </td>
                </tr>
              </table>

              <!-- Business contact -->
              ${tenantPhone || tenantEmail ? `
              <div style="background:#ede9fe;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
                <p style="margin:0 0 8px;color:#5b21b6;font-size:13px;font-weight:600;">İşletme İletişim</p>
                ${tenantPhone ? `<p style="margin:0 0 4px;color:#6d28d9;font-size:14px;">📞 ${tenantPhone}</p>` : ''}
                ${tenantEmail ? `<p style="margin:0;color:#6d28d9;font-size:14px;">✉️ ${tenantEmail}</p>` : ''}
              </div>` : ''}

              <p style="margin:0;color:#9ca3af;font-size:13px;text-align:center;">
                İptal veya değişiklik için lütfen işletmeyle iletişime geçin.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #f3f4f6;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">© 2025 Hemensalon · <a href="${APP_URL}" style="color:#9ca3af;">hemensalon.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
