import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { LegalPage, type LegalContent } from '@/components/vitrin/LegalPage'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const titles: Record<string, string> = {
    tr: 'Gizlilik Politikası – Hemensalon',
    en: 'Privacy Policy – Hemensalon',
    de: 'Datenschutzrichtlinie – Hemensalon',
    ar: 'سياسة الخصوصية – Hemensalon',
  }
  return { title: titles[locale] ?? titles.en }
}

const CONTENT: Record<string, LegalContent> = {
  tr: {
    title: 'Gizlilik Politikası',
    updated: 'Son güncelleme: 16 Mayıs 2026',
    sections: [
      { heading: '1. Genel Bilgi', body: 'Hemensalon olarak gizliliğinize saygı duyuyor ve kişisel verilerinizi korumayı taahhüt ediyoruz. Bu politika, uygulamamızı kullanırken hangi verileri topladığımızı, nasıl kullandığımızı ve haklarınızı açıklar.' },
      { heading: '2. Topladığımız Veriler', body: '• Ad, soyad, e-posta, telefon numarası\n• İşletme adı ve adresi\n• Randevu ve hizmet kayıtları\n• Ödeme bilgileri (yalnızca ödeme sağlayıcısı üzerinden işlenir, tarafımızca saklanmaz)\n• Cihaz bilgileri ve uygulama kullanım verileri (anonim analitik)' },
      { heading: '3. Verilerin Kullanım Amacı', body: '• Randevu yönetimi ve hatırlatma bildirimleri\n• Müşteri ve personel profillerini yönetme\n• Uygulama performansını iyileştirme\n• Teknik destek sağlama\n• Yasal yükümlülükleri yerine getirme' },
      { heading: '4. Verilerin Paylaşımı', body: 'Kişisel verilerinizi satmıyoruz. Veriler yalnızca şu durumlarda paylaşılır:\n• SMS/e-posta altyapısı sağlayıcılarıyla\n• Yasal zorunluluk halinde yetkili kurumlarla\n• Açık rızanızla' },
      { heading: '5. Veri Güvenliği', body: 'Tüm veriler HTTPS/TLS üzerinden şifreli iletilir. Sunucularımız Türkiye\'de yer almakta olup endüstri standardı güvenlik önlemleri uygulanmaktadır.' },
      { heading: '6. Veri Saklama Süresi', body: 'Hesabınız aktif olduğu sürece verileriniz saklanır. Hesap silme talebinde verileriniz 30 gün içinde kalıcı olarak silinir.' },
      { heading: '7. Haklarınız (KVKK)', body: '• Kişisel verilerinize erişim\n• Düzeltme veya silme talebi\n• İşlemeye itiraz\n• Veri taşınabilirliği\n\nTalep: destek@hemensalon.com' },
      { heading: '8. Çerezler', body: 'Web sitemiz oturum ve tercih çerezleri kullanır. Detaylar için Çerez Politikamıza bakınız.' },
      { heading: '9. Çocukların Gizliliği', body: 'Uygulamamız 18 yaş altı bireyler için değildir. Reşit olmayanların verilerini bilerek toplamıyoruz.' },
      { heading: '10. İletişim', body: 'E-posta: destek@hemensalon.com\nWeb: https://www.hemensalon.com' },
    ],
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: May 16, 2026',
    sections: [
      { heading: '1. Overview', body: 'Hemensalon respects your privacy and is committed to protecting your personal data. This policy explains what data we collect, how we use it, and your rights.' },
      { heading: '2. Data We Collect', body: '• Full name, email address, phone number\n• Business name and address\n• Appointment and service records\n• Payment information (processed by payment provider only, not stored by us)\n• Device information and app usage data (anonymous analytics)' },
      { heading: '3. How We Use Your Data', body: '• Appointment management and reminder notifications\n• Managing customer and staff profiles\n• Improving app performance\n• Providing technical support\n• Complying with legal obligations' },
      { heading: '4. Data Sharing', body: 'We do not sell your data. Data is shared only:\n• With SMS/email infrastructure providers\n• With authorities when legally required\n• With your explicit consent' },
      { heading: '5. Data Security', body: 'All data is transmitted encrypted via HTTPS/TLS. Our servers apply industry-standard security measures.' },
      { heading: '6. Data Retention', body: 'Data is retained while your account is active. Upon account deletion request, your data is permanently deleted within 30 days.' },
      { heading: '7. Your Rights (GDPR)', body: '• Access to your personal data\n• Right to rectification or erasure\n• Right to object to processing\n• Data portability\n\nContact: support@hemensalon.com' },
      { heading: '8. Cookies', body: 'Our website uses session and preference cookies. See our Cookie Policy for details.' },
      { heading: '9. Children\'s Privacy', body: 'Our app is not directed at individuals under 18. We do not knowingly collect data from minors.' },
      { heading: '10. Contact', body: 'Email: support@hemensalon.com\nWebsite: https://www.hemensalon.com' },
    ],
  },
  de: {
    title: 'Datenschutzrichtlinie',
    updated: 'Zuletzt aktualisiert: 16. Mai 2026',
    sections: [
      { heading: '1. Überblick', body: 'Hemensalon respektiert Ihre Privatsphäre und verpflichtet sich zum Schutz Ihrer personenbezogenen Daten gemäß DSGVO.' },
      { heading: '2. Erhobene Daten', body: '• Vollständiger Name, E-Mail-Adresse, Telefonnummer\n• Unternehmensname und -adresse\n• Termin- und Serviceaufzeichnungen\n• Zahlungsinformationen (nur durch Zahlungsanbieter verarbeitet)\n• Geräteinformationen und anonyme Nutzungsanalytik' },
      { heading: '3. Verwendung Ihrer Daten', body: '• Terminverwaltung und Erinnerungsbenachrichtigungen\n• Verwaltung von Kunden- und Mitarbeiterprofilen\n• Verbesserung der App-Leistung\n• Technischen Support bereitstellen\n• Erfüllung gesetzlicher Verpflichtungen' },
      { heading: '4. Datenweitergabe', body: 'Wir verkaufen Ihre Daten nicht. Daten werden nur geteilt:\n• Mit SMS/E-Mail-Infrastrukturanbietern\n• Mit Behörden bei gesetzlicher Verpflichtung\n• Mit Ihrer ausdrücklichen Einwilligung' },
      { heading: '5. Datensicherheit', body: 'Alle Daten werden verschlüsselt über HTTPS/TLS übertragen. Unsere Server wenden branchenübliche Sicherheitsmaßnahmen an.' },
      { heading: '6. Datenspeicherung', body: 'Daten werden gespeichert, solange Ihr Konto aktiv ist. Nach einer Löschanfrage werden Ihre Daten innerhalb von 30 Tagen dauerhaft gelöscht.' },
      { heading: '7. Ihre Rechte (DSGVO)', body: '• Auskunftsrecht über Ihre personenbezogenen Daten\n• Recht auf Berichtigung oder Löschung\n• Widerspruchsrecht\n• Datenübertragbarkeit\n\nKontakt: support@hemensalon.com' },
      { heading: '8. Cookies', body: 'Unsere Website verwendet Sitzungs- und Präferenz-Cookies. Details finden Sie in unserer Cookie-Richtlinie.' },
      { heading: '9. Datenschutz für Minderjährige', body: 'Unsere App richtet sich nicht an Personen unter 18 Jahren. Wir erheben wissentlich keine Daten von Minderjährigen.' },
      { heading: '10. Kontakt', body: 'E-Mail: support@hemensalon.com\nWebsite: https://www.hemensalon.com' },
    ],
  },
  ar: {
    title: 'سياسة الخصوصية',
    updated: 'آخر تحديث: 16 مايو 2026',
    sections: [
      { heading: '1. نظرة عامة', body: 'تحترم Hemensalon خصوصيتك وتلتزم بحماية بياناتك الشخصية وفقاً للقوانين المعمول بها.' },
      { heading: '2. البيانات التي نجمعها', body: '• الاسم الكامل، البريد الإلكتروني، رقم الهاتف\n• اسم النشاط التجاري وعنوانه\n• سجلات المواعيد والخدمات\n• معلومات الدفع (تُعالج فقط من قِبل مزود الدفع)\n• معلومات الجهاز وبيانات الاستخدام المجهولة' },
      { heading: '3. كيفية استخدام بياناتك', body: '• إدارة المواعيد وإرسال تذكيرات\n• إدارة ملفات تعريف العملاء والموظفين\n• تحسين أداء التطبيق\n• تقديم الدعم الفني\n• الامتثال للالتزامات القانونية' },
      { heading: '4. مشاركة البيانات', body: 'لا نبيع بياناتك. تُشارك البيانات فقط:\n• مع مزودي البنية التحتية للرسائل والبريد الإلكتروني\n• مع السلطات عند الاقتضاء القانوني\n• بموافقتك الصريحة' },
      { heading: '5. أمان البيانات', body: 'تُرسل جميع البيانات مشفرة عبر HTTPS/TLS. تطبق خوادمنا معايير أمان صناعية.' },
      { heading: '6. الاحتفاظ بالبيانات', body: 'تُحفظ البيانات طالما حسابك نشط. عند طلب حذف الحساب، تُحذف بياناتك نهائياً خلال 30 يوماً.' },
      { heading: '7. حقوقك', body: '• الوصول إلى بياناتك الشخصية\n• حق التصحيح أو الحذف\n• حق الاعتراض على المعالجة\n• قابلية نقل البيانات\n\nللتواصل: support@hemensalon.com' },
      { heading: '8. ملفات تعريف الارتباط', body: 'يستخدم موقعنا ملفات تعريف ارتباط للجلسة والتفضيلات. راجع سياسة ملفات تعريف الارتباط للتفاصيل.' },
      { heading: '9. خصوصية الأطفال', body: 'تطبيقنا غير موجه لمن هم دون 18 عاماً. لا نجمع بيانات القاصرين عن قصد.' },
      { heading: '10. التواصل', body: 'البريد الإلكتروني: support@hemensalon.com\nالموقع: https://www.hemensalon.com' },
    ],
  },
}

export default async function GizlilikPage() {
  const locale = await getLocale()
  return <LegalPage content={CONTENT[locale] ?? CONTENT.en} locale={locale} />
}
