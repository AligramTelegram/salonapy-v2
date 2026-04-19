import type { Metadata } from 'next'
import { LegalLayout } from '@/components/vitrin/LegalLayout'

export const metadata: Metadata = {
  title: 'İptal ve İade Politikası - Hemensalon',
  description: 'Hemensalon abonelik iptali ve iade koşulları hakkında bilgi alın. 14 günlük cayma hakkınızı kullanabilirsiniz.',
  robots: { index: true, follow: true },
}

const SECTIONS = [
  {
    heading: 'Cayma Hakkı',
    body: (
      <>
        <p>
          6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği
          kapsamında, aboneliğinizin başlangıcından itibaren <strong className="text-gray-800">14 gün içinde</strong> herhangi
          bir gerekçe göstermeksizin cayma hakkını kullanabilirsiniz.
        </p>
        <p>
          Cayma hakkını kullanmak için aşağıdaki iletişim kanallarından bize ulaşmanız yeterlidir:
        </p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'E-posta: destek@hemensalon.com',
            'İletişim formu: hemensalon.com/iletisim',
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
    heading: 'İptal Koşulları',
    body: (
      <>
        <p>
          Aboneliğinizi dilediğiniz zaman iptal edebilirsiniz. İptal işlemi mevcut ödeme döneminin
          sonunda geçerli olur; kalan süre için ücret iadesi yapılmaz.
        </p>
        <ul className="ml-4 list-none space-y-2">
          {[
            'Aylık abonelikte: İptal tarihinden sonraki ilk fatura kesilmez.',
            'Yıllık abonelikte: Kalan ay sayısına göre kısmi iade değerlendirilebilir.',
            '14 günlük deneme süresi içinde iptal: Ücret alınmaz.',
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
    heading: 'İade Süreci',
    body: (
      <p>
        Cayma hakkı kapsamında onaylanan iadeler, talebinizin ulaşmasından itibaren{' '}
        <strong className="text-gray-800">14 iş günü</strong> içinde ödeme yönteminize iade edilir.
        İade tutarı, kredi kartı ekstrelerinizde banka işlem sürelerine bağlı olarak 1–5 iş günü
        içinde görünebilir.
      </p>
    ),
  },
  {
    heading: 'İletişim',
    body: (
      <p>
        İptal ve iade talepleriniz için{' '}
        <a href="mailto:destek@hemensalon.com" className="text-purple-600 hover:underline">
          destek@hemensalon.com
        </a>{' '}
        adresine e-posta gönderebilir veya{' '}
        <a href="/iletisim" className="text-purple-600 hover:underline">
          iletişim formunu
        </a>{' '}
        kullanabilirsiniz. Talepleriniz en geç 1 iş günü içinde yanıtlanır.
      </p>
    ),
  },
]

export default function IptalIadePage() {
  return (
    <LegalLayout
      badge="İptal & İade"
      title="İptal ve İade Politikası"
      lastUpdated="1 Ocak 2025"
      sections={SECTIONS}
    />
  )
}
