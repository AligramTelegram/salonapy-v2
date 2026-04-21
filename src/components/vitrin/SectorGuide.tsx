'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Scissors, Sparkles, Stethoscope, Palette, Car } from 'lucide-react'

const SECTORS = [
  {
    icon: Scissors,
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    title: 'Kuaför ve Berberler',
    slug: 'kuafor-berber',
    summary: 'Boş koltuk = boş cüzdan. Randevusuna gelmeyen tek müşteri bile günün dengesini bozar.',
    content: `O telefon çalıyor. Bir eliniz makasta, diğer eliniz müşterinin saçında. Bakıyorsunuz ekrana — arayan kişi randevu sormak istiyor. Açamazsınız. Kapatıyorsunuz. Geçiyor. Ama o kişi başka bir yere gidiyor.

Kuaförlerin ve berberlerin çoğu bu sahneyi haftada onlarca kez yaşıyor. Üstelik işin kötü tarafı şu: boş koltuk sadece "kayıp randevu" değil, aynı zamanda kaybedilen kira, elektrik, personel maliyeti demek. Yarım saatlik boşluk ayda birikmeden hesaplanmaz; ama birikim yıllık binlerce liraya ulaşır.

HemenSalon'un online randevu sistemi sayesinde müşteri siz meşgulken bile randevusunu kendiniz alıyor. Sabah 02:00'de Instagram'dan sizi bulan bir müşteri, sabahı beklemeden takvime giriyor. Siz uyurken bile dolup taşan bir ajanda.

Bir de randevusuz gelen müşteriye ne diyorsunuz? "Bekleyebilir misiniz?" Beklemez. Gider. Ama sistemde anlık doluluk görünüyorsa, müşteri bunu baştan biliyor ve buna göre planlıyor. Koltukta boşluk da, holde sinirli bir bekleme de kalmıyor.

**SMS hatırlatma** konusuna ayrıca değinmek lazım. "Yarın randevunuz var, sizi bekliyoruz" mesajı göndermek için tek tek aramak ne kadar vakit alır? Bir berber düşünün — günde 15 randevu. Her birini aramak 3 dakika. Günde 45 dakika sadece hatırlatma telefonu. Haftada 5 gün — 225 dakika. Neredeyse dört saatlik iş gücü. Sistemin bunu otomatik yapması, size o dört saati geri veriyor.`,
  },
  {
    icon: Sparkles,
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    title: 'Güzellik Merkezleri & Lazer Epilasyon',
    slug: 'guzellik-merkezi-lazer',
    summary: 'Hangi müşteri kaçıncı seansta? Paket takibi olmadan işletmek, delik kovaya su doldurmak gibi.',
    content: `Lazer epilasyon merkezi işletmek başlı başına bir lojistik operasyonu. Müşteri var — 8 seanslık paket almış. Üçüncü seanstamı, beşinci mi? Hangi bölge yapıldı, hangisi kaldı? Cilt tipine göre enerji ayarı not edildi mi?

Kağıt dosyada tutanlar biliyor bu derdi. Bir müşteri "Geçen seansta sağ bacak yapıldı mıydı?" diye sorduğunda, çekmecede dosya aramak... Hem vakit kaybı, hem profesyonellik sorusu işareti.

HemenSalon'da her müşterinin seans geçmişi, notları ve paket bilgisi bir arada tutuluyor. Müşteri geldiğinde ekranı açıyorsunuz, tüm geçmişi önünüzde. Hangi seans, hangi tarih, hangi teknisyen — hepsi kayıtlı.

Güzellik merkezlerinde ayrıca çalışan takvimi kritik. Kim saat kaçta müsait? Cilt bakımı ve epilasyon aynı anda iki ayrı kabinde yürüyorsa, çakışmadan yönetmek şart. Sistem bunu otomatik çözüyor; aynı saate iki randevu düşmüyor, aynı kabine iki iş girmiyor.

Paket satışları ise ayrı bir tartışma. "Bu müşteri 5 seans almıştı, kaçı kaldı?" sorusu her gün sorulmak yerine, sistem zaten bunu takip ediyor ve son seans yaklaşınca hatırlatma yapıyor. Müşteriye "Seansınız bitiyor, yeni paket ister misiniz?" demek için doğru zamanı kaçırmıyorsunuz.`,
  },
  {
    icon: Stethoscope,
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    title: 'Klinikler ve Diyetisyenler',
    slug: 'klinik-diyetisyen',
    summary: 'Hasta dosyası, ölçüm takibi, randevu akışı — bunları ayrı ayrı yönetmek artık gerekmiyor.',
    content: `Bir diyetisyen kliniği düşünün. Sabah 9'da ilk hasta. Önceki görüşmede ne konuşuldu? Kaç kilo verdi, hangi diyet listesi verildi, bir sonraki hedef neydi? Bunları hatırlamak için deftere mi bakıyor, bilgisayarda eski Word dosyasını mı açıyor?

Hasta geldiğinde "geçen seferki notlarını bulamıyorum" demek, o hastanın gözünde güven kaybı. Basit ama kritik.

Kliniklerde randevu yönetimi ayrı bir başlık. Psikolog, diyetisyen, fizik tedavi — gün boyunca yoğun bir akış var. Hasta 15 dakika geç kalırsa sonraki randevuya ne oluyor? Sistem bunu planlıyor. Aralara esneklik koyabiliyorsunuz, acil durumlar için boşluk yaratabiliyorsunuz.

SMS hatırlatma kliniklerde özellikle kritik çünkü hastalar randevuyu 2-3 hafta önceden alıyor. O tarih geldiğinde, randevu aklında olmayabiliyor. Otomatik hatırlatma mesajı gittiğinde iptal oranı düşüyor. Boş kalan saati başka hastaya verebiliyorsunuz.

Raporlama tarafında ise ay sonunda hangi hizmet ne kadar gelir getirdi, hangi paketler daha çok tercih edildi, aylık hasta sayısı nasıl seyretti — bunları elle hesaplamak değil, bir ekranda görmek istiyorsunuz. İşletme sahiplerinin en çok zaman harcadığı yer bu hesaplamalar. Sistemin bunu otomatik yapması, o zamanı hastalarınıza ve işinize verebilmeniz demek.`,
  },
  {
    icon: Palette,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    title: 'Dövme Stüdyoları & Sanat Atölyeleri',
    slug: 'dovme-studyo',
    summary: 'Kapora takibi, referans görsel notları, uzun seans planlaması — kağıtta değil, sistemde.',
    content: `Dövme işi uzun bir süreç. Müşteri ilk görüşmede tasarımı konuşuyor, kaparo bırakıyor. Bir ay sonra geliyor. O bir ayda ne oldu? Referans görseller nerede? Tasarım onaylandı mı? Büyüklük ve yerleşim üzerinde anlaşıldı mı?

Bunların hepsini hatırlamaya çalışmak yerine, müşteri kartına not düşmek yeterli. Müşteri geldiğinde açıyorsunuz, her şey orada.

Kapora takibi ise stüdyolarda ayrı bir baş ağrısı. Kim ödedi, kim ödemedi, ne kadar kaldı? Kağıtta tutanlar biliyor — "Ödedi mi ödemedi mi?" sorusu utandırıcı bir an yaratıyor. Sistem bunu netleştiriyor; ödemeleri kayıt altında tutuyor.

Uzun seanslar (full back, sleeve gibi büyük işler) için seans arası planlama da kritik. İlk seans ne zaman yapıldı, hangi bölge tamamlandı, iyileşme süresi ne kadar, sonraki seans ne zaman olmalı? Bunları sisteme girdiğinizde, hem müşterinize doğru bilgi veriyorsunuz, hem de takviminizi buna göre düzenliyorsunuz.

Sanat atölyelerinde de benzer tablo geçerli. Seramik kursu, resim atölyesi, takı yapımı — sınıf kapasitesi var, her hafta tekrarlayan gruplar var. Kimin hangi kursa kayıtlı olduğunu takip etmek, elle tutulur bir iş yükü. Sistemde grup randevusu tanımlamak ve kayıtları buradan yönetmek bu yükü ortadan kaldırıyor.`,
  },
  {
    icon: Car,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    title: 'Oto Bakım & Detailing Merkezleri',
    slug: 'oto-bakim',
    summary: 'Araç bazlı takip, servis kapasitesi planlaması ve müşteri sadakati — hepsi bir arada.',
    content: `Oto detailing veya bakım merkezi, klasik randevu sistemlerinin pek düşünmediği bir alan. Ama ihtiyaçlar aynı, hatta biraz daha karmaşık. Çünkü burada müşteri değil, araç takip ediliyor.

"Bu araç en son ne zaman geldi? İç-dış temizlik mi yapıldı, seramik mi? Müşteri paket mi almıştı?" Bu soruları her araç geldiğinde sıfırdan sormak hem vakit kaybı, hem profesyonellik sorunu. Araç plakasıyla müşteri kaydı tutmak, her gelişte geçmiş işlemleri görmek — bu kadar basit bir özellik aslında büyük bir fark yaratıyor.

Kapasite planlaması da kritik. Bir detailing merkezi günde kaç araç alabiliyor? Dolu bir günde yeni araç kabul etmek, hem kaliteyi düşürüyor, hem müşteriyi mutsuz ediyor. Online randevu sistemi kapasiteyi görünür kılıyor; dolu günler kendiliğinden kapanıyor, müşteri boş bir tarih seçiyor.

SMS hatırlatma burada biraz farklı çalışıyor: müşteriye randevu hatırlatmasının yanı sıra, "Aracınızın 6 aylık bakımı yaklaşıyor" gibi periyodik mesajlar da gönderilebilir. Bu müşteriyi geri getiriyor. Pazarlama yapmadan, sadece sistemin hatırlatmasıyla tekrar randevu alıyorsunuz.`,
  },
]

