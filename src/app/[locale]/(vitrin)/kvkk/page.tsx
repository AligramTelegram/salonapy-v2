import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { LegalPage, type LegalContent } from '@/components/vitrin/LegalPage'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const titles: Record<string, string> = {
    tr: 'KVKK Aydınlatma Metni – Hemensalon',
    en: 'GDPR / Data Protection – Hemensalon',
    de: 'DSGVO / Datenschutz – Hemensalon',
    ar: 'حماية البيانات KVKK/GDPR – Hemensalon',
  }
  return { title: titles[locale] ?? titles.en }
}

const CONTENT: Record<string, LegalContent> = {
  tr: {
    title: 'KVKK Aydınlatma Metni',
    subtitle: '6698 Sayılı Kişisel Verilerin Korunması Kanunu kapsamında',
    updated: 'Son güncelleme: 16 Mayıs 2026',
    sections: [
      { heading: 'Veri Sorumlusu', body: 'Hemensalon ("Şirket") olarak 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu sıfatıyla hareket etmekteyiz.\n\nİletişim: destek@hemensalon.com' },
      { heading: 'İşlenen Kişisel Veriler', body: '• Kimlik verileri: Ad, soyad\n• İletişim verileri: Telefon, e-posta\n• İşletme verileri: Salon adı, adresi\n• İşlem verileri: Randevular, hizmetler, ödemeler\n• Teknik veriler: IP adresi, cihaz bilgisi, log kayıtları' },
      { heading: 'Kişisel Verilerin İşlenme Amaçları', body: '• Hizmet sözleşmesinin ifası\n• Randevu ve bildirim yönetimi\n• Müşteri desteği sağlanması\n• Yasal yükümlülüklerin yerine getirilmesi\n• Uygulama güvenliğinin sağlanması' },
      { heading: 'Hukuki Dayanaklar', body: 'Kişisel verileriniz KVKK\'nın 5. maddesi uyarınca şu hukuki sebeplere dayanılarak işlenmektedir:\n• Sözleşmenin kurulması ve ifası (md. 5/2-c)\n• Meşru menfaat (md. 5/2-f)\n• Açık rıza (md. 5/1) — pazarlama iletişimleri için' },
      { heading: 'Verilerin Aktarımı', body: 'Kişisel verileriniz;\n• Sunucu/altyapı sağlayıcılarına (yurt içi)\n• SMS/e-posta hizmet sağlayıcılarına\n• Yetkili kamu kurum ve kuruluşlarına\naktarılabilir. Yurt dışına veri aktarımı KVKK\'nın 9. maddesi çerçevesinde yapılır.' },
      { heading: 'Saklama Süreleri', body: '• Hesap verileri: Hesap aktif olduğu süre + 30 gün\n• İşlem kayıtları: 10 yıl (vergi mevzuatı)\n• Log kayıtları: 2 yıl' },
      { heading: 'İlgili Kişinin Hakları (KVKK md. 11)', body: 'Aşağıdaki hakları kullanabilirsiniz:\n• Kişisel verilerinizin işlenip işlenmediğini öğrenme\n• İşleniyorsa bilgi talep etme\n• İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme\n• Yurt içi/dışı aktarım yapılıyorsa bilgi edinme\n• Eksik/yanlış işleme halinde düzeltme talep etme\n• KVKK md.7 çerçevesinde silinmesini/yok edilmesini talep etme\n• İşlemenin otomatik sistemle yapılması halinde itiraz etme\n• Kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme\n\nBaşvuru: destek@hemensalon.com' },
      { heading: 'Başvuru Yöntemi', body: 'KVKK kapsamındaki haklarınızı kullanmak için destek@hemensalon.com adresine e-posta ile başvurabilirsiniz. Başvurularınız 30 gün içinde yanıtlanır.' },
    ],
  },
  en: {
    title: 'GDPR & Data Protection',
    subtitle: 'General Data Protection Regulation compliance',
    updated: 'Last updated: May 16, 2026',
    sections: [
      { heading: 'Data Controller', body: 'Hemensalon acts as the data controller for personal data processed through the app.\n\nContact: support@hemensalon.com' },
      { heading: 'Personal Data Processed', body: '• Identity: Full name\n• Contact: Phone number, email address\n• Business: Salon name, address\n• Transaction: Appointments, services, payments\n• Technical: IP address, device info, log records' },
      { heading: 'Purposes of Processing', body: '• Performance of the service contract\n• Appointment and notification management\n• Customer support\n• Compliance with legal obligations\n• Application security' },
      { heading: 'Legal Bases (GDPR Art. 6)', body: '• Contract performance (Art. 6(1)(b))\n• Legitimate interests (Art. 6(1)(f))\n• Consent (Art. 6(1)(a)) — for marketing communications' },
      { heading: 'Data Transfers', body: 'Data may be transferred to:\n• Server/infrastructure providers\n• SMS/email service providers\n• Competent public authorities\n\nTransfers outside the EEA are made with appropriate safeguards (SCCs or adequacy decisions).' },
      { heading: 'Retention Periods', body: '• Account data: Duration of account + 30 days\n• Transaction records: 10 years (tax law)\n• Log records: 2 years' },
      { heading: 'Your Rights (GDPR Art. 15–22)', body: '• Right of access\n• Right to rectification\n• Right to erasure ("right to be forgotten")\n• Right to restriction of processing\n• Right to data portability\n• Right to object\n• Rights related to automated decision-making\n\nContact: support@hemensalon.com\nResponse within 30 days.' },
      { heading: 'Supervisory Authority', body: 'You have the right to lodge a complaint with your local data protection supervisory authority.' },
    ],
  },
  de: {
    title: 'DSGVO & Datenschutz',
    subtitle: 'Datenschutz-Grundverordnung – Informationspflichten',
    updated: 'Zuletzt aktualisiert: 16. Mai 2026',
    sections: [
      { heading: 'Verantwortlicher', body: 'Hemensalon ist Verantwortlicher für die im Rahmen der App verarbeiteten personenbezogenen Daten.\n\nKontakt: support@hemensalon.com' },
      { heading: 'Verarbeitete personenbezogene Daten', body: '• Identität: Vollständiger Name\n• Kontakt: Telefonnummer, E-Mail-Adresse\n• Unternehmen: Salonname, Adresse\n• Transaktionen: Termine, Dienstleistungen, Zahlungen\n• Technisch: IP-Adresse, Geräteinformationen, Protokolle' },
      { heading: 'Verarbeitungszwecke', body: '• Vertragserfüllung\n• Terminverwaltung und Benachrichtigungen\n• Kundenservice\n• Erfüllung gesetzlicher Pflichten\n• Anwendungssicherheit' },
      { heading: 'Rechtsgrundlagen (Art. 6 DSGVO)', body: '• Vertragserfüllung (Art. 6 Abs. 1 lit. b)\n• Berechtigte Interessen (Art. 6 Abs. 1 lit. f)\n• Einwilligung (Art. 6 Abs. 1 lit. a) – für Marketing' },
      { heading: 'Datenübermittlung', body: 'Daten können übermittelt werden an:\n• Server-/Infrastrukturanbieter\n• SMS-/E-Mail-Dienstleister\n• Zuständige Behörden\n\nÜbermittlungen in Drittländer erfolgen mit geeigneten Garantien (SCC oder Angemessenheitsbeschluss).' },
      { heading: 'Speicherdauer', body: '• Kontodaten: Aktive Nutzungszeit + 30 Tage\n• Transaktionsdaten: 10 Jahre (Steuerrecht)\n• Protokolldaten: 2 Jahre' },
      { heading: 'Ihre Rechte (Art. 15–22 DSGVO)', body: '• Auskunftsrecht\n• Recht auf Berichtigung\n• Recht auf Löschung\n• Recht auf Einschränkung der Verarbeitung\n• Recht auf Datenübertragbarkeit\n• Widerspruchsrecht\n\nKontakt: support@hemensalon.com\nAntwort innerhalb von 30 Tagen.' },
      { heading: 'Aufsichtsbehörde', body: 'Sie haben das Recht, eine Beschwerde bei der zuständigen Datenschutz-Aufsichtsbehörde einzureichen.' },
    ],
  },
  ar: {
    title: 'حماية البيانات KVKK/GDPR',
    subtitle: 'الامتثال لقوانين حماية البيانات الشخصية',
    updated: 'آخر تحديث: 16 مايو 2026',
    sections: [
      { heading: 'المتحكم في البيانات', body: 'تعمل Hemensalon بوصفها المتحكم في البيانات الشخصية المعالجة من خلال التطبيق.\n\nللتواصل: support@hemensalon.com' },
      { heading: 'البيانات الشخصية المعالجة', body: '• الهوية: الاسم الكامل\n• الاتصال: رقم الهاتف، البريد الإلكتروني\n• النشاط التجاري: اسم الصالون، العنوان\n• المعاملات: المواعيد، الخدمات، المدفوعات\n• التقنية: عنوان IP، معلومات الجهاز، السجلات' },
      { heading: 'أغراض المعالجة', body: '• تنفيذ عقد الخدمة\n• إدارة المواعيد والإشعارات\n• دعم العملاء\n• الامتثال للالتزامات القانونية\n• أمان التطبيق' },
      { heading: 'الأسس القانونية', body: '• تنفيذ العقد\n• المصالح المشروعة\n• الموافقة الصريحة – للتواصل التسويقي' },
      { heading: 'نقل البيانات', body: 'قد تُنقل البيانات إلى:\n• مزودي الخوادم والبنية التحتية\n• مزودي خدمات الرسائل والبريد الإلكتروني\n• الجهات الحكومية المختصة' },
      { heading: 'فترات الاحتفاظ', body: '• بيانات الحساب: مدة النشاط + 30 يوماً\n• سجلات المعاملات: 10 سنوات\n• سجلات النظام: سنتان' },
      { heading: 'حقوقك', body: '• حق الوصول إلى بياناتك\n• حق التصحيح\n• حق الحذف\n• حق تقييد المعالجة\n• حق نقل البيانات\n• حق الاعتراض\n\nللتواصل: support@hemensalon.com\nالرد خلال 30 يوماً.' },
    ],
  },
}

export default async function KvkkPage() {
  const locale = await getLocale()
  return <LegalPage content={CONTENT[locale] ?? CONTENT.en} locale={locale} />
}
