import type { Metadata } from 'next'
import { LegalLayout } from '@/components/vitrin/LegalLayout'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası - Salonapy',
  description: 'Salonapy gizlilik politikası: kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi alın.',
  robots: { index: false, follow: false },
}

const SECTIONS = [
  {
    heading: 'Veri Sorumlusu',
    body: (
      <>
        <p>
          Bu gizlilik politikası, <strong className="text-gray-800">Salonapy</strong> tarafından işletilen
          salonapy.com web sitesi ve ilgili hizmetlere ilişkin kişisel veri işleme faaliyetlerini açıklamaktadır.
        </p>
        <p>
          Veri sorumlusu olarak Salonapy, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili
          mevzuat kapsamındaki yükümlülüklerimizi yerine getirmektedir.
        </p>
        <p>
          İletişim: <a href="mailto:destek@salonapy.com" className="text-purple-600 hover:underline">destek@salonapy.com</a>
        </p>
      </>
    ),
  },
  {
    heading: 'Toplanan Kişisel Veriler',
    body: (
      <>
        <p>Hizmetlerimizi kullanırken aşağıdaki kişisel verileriniz işlenebilir:</p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'Kimlik bilgileri: Ad, soyad',
            'İletişim bilgileri: E-posta adresi, telefon numarası',
            'İşletme bilgileri: İşletme adı, adresi, sektör bilgisi',
            'Finansal bilgiler: Abonelik planı, ödeme geçmişi (kart bilgileri işlenmez)',
            'Kullanım verileri: Giriş zamanları, sayfa görüntülemeleri, özellik kullanımı',
            'Teknik veriler: IP adresi, tarayıcı türü, cihaz bilgisi, çerezler',
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
    heading: 'Kişisel Verilerin İşlenme Amaçları',
    body: (
      <>
        <p>Toplanan veriler aşağıdaki amaçlarla işlenmektedir:</p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'Hizmetin sunulması ve sürdürülmesi',
            'Hesap oluşturma ve yönetimi',
            'Randevu, müşteri ve personel yönetimi özelliklerinin işletilmesi',
            'Abonelik ve faturalandırma işlemlerinin yürütülmesi',
            'SMS hatırlatmaları ve e-posta iletişimi',
            'Teknik destek ve müşteri hizmetleri',
            'Platform güvenliği ve dolandırıcılık önleme',
            'Yasal yükümlülüklerin yerine getirilmesi',
            'Hizmet iyileştirme ve kullanıcı deneyimi analizi',
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
    heading: 'Verilerin Paylaşımı',
    body: (
      <>
        <p>
          Kişisel verileriniz, açık rızanız olmaksızın üçüncü taraflarla paylaşılmamaktadır. Ancak
          aşağıdaki durumlar istisna oluşturmaktadır:
        </p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'Hizmet sağlayıcılar: Supabase (veritabanı), Vercel (hosting), Resend (e-posta), NetGSM (SMS API) — yalnızca hizmetin işletilmesi için gerekli ölçüde',
            'Ödeme işlemcileri: İyzico ve Stripe — ödeme güvenliği amacıyla, kart bilgileriniz Salonapy\'ye iletilmez',
            'Yasal zorunluluklar: Mahkeme kararı, yasal düzenleme veya yetkili idari/adli makam talebi',
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
    heading: 'Çerezler (Cookies)',
    body: (
      <>
        <p>
          Web sitemizde hizmetin işletilmesi için zorunlu çerezler ve kullanım analizi için analitik
          çerezler kullanılmaktadır. Çerezler hakkında detaylı bilgi için{' '}
          <a href="/cerez-politikasi" className="text-purple-600 hover:underline">
            Çerez Politikamızı
          </a>{' '}
          inceleyebilirsiniz.
        </p>
        <p>
          Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz. Ancak zorunlu çerezlerin
          devre dışı bırakılması hizmetin düzgün çalışmasını engelleyebilir.
        </p>
      </>
    ),
  },
  {
    heading: 'Veri Saklama Süreleri',
    body: (
      <>
        <p>Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca saklanmaktadır:</p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'Hesap bilgileri: Hesap aktif olduğu sürece + hesap silme tarihinden itibaren 30 gün',
            'Randevu ve müşteri verileri: Hesap aktif olduğu sürece + 1 yıl',
            'Finansal kayıtlar: Yasal yükümlülükler gereğince 10 yıl',
            'Log ve güvenlik verileri: 6 ay',
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
    heading: 'Veri Güvenliği',
    body: (
      <p>
        Kişisel verilerinizi yetkisiz erişim, değişiklik, ifşa veya imhaya karşı korumak için
        endüstri standardı güvenlik önlemleri uygulamaktayız. Veriler SSL/TLS şifrelemesiyle
        iletilmekte, sunucu tarafında güvenli altyapıda saklanmaktadır. Bununla birlikte internet
        üzerinden yapılan hiçbir iletimin %100 güvenli olduğu garanti edilemez.
      </p>
    ),
  },
  {
    heading: 'İlgili Kişi Hakları',
    body: (
      <>
        <p>KVKK kapsamında kişisel verilerinize ilişkin aşağıdaki haklara sahipsiniz:</p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
            'İşlenmişse buna ilişkin bilgi talep etme',
            'İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme',
            'Verilerin aktarıldığı üçüncü kişileri öğrenme',
            'Eksik veya yanlış işlenen verilerin düzeltilmesini isteme',
            'Kişisel verilerin silinmesini veya yok edilmesini isteme',
            'Kişisel verileriniz aleyhine sonuç doğuran bir kararın yalnızca otomatik işleme dayalı olmaksızın itiraz etme',
            'Kişisel verilerinizin kanuna aykırı işlenmesi nedeniyle uğradığınız zararın giderilmesini talep etme',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
              {item}
            </li>
          ))}
        </ul>
        <p>
          Haklarınızı kullanmak için{' '}
          <a href="mailto:destek@salonapy.com" className="text-purple-600 hover:underline">
            destek@salonapy.com
          </a>{' '}
          adresine yazabilir veya{' '}
          <a href="/iletisim" className="text-purple-600 hover:underline">
            iletişim formunu
          </a>{' '}
          kullanabilirsiniz.
        </p>
      </>
    ),
  },
  {
    heading: 'Politika Değişiklikleri',
    body: (
      <p>
        Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda
        kayıtlı e-posta adresinize bildirim gönderilecektir. Güncel politika her zaman bu sayfada
        yayımlanacaktır.
      </p>
    ),
  },
]

export default function GizlilikPage() {
  return (
    <LegalLayout
      badge="Gizlilik"
      title="Gizlilik Politikası"
      lastUpdated="1 Ocak 2025"
      sections={SECTIONS}
    />
  )
}
