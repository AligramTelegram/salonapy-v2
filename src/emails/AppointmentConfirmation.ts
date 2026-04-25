// Appointment confirmation email sent to customer

export interface AppointmentConfirmationProps {
  customerName: string
  serviceName: string
  staffName: string
  date: string
  startTime: string
  endTime: string
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
<body style="margin:0;padding:0;background:#f4f1ff;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ff;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

          <!-- Logo / Brand -->
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

              <!-- Hero Header -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#ec4899 100%);padding:48px 40px 36px;text-align:center;">
                    <!-- Check badge -->
                    <div style="display:inline-block;background:rgba(255,255,255,0.15);border:2px solid rgba(255,255,255,0.35);border-radius:50%;width:68px;height:68px;line-height:68px;font-size:32px;margin-bottom:16px;">✓</div>
                    <h1 style="margin:0 0 6px;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.3px;">Randevunuz Onaylandı!</h1>
                    <p style="margin:0;color:rgba(255,255,255,0.85);font-size:15px;font-weight:500;">${tenantName}</p>
                  </td>
                </tr>
              </table>

              <!-- Greeting -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:32px 40px 8px;">
                    <p style="margin:0;color:#374151;font-size:16px;line-height:1.7;">
                      Merhaba <strong style="color:#111827;">${customerName}</strong> 👋<br/>
                      Randevunuz başarıyla oluşturuldu. Aşağıda randevu detaylarınızı bulabilirsiniz.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Time highlight card -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:20px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#faf5ff,#fdf2f8);border:1.5px solid #e9d5ff;border-radius:16px;">
                      <tr>
                        <td style="padding:20px 24px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="40" style="vertical-align:middle;">
                                <div style="width:40px;height:40px;background:linear-gradient(135deg,#7c3aed,#a855f7);border-radius:10px;text-align:center;line-height:40px;font-size:18px;">🕐</div>
                              </td>
                              <td style="padding-left:14px;vertical-align:middle;">
                                <p style="margin:0;color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">Randevu Saati</p>
                                <p style="margin:3px 0 0;color:#7c3aed;font-size:22px;font-weight:800;letter-spacing:-0.5px;">${startTime} <span style="color:#d1d5db;font-weight:400;">–</span> ${endTime}</p>
                              </td>
                              <td align="right" style="vertical-align:middle;">
                                <div style="background:#7c3aed;border-radius:10px;padding:8px 14px;display:inline-block;">
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

              <!-- Details grid -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 40px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #f3f4f6;border-radius:16px;overflow:hidden;">

                      <!-- Service -->
                      <tr>
                        <td style="padding:16px 20px;border-bottom:1px solid #f3f4f6;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:36px;height:36px;background:#faf5ff;border-radius:8px;text-align:center;vertical-align:middle;font-size:17px;">💅</td>
                              <td style="padding-left:12px;vertical-align:middle;">
                                <p style="margin:0;color:#9ca3af;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;">Hizmet</p>
                                <p style="margin:2px 0 0;color:#111827;font-size:15px;font-weight:600;">${serviceName}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Staff -->
                      <tr>
                        <td style="padding:16px 20px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:36px;height:36px;background:#faf5ff;border-radius:8px;text-align:center;vertical-align:middle;font-size:17px;">👩‍💼</td>
                              <td style="padding-left:12px;vertical-align:middle;">
                                <p style="margin:0;color:#9ca3af;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;">Uzman</p>
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

              <!-- Contact block -->
              ${tenantPhone || tenantEmail ? `
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 40px 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf5ff;border:1.5px solid #ede9fe;border-radius:14px;padding:16px 20px;">
                      <tr>
                        <td>
                          <p style="margin:0 0 10px;color:#7c3aed;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;">İşletme İletişim</p>
                          ${tenantPhone ? `
                          <table cellpadding="0" cellspacing="0" style="margin-bottom:6px;">
                            <tr>
                              <td style="color:#a855f7;font-size:15px;padding-right:8px;">📞</td>
                              <td><a href="tel:${tenantPhone}" style="color:#6d28d9;font-size:14px;font-weight:600;text-decoration:none;">${tenantPhone}</a></td>
                            </tr>
                          </table>` : ''}
                          ${tenantEmail ? `
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color:#a855f7;font-size:15px;padding-right:8px;">✉️</td>
                              <td><a href="mailto:${tenantEmail}" style="color:#6d28d9;font-size:14px;font-weight:600;text-decoration:none;">${tenantEmail}</a></td>
                            </tr>
                          </table>` : ''}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>` : ''}

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0 40px 40px;">
                    <p style="margin:0 0 20px;color:#9ca3af;font-size:13px;text-align:center;line-height:1.6;">
                      İptal veya değişiklik için lütfen işletmeyle iletişime geçin.
                    </p>
                    <a href="${APP_URL}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:50px;letter-spacing:0.2px;box-shadow:0 4px 16px rgba(124,58,237,0.35);">
                      Hemensalon'a Git →
                    </a>
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
