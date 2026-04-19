// Email template helpers: subjects + from address

export type EmailType =
  | 'welcome'
  | 'staff-welcome'
  | 'appointment-confirmation'
  | 'trial-ending'
  | 'payment-success'
  | 'payment-failed'

export function getEmailFrom(): string {
  return 'Hemensalon <noreply@hemensalon.com>'
}

export function getEmailSubject(type: EmailType, params?: Record<string, string>): string {
  switch (type) {
    case 'welcome':
      return `Hoş geldiniz${params?.tenantName ? `, ${params.tenantName}` : ''}! Hemensalon'ye başlayın`
    case 'staff-welcome':
      return `${params?.staffName ?? 'Hesabınız'} hazır — Hemensalon paneline erişin`
    case 'appointment-confirmation':
      return `Randevunuz onaylandı${params?.date ? ` — ${params.date}` : ''}`
    case 'trial-ending':
      return `Deneme süreniz bitiyor — ${params?.daysLeft ?? '3'} gün kaldı`
    case 'payment-success':
      return `Ödeme başarılı — ${params?.plan ?? ''} planınız aktif`
    case 'payment-failed':
      return 'Ödeme başarısız — lütfen ödeme yönteminizi güncelleyin'
    default:
      return 'Hemensalon Bildirimi'
  }
}
