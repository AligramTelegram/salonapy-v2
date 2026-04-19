import type { Metadata } from 'next'
import { LegalLayout } from '@/components/vitrin/LegalLayout'

export const metadata: Metadata = {
  title: 'Çerez Politikası - Hemensalon',
  description: 'Hemensalon çerez politikası: hangi çerezleri kullandığımız ve nasıl kontrol edebileceğiniz hakkında bilgi.',
  robots: { index: false, follow: false },
}

const SECTIONS = [
  {
    heading: 'Çerez Nedir?',
    body: (
      <p>
        Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız tarafından cihazınıza kaydedilen
        küçük metin dosyalarıdır. Çerezler, web sitelerinin daha verimli çalışmasına, tercihlerinizin
        hatırlanmasına ve ziyaretçilere daha iyi bir deneyim sunulmasına yardımcı olur.
      </p>
    ),
  },
  {
    heading: 'Kullandığımız Çerez Türleri',
    body: (
      <div className="space-y-4">
        {[
          {
            tür: 'Zorunlu Çerezler',
            açıklama:
              'Bu çerezler Platform\'un düzgün çalışması için zorunludur. Oturum yönetimi, güvenlik doğrulaması ve temel işlevler için kullanılır. Bu çerezler devre dışı bırakılamaz.',
            saklama: 'Oturum süresi / 30 gün',
            rıza: 'Rıza gerekmez',
          },
          {
            tür: 'Fonksiyonel Çerezler',
            açıklama:
              'Dil tercihi, çerez onay durumu gibi kullanıcı tercihlerini hatırlamak için kullanılır.',
            saklama: '1 yıl',
            rıza: 'Tercihli (varsayılan: açık)',
          },
          {
            tür: 'Analitik Çerezler',
            açıklama:
              'Platform\'un nasıl kullanıldığını anlamak amacıyla anonim istatistiksel veriler toplar. Google Analytics aracılığıyla işlenir; IP anonimleştirme aktiftir.',
            saklama: '2 yıl',
            rıza: 'Açık rıza gerekir',
          },
          {
            tür: 'Performans Çerezleri',
            açıklama:
              'Sayfa yükleme süreleri ve hata tespiti için kullanılır. Veriler toplu ve anonimdir.',
            saklama: '90 gün',
            rıza: 'Açık rıza gerekir',
          },
        ].map((row) => (
          <div key={row.tür} className="rounded-lg border border-purple-100 bg-purple-50/50 p-4">
            <p className="mb-1 font-semibold text-gray-800">{row.tür}</p>
            <p className="mb-2 text-xs text-gray-600">{row.açıklama}</p>
            <div className="flex gap-4 text-xs text-gray-400">
              <span>Saklama: <span className="text-gray-600">{row.saklama}</span></span>
              <span>Rıza: <span className="text-gray-600">{row.rıza}</span></span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    heading: 'Üçüncü Taraf Çerezleri',
    body: (
      <>
        <p>Platform&apos;da aşağıdaki üçüncü taraf çerezleri kullanılabilir:</p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'Google Analytics: Kullanım analizi — analitik çerezler kapsamında',
            'Stripe: Ödeme güvenliği — zorunlu çerezler kapsamında',
            'İyzico: Ödeme güvenliği — zorunlu çerezler kapsamında',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
              {item}
            </li>
          ))}
        </ul>
        <p>
          Bu üçüncü tarafların çerez politikaları kendi web sitelerinde yayımlanmaktadır.
        </p>
      </>
    ),
  },
  {
    heading: 'Çerezleri Nasıl Kontrol Edebilirsiniz?',
    body: (
      <>
        <p>Çerezleri aşağıdaki yöntemlerle kontrol edebilirsiniz:</p>

        <p className="font-medium text-gray-700">Çerez Onay Paneli:</p>
        <p>
          Sitemizi ilk ziyaretinizde gösterilen çerez onay penceresinden tercihlerinizi
          yönetebilirsiniz. Zorunlu çerezler dışındakileri reddedebilirsiniz.
        </p>

        <p className="font-medium text-gray-700">Tarayıcı Ayarları:</p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'Chrome: Ayarlar → Gizlilik ve güvenlik → Çerezler',
            'Firefox: Ayarlar → Gizlilik ve Güvenlik → Çerezler',
            'Safari: Tercihler → Gizlilik → Çerezler',
            'Edge: Ayarlar → Gizlilik, arama ve hizmetler → Çerezler',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
              {item}
            </li>
          ))}
        </ul>
        <p>
          Zorunlu çerezleri tarayıcınızdan engellerseniz Platform&apos;un bazı özellikleri
          çalışmayabilir.
        </p>
      </>
    ),
  },
  {
    heading: 'Çerez Politikası Güncellemeleri',
    body: (
      <p>
        Bu çerez politikasını teknoloji, yasal mevzuat veya hizmetlerimizdeki değişikliklere bağlı
        olarak güncelleyebiliriz. Önemli değişiklikler e-posta yoluyla bildirilecektir. Güncel politika
        her zaman bu sayfada yayımlanacaktır.
      </p>
    ),
  },
]

export default function CerezPolitikasiPage() {
  return (
    <LegalLayout
      badge="Çerez"
      title="Çerez Politikası"
      lastUpdated="1 Ocak 2025"
      sections={SECTIONS}
    />
  )
}
