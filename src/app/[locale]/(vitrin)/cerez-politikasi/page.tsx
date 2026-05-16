import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { LegalPage, type LegalContent } from '@/components/vitrin/LegalPage'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const titles: Record<string, string> = {
    tr: 'Çerez Politikası – Hemensalon',
    en: 'Cookie Policy – Hemensalon',
    de: 'Cookie-Richtlinie – Hemensalon',
    ar: 'سياسة ملفات تعريف الارتباط – Hemensalon',
  }
  return { title: titles[locale] ?? titles.en }
}

const CONTENT: Record<string, LegalContent> = {
  tr: {
    title: 'Çerez Politikası',
    updated: 'Son güncelleme: 16 Mayıs 2026',
    sections: [
      { heading: '1. Çerez Nedir?', body: 'Çerezler, tarayıcınız aracılığıyla cihazınıza yerleştirilen küçük metin dosyalarıdır. Web sitesinin düzgün çalışması, tercihlerinizin hatırlanması ve kullanım analitiği için kullanılır.' },
      { heading: '2. Kullandığımız Çerez Türleri', body: '🔒 Zorunlu Çerezler\nSitenin temel işlevleri için gereklidir. Oturum çerezleri, CSRF koruması.\n\n⚙️ Tercih Çerezleri\nDil ve tema tercihlerinizi hatırlar.\n\n📊 Analitik Çerezler\nSite kullanımını anonim olarak ölçmek için (Vercel Analytics). Kişisel veri içermez.\n\n❌ Pazarlama Çerezleri\nHemensalon kendi bünyesinde reklam hedefleme çerezi kullanmaz.' },
      { heading: '3. Üçüncü Taraf Çerezleri', body: 'Aşağıdaki üçüncü taraf hizmetleri çerez yerleştirebilir:\n• Vercel Analytics – anonim trafik analizi\n• Google Tag Manager – isteğe bağlı analytics entegrasyonu\n\nBu hizmetlerin kendi gizlilik politikaları geçerlidir.' },
      { heading: '4. Çerezleri Yönetme', body: 'Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz:\n• Chrome: Ayarlar → Gizlilik ve güvenlik → Çerezler\n• Firefox: Ayarlar → Gizlilik ve Güvenlik\n• Safari: Tercihler → Gizlilik\n\nZorunlu çerezlerin kapatılması site işlevlerini etkileyebilir.' },
      { heading: '5. İletişim', body: 'Sorularınız için: destek@hemensalon.com' },
    ],
  },
  en: {
    title: 'Cookie Policy',
    updated: 'Last updated: May 16, 2026',
    sections: [
      { heading: '1. What Are Cookies?', body: 'Cookies are small text files placed on your device via your browser. They are used for proper website functionality, remembering preferences, and usage analytics.' },
      { heading: '2. Types of Cookies We Use', body: '🔒 Strictly Necessary Cookies\nRequired for basic site functions. Session cookies, CSRF protection.\n\n⚙️ Preference Cookies\nRemember your language and theme settings.\n\n📊 Analytics Cookies\nMeasure site usage anonymously (Vercel Analytics). No personal data.\n\n❌ Marketing Cookies\nHemensalon does not use advertising targeting cookies.' },
      { heading: '3. Third-Party Cookies', body: 'The following third-party services may set cookies:\n• Vercel Analytics – anonymous traffic analysis\n• Google Tag Manager – optional analytics integration\n\nTheir respective privacy policies apply.' },
      { heading: '4. Managing Cookies', body: 'You can manage cookies through your browser settings:\n• Chrome: Settings → Privacy and security → Cookies\n• Firefox: Settings → Privacy & Security\n• Safari: Preferences → Privacy\n\nDisabling necessary cookies may affect site functionality.' },
      { heading: '5. Contact', body: 'Questions: support@hemensalon.com' },
    ],
  },
  de: {
    title: 'Cookie-Richtlinie',
    updated: 'Zuletzt aktualisiert: 16. Mai 2026',
    sections: [
      { heading: '1. Was sind Cookies?', body: 'Cookies sind kleine Textdateien, die über Ihren Browser auf Ihrem Gerät platziert werden. Sie dienen der Grundfunktionalität der Website, der Speicherung von Einstellungen und der anonymen Nutzungsanalyse.' },
      { heading: '2. Von uns verwendete Cookie-Typen', body: '🔒 Notwendige Cookies\nFür grundlegende Website-Funktionen erforderlich. Sitzungs-Cookies, CSRF-Schutz.\n\n⚙️ Präferenz-Cookies\nSpeichern Ihre Sprach- und Designeinstellungen.\n\n📊 Analyse-Cookies\nMessen die Website-Nutzung anonym (Vercel Analytics). Keine persönlichen Daten.\n\n❌ Marketing-Cookies\nHemensalon verwendet keine Werbe-Targeting-Cookies.' },
      { heading: '3. Drittanbieter-Cookies', body: 'Folgende Drittanbieterdienste können Cookies setzen:\n• Vercel Analytics – anonyme Traffic-Analyse\n• Google Tag Manager – optionale Analytics-Integration' },
      { heading: '4. Cookies verwalten', body: 'Sie können Cookies über Ihre Browser-Einstellungen verwalten:\n• Chrome: Einstellungen → Datenschutz → Cookies\n• Firefox: Einstellungen → Datenschutz\n• Safari: Einstellungen → Datenschutz\n\nDas Deaktivieren notwendiger Cookies kann die Website-Funktionalität beeinträchtigen.' },
      { heading: '5. Kontakt', body: 'Bei Fragen: support@hemensalon.com' },
    ],
  },
  ar: {
    title: 'سياسة ملفات تعريف الارتباط',
    updated: 'آخر تحديث: 16 مايو 2026',
    sections: [
      { heading: '1. ما هي ملفات تعريف الارتباط؟', body: 'ملفات تعريف الارتباط هي ملفات نصية صغيرة تُوضع على جهازك عبر المتصفح. تُستخدم لضمان عمل الموقع بشكل صحيح وتذكر التفضيلات وتحليل الاستخدام.' },
      { heading: '2. أنواع ملفات تعريف الارتباط التي نستخدمها', body: '🔒 الضرورية\nمطلوبة للوظائف الأساسية للموقع. ملفات الجلسة، حماية CSRF.\n\n⚙️ التفضيلية\nتحفظ إعدادات اللغة والمظهر.\n\n📊 التحليلية\nتقيس استخدام الموقع بشكل مجهول (Vercel Analytics). لا تحتوي على بيانات شخصية.\n\n❌ التسويقية\nلا تستخدم Hemensalon ملفات تعريف ارتباط للاستهداف الإعلاني.' },
      { heading: '3. ملفات تعريف الارتباط التابعة لجهات خارجية', body: 'قد تضع الخدمات التالية ملفات تعريف ارتباط:\n• Vercel Analytics – تحليل حركة المرور المجهولة\n• Google Tag Manager – تكامل تحليلي اختياري' },
      { heading: '4. إدارة ملفات تعريف الارتباط', body: 'يمكنك إدارتها عبر إعدادات المتصفح:\n• Chrome: الإعدادات ← الخصوصية ← ملفات تعريف الارتباط\n• Firefox: الإعدادات ← الخصوصية\n• Safari: التفضيلات ← الخصوصية' },
      { heading: '5. التواصل', body: 'للاستفسار: support@hemensalon.com' },
    ],
  },
}

export default async function CerezPolitikasiPage() {
  const locale = await getLocale()
  return <LegalPage content={CONTENT[locale] ?? CONTENT.en} locale={locale} />
}
