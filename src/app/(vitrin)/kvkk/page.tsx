import type { Metadata } from 'next'
import { LegalLayout } from '@/components/vitrin/LegalLayout'

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni - Salonapy',
  description: '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında Salonapy aydınlatma metni.',
  robots: { index: false, follow: false },
}

const SECTIONS = [
  {
    heading: 'Veri Sorumlusunun Kimliği',
    body: (
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, kişisel verileriniz
        veri sorumlusu sıfatıyla <strong className="text-gray-800">Salonapy</strong> tarafından
        işbu Aydınlatma Metni kapsamında işlenecektir.
        İletişim: <a href="mailto:destek@salonapy.com" className="text-purple-600 hover:underline">destek@salonapy.com</a>
      </p>
    ),
  },
  {
    heading: 'İşlenen Kişisel Veri Kategorileri',
    body: (
      <>
        <p>Platformumuz kapsamında aşağıdaki kategorilerdeki kişisel veriler işlenmektedir:</p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'Kimlik Verileri: Ad-soyad',
            'İletişim Verileri: E-posta adresi, telefon numarası',
            'İşletme Verileri: İşletme adı, adresi, sektör bilgisi',
            'Müşteri Verileri: İşletmenizin müşterilerine ait ad, telefon, randevu geçmişi (bu veriler sizin tarafınızdan girilmektedir)',
            'Finansal Veriler: Abonelik planı, ödeme durumu (kart/banka bilgileri işlenmemektedir)',
            'İşlem Güvenliği Verileri: IP adresi, oturum bilgileri, log kayıtları',
            'Pazarlama Verileri: Platform kullanım alışkanlıkları, özellik kullanım istatistikleri',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    heading: 'Kişisel Verilerin İşlenme Amaçları ve Hukuki Sebepleri',
    body: (
      <>
        <div className="space-y-4">
          {[
            {
              amaç: 'Hizmetin sunulması',
              hukuki: 'Sözleşmenin kurulması ve ifası (KVKK m.5/2-c)',
            },
            {
              amaç: 'Hesap oluşturma ve kimlik doğrulama',
              hukuki: 'Sözleşmenin kurulması ve ifası (KVKK m.5/2-c)',
            },
            {
              amaç: 'Randevu bildirimleri ve hatırlatmalar',
              hukuki: 'Açık rıza ve/veya meşru menfaat (KVKK m.5/2-f)',
            },
            {
              amaç: 'Abonelik ve faturalandırma',
              hukuki: 'Hukuki yükümlülüğün yerine getirilmesi (KVKK m.5/2-ç)',
            },
            {
              amaç: 'Platform güvenliği',
              hukuki: 'Meşru menfaat (KVKK m.5/2-f)',
            },
            {
              amaç: 'Müşteri desteği',
              hukuki: 'Sözleşmenin ifası / meşru menfaat',
            },
          ].map((row) => (
            <div key={row.amaç} className="rounded-lg border border-purple-100 bg-purple-50/50 p-3">
              <p className="font-medium text-gray-800">{row.amaç}</p>
              <p className="text-xs text-gray-500">{row.hukuki}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    heading: 'Kişisel Verilerin Aktarımı',
    body: (
      <>
        <p>Kişisel verileriniz yurt içinde ve/veya yurt dışında aşağıdaki taraflara aktarılabilir:</p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'Supabase Inc. (ABD) — Veritabanı ve kimlik doğrulama altyapısı; Standart Sözleşme Maddeleri kapsamında',
            'Vercel Inc. (ABD) — Uygulama barındırma; Standart Sözleşme Maddeleri kapsamında',
            'Resend Inc. (ABD) — E-posta iletim altyapısı; Standart Sözleşme Maddeleri kapsamında',
            'NetGSM Bilgi İletişim A.Ş. (Türkiye) — SMS iletim altyapısı',
            'İyzico Ödeme Hizmetleri A.Ş. (Türkiye) — Ödeme işleme',
            'Stripe Inc. (ABD) — Uluslararası ödeme işleme; Standart Sözleşme Maddeleri kapsamında',
            'Yetkili kamu kurum ve kuruluşları — Yasal zorunluluk halinde',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    heading: 'Kişisel Verilerin Toplanma Yöntemi',
    body: (
      <>
        <p>Kişisel verileriniz aşağıdaki yöntemlerle toplanmaktadır:</p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'Kayıt ve giriş formları aracılığıyla elektronik ortamda',
            'Platform kullanımı sırasında otomatik olarak (çerezler, log kayıtları)',
            'İletişim formu ve destek talepleri aracılığıyla',
            'Ödeme işlemleri sırasında ödeme sağlayıcıları aracılığıyla',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    heading: 'İlgili Kişinin Hakları (KVKK Madde 11)',
    body: (
      <>
        <p>KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
            'Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme',
            'Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme',
            'Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme',
            'Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme',
            'Kişisel verilerinizin silinmesini veya yok edilmesini isteme',
            'Düzeltme, silme ve yok etme işlemlerinin aktarım yapılan üçüncü kişilere bildirilmesini isteme',
            'İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme',
            'Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    heading: 'Başvuru Yöntemi',
    body: (
      <>
        <p>
          Yukarıda belirtilen haklarınızı kullanmak için aşağıdaki kanallardan bize ulaşabilirsiniz:
        </p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'E-posta: destek@salonapy.com (konu satırında "KVKK Başvurusu" yazınız)',
            'İletişim formu: salonapy.com/iletisim',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
              {item}
            </li>
          ))}
        </ul>
        <p>
          Başvurularınız, kimliğinizi doğrulayan belgeleri içermeli ve talebin açıkça belirtilmesi
          gerekmektedir. Başvurular, KVKK&apos;nın 13. maddesi uyarınca en geç 30 (otuz) gün içinde
          sonuçlandırılacaktır.
        </p>
        <p>
          Başvurunuzun reddedilmesi veya yetersiz yanıt verilmesi durumunda Kişisel Verileri Koruma
          Kurulu&apos;na (&quot;Kurul&quot;) şikayette bulunma hakkınız saklıdır.
        </p>
      </>
    ),
  },
]

export default function KVKKPage() {
  return (
    <LegalLayout
      badge="KVKK"
      title="KVKK Aydınlatma Metni"
      lastUpdated="1 Ocak 2025"
      sections={SECTIONS}
    />
  )
}
