import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { LegalPage, type LegalContent } from '@/components/vitrin/LegalPage'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const titles: Record<string, string> = {
    tr: 'Hesap ve Veri Silme – Hemensalon',
    en: 'Account & Data Deletion – Hemensalon',
    de: 'Konto & Datenlöschung – Hemensalon',
    ar: 'حذف الحساب والبيانات – Hemensalon',
  }
  return { title: titles[locale] ?? titles.en }
}

const CONTENT: Record<string, LegalContent> = {
  tr: {
    title: 'Hesap ve Veri Silme',
    subtitle: 'Apple App Store ve Google Play gereksinimleri doğrultusunda',
    updated: 'Son güncelleme: 16 Mayıs 2026',
    sections: [
      { heading: 'Hesabınızı Nasıl Silebilirsiniz?', body: 'Hesabınızı ve tüm verilerinizi aşağıdaki yöntemlerden biriyle silebilirsiniz:\n\n📱 Uygulama üzerinden:\nAyarlar → Hesabım → Hesabı Sil\n\n📧 E-posta ile:\ndestek@hemensalon.com adresine "Hesap Silme Talebi" konusuyla e-posta gönderin. Kayıtlı e-posta adresinizi ve salon adınızı belirtin.' },
      { heading: 'Silme İşleminin Kapsamı', body: 'Hesap silme talebinde aşağıdaki veriler kalıcı olarak silinir:\n\n✅ Hemen silinen veriler:\n• Profil bilgileri (ad, e-posta, telefon)\n• İşletme bilgileri\n• Personel bilgileri\n• Uygulama tercihleriniz ve oturum verileri\n\n⏳ 30 gün içinde silinen veriler:\n• Müşteri kayıtları\n• Randevu geçmişi\n• Hizmet ve stok verileri' },
      { heading: 'Saklanan Veriler (Yasal Zorunluluk)', body: 'Aşağıdaki veriler yasal zorunluluklar nedeniyle hesap silinse dahi belirtilen süreler boyunca saklanır:\n\n• Mali kayıtlar ve fatura bilgileri: 10 yıl (213 sayılı VUK)\n• Log kayıtları: 2 yıl (5651 sayılı Kanun)\n\nBu veriler yalnızca yasal yükümlülüklerin yerine getirilmesi amacıyla saklanır ve üçüncü taraflarla paylaşılmaz.' },
      { heading: 'Silme Talebi İşlem Süresi', body: 'Silme talebiniz alındıktan sonra:\n• Kimlik doğrulaması yapılır (en fazla 2 iş günü)\n• Verileriniz kademeli olarak silinir (en fazla 30 gün)\n• Silme tamamlandığında e-posta ile bilgilendirilirsiniz' },
      { heading: 'Abonelik İptali', body: 'Hesap silme işlemi mevcut aboneliğinizi otomatik olarak sonlandırır. Kalan abonelik süreniz için iade yapılmaz. Aboneliği yalnızca iptal etmek (hesabı silmeden) için:\n• App Store: Apple ID → Abonelikler\n• Google Play: Ödeme Yöntemi → Abonelikler' },
      { heading: 'İletişim', body: 'Hesap silme veya veri konusundaki tüm talepleriniz için:\n📧 destek@hemensalon.com\n\nTalebiniz en geç 30 gün içinde yanıtlanır.' },
    ],
  },
  en: {
    title: 'Account & Data Deletion',
    subtitle: 'In accordance with Apple App Store and Google Play requirements',
    updated: 'Last updated: May 16, 2026',
    sections: [
      { heading: 'How to Delete Your Account', body: 'You can delete your account and all your data using one of the following methods:\n\n📱 Via the app:\nSettings → My Account → Delete Account\n\n📧 Via email:\nSend an email to support@hemensalon.com with subject "Account Deletion Request". Include your registered email address and salon name.' },
      { heading: 'Scope of Deletion', body: 'Upon account deletion, the following data is permanently deleted:\n\n✅ Immediately deleted:\n• Profile information (name, email, phone)\n• Business information\n• Staff information\n• App preferences and session data\n\n⏳ Deleted within 30 days:\n• Customer records\n• Appointment history\n• Service and inventory data' },
      { heading: 'Retained Data (Legal Requirements)', body: 'The following data is retained even after account deletion due to legal obligations:\n\n• Financial records and invoices: 10 years (tax law)\n• System logs: 2 years\n\nThis data is retained solely for legal compliance and is not shared with third parties.' },
      { heading: 'Processing Time', body: 'After your deletion request is received:\n• Identity verification is performed (up to 2 business days)\n• Your data is progressively deleted (up to 30 days)\n• You will be notified by email when deletion is complete' },
      { heading: 'Subscription Cancellation', body: 'Account deletion automatically terminates your active subscription. No refund is issued for the remaining subscription period. To cancel the subscription only (without deleting the account):\n• App Store: Apple ID → Subscriptions\n• Google Play: Payment Method → Subscriptions' },
      { heading: 'Contact', body: 'For all account deletion and data-related requests:\n📧 support@hemensalon.com\n\nYour request will be answered within 30 days.' },
    ],
  },
  de: {
    title: 'Konto & Datenlöschung',
    subtitle: 'Gemäß Apple App Store und Google Play Anforderungen',
    updated: 'Zuletzt aktualisiert: 16. Mai 2026',
    sections: [
      { heading: 'Konto löschen', body: 'Sie können Ihr Konto und alle Daten auf folgende Weise löschen:\n\n📱 Über die App:\nEinstellungen → Mein Konto → Konto löschen\n\n📧 Per E-Mail:\nSenden Sie eine E-Mail an support@hemensalon.com mit dem Betreff "Kontolöschungsanfrage". Geben Sie Ihre registrierte E-Mail-Adresse und den Salonnamen an.' },
      { heading: 'Umfang der Löschung', body: '✅ Sofort gelöscht:\n• Profilinformationen (Name, E-Mail, Telefon)\n• Unternehmensinformationen\n• Mitarbeiterinformationen\n• App-Einstellungen und Sitzungsdaten\n\n⏳ Innerhalb von 30 Tagen gelöscht:\n• Kundendaten\n• Terminhistorie\n• Dienstleistungs- und Lagerdaten' },
      { heading: 'Aufbewahrungspflichten', body: 'Folgende Daten werden trotz Kontolöschung aus gesetzlichen Gründen aufbewahrt:\n\n• Finanzunterlagen und Rechnungen: 10 Jahre (Steuerrecht)\n• Systemprotokolle: 2 Jahre\n\nDiese Daten werden ausschließlich zur gesetzlichen Compliance verwendet und nicht an Dritte weitergegeben.' },
      { heading: 'Bearbeitungszeit', body: 'Nach Eingang Ihrer Löschanfrage:\n• Identitätsprüfung (bis zu 2 Werktage)\n• Schrittweise Datenlöschung (bis zu 30 Tage)\n• E-Mail-Benachrichtigung nach Abschluss' },
      { heading: 'Abonnementkündigung', body: 'Eine Kontolöschung beendet Ihr aktives Abonnement automatisch. Keine Rückerstattung für verbleibende Abonnementzeiträume.\n• App Store: Apple ID → Abonnements\n• Google Play: Zahlungsmethode → Abonnements' },
      { heading: 'Kontakt', body: '📧 support@hemensalon.com\n\nIhre Anfrage wird innerhalb von 30 Tagen beantwortet.' },
    ],
  },
  ar: {
    title: 'حذف الحساب والبيانات',
    subtitle: 'وفقاً لمتطلبات Apple App Store وGoogle Play',
    updated: 'آخر تحديث: 16 مايو 2026',
    sections: [
      { heading: 'كيفية حذف حسابك', body: 'يمكنك حذف حسابك وجميع بياناتك بإحدى الطريقتين:\n\n📱 عبر التطبيق:\nالإعدادات ← حسابي ← حذف الحساب\n\n📧 عبر البريد الإلكتروني:\nأرسل بريداً إلكترونياً إلى support@hemensalon.com بموضوع "طلب حذف الحساب"، مع ذكر بريدك الإلكتروني المسجل واسم الصالون.' },
      { heading: 'نطاق الحذف', body: '✅ يُحذف فوراً:\n• معلومات الملف الشخصي (الاسم، البريد الإلكتروني، الهاتف)\n• معلومات النشاط التجاري\n• معلومات الموظفين\n• تفضيلات التطبيق وبيانات الجلسة\n\n⏳ يُحذف خلال 30 يوماً:\n• سجلات العملاء\n• سجل المواعيد\n• بيانات الخدمات والمخزون' },
      { heading: 'البيانات المحتفظ بها (التزامات قانونية)', body: 'تُحتفظ بالبيانات التالية حتى بعد حذف الحساب:\n\n• السجلات المالية والفواتير: 10 سنوات (قانون الضرائب)\n• سجلات النظام: سنتان\n\nتُستخدم هذه البيانات فقط للامتثال القانوني ولا تُشارك مع أطراف ثالثة.' },
      { heading: 'مدة المعالجة', body: 'بعد استلام طلب الحذف:\n• التحقق من الهوية (حتى يومي عمل)\n• حذف البيانات تدريجياً (حتى 30 يوماً)\n• إشعار عبر البريد الإلكتروني عند اكتمال الحذف' },
      { heading: 'إلغاء الاشتراك', body: 'يُنهي حذف الحساب اشتراكك الفعال تلقائياً. لا يُرد المبلغ عن الفترة المتبقية.\n• App Store: Apple ID ← الاشتراكات\n• Google Play: طريقة الدفع ← الاشتراكات' },
      { heading: 'التواصل', body: '📧 support@hemensalon.com\n\nسيُجاب على طلبك خلال 30 يوماً.' },
    ],
  },
}

export default async function HesapSilmePage() {
  const locale = await getLocale()
  return <LegalPage content={CONTENT[locale] ?? CONTENT.en} locale={locale} />
}