const FAQ_ITEMS = [
  {
    q: 'HemenSalon\'u kullanmaya başlamak ne kadar sürer?',
    a: 'Hesap oluşturmak, işletme bilgilerini ve hizmetleri girmek yaklaşık 5-10 dakika alıyor. Teknik kurulum yok, sunucu yok, IT destek gerektirmiyor. Tarayıcıdan veya telefondan açıyorsunuz, başlıyorsunuz.',
  },
  {
    q: 'Müşterilerimin telefon numaraları güvende mi?',
    a: 'Tüm veriler Türkiye KVKK mevzuatına ve Avrupa GDPR standartlarına uygun şifrelenmiş altyapıda saklanıyor. Verileriniz üçüncü taraflarla paylaşılmıyor.',
  },
  {
    q: 'SMS hatırlatma pakete dahil mi?',
    a: 'Her planla birlikte aylık belirli sayıda SMS kredisi geliyor. Profesyonel ve İşletme planlarında bu kota daha yüksek. İhtiyaç olursa ek SMS kredisi satın alınabiliyor.',
  },
  {
    q: 'Birden fazla çalışan veya şube olursa ne yapıyoruz?',
    a: 'Her çalışan için ayrı takvim ve çalışma saatleri tanımlayabiliyorsunuz. Randevular otomatik olarak ilgili kişiye atanıyor. Birden fazla şubeniz varsa İşletme planı buna göre yapılandırıldı.',
  },
  {
    q: 'İnternet olmadığında sistem çalışıyor mu?',
    a: 'Sistem bulut tabanlı olduğu için internet bağlantısı gerekiyor. Ancak telefonunuza kısayol olarak ekleyebiliyorsunuz, masaüstü uygulama gibi çalışıyor.',
  },
]

