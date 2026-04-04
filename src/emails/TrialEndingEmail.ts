// Trial ending warning email

export interface TrialEndingEmailProps {
  tenantName: string
  ownerName: string
  daysLeft: number
  slug: string
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://salonapy.com'

export function renderTrialEndingEmail({
  tenantName,
  ownerName,
  daysLeft,
  slug,
}: TrialEndingEmailProps): string {
  const pricingUrl = `${APP_URL}/fiyatlar`
  const panelUrl = `${APP_URL}/b/${slug}`

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Deneme Süreniz Bitiyor</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:36px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:36px;">⏰</p>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Deneme Süreniz Bitiyor</h1>
              <p style="margin:8px 0 0;color:#fef3c7;font-size:14px;">${daysLeft} gün kaldı</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6;">
                Merhaba <strong>${ownerName}</strong>,
              </p>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                <strong>${tenantName}</strong> için ${daysLeft} günlük ücretsiz deneme süreniz <strong>${daysLeft} gün</strong> içinde sona erecek.
                Kesintisiz erişim için bir plan seçin.
              </p>

              <!-- Features reminder -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border-radius:12px;border:1px solid #fde68a;padding:20px;margin-bottom:28px;">
                <tr><td style="padding:6px 0;"><span style="color:#92400e;font-size:14px;">✓ Sınırsız randevu yönetimi</span></td></tr>
                <tr><td style="padding:6px 0;"><span style="color:#92400e;font-size:14px;">✓ WhatsApp hatırlatma mesajları</span></td></tr>
                <tr><td style="padding:6px 0;"><span style="color:#92400e;font-size:14px;">✓ Gelir & gider takibi</span></td></tr>
                <tr><td style="padding:6px 0;"><span style="color:#92400e;font-size:14px;">✓ Müşteri & personel yönetimi</span></td></tr>
              </table>

              <!-- CTAs -->
              <div style="text-align:center;margin-bottom:16px;">
                <a href="${pricingUrl}" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;">
                  Plan Seç →
                </a>
              </div>
              <div style="text-align:center;margin-bottom:28px;">
                <a href="${panelUrl}" style="color:#7c3aed;font-size:13px;text-decoration:underline;">Panele dön</a>
              </div>

              <p style="margin:0;color:#9ca3af;font-size:13px;text-align:center;">
                Sorularınız için <a href="mailto:destek@salonapy.com" style="color:#7c3aed;text-decoration:none;">destek@salonapy.com</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #f3f4f6;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">© 2025 Salonapy</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
