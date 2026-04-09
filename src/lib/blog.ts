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
      name: 'Salonapy Ekibi',
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
      <p>Salonapy kullanan işletmelerin verileri incelendiğinde, düzenli WhatsApp hatırlatması uygulayan salonlarda iptal oranının <strong>%32 düştüğü</strong> görülmüştür. Aylık 50 randevu alan bir salon için bu, ortalama 16 ek dolu randevu demek.</p>

      <h2>Hemen Başlayın</h2>
      <p>Salonapy'nin WhatsApp otomasyon özelliği, tüm bu mesajları otomatik olarak gönderir. Siz yalnızca randevuyu girersiniz, geri kalanını sistem halleder.</p>
    `,
  },
  {
    slug: 'salon-verimlilik-ipuclari',
    title: 'Salonunuzun Verimliliğini %40 Artıracak 7 İpucu',
    excerpt:
      'Küçük değişiklikler, büyük farklar yaratır. Randevu akışından personel yönetimine kadar verimliliği artıran pratik öneriler.',
    date: '2026-03-12',
    author: {
      name: 'Salonapy Ekibi',
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
      name: 'Salonapy Ekibi',
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

      <p>Salonapy ile 5 dakikada online randevu sisteminizi kurun. 3 gün ücretsiz deneyin, memnun kalırsanız devam edin.</p>
    `,
  },
  {
    slug: 'kvkk-guzellik-salonu',
    title: 'Güzellik Salonu KVKK Uyumu: Bilmeniz Gerekenler',
    excerpt:
      'Müşteri verilerini toplayan her işletme KVKK kapsamında. Salon için pratik KVKK rehberi ve dikkat edilmesi gerekenler.',
    date: '2026-02-15',
    author: {
      name: 'Salonapy Ekibi',
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

      <h2>Salonapy KVKK Uyumunu Nasıl Kolaylaştırıyor?</h2>
      <ul>
        <li>Veriler şifrelenmiş Supabase altyapısında saklanır</li>
        <li>GDPR ve KVKK uyumlu veri işleme</li>
        <li>Müşteri silme / anonimleştirme özelliği</li>
        <li>Aydınlatma metni şablonu dahil</li>
      </ul>

      <p><strong>Not:</strong> Bu yazı genel bilgi amaçlıdır, hukuki danışmanlık değildir. İşletmenize özel değerlendirme için bir KVKK uzmanına başvurun.</p>
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
