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

export type EmailLocale = 'tr' | 'en' | 'de' | 'ar'

const SUBJECTS: Record<EmailLocale, Record<EmailType, (p?: Record<string, string>) => string>> = {
  tr: {
    'welcome': (p) => `Hoş geldiniz${p?.tenantName ? `, ${p.tenantName}` : ''}! Hemensalon'ye başlayın`,
    'staff-welcome': (p) => `${p?.staffName ?? 'Hesabınız'} hazır — Hemensalon paneline erişin`,
    'appointment-confirmation': (p) => `Randevunuz onaylandı${p?.date ? ` — ${p.date}` : ''}`,
    'trial-ending': (p) => `Deneme süreniz bitiyor — ${p?.daysLeft ?? '3'} gün kaldı`,
    'payment-success': (p) => `Ödeme başarılı — ${p?.plan ?? ''} planınız aktif`,
    'payment-failed': () => 'Ödeme başarısız — lütfen ödeme yönteminizi güncelleyin',
  },
  en: {
    'welcome': (p) => `Welcome${p?.tenantName ? `, ${p.tenantName}` : ''}! Get started with Hemensalon`,
    'staff-welcome': (p) => `${p?.staffName ?? 'Your account'} is ready — Access Hemensalon panel`,
    'appointment-confirmation': (p) => `Appointment confirmed${p?.date ? ` — ${p.date}` : ''}`,
    'trial-ending': (p) => `Your trial is ending — ${p?.daysLeft ?? '3'} days left`,
    'payment-success': (p) => `Payment successful — ${p?.plan ?? ''} plan is active`,
    'payment-failed': () => 'Payment failed — please update your payment method',
  },
  de: {
    'welcome': (p) => `Willkommen${p?.tenantName ? `, ${p.tenantName}` : ''}! Starten Sie mit Hemensalon`,
    'staff-welcome': (p) => `${p?.staffName ?? 'Ihr Konto'} ist bereit — Zugang zum Hemensalon-Panel`,
    'appointment-confirmation': (p) => `Termin bestätigt${p?.date ? ` — ${p.date}` : ''}`,
    'trial-ending': (p) => `Ihre Testphase endet — noch ${p?.daysLeft ?? '3'} Tage`,
    'payment-success': (p) => `Zahlung erfolgreich — ${p?.plan ?? ''} Plan aktiv`,
    'payment-failed': () => 'Zahlung fehlgeschlagen — bitte aktualisieren Sie Ihre Zahlungsmethode',
  },
  ar: {
    'welcome': (p) => `مرحباً${p?.tenantName ? `، ${p.tenantName}` : ''}! ابدأ مع Hemensalon`,
    'staff-welcome': (p) => `${p?.staffName ?? 'حسابك'} جاهز — الوصول إلى لوحة Hemensalon`,
    'appointment-confirmation': (p) => `تم تأكيد موعدك${p?.date ? ` — ${p.date}` : ''}`,
    'trial-ending': (p) => `تنتهي فترتك التجريبية — ${p?.daysLeft ?? '3'} أيام متبقية`,
    'payment-success': (p) => `تم الدفع بنجاح — خطة ${p?.plan ?? ''} نشطة`,
    'payment-failed': () => 'فشل الدفع — يرجى تحديث طريقة الدفع',
  },
}

export function getEmailSubject(
  type: EmailType,
  params?: Record<string, string>,
  locale: EmailLocale = 'tr',
): string {
  return (SUBJECTS[locale]?.[type] ?? SUBJECTS.tr[type])(params) ?? 'Hemensalon'
}
