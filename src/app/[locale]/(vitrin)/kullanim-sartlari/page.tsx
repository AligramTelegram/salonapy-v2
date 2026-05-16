import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { LegalPage, type LegalContent } from '@/components/vitrin/LegalPage'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const titles: Record<string, string> = {
    tr: 'Kullanım Şartları – Hemensalon',
    en: 'Terms of Service – Hemensalon',
    de: 'Nutzungsbedingungen – Hemensalon',
    ar: 'شروط الخدمة – Hemensalon',
  }
  return { title: titles[locale] ?? titles.en }
}

const CONTENT: Record<string, LegalContent> = {
  tr: {
    title: 'Kullanım Şartları',
    updated: 'Son güncelleme: 16 Mayıs 2026',
    sections: [
      { heading: '1. Kabul', body: 'Hemensalon uygulamasını veya web sitesini kullanarak bu kullanım şartlarını kabul etmiş olursunuz. Şartları kabul etmiyorsanız uygulamayı kullanmayınız.' },
      { heading: '2. Hizmet Tanımı', body: 'Hemensalon; kuaför, berber ve güzellik salonu işletmecileri için randevu, müşteri, personel, stok ve finans yönetimi sunan bir mobil ve web uygulamasıdır.' },
      { heading: '3. Hesap Oluşturma', body: '• Doğru ve güncel bilgilerle kayıt olmanız gerekmektedir.\n• Hesap güvenliğinizden siz sorumlusunuz.\n• Hesabınızı başkalarıyla paylaşamazsınız.\n• 18 yaşından küçük bireyler hesap açamaz.' },
      { heading: '4. Abonelik ve Ödeme', body: '• Başlangıç planı 3 gün ücretsiz deneme içerir.\n• Ücretli planlar aylık olarak faturalandırılır.\n• İptal, bir sonraki fatura döneminden itibaren geçerli olur.\n• Fiyatlar KDV dahildir ve önceden bildirim yapılarak değiştirilebilir.' },
      { heading: '5. Kabul Edilemez Kullanım', body: 'Aşağıdaki kullanımlar yasaktır:\n• Yasadışı faaliyetler için kullanım\n• Spam veya istenmeyen iletişim gönderimi\n• Sistemlere yetkisiz erişim girişimi\n• Uygulamanın tersine mühendisliği\n• Başkalarının verilerine izinsiz erişim' },
      { heading: '6. Veri Mülkiyeti', body: 'Uygulamaya girdiğiniz veriler (müşteri bilgileri, randevular vb.) size aittir. Hemensalon bu verileri yalnızca hizmet sunmak amacıyla kullanır.' },
      { heading: '7. Hizmet Kesintileri', body: 'Hemensalon, bakım veya beklenmedik durumlar nedeniyle hizmeti geçici olarak kesebilir. Bu sürelerde erişim garantisi verilmez.' },
      { heading: '8. Sorumluluk Sınırı', body: 'Hemensalon, dolaylı, arızi veya sonuç kayıplarından sorumlu tutulamaz. Toplam sorumluluğumuz son 3 aylık abonelik ücreti ile sınırlıdır.' },
      { heading: '9. Değişiklikler', body: 'Bu şartları değiştirme hakkını saklı tutarız. Önemli değişiklikler e-posta veya uygulama bildirimi yoluyla duyurulur. Değişiklik sonrası kullanım, yeni şartları kabul sayılır.' },
      { heading: '10. Geçerli Hukuk', body: 'Bu şartlar Türkiye Cumhuriyeti hukukuna tabidir. Anlaşmazlıklar İstanbul mahkemelerinde çözüme kavuşturulur.\n\nİletişim: destek@hemensalon.com' },
    ],
  },
  en: {
    title: 'Terms of Service',
    updated: 'Last updated: May 16, 2026',
    sections: [
      { heading: '1. Acceptance', body: 'By using Hemensalon app or website, you agree to these Terms of Service. If you disagree, do not use the app.' },
      { heading: '2. Service Description', body: 'Hemensalon is a mobile and web application providing appointment, customer, staff, inventory, and finance management for hair salon, barber, and beauty studio owners.' },
      { heading: '3. Account Creation', body: '• You must register with accurate and up-to-date information.\n• You are responsible for the security of your account.\n• You may not share your account with others.\n• Individuals under 18 may not create an account.' },
      { heading: '4. Subscription & Payment', body: '• The starter plan includes a 3-day free trial.\n• Paid plans are billed monthly.\n• Cancellation takes effect from the next billing period.\n• Prices include applicable taxes and may change with prior notice.' },
      { heading: '5. Prohibited Use', body: 'The following uses are prohibited:\n• Use for illegal activities\n• Sending spam or unsolicited communications\n• Attempting unauthorized access to systems\n• Reverse engineering the application\n• Unauthorized access to others\' data' },
      { heading: '6. Data Ownership', body: 'Data you enter (customer records, appointments, etc.) belongs to you. Hemensalon uses this data solely to provide the service.' },
      { heading: '7. Service Interruptions', body: 'Hemensalon may temporarily suspend service for maintenance or unforeseen circumstances. Access is not guaranteed during these periods.' },
      { heading: '8. Limitation of Liability', body: 'Hemensalon shall not be liable for indirect, incidental, or consequential damages. Our total liability is limited to the last 3 months of subscription fees paid.' },
      { heading: '9. Changes', body: 'We reserve the right to modify these terms. Material changes will be notified via email or in-app notification. Continued use after changes constitutes acceptance.' },
      { heading: '10. Governing Law', body: 'These terms are governed by the laws of the Republic of Turkey. Disputes shall be resolved in Istanbul courts.\n\nContact: support@hemensalon.com' },
    ],
  },
  de: {
    title: 'Nutzungsbedingungen',
    updated: 'Zuletzt aktualisiert: 16. Mai 2026',
    sections: [
      { heading: '1. Annahme', body: 'Durch die Nutzung der Hemensalon-App oder -Website stimmen Sie diesen Nutzungsbedingungen zu.' },
      { heading: '2. Dienstbeschreibung', body: 'Hemensalon ist eine mobile und Web-Anwendung für Termin-, Kunden-, Mitarbeiter-, Lager- und Finanzverwaltung für Friseursalons, Barbiere und Beauty-Studios.' },
      { heading: '3. Kontoerstellung', body: '• Sie müssen sich mit korrekten und aktuellen Daten registrieren.\n• Sie sind für die Sicherheit Ihres Kontos verantwortlich.\n• Sie dürfen Ihr Konto nicht mit anderen teilen.\n• Personen unter 18 Jahren dürfen kein Konto erstellen.' },
      { heading: '4. Abonnement & Zahlung', body: '• Der Starterplan enthält eine kostenlose 3-Tage-Testphase.\n• Kostenpflichtige Pläne werden monatlich abgerechnet.\n• Kündigung gilt ab der nächsten Abrechnungsperiode.\n• Preise inkl. MwSt., Änderungen mit vorheriger Ankündigung.' },
      { heading: '5. Verbotene Nutzung', body: 'Folgende Nutzungen sind untersagt:\n• Nutzung für illegale Aktivitäten\n• Versenden von Spam oder unerwünschter Kommunikation\n• Versuche unbefugten Systemzugangs\n• Reverse Engineering der Anwendung' },
      { heading: '6. Dateneigentum', body: 'Die von Ihnen eingegebenen Daten gehören Ihnen. Hemensalon nutzt diese Daten ausschließlich zur Erbringung des Dienstes.' },
      { heading: '7. Dienstunterbrechungen', body: 'Hemensalon kann den Dienst vorübergehend für Wartungsarbeiten unterbrechen. Während dieser Zeit wird kein Zugang garantiert.' },
      { heading: '8. Haftungsbeschränkung', body: 'Hemensalon haftet nicht für indirekte oder Folgeschäden. Die Gesamthaftung ist auf die letzten 3 Monatsgebühren begrenzt.' },
      { heading: '9. Änderungen', body: 'Wir behalten uns vor, diese Bedingungen zu ändern. Wesentliche Änderungen werden per E-Mail oder App-Benachrichtigung mitgeteilt.' },
      { heading: '10. Anwendbares Recht', body: 'Diese Bedingungen unterliegen dem türkischen Recht.\n\nKontakt: support@hemensalon.com' },
    ],
  },
  ar: {
    title: 'شروط الخدمة',
    updated: 'آخر تحديث: 16 مايو 2026',
    sections: [
      { heading: '1. القبول', body: 'باستخدام تطبيق أو موقع Hemensalon، فإنك توافق على شروط الخدمة هذه.' },
      { heading: '2. وصف الخدمة', body: 'Hemensalon تطبيق جوال وويب لإدارة المواعيد والعملاء والموظفين والمخزون والمالية لصالونات الشعر والحلاقة ومراكز التجميل.' },
      { heading: '3. إنشاء الحساب', body: '• يجب التسجيل بمعلومات صحيحة وحديثة.\n• أنت مسؤول عن أمان حسابك.\n• لا يمكنك مشاركة حسابك مع الآخرين.\n• لا يُسمح للأشخاص دون 18 عاماً بإنشاء حساب.' },
      { heading: '4. الاشتراك والدفع', body: '• تتضمن الخطة الأساسية تجربة مجانية لمدة 3 أيام.\n• تُفوتر الخطط المدفوعة شهرياً.\n• يسري الإلغاء من دورة الفوترة التالية.\n• الأسعار شاملة الضرائب وقابلة للتغيير مع إشعار مسبق.' },
      { heading: '5. الاستخدام المحظور', body: 'يُحظر ما يلي:\n• الاستخدام في أنشطة غير قانونية\n• إرسال رسائل غير مرغوب فيها\n• محاولة الوصول غير المصرح به للأنظمة\n• الهندسة العكسية للتطبيق' },
      { heading: '6. ملكية البيانات', body: 'البيانات التي تدخلها تعود لك. تستخدم Hemensalon هذه البيانات فقط لتقديم الخدمة.' },
      { heading: '7. انقطاع الخدمة', body: 'قد تعلق Hemensalon الخدمة مؤقتاً للصيانة. لا يُضمن الوصول خلال هذه الفترات.' },
      { heading: '8. تحديد المسؤولية', body: 'لا تتحمل Hemensalon المسؤولية عن الأضرار غير المباشرة. تقتصر المسؤولية الإجمالية على رسوم الاشتراك لآخر 3 أشهر.' },
      { heading: '9. التغييرات', body: 'نحتفظ بحق تعديل هذه الشروط. ستُبلَّغ بالتغييرات الجوهرية عبر البريد الإلكتروني أو إشعار التطبيق.' },
      { heading: '10. القانون المطبق', body: 'تخضع هذه الشروط لقوانين جمهورية تركيا.\n\nللتواصل: support@hemensalon.com' },
    ],
  },
}

export default async function KullanimSartlariPage() {
  const locale = await getLocale()
  return <LegalPage content={CONTENT[locale] ?? CONTENT.en} locale={locale} />
}
