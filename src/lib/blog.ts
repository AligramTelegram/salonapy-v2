export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string // HTML
  date: string
  author: {
    name: string
    initials: string
    avatarBg: string
    avatarColor: string
    title: string
  }
  coverGradient: string
  coverAccent: string
  readTime: number
  tags: string[]
}

const POSTS: BlogPost[] = [
  {
    slug: 'whatsapp-randevu-hatirlatma',
    title: 'WhatsApp Randevu Hatırlatma: Müşteri İptalleri Nasıl Azaltılır?',
    excerpt:
      'Randevu iptalleri her salonu etkiliyor. WhatsApp otomasyonu ile iptal oranını %30\'a kadar düşüren stratejiler.',
    date: '2026-03-20',
    author: {
      name: 'Hemensalon Ekibi',
      initials: 'SE',
      avatarBg: 'bg-purple-100',
      avatarColor: 'text-purple-700',
      title: 'Ürün Ekibi',
    },
    coverGradient: 'from-purple-500 via-violet-500 to-indigo-600',
    coverAccent: 'bg-purple-100',
    readTime: 5,
    tags: ['WhatsApp', 'Randevu', 'Otomasyon'],
    content: `
      <p>Araştırmalar, salon randevularının ortalama <strong>%25-35</strong>'inin haber verilmeden iptal edildiğini ya da unutulduğunu gösteriyor. Bu kayıp, küçük bir salon için aylık on binlerce lira anlamına gelir.</p>

      <h2>Neden Müşteriler Randevularını Unutuyor?</h2>
      <p>Günlük hayatın yoğunluğu içinde randevu tarih ve saatini akılda tutmak zorlaşıyor. Özellikle 2 haftadan uzun süre önceden alınan randevular büyük risk taşır.</p>
      <ul>
        <li>Günlük takvim kullanım oranı düşük</li>
        <li>Randevu detaylarını kaydeden müşteri sayısı az</li>
        <li>İş, aile, sağlık nedeniyle plansız meşguliyet</li>
      </ul>

      <h2>WhatsApp Hatırlatma Stratejisi</h2>
      <p>Etkili bir WhatsApp hatırlatma akışı şu mesajlardan oluşur:</p>

      <h3>1. Anlık Onay Mesajı</h3>
      <p>Randevu alındığı anda müşteriye detayları içeren onay mesajı gönderin. Bu mesaj güven oluşturur ve müşteri tarafından ekran görüntüsü olarak saklanır.</p>

      <h3>2. 24 Saat Öncesi Hatırlatma</h3>
      <p>En kritik hatırlatma noktasıdır. Müşteriye yarın randevusu olduğunu bildirin ve gerekirse iptal/erteleme seçeneği sunun.</p>

      <h3>3. 2 Saat Öncesi Kısa Hatırlatma</h3>
      <p>Kısa ve öz bir "sizi bekliyoruz" mesajı. Uzun metin yazmayın, müşteri zaten hazırlanıyor olabilir.</p>

      <h2>Sonuçlar</h2>
      <p>Hemensalon kullanan işletmelerin verileri incelendiğinde, düzenli WhatsApp hatırlatması uygulayan salonlarda iptal oranının <strong>%32 düştüğü</strong> görülmüştür. Aylık 50 randevu alan bir salon için bu, ortalama 16 ek dolu randevu demek.</p>

      <h2>Hemen Başlayın</h2>
      <p>Hemensalon'nin WhatsApp otomasyon özelliği, tüm bu mesajları otomatik olarak gönderir. Siz yalnızca randevuyu girersiniz, geri kalanını sistem halleder.</p>
    `,
  },
  {
    slug: 'salon-verimlilik-ipuclari',
    title: 'Salonunuzun Verimliliğini %40 Artıracak 7 İpucu',
    excerpt:
      'Küçük değişiklikler, büyük farklar yaratır. Randevu akışından personel yönetimine kadar verimliliği artıran pratik öneriler.',
    date: '2026-03-12',
    author: {
      name: 'Hemensalon Ekibi',
      initials: 'SE',
      avatarBg: 'bg-purple-100',
      avatarColor: 'text-purple-700',
      title: 'Ürün Ekibi',
    },
    coverGradient: 'from-blue-500 via-cyan-500 to-teal-500',
    coverAccent: 'bg-blue-100',
    readTime: 7,
    tags: ['Verimlilik', 'Yönetim', 'İpuçları'],
    content: `
      <p>Salon işletmeciliğinde başarı, sadece teknik beceriye değil, <strong>iş yönetimine</strong> de bağlıdır. İşte en etkili 7 ipucu:</p>

      <h2>1. Randevu Aralıklarını Optimize Edin</h2>
      <p>Her hizmet için gerçekçi süreler belirleyin. Müşteriyi ağırlamak, ödeme almak ve hazırlık süresini hesaba katın. Çok sıkışık programa "tampon süreler" ekleyin.</p>

      <h2>2. Blok Randevu Sistemi Kullanın</h2>
      <p>Saçlı işlemleri sabah, manikür/pedikür öğleden sonra gibi hizmet bloklarıyla personel kullanımını optimize edin.</p>

      <h2>3. Müşteri Geçmişini Takip Edin</h2>
      <p>Müşterinin önceki ziyaretlerini, tercihlerini ve notlarını kaydedin. "Geçen sefer hangi boyayı kullanmıştık?" sorusu sormadan hizmet kalitesini artırın.</p>

      <h2>4. Doluluk Oranını İzleyin</h2>
      <p>Hangi gün ve saatler boş kalıyor? Bu verilere bakarak kampanya dönemlerini ve indirim günlerini planlayın.</p>

      <h2>5. Personel Başına Geliri Hesaplayın</h2>
      <p>Her personelin aylık gelir katkısını bilin. Yüksek performanslı personeli ödüllendirin, düşük performansı birlikte analiz edin.</p>

      <h2>6. Hatırlatma ile Yeniden Çekme</h2>
      <p>60 gün gelmemiş müşterilere otomatik "sizi özledik" mesajı gönderin. Bu basit dokunuş, kayıp müşteri oranını ciddi düşürür.</p>

      <h2>7. Mobil Panel Kullanın</h2>
      <p>Telefonunuzdan takvimi anlık görün, randevu ekleyin ve müşteri durumunu takip edin. Masa başında olmak zorunda değilsiniz.</p>

      <h2>Sonuç</h2>
      <p>Bu 7 ipucunu hayata geçiren işletmeler, ortalama <strong>%40 verimlilik artışı</strong> yaşıyor. Küçük adımlar, büyük farklar yaratır.</p>
    `,
  },
  {
    slug: 'online-randevu-sistemi-neden-onemli',
    title: 'Online Randevu Sistemi Neden Artık Zorunlu?',
    excerpt:
      'Telefonla randevu almak artık geçmişte kaldı. Müşteriler 7/24 online randevu talep ediyor — hazır mısınız?',
    date: '2026-02-28',
    author: {
      name: 'Hemensalon Ekibi',
      initials: 'SE',
      avatarBg: 'bg-purple-100',
      avatarColor: 'text-purple-700',
      title: 'Ürün Ekibi',
    },
    coverGradient: 'from-amber-400 via-orange-500 to-rose-500',
    coverAccent: 'bg-amber-100',
    readTime: 4,
    tags: ['Online Randevu', 'Dijitalleşme', 'Müşteri Deneyimi'],
    content: `
      <p>2026 yılında müşterilerin <strong>%67'si</strong> online randevu alabileceği işletmeleri tercih ediyor. Peki salonunuz bu beklentiye cevap veriyor mu?</p>

      <h2>Telefonla Randevunun Sorunları</h2>
      <ul>
        <li>Çalışma saatleri dışında ulaşılamama</li>
        <li>Personel meşgulken cevap verilememesi</li>
        <li>Randevu defterinde karışıklık ve çakışma riski</li>
        <li>Yazılı kayıt olmaması, hata payı yüksek</li>
      </ul>

      <h2>Online Randevunun Avantajları</h2>
      <h3>7/24 Erişim</h3>
      <p>Müşteri gece 23:00'de, siz uyurken randevu alabilir. Sabah iş başında hazır takvimi görürsünüz.</p>

      <h3>Çakışma Riski Sıfır</h3>
      <p>Sistem, mevcut randevuları ve personel müsaitliğini anlık kontrol eder. Çakışma fiziksel olarak imkânsız.</p>

      <h3>Anında Onay</h3>
      <p>Randevu alındığında müşteri anında WhatsApp onayı alır. Sizi aramak zorunda kalmaz.</p>

      <h3>Müşteri Profili Oluşur</h3>
      <p>Her online randevu, müşteri profiline otomatik kaydedilir. Ziyaret geçmişi, harcama özeti — hepsi elinizin altında.</p>

      <h2>Rakiplerinizden Önce Geçin</h2>
      <p>Sektördeki dijitalleşme hızlanıyor. Online randevu sistemi kurmak artık lüks değil, <strong>rekabetçi kalmak için zorunlu</strong>.</p>

      <p>Hemensalon ile 5 dakikada online randevu sisteminizi kurun. 3 gün ücretsiz deneyin, memnun kalırsanız devam edin.</p>
    `,
  },
  {
    slug: 'kvkk-guzellik-salonu',
    title: 'Güzellik Salonu KVKK Uyumu: Bilmeniz Gerekenler',
    excerpt:
      'Müşteri verilerini toplayan her işletme KVKK kapsamında. Salon için pratik KVKK rehberi ve dikkat edilmesi gerekenler.',
    date: '2026-02-15',
    author: {
      name: 'Hemensalon Ekibi',
      initials: 'SE',
      avatarBg: 'bg-purple-100',
      avatarColor: 'text-purple-700',
      title: 'Ürün Ekibi',
    },
    coverGradient: 'from-rose-400 via-pink-500 to-purple-600',
    coverAccent: 'bg-rose-100',
    readTime: 6,
    tags: ['KVKK', 'Hukuk', 'Güvenlik'],
    content: `
      <p>Müşteri adı, telefon numarası veya email adresi toplayan her işletme, <strong>Kişisel Verilerin Korunması Kanunu (KVKK)</strong> kapsamındadır. Salonlar da bu kapsamda.</p>

      <h2>Salonlar Hangi Veriyi Topluyor?</h2>
      <ul>
        <li>Ad, soyad</li>
        <li>Telefon numarası</li>
        <li>Email adresi</li>
        <li>Ziyaret geçmişi</li>
        <li>Sağlık notları (bazı uygulamalar için — bu özel nitelikli veri!)</li>
      </ul>

      <h2>KVKK'nın Temel Yükümlülükleri</h2>

      <h3>1. Aydınlatma Yükümlülüğü</h3>
      <p>Müşteriye verilerini neden, nasıl topladığınızı açıklamalısınız. Bu bir Aydınlatma Metni ile yapılır. Web sitenizde ve işletmenizde görünür olmalı.</p>

      <h3>2. Veri Güvenliği</h3>
      <p>Müşteri verilerini kâğıt defterde veya güvensiz Excel dosyasında saklamak risk oluşturur. Şifreli ve güvenli sistemler kullanmalısınız.</p>

      <h3>3. Saklama Süresi</h3>
      <p>Verileri amacı dışında veya gereğinden uzun süre saklayamazsınız. Müşteri ilişkisi bittiğinde veri silinmeli ya da anonimleştirilmeli.</p>

      <h3>4. Üçüncü Taraflarla Paylaşım</h3>
      <p>Müşteri verilerini pazarlama şirketleriyle, WhatsApp üzerinden üçüncü kişilerle paylaşmak KVKK ihlalidir.</p>

      <h2>Hemensalon KVKK Uyumunu Nasıl Kolaylaştırıyor?</h2>
      <ul>
        <li>Veriler şifrelenmiş Supabase altyapısında saklanır</li>
        <li>GDPR ve KVKK uyumlu veri işleme</li>
        <li>Müşteri silme / anonimleştirme özelliği</li>
        <li>Aydınlatma metni şablonu dahil</li>
      </ul>

      <p><strong>Not:</strong> Bu yazı genel bilgi amaçlıdır, hukuki danışmanlık değildir. İşletmenize özel değerlendirme için bir KVKK uzmanına başvurun.</p>
    `,
  },
  {
    slug: 'kuafor-randevu-programi-secimi',
    title: 'Kuaför Randevu Programı Seçerken Dikkat Edilmesi Gereken 8 Şey',
    excerpt:
      'Yüzlerce kuaför yazılımı arasında kaybolmayın. İşletmenize gerçekten uygun randevu programını seçmek için bilmeniz gerekenler.',
    date: '2026-04-20',
    author: {
      name: 'Hemensalon Ekibi',
      initials: 'SE',
      avatarBg: 'bg-purple-100',
      avatarColor: 'text-purple-700',
      title: 'Ürün Ekibi',
    },
    coverGradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    coverAccent: 'bg-emerald-100',
    readTime: 6,
    tags: ['Kuaför Programı', 'Yazılım', 'Randevu Sistemi'],
    content: `
      <p>Bir kuaför veya güzellik salonu açtığınızda en kritik kararlardan biri <strong>hangi randevu programını kullanacağınızdır</strong>. Yanlış seçim, hem zaman hem de para kaybına yol açar. Bu yazıda doğru programı seçmek için nelere bakmanız gerektiğini sade bir şekilde anlatıyorum.</p>

      <h2>1. Kurulum Gerektirmeyen Bulut Tabanlı Sistemleri Tercih Edin</h2>
      <p>Bilgisayara kurulan eski tip programlar giderek tarihe karışıyor. Bulut tabanlı bir <strong>kuaför randevu sistemi</strong> seçerseniz hem telefondan hem bilgisayardan, hem de salonunuzun dışındayken erişebilirsiniz. Güncelleme sorunu yoktur, veri kaybı riski minimumdur.</p>

      <h2>2. SMS Hatırlatma Özelliğine Bakın</h2>
      <p>Randevu iptalleri salonların en büyük gelir kaybı nedeni. <strong>Otomatik SMS hatırlatma</strong> gönderen bir program seçmek, bu kaybın önüne geçer. Randevudan 24 saat ve 1 saat önce giden hatırlatmalar, iptal oranını ciddi ölçüde düşürür. Bu özellik olmayan bir programa para vermek uzun vadede daha pahalıya gelir.</p>

      <h2>3. Personel Bazlı Takvim Şart</h2>
      <p>Birden fazla çalışanınız varsa, her birinin ayrı takviminin olması ve müşterilerin hangi personelle çalışmak istediğini seçebilmesi gerekir. Bu özelliği olmayan sistemler kısa sürede yetersiz kalır.</p>

      <h2>4. Müşteri Kayıt ve Geçmiş Takibi</h2>
      <p>İyi bir <strong>salon yönetim programı</strong> sadece randevu almaz; müşterinin geçmiş ziyaretlerini, hangi hizmetleri aldığını ve notlarınızı saklar. "Bu müşteri geçen sefer ne demişti?" sorusunu hiç sormamak hem profesyonel görünmenizi sağlar hem de müşteri memnuniyetini artırır.</p>

      <h2>5. Online Randevu Sayfası Sunuyor mu?</h2>
      <p>Program size özel bir randevu linki oluşturabiliyorsa, bu linki Instagram biyografinize, Google işletme profilinize ve WhatsApp durumunuza ekleyebilirsiniz. Müşteriler sizi aramadan, sizin müsait olmanızı beklemeden randevu alır. Bu özellik başlı başına müşteri portföyünüzü büyütür.</p>

      <h2>6. Fiyatı Performansla Karşılaştırın</h2>
      <p>Aylık birkaç bin lira isteyen programlar mutlaka daha iyi değildir. Küçük ve orta ölçekli salonlar için temel özellikler yeterlidir. Kullanmayacağınız özellikler için fazla ödeme yapmayın. Ücretsiz deneme sunan programları mutlaka deneyin, satın almadan önce gerçek kullanım koşullarında test edin.</p>

      <h2>7. Mobil Uyumluluk</h2>
      <p>Salonunuzdaki en yoğun anlarda masa başına geçemezsiniz. Telefona gelen bildirim, anlık randevu ekleme ve takvim görüntüleme hayat kurtarır. Programı seçmeden önce mutlaka telefondan deneyin.</p>

      <h2>8. Müşteri Desteği ve Türkçe Arayüz</h2>
      <p>Sorun yaşadığınızda ulaşabileceğiniz bir destek hattı veya chat özelliği olan programları tercih edin. Türkçe arayüz, personelin sisteme alışma süresini kısaltır. Yabancı kaynaklı programlarda dil sorunu hem sizi hem personelinizi yavaşlatır.</p>

      <h2>Sonuç</h2>
      <p>İdeal <strong>kuaför randevu programı</strong>; bulut tabanlı, SMS hatırlatmalı, personel takvimine sahip, müşteri geçmişi kaydeden ve online randevu sayfası sunan bir sistem olmalıdır. Bu kriterlerin tamamını karşılayan Hemensalon'u 3 gün ücretsiz deneyebilir, işletmenize uyup uymadığına kendiniz karar verebilirsiniz.</p>
    `,
  },
  {
    slug: 'guzellik-salonu-musteri-sadakati',
    title: 'Güzellik Salonunda Müşteri Sadakati Nasıl Sağlanır?',
    excerpt:
      'Yeni müşteri kazanmak, mevcut müşteriyi tutmaktan 5 kat daha pahalıdır. İşte salonunuzda sadık müşteri kitlesi oluşturmanın yolları.',
    date: '2026-04-10',
    author: {
      name: 'Hemensalon Ekibi',
      initials: 'SE',
      avatarBg: 'bg-purple-100',
      avatarColor: 'text-purple-700',
      title: 'Ürün Ekibi',
    },
    coverGradient: 'from-pink-400 via-rose-500 to-red-500',
    coverAccent: 'bg-pink-100',
    readTime: 5,
    tags: ['Müşteri Sadakati', 'Salon Yönetimi', 'Pazarlama'],
    content: `
      <p>Pazarlama dünyasında kabul görmüş bir gerçek var: <strong>yeni bir müşteri kazanmak, mevcut müşteriyi elde tutmaktan 5 kat daha pahalıdır</strong>. Güzellik salonları için bu oran bazen daha da yüksektir. O yüzden sadık bir müşteri tabanı oluşturmak, reklam bütçesi harcamaktan çok daha akıllıca bir yatırımdır.</p>

      <h2>Müşteri Neden Başka Salona Geçer?</h2>
      <p>Hizmet kalitesi düşmedikçe bile müşteriler başka salona geçebilir. Bunun başlıca sebepleri:</p>
      <ul>
        <li>Randevu almak için çok uğraşmak zorunda kalmak</li>
        <li>Randevu saatine uyulmaması, bekleme</li>
        <li>Personelin değişmesi ve kişisel ilişkinin kopması</li>
        <li>Tercihlerinin hatırlanmaması</li>
        <li>Herhangi bir özel gün hatırlatması veya ilgi görmemesi</li>
      </ul>
      <p>Dikkat edin: bu sebeplerin büyük çoğunluğu hizmet kalitesiyle değil, <strong>deneyimle</strong> ilgili. Yani teknik beceri yeterli olmayabilir.</p>

      <h2>1. Müşteriyi Tanıyın, Hatırlayın</h2>
      <p>Müşterinin hangi boyayı tercih ettiğini, hassasiyetlerini, çocuklarının adını bilmek küçük ama etkili bir bağ kurar. Bir <strong>müşteri takip sistemi</strong> kullanıyorsanız ziyaret notları bölümüne bunları kaydedin. Bir sonraki randevuda sormadan bilmek, müşteriye "burada önemli biriyim" hissi verir.</p>

      <h2>2. Doğum Günü Mesajı Gönderin</h2>
      <p>Basit ama etkisi büyük. Müşterinizin doğum gününde kısa bir kutlama mesajı göndermek, rakip salonların neredeyse hiçbirinin yapmadığı bir şeydir. Buna küçük bir indirim veya hediye hizmet eklerseniz, o müşteriyi kaybetme ihtimaliniz dramatik biçimde düşer.</p>

      <h2>3. Düzenli Geri Bildirim Alın</h2>
      <p>Hizmetten memnun olmayan müşteri genellikle söylemez; sessizce gider. Randevudan sonra kısa bir "nasıldı?" mesajı göndermek hem geri bildirim almanızı sağlar hem de müşteriye değer verildiğini hissettirir. Olumsuz geri bildirimleri savunmacı değil, çözüm odaklı karşılayın.</p>

      <h2>4. SMS Hatırlatmaları ile Bağı Canlı Tutun</h2>
      <p>Müşteri son ziyaretinden 45-60 gün geçmişse otomatik bir hatırlatma mesajı gönderin. "Sizi özledik, yeni sezon renkleri geldi" gibi kısa bir metin bile aylarca gelmemiş müşteriyi geri getirebilir. Bu işlemi otomatik yapan bir <strong>salon randevu programı</strong> kullanmak, hem zaman kazandırır hem de hiçbir müşteriyi gözden kaçırmamanızı sağlar.</p>

      <h2>5. Sadakat Programı Kurun</h2>
      <p>Karmaşık olmak zorunda değil. "10 ziyarette bir hizmet bedava" gibi basit bir kart bile müşteriyi bağlar. Dijital versiyonunu randevu sisteminizde takip edebilirsiniz. Müşteri her geldiğinde birikim yaptığını bilirse, başka salonu denemek için daha az nedeni olur.</p>

      <h2>6. Online Randevuyu Kolaylaştırın</h2>
      <p>Müşteri randevu almak için sizi aralamak, WhatsApp'ta cevap beklemek zorunda kalmamalı. 7/24 <strong>online randevu</strong> alabileceği bir sistem sunduğunuzda, hem randevu almak daha kolay olur hem de sizi tercih etmek için bir neden daha oluşur.</p>

      <h2>Ne Zaman Başlamalı?</h2>
      <p>Şu an kaç müşteriniz var, kaçı düzenli geliyor? Bu soruyu yanıtlayamıyorsanız, ilk adım müşteri takip sistemini kurmaktır. Bunun üzerine sadakat stratejileri inşa etmek çok daha kolaydır.</p>

      <p>Hemensalon, müşteri geçmişi takibi ve otomatik hatırlatmalarıyla bu sürecin büyük bölümünü sizin yerinize halleder. 3 gün ücretsiz deneyebilirsiniz.</p>
    `,
  },
]

export function getAllPosts(): BlogPost[] {
  return [...POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug)
}

export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  return POSTS.filter((p) => p.slug !== slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
