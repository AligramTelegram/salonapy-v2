// Staff welcome email sent when a new staff account is created

export interface StaffWelcomeEmailProps {
  staffName: string
  tenantName: string
  slug: string
  email: string
  password: string
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://hemensalon.com'

export function renderStaffWelcomeEmail({
  staffName,
  tenantName,
  slug,
  email,
  password,
}: StaffWelcomeEmailProps): string {
  const panelUrl = `${APP_URL}/p/${slug}`

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hesabınız Hazır — Hemensalon</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#6d28d9);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;">Hemensalon</h1>
              <p style="margin:8px 0 0;color:#e9d5ff;font-size:14px;">Personel Paneli</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#1f2937;font-size:22px;font-weight:700;">Merhaba, ${staffName}!</h2>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                <strong>${tenantName}</strong> işletmesine eklendiniz. Aşağıdaki bilgilerle panele giriş yapabilirsiniz.
              </p>

              <!-- Credentials -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">
                    <p style="margin:0;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">E-posta</p>
                    <p style="margin:4px 0 0;color:#111827;font-size:15px;font-weight:600;">${email}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Geçici Şifre</p>
                    <p style="margin:4px 0 0;color:#111827;font-size:15px;font-weight:600;font-family:monospace;">${password}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px;color:#6b7280;font-size:13px;line-height:1.5;">
                ⚠️ İlk girişte şifrenizi değiştirmenizi öneririz.
              </p>

              <!-- CTA -->
              <div style="text-align:center;margin-bottom:28px;">
                <a href="${panelUrl}" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;">
                  Panele Giriş Yap →
                </a>
              </div>

              <p style="margin:0;color:#9ca3af;font-size:13px;text-align:center;">
                Sorun yaşıyorsanız <a href="mailto:destek@hemensalon.com" style="color:#7c3aed;text-decoration:none;">destek@hemensalon.com</a> adresiyle iletişime geçin.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #f3f4f6;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">© 2025 Hemensalon</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
