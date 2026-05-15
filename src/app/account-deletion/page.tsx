import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account Deletion / Hesap Silme – Hemensalon',
  description: 'Request deletion of your Hemensalon / Appointly account and personal data.',
}

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

          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Delete Your Appointly Account
          </h1>

          <p className="mb-6 text-gray-600 leading-relaxed">
            If you wish to permanently delete your account and all personal data associated with
            <strong> Appointly (Hemensalon)</strong>, please send an email to the address below.
            Your account and all related data — including appointments, customer records, and staff
            information — will be <strong>permanently deleted within 7 business days</strong>.
          </p>

          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-1">Send your deletion request to:</p>
            <a
              href="mailto:destek@hemensalon.com?subject=Account Deletion Request&body=Hello,%0A%0AI would like to permanently delete my Appointly account.%0A%0ARegistered Email: %0AName: %0A%0AThank you."
              className="text-lg font-bold text-red-600 hover:text-red-700 underline"
            >
              destek@hemensalon.com
            </a>
            <p className="mt-3 text-sm text-gray-500">Subject: <em>Account Deletion Request</em></p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <p className="text-sm font-bold text-gray-700 mb-3">What data will be deleted?</p>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                'Account credentials (email, password)',
                'Business profile (salon name, address, contact info)',
                'Appointment history and records',
                'Customer and staff information',
                'Payment and transaction history',
                'All notification and communication logs',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500">✕</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-gray-400">
              Some anonymized, non-identifiable data may be retained for legal and financial compliance
              purposes for up to 3 years, as required by applicable law.
            </p>
          </div>
        </section>

        <hr className="border-gray-200 mb-16" />

        {/* Turkish */}
        <section>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-sm font-semibold text-red-600">Hesap Silme Talebi</span>
          </div>

          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Appointly Hesabınızı Silin
          </h2>

          <p className="mb-6 text-gray-600 leading-relaxed">
            <strong>Appointly (Hemensalon)</strong> hesabınızı ve hesabınıza ait tüm kişisel
            verilerinizi kalıcı olarak silmek istiyorsanız aşağıdaki e-posta adresine talep
            gönderin. Hesabınız ve buna bağlı tüm veriler —randevular, müşteri kayıtları,
            personel bilgileri dahil— <strong>7 iş günü içinde kalıcı olarak silinecektir</strong>.
          </p>

          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-1">Silme talebinizi şu adrese gönderin:</p>
            <a
              href="mailto:destek@hemensalon.com?subject=Hesap Silme Talebi&body=Merhaba,%0A%0AAppointly hesabımın kalıcı olarak silinmesini talep ediyorum.%0A%0AKayıtlı E-posta: %0AAdım: %0A%0ATeşekkürler."
              className="text-lg font-bold text-red-600 hover:text-red-700 underline"
            >
              destek@hemensalon.com
            </a>
            <p className="mt-3 text-sm text-gray-500">Konu: <em>Hesap Silme Talebi</em></p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <p className="text-sm font-bold text-gray-700 mb-3">Hangi veriler silinecek?</p>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                'Hesap bilgileri (e-posta, şifre)',
                'İşletme profili (salon adı, adres, iletişim bilgileri)',
                'Randevu geçmişi ve kayıtları',
                'Müşteri ve personel bilgileri',
                'Ödeme ve işlem geçmişi',
                'Tüm bildirim ve iletişim kayıtları',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500">✕</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-gray-400">
              Kimliği belirlenemeyen anonimleştirilmiş bazı veriler, yasal ve mali yükümlülükler
              kapsamında yürürlükteki mevzuatın gerektirdiği şekilde en fazla 3 yıl süreyle saklanabilir.
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
