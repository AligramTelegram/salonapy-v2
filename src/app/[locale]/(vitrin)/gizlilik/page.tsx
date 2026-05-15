import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: locale === 'tr' ? 'Gizlilik Politikası – Hemensalon' : 'Privacy Policy – Hemensalon',
    description: locale === 'tr'
      ? 'Hemensalon gizlilik politikası ve kişisel veri işleme koşulları.'
      : 'Hemensalon privacy policy and personal data processing terms.',
  }
}

const TR = {
  title: 'Gizlilik Politikası',
  updated: 'Son güncelleme: 16 Mayıs 2026',
  sections: [
    {
      heading: '1. Genel Bilgi',
      body: 'Hemensalon ("uygulama", "biz", "bizim") olarak gizliliğinize saygı duyuyor ve kişisel verilerinizi korumayı taahhüt ediyoruz. Bu gizlilik politikası, uygulamamızı kullanırken hangi verileri topladığımızı, bu verileri nasıl kullandığımızı ve haklarınızı açıklamaktadır.',
    },
    {
      heading: '2. Topladığımız Veriler',
      body: 'Uygulamamız aşağıdaki verileri toplayabilir:\n• Ad, soyad ve iletişim bilgileri (telefon, e-posta)\n• İşletme bilgileri (salon adı, adresi)\n• Randevu ve hizmet kayıtları\n• Uygulama kullanım verileri (anonim analitik)\n• Cihaz bilgileri (model, işletim sistemi)',
    },
    {
      heading: '3. Verilerin Kullanım Amacı',
      body: 'Toplanan veriler şu amaçlarla kullanılır:\n• Randevu yönetimi ve hatırlatma bildirimleri gönderme\n• Müşteri ve personel profillerini yönetme\n• Uygulamanın performansını ve kullanıcı deneyimini iyileştirme\n• Teknik destek sağlama\n• Yasal yükümlülükleri yerine getirme',
    },
    {
      heading: '4. Verilerin Paylaşımı',
      body: 'Kişisel verilerinizi üçüncü taraflarla satmıyoruz. Veriler yalnızca şu durumlarda paylaşılır:\n• Hizmet sağlayıcılarımızla (SMS gönderimi, e-posta servisi, sunucu altyapısı)\n• Yasal zorunluluk halinde yetkili makamlarla\n• Açık rızanız olduğunda',
    },
    {
      heading: '5. SMS ve E-posta Bildirimleri',
      body: 'Uygulamayı kullanan salon sahipleri, müşterilerine randevu hatırlatma SMS ve e-postaları gönderebilir. Bu bildirimler yalnızca randevuya ilişkin bilgiler içerir. SMS hizmeti yalnızca Türkiye\'deki kullanıcılara sunulmaktadır.',
    },
    {
      heading: '6. Veri Güvenliği',
      body: 'Verilerinizi korumak için endüstri standardı güvenlik önlemleri uyguluyoruz. Tüm veriler şifreli bağlantılar (HTTPS/TLS) üzerinden iletilir ve güvenli sunucularda saklanır.',
    },
    {
      heading: '7. Veri Saklama Süresi',
      body: 'Kişisel verileriniz hesabınız aktif olduğu sürece saklanır. Hesabınızı sildiğinizde verileriniz 30 gün içinde kalıcı olarak silinir.',
    },
    {
      heading: '8. Haklarınız',
      body: 'KVKK kapsamında aşağıdaki haklara sahipsiniz:\n• Kişisel verilerinize erişim hakkı\n• Verilerinizin düzeltilmesini talep etme\n• Verilerinizin silinmesini talep etme\n• Veri işlemeye itiraz etme\n\nBu haklarınızı kullanmak için destek@hemensalon.com adresine e-posta gönderebilirsiniz.',
    },
    {
      heading: '9. Çocukların Gizliliği',
      body: 'Uygulamamız 18 yaşın altındaki kişilere yönelik değildir. 18 yaşından küçük kişilerin kişisel verilerini bilerek toplamıyoruz.',
    },
    {
      heading: '10. İletişim',
      body: 'Gizlilik politikamız hakkında sorularınız için:\nE-posta: destek@hemensalon.com\nWeb: https://www.hemensalon.com',
    },
  ],
}

const EN = {
  title: 'Privacy Policy',
  updated: 'Last updated: May 16, 2026',
  sections: [
    {
      heading: '1. Overview',
      body: 'Hemensalon ("app", "we", "our") respects your privacy and is committed to protecting your personal data. This privacy policy explains what data we collect when you use our app, how we use it, and your rights.',
    },
    {
      heading: '2. Data We Collect',
      body: 'Our app may collect the following data:\n• Full name and contact information (phone number, email address)\n• Business information (salon name, address)\n• Appointment and service records\n• App usage data (anonymous analytics)\n• Device information (model, operating system)',
    },
    {
      heading: '3. How We Use Your Data',
      body: 'Collected data is used to:\n• Manage appointments and send reminder notifications\n• Manage customer and staff profiles\n• Improve app performance and user experience\n• Provide technical support\n• Comply with legal obligations',
    },
    {
      heading: '4. Data Sharing',
      body: 'We do not sell your personal data to third parties. Data is only shared:\n• With our service providers (SMS delivery, email service, server infrastructure)\n• With competent authorities when legally required\n• With your explicit consent',
    },
    {
      heading: '5. SMS and Email Notifications',
      body: 'Salon owners using the app may send appointment reminder SMS messages and emails to their customers. These notifications contain only appointment-related information. SMS service is available only for users in Turkey.',
    },
    {
      heading: '6. Data Security',
      body: 'We apply industry-standard security measures to protect your data. All data is transmitted over encrypted connections (HTTPS/TLS) and stored on secure servers.',
    },
    {
      heading: '7. Data Retention',
      body: 'Your personal data is retained as long as your account is active. When you delete your account, your data is permanently deleted within 30 days.',
    },
    {
      heading: '8. Your Rights',
      body: 'You have the following rights regarding your personal data:\n• Right to access your personal data\n• Right to request correction of your data\n• Right to request deletion of your data\n• Right to object to data processing\n\nTo exercise these rights, please contact us at: support@hemensalon.com',
    },
    {
      heading: '9. Children\'s Privacy',
      body: 'Our app is not directed at individuals under the age of 18. We do not knowingly collect personal data from children under 18.',
    },
    {
      heading: '10. Contact Us',
      body: 'If you have any questions about this privacy policy:\nEmail: support@hemensalon.com\nWebsite: https://www.hemensalon.com',
    },
  ],
}

export default async function GizlilikPage() {
  const locale = await getLocale()
  const content = locale === 'tr' ? TR : EN

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-custom max-w-3xl">
        <h1 className="mb-2 font-display text-4xl font-bold text-gray-900">{content.title}</h1>
        <p className="mb-10 text-sm text-gray-400">{content.updated}</p>

        <div className="space-y-8">
          {content.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="mb-3 font-display text-xl font-bold text-gray-800">{section.heading}</h2>
              <p className="whitespace-pre-line text-gray-600 leading-relaxed text-[15px]">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
