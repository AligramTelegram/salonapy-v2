// Payment failed warning email

export interface PaymentFailedEmailProps {
  ownerName: string
  tenantName: string
  reason?: string
  slug: string
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://hemensalon.com'

export function renderPaymentFailedEmail({
  ownerName,
  tenantName,
  reason,
  slug,
}: PaymentFailedEmailProps): string {
  const settingsUrl = `${APP_URL}/b/${slug}/ayarlar`

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ödeme Başarısız</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#dc2626,#b91c1c);padding:36px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:36px;">⚠️</p>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Ödeme Başarısız</h1>
              <p style="margin:8px 0 0;color:#fecaca;font-size:14px;">${tenantName}</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                Merhaba <strong>${ownerName}</strong>, abonelik ödemeniz işleme alınamadı.
                ${reason ? `<br/><br/>Sebep: <em>${reason}</em>` : ''}
              </p>

              <!-- Warning box -->
              <div style="background:#fef2f2;border-radius:12px;border:1px solid #fecaca;padding:20px;margin-bottom:28px;">
                <p style="margin:0 0 8px;color:#991b1b;font-size:14px;font-weight:600;">Ne yapmalısınız?</p>
                <p style="margin:0 0 6px;color:#b91c1c;font-size:14px;">• Ödeme yönteminizi güncelleyin</p>
                <p style="margin:0 0 6px;color:#b91c1c;font-size:14px;">• Kart limitinizi kontrol edin</p>
                <p style="margin:0;color:#b91c1c;font-size:14px;">• Bankanızla iletişime geçin</p>
              </div>

              <!-- CTAs -->
              <div style="text-align:center;margin-bottom:16px;">
                <a href="${settingsUrl}" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;">
                  Ödeme Yöntemi Güncelle →
                </a>
              </div>
              <div style="text-align:center;margin-bottom:28px;">
                <a href="mailto:destek@hemensalon.com" style="color:#7c3aed;font-size:13px;text-decoration:underline;">Destek ile iletişime geç</a>
              </div>

              <p style="margin:0;color:#9ca3af;font-size:13px;text-align:center;">
                Ödeme güncellenmezse hesabınız geçici olarak kısıtlanabilir.
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
