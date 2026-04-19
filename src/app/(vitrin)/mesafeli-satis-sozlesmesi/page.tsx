import type { Metadata } from 'next'
import { LegalLayout } from '@/components/vitrin/LegalLayout'

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi - Hemensalon',
  description: 'Hemensalon mesafeli satış sözleşmesi. Abonelik satın alımlarına ilişkin hak ve yükümlülükleriniz hakkında bilgi alın.',
  robots: { index: true, follow: true },
}

const SECTIONS = [
  {
    heading: 'Taraflar',
    body: (
      <>
        <p>
          <strong className="text-gray-800">Satıcı:</strong> Hemensalon (hemensalon.com){' '}
          · E-posta: destek@hemensalon.com
        </p>
        <p>
          <strong className="text-gray-800">Alıcı:</strong> Hemensalon platformuna üye olan ve abonelik
          satın alan gerçek veya tüzel kişi.
        </p>
      </>
    ),
  },
  {
    heading: 'Sözleşmenin Konusu',
    body: (
      <p>
        Bu sözleşme, Alıcı&apos;nın Hemensalon web sitesi üzerinden satın aldığı yazılım abonelik
        hizmetinin koşullarını düzenler. Hizmet; randevu yönetimi, müşteri takibi, personel
        yönetimi ve ilgili SaaS özelliklerini kapsar.
      </p>
    ),
  },
  {
    heading: 'Cayma Hakkı',
    body: (
      <>
        <p>
          Alıcı, sözleşmenin kurulduğu tarihten itibaren <strong className="text-gray-800">14 gün içinde</strong> herhangi
          bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
        </p>
        <p>
          Cayma hakkı bildiriminin iletilmesi için:{' '}
          <a href="mailto:destek@hemensalon.com" className="text-purple-600 hover:underline">
            destek@hemensalon.com
          </a>
        </p>
      </>
    ),
  },
  {
    heading: 'Ödeme ve Fiyatlandırma',
    body: (
      <>
        <p>
          Abonelik ücretleri, seçilen plana ve ödeme periyoduna göre belirlenir. Tüm fiyatlara
          KDV dahildir. Ödeme; kredi kartı veya banka kartı aracılığıyla iyzico güvenli ödeme
          altyapısı üzerinden gerçekleştirilir.
        </p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'Aylık abonelikler: Her ay otomatik yenilenir.',
            'Yıllık abonelikler: 12 aylık dönem için tek seferinde ücretlendirilir.',
            'Deneme süresi: 14 gün ücretsiz, kredi kartı gerekmez.',
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
    heading: 'Hizmetin İfası',
    body: (
      <p>
        Abonelik ödemesinin onaylanmasının ardından hizmet anında aktif edilir. Hizmet, internet
        erişimi gerektiren bir SaaS (yazılım hizmeti) olup tarayıcı üzerinden kullanılır. Alıcı,
        hizmetin dijital niteliği gereği fiziksel teslimat söz konusu olmadığını kabul eder.
      </p>
    ),
  },
  {
    heading: 'Uyuşmazlık Çözümü',
    body: (
      <p>
        Bu sözleşmeden doğabilecek uyuşmazlıklarda Türk Hukuku uygulanır. Tüketici
        mahkemeleri ve Tüketici Hakem Heyetleri yetkilidir. İletişim için:{' '}
        <a href="/iletisim" className="text-purple-600 hover:underline">
          iletişim formu
        </a>{' '}
        veya{' '}
        <a href="mailto:destek@hemensalon.com" className="text-purple-600 hover:underline">
          destek@hemensalon.com
        </a>
        .
      </p>
    ),
  },
]

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <LegalLayout
      badge="Mesafeli Satış"
      title="Mesafeli Satış Sözleşmesi"
      lastUpdated="1 Ocak 2025"
      sections={SECTIONS}
    />
  )
}
