// Payment success confirmation email

export interface PaymentSuccessEmailProps {
  ownerName: string
  tenantName: string
  plan: string        // "Başlangıç" | "Profesyonel" | "İşletme"
  amount: string      // e.g. "₺450" | "€35"
  nextPaymentDate: string // e.g. "26 Nisan 2025"
  slug: string
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://hemensalon.com'

export function renderPaymentSuccessEmail({
  ownerName,
  tenantName,
  plan,
  amount,
  nextPaymentDate,
  slug,
}: PaymentSuccessEmailProps): string {
  const panelUrl = `${APP_URL}/b/${slug}`

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ödeme Başarılı</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#059669,#047857);padding:36px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:36px;">✅</p>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Ödeme Başarılı!</h1>
              <p style="margin:8px 0 0;color:#d1fae5;font-size:14px;">${tenantName}</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                Merhaba <strong>${ownerName}</strong>, ödemeniz başarıyla alındı. <strong>${plan}</strong> planınız aktif.
              </p>

              <!-- Receipt -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #bbf7d0;">
                    <p style="margin:0;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Plan</p>
                    <p style="margin:4px 0 0;color:#111827;font-size:15px;font-weight:600;">${plan}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #bbf7d0;">
                    <p style="margin:0;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Ödenen Tutar</p>
                    <p style="margin:4px 0 0;color:#111827;font-size:15px;font-weight:600;">${amount}/ay</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Sonraki Ödeme</p>
                    <p style="margin:4px 0 0;color:#111827;font-size:15px;font-weight:600;">${nextPaymentDate}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <div style="text-align:center;margin-bottom:28px;">
                <a href="${panelUrl}" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;">
                  Panele Git →
                </a>
              </div>

              <p style="margin:0;color:#9ca3af;font-size:13px;text-align:center;">
                Fatura ve abonelik yönetimi için paneldeki Ayarlar &gt; Abonelik bölümünü ziyaret edin.
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
