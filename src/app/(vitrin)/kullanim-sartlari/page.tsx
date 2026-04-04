import type { Metadata } from 'next'
import { LegalLayout } from '@/components/vitrin/LegalLayout'

export const metadata: Metadata = {
  title: 'Kullanım Şartları - Salonapy',
  description: 'Salonapy kullanım şartları ve koşulları. Platformumuzu kullanmadan önce lütfen okuyunuz.',
  robots: { index: false, follow: false },
}

const SECTIONS = [
  {
    heading: 'Kabul Koşulları',
    body: (
      <>
        <p>
          Salonapy platformunu (&quot;Platform&quot;) kullanarak bu kullanım şartlarını kabul etmiş
          sayılırsınız. Şartları kabul etmiyorsanız Platformu kullanmayınız.
        </p>
        <p>
          Bu şartlar, Salonapy ile siz (&quot;İşletme&quot; veya &quot;Kullanıcı&quot;) arasındaki hukuki
          ilişkiyi düzenlemektedir. Platforma erişiminiz bu şartlara uymanıza bağlıdır.
        </p>
      </>
    ),
  },
  {
    heading: 'Hizmetin Tanımı',
    body: (
      <>
        <p>
          Salonapy; kuaför, berber, güzellik merkezi ve randevu ile çalışan işletmeler için bulut
          tabanlı bir yönetim platformudur. Platform şu özellikleri içerir:
        </p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'Çevrimiçi randevu yönetimi ve takvim',
            'Müşteri ilişkileri yönetimi (CRM)',
            'Personel yönetimi ve çalışma saatleri',
            'SMS bildirimleri ve hatırlatmalar',
            'Finansal takip ve raporlama',
            'Abonelik bazlı fiyatlandırma',
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
    heading: 'Hesap Oluşturma ve Güvenlik',
    body: (
      <>
        <p>
          Platform&apos;u kullanmak için hesap oluşturmanız gerekmektedir. Hesabınızla ilgili
          aşağıdaki yükümlülükleri kabul edersiniz:
        </p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'Doğru, güncel ve eksiksiz bilgi sağlamak',
            'Hesap bilgilerinizin gizliliğini korumak',
            'Hesabınızda gerçekleşen tüm faaliyetlerden sorumlu olmak',
            'Şifrenizin yetkisiz kişilerce ele geçirildiğini öğrendiğinizde derhal bildirmek',
            'Hesabınızı başkasına devretmemek veya satmamak',
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
    heading: 'Kullanıcı Yükümlülükleri',
    body: (
      <>
        <p>Platform&apos;u kullanırken aşağıdakilerden kaçınmanız gerekmektedir:</p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'Yasa dışı faaliyetler için Platform\'u kullanmak',
            'Platform\'un güvenlik önlemlerini atlatmaya çalışmak',
            'Diğer kullanıcıların verilerine yetkisiz erişmeye çalışmak',
            'Platforma zarar verecek yazılım veya kod yüklemek',
            'Platform\'un altyapısını aşırı yük altına sokacak faaliyetler yürütmek',
            'Spam, kötü amaçlı içerik veya yanıltıcı bilgi yaymak',
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
    heading: 'Abonelik ve Ödeme',
    body: (
      <>
        <p>
          Salonapy abonelik tabanlı bir hizmet sunar. Ödeme koşulları aşağıdaki gibidir:
        </p>
        <ul className="ml-4 list-none space-y-2">
          {[
            '14 günlük ücretsiz deneme süresi sonunda bir plan seçmeniz gerekir',
            'Aylık abonelik ücretleri dönem başında tahsil edilir',
            'Ödemeler Türkiye\'de İyzico, uluslararası işlemlerde Stripe üzerinden gerçekleştirilir',
            'Plan yükseltme işlemi anında geçerli olur; fark tutarı bir sonraki faturada hesaplanır',
            'Plan düşürme işlemi mevcut dönem sonunda geçerli olur',
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
    heading: 'İade Politikası',
    body: (
      <>
        <p>
          Salonapy, dijital hizmet niteliği taşıdığından aşağıdaki iade politikası geçerlidir:
        </p>
        <ul className="ml-4 list-none space-y-2">
          {[
            '14 günlük ücretsiz deneme süresi içinde ücret alınmaz; iade söz konusu değildir',
            'Aylık abonelik ücretleri iade edilmez',
            'Platform\'da yaşanan teknik aksaklıklar nedeniyle hizmet kullanılamaması durumunda, etkilenen süre oranında kredi tanımlanabilir',
            'İade taleplerinizi destek@salonapy.com adresine iletebilirsiniz; her talep bireysel olarak değerlendirilir',
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
    heading: 'Hizmetin Askıya Alınması ve Fesih',
    body: (
      <>
        <p>
          Salonapy, aşağıdaki durumlarda hesabınızı askıya alabilir veya silebilir:
        </p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'Bu kullanım şartlarının ihlali',
            'Ödeme temerrüdü (ödeme başarısızlığından 7 gün sonra)',
            'Dolandırıcılık veya kötüye kullanım tespiti',
            'Yasal bir zorunluluk',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
              {item}
            </li>
          ))}
        </ul>
        <p>
          Hesap feshinden sonra verileriniz 30 gün boyunca saklanır; bu süre içinde dışa aktarma
          talebinde bulunabilirsiniz. Sonrasında veriler kalıcı olarak silinir.
        </p>
        <p>
          Hesabınızı kendiniz istediğiniz zaman kapatabilirsiniz. İptal işlemi mevcut abonelik
          döneminin sonunda geçerli olur.
        </p>
      </>
    ),
  },
  {
    heading: 'Fikri Mülkiyet',
    body: (
      <p>
        Platform&apos;un tüm içerikleri, yazılımı, logolar, tasarımlar ve ticari markalar Salonapy&apos;ye
        aittir. Platforma erişim, bu fikri mülkiyet haklarının size devredildiği anlamına gelmez.
        Verileriniz (müşteri bilgileri, randevular vb.) ise tamamen size aittir; Salonapy bu verileri
        yalnızca hizmetin işletilmesi amacıyla işler.
      </p>
    ),
  },
  {
    heading: 'Sorumluluk Sınırlaması',
    body: (
      <>
        <p>
          Salonapy, Platform&apos;un kesintisiz veya hatasız çalışacağını garanti etmez. Hizmet
          kesintileri, veri kaybı veya yetkisiz erişimden doğan zararlardan Salonapy&apos;nin sorumluluğu,
          ilgili aydaki abonelik ücreti ile sınırlıdır.
        </p>
        <p>
          Platform üzerinden yönetilen müşteri ilişkileri, randevular ve finansal verilerle ilgili
          son karar ve sorumluluk kullanıcıya aittir.
        </p>
      </>
    ),
  },
  {
    heading: 'Şartlarda Değişiklik',
    body: (
      <p>
        Bu şartları zaman zaman güncelleyebiliriz. Önemli değişiklikler en az 30 gün önce
        e-posta yoluyla bildirilecektir. Değişiklik sonrası Platform&apos;u kullanmaya devam etmek,
        güncellenmiş şartları kabul ettiğiniz anlamına gelir.
      </p>
    ),
  },
  {
    heading: 'Uygulanacak Hukuk',
    body: (
      <p>
        Bu şartlar Türkiye Cumhuriyeti hukuku kapsamında yorumlanır ve uygulanır. Herhangi bir
        anlaşmazlık durumunda İstanbul mahkemeleri yetkilidir.
      </p>
    ),
  },
]

export default function KullanimSartlariPage() {
  return (
    <LegalLayout
      badge="Hukuki"
      title="Kullanım Şartları"
      lastUpdated="1 Ocak 2025"
      sections={SECTIONS}
    />
  )
}
