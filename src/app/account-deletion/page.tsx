import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account Deletion / Hesap Silme – Hemensalon',
  description: 'Request deletion of your Hemensalon / Appointly account and personal data.',
}

const EN_SECTIONS = [
  { heading: '1. Overview', body: 'If you wish to permanently delete your Appointly (Hemensalon) account and all associated personal data, please send an email to the address below. Your account and all related data — including appointments, customer records, and staff information — will be permanently deleted within 7 business days.' },
  { heading: '2. What data will be deleted?', body: '• Account credentials (email, password)\n• Business profile (salon name, address, contact info)\n• Appointment history and records\n• Customer and staff information\n• Payment and transaction history\n• All notification and communication logs' },
  { heading: '3. Data Retention Notice', body: 'Some anonymized, non-identifiable data may be retained for legal and financial compliance purposes for up to 3 years, as required by applicable law.' },
]

const TR_SECTIONS = [
  { heading: '1. Genel Bilgi', body: 'Appointly (Hemensalon) hesabınızı ve hesabınıza ait tüm kişisel verilerinizi kalıcı olarak silmek istiyorsanız aşağıdaki e-posta adresine talep gönderin. Hesabınız ve buna bağlı tüm veriler — randevular, müşteri kayıtları, personel bilgileri dahil — 7 iş günü içinde kalıcı olarak silinecektir.' },
  { heading: '2. Hangi veriler silinecek?', body: '• Hesap bilgileri (e-posta, şifre)\n• İşletme profili (salon adı, adres, iletişim bilgileri)\n• Randevu geçmişi ve kayıtları\n• Müşteri ve personel bilgileri\n• Ödeme ve işlem geçmişi\n• Tüm bildirim ve iletişim kayıtları' },
  { heading: '3. Veri Saklama Notu', body: 'Kimliği belirlenemeyen anonimleştirilmiş bazı veriler, yasal ve mali yükümlülükler kapsamında yürürlükteki mevzuatın gerektirdiği şekilde en fazla 3 yıl süreyle saklanabilir.' },
]

export default function AccountDeletionPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="mx-auto max-w-2xl">

        {/* English */}
        <section className="mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-sm font-semibold text-red-600">Account Deletion Request</span>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Delete Your Appointly Account</h1>

          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 mb-8">
            <p className="text-sm font-semibold text-gray-700 mb-1">Send your deletion request to:</p>
            <a
              href="mailto:destek@hemensalon.com?subject=Account Deletion Request&body=Hello,%0A%0AI would like to permanently delete my Appointly account.%0A%0ARegistered Email: %0AName: %0A%0AThank you."
              className="text-lg font-bold text-red-600 hover:text-red-700 underline"
            >
              destek@hemensalon.com
            </a>
            <p className="mt-2 text-sm text-gray-500">Subject: <em>Account Deletion Request</em></p>
          </div>

          <div className="space-y-6">
            {EN_SECTIONS.map(s => (
              <div key={s.heading}>
                <h2 className="mb-2 text-lg font-bold text-gray-800">{s.heading}</h2>
                <p className="whitespace-pre-line text-gray-600 leading-relaxed text-[15px]">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-200 mb-16" />

        {/* Turkish */}
        <section>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-sm font-semibold text-red-600">Hesap Silme Talebi</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-gray-900">Appointly Hesabınızı Silin</h2>

          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 mb-8">
            <p className="text-sm font-semibold text-gray-700 mb-1">Silme talebinizi şu adrese gönderin:</p>
            <a
              href="mailto:destek@hemensalon.com?subject=Hesap Silme Talebi&body=Merhaba,%0A%0AAppointly hesabımın kalıcı olarak silinmesini talep ediyorum.%0A%0AKayıtlı E-posta: %0AAdım: %0A%0ATeşekkürler."
              className="text-lg font-bold text-red-600 hover:text-red-700 underline"
            >
              destek@hemensalon.com
            </a>
            <p className="mt-2 text-sm text-gray-500">Konu: <em>Hesap Silme Talebi</em></p>
          </div>

          <div className="space-y-6">
            {TR_SECTIONS.map(s => (
              <div key={s.heading}>
                <h2 className="mb-2 text-lg font-bold text-gray-800">{s.heading}</h2>
                <p className="whitespace-pre-line text-gray-600 leading-relaxed text-[15px]">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
