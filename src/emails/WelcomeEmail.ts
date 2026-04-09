// Welcome email for new tenant owners

export interface WelcomeEmailProps {
  tenantName: string
  ownerName: string
  slug: string
  isTrial?: boolean
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://salonapy.com'

export function renderWelcomeEmail({ tenantName, ownerName, slug, isTrial = true }: WelcomeEmailProps): string {
  const panelUrl = `${APP_URL}/b/${slug}`

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hoş Geldiniz — Salonapy</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#6d28d9);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Salonapy</h1>
              <p style="margin:8px 0 0;color:#e9d5ff;font-size:14px;">Randevu & Salon Yönetim Platformu</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#1f2937;font-size:22px;font-weight:700;">Hoş geldiniz, ${ownerName}! 🎉</h2>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                <strong>${tenantName}</strong> işletmeniz başarıyla oluşturuldu.
                ${isTrial
                  ? ' 3 günlük ücretsiz deneme süreniz başladı.'
                  : ' Aboneliğiniz ödeme tamamlandıktan sonra aktifleşecektir.'}
              </p>

              <!-- Steps -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;height:36px;background:#ede9fe;border-radius:50%;text-align:center;vertical-align:middle;">
                          <span style="color:#7c3aed;font-weight:700;font-size:16px;">1</span>
                        </td>
                        <td style="padding-left:14px;">
                          <p style="margin:0;color:#374151;font-size:14px;font-weight:600;">Hizmetlerinizi ekleyin</p>
                          <p style="margin:2px 0 0;color:#9ca3af;font-size:13px;">Sunduğunuz hizmetleri ve fiyatları tanımlayın</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;height:36px;background:#ede9fe;border-radius:50%;text-align:center;vertical-align:middle;">
                          <span style="color:#7c3aed;font-weight:700;font-size:16px;">2</span>
                        </td>
                        <td style="padding-left:14px;">
                          <p style="margin:0;color:#374151;font-size:14px;font-weight:600;">Personelinizi ekleyin</p>
                          <p style="margin:2px 0 0;color:#9ca3af;font-size:13px;">Çalışanlarınızı sisteme tanıtın</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;height:36px;background:#ede9fe;border-radius:50%;text-align:center;vertical-align:middle;">
                          <span style="color:#7c3aed;font-weight:700;font-size:16px;">3</span>
                        </td>
                        <td style="padding-left:14px;">
                          <p style="margin:0;color:#374151;font-size:14px;font-weight:600;">İlk randevunuzu alın</p>
                          <p style="margin:2px 0 0;color:#9ca3af;font-size:13px;">Müşterilerinizle randevu oluşturun</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <div style="text-align:center;margin-bottom:28px;">
                <a href="${panelUrl}" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;">
                  Panele Git →
                </a>
              </div>

              <p style="margin:0;color:#9ca3af;font-size:13px;text-align:center;">
                Sorularınız için <a href="mailto:destek@salonapy.com" style="color:#7c3aed;text-decoration:none;">destek@salonapy.com</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #f3f4f6;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © 2025 Salonapy · <a href="${APP_URL}/gizlilik" style="color:#9ca3af;">Gizlilik</a> · <a href="${APP_URL}/kullanim" style="color:#9ca3af;">Kullanım Koşulları</a>
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