function AccordionItem({
  item,
  isOpen,
  toggle,
}: {
  item: typeof SECTORS[0]
  isOpen: boolean
  toggle: () => void
}) {
  const IconComponent = item.icon
  return (
    <div className={`border rounded-2xl overflow-hidden bg-white transition-all duration-200 ${isOpen ? 'border-purple-200 shadow-sm' : 'border-gray-100'}`}>
      <button
        onClick={toggle}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50/80 transition-colors"
      >
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
          <IconComponent className={`h-5 w-5 ${item.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-gray-900 text-sm md:text-base">{item.title}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.summary}</p>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-gray-50">
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-3">
                {item.content.split('\n\n').map((para, i) => (
                  <p key={i} dangerouslySetInnerHTML={{
                    __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FaqItem({ q, a, isOpen, toggle }: { q: string; a: string; isOpen: boolean; toggle: () => void }) {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 text-sm">{q}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 pt-1 text-sm text-gray-500 leading-relaxed border-t border-gray-50">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function SectorGuide() {
  const [openSector, setOpenSector] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <section className="py-20 md:py-28 bg-gray-50/60">
      <div className="container-custom">

        {/* Sektörler */}
        <div className="mb-16">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
              Sektörünüz ne olursa olsun
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900 md:text-4xl mb-4">
              Randevu kaosu<br />
              <span className="text-purple-600">herkese aynı şekilde dokunuyor</span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-500 text-base leading-relaxed">
              Kuaförden kliniğe, dövme stüdyosundan oto bakım merkezine — kayıp randevu, unutulan müşteri ve hesap karmaşası her işletmede aynı sonucu veriyor. Boşa giden zaman, boşa giden para.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {SECTORS.map((sector) => (
              <AccordionItem
                key={sector.slug}
                item={sector}
                isOpen={openSector === sector.slug}
                toggle={() => setOpenSector(openSector === sector.slug ? null : sector.slug)}
              />
            ))}
          </div>
        </div>

        {/* SMS Hatırlatma Vurgu */}
        <div className="max-w-3xl mx-auto mb-16 rounded-2xl bg-purple-600 p-8 text-white text-center">
          <p className="text-3xl mb-3">📱</p>
          <h3 className="font-display text-xl font-bold mb-3">SMS Hatırlatma Bir Lüks Değil</h3>
          <p className="text-purple-100 leading-relaxed max-w-xl mx-auto text-sm">
            Araştırmalar randevu hatırlatmalarının gelmeme oranını %40'a kadar düşürdüğünü gösteriyor. Müşterinizi tek tek aramak yerine sistem otomatik mesaj gönderiyor. Bir çalışanın maaşından çok daha ucuza, tam zamanlı sekreterlik hizmeti.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[
              { label: 'Gelmeme oranı', value: '-%40' },
              { label: 'Günlük tasarruf', value: '~4 saat' },
              { label: 'Kurulum süresi', value: '5 dk' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-purple-200 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SSS */}
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="font-display text-2xl font-bold text-gray-900">Sık Sorulan Sorular</h2>
          </div>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem
                key={i}
                q={item.q}
                a={item.a}
                isOpen={openFaq === i}
                toggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
