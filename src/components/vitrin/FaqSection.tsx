'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQS = [
  {
    q: 'Hemensalon online randevu sistemi ücretsiz mi?',
    a: 'Evet, 3 gün ücretsiz deneme sunuyoruz — kredi kartı gerekmez. Deneme süresi boyunca tüm özelliklere sınırsız erişebilirsiniz. Sonrasında işletme büyüklüğünüze göre uygun bir plan seçebilirsiniz.',
  },
  {
    q: 'Kuaförüm için online randevu sistemini nasıl kurarım?',
    a: 'Kurulum 5 dakikadan kısa sürer. Ücretsiz hesap açın, işletme adınızı ve hizmetlerinizi girin, çalışma saatlerinizi belirleyin. Randevu linkiniz hazır — Instagram biyografinize koyun, sistem çalışmaya başlar.',
  },
  {
    q: 'SMS hatırlatma özelliği nasıl çalışıyor?',
    a: 'Müşteri randevu aldığında anında SMS onayı gider. Randevudan 24 saat ve 2 saat önce otomatik hatırlatma mesajları iletilir. Bu sayede no-show (gelmeme) oranı ortalama %30 düşer.',
  },
  {
    q: 'WhatsApp üzerinden randevu alınabilir mi?',
    a: 'Evet. WhatsApp Business entegrasyonu ile randevu onayı, hatırlatma ve teşekkür mesajları otomatik gönderilir. Yakında aktif olacak AI Asistan özelliği ile WhatsApp\'tan gelen mesajlara yapay zeka otomatik yanıt verir ve randevu oluşturur.',
  },
  {
    q: 'Hangi sektörler Hemensalon kullanabilir?',
    a: 'Kuaför, berber, güzellik merkezi, nail art stüdyosu, güzellik kliniği, masaj salonu, dövme stüdyosu, epilasyon merkezi ve benzer randevu bazlı hizmet sunan tüm işletmeler kullanabilir.',
  },
  {
    q: 'Birden fazla personel ve şube yönetilebilir mi?',
    a: 'Evet. Her personele ayrı takvim ve çalışma saati tanımlayabilirsiniz. Müşteri randevu alırken istediği personeli seçebilir. İşletme planına göre birden fazla şube de desteklenmektedir.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-20 md:py-28 bg-gray-50" id="sss">
      <div className="container-custom max-w-3xl">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            Sık Sorulan Sorular
          </span>
          <h2 className="font-display text-3xl font-bold text-gray-900 md:text-4xl">
            Online randevu sistemi hakkında
            <br />
            <span className="text-purple-600">merak ettikleriniz</span>
          </h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={open === i}
              >
                <span className="font-semibold text-gray-900 text-sm md:text-base">
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200',
                    open === i && 'rotate-180 text-purple-600'
                  )}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
