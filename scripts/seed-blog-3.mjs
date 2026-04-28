import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const posts = [
  {
    slug: 'erkek-kuafor-salonunda-musteri-deneyimi',
    title: 'Erkek Kuaförü Açmak veya Büyütmek İsteyenlere: Müşteri Deneyimini Merkeze Almanın Tam Rehberi',
    excerpt:
      'Türkiye\'de erkek kuaförü sektörü hızla büyüyor. Ancak ayakta kalan salonlar fiyatla değil, deneyimle öne çıkıyor. İşte fark yaratmanın somut yolları.',
    author: 'Hemensalon Ekibi',
    published: true,
    publishedAt: new Date('2026-04-28'),
    tags: ['erkek kuaförü', 'berber', 'müşteri deneyimi', 'salon yönetimi', 'kuaför açmak'],
    content: `<p>Şu an Türkiye'de yaklaşık 120.000 aktif berber ve erkek kuaförü faaliyet gösteriyor. Bu rakam, sektörün ne kadar kalabalık olduğunu ortaya koyuyor. Aynı mahallede beş farklı erkek kuaförü varsa, müşteri neden sizi seçsin?</p>

<p>Cevap çoğunlukla "makas ustalığı" ya da "ucuz fiyat" değil. Müşteriler geri döndüklerinde genellikle şunu hissettikleri için geri dönerler: <em>buraya gelince kendimi iyi hissediyorum.</em> Bu his tesadüf değil, tasarımdır.</p>

<h2>İlk İzlenim: Kapıdan Girişten Sandalyeye Oturuşa Kadar</h2>

<p>Bir müşterinin salonunuzu deneyimlediği ilk 90 saniye, geri gelip gelmeyeceğini büyük ölçüde belirler. Bu süreçte her detay konuşur.</p>

<p>Kapıdan girişte selam verilmesi, ne kadar bekleneceğinin belirtilmesi, bekleme alanında bir içecek ikramı — bunların maliyeti neredeyse sıfırdır ama izlenimde bıraktığı fark büyüktür. Buna karşın çoğu salon bu anı tamamen atlar çünkü "her zaman böyle yapıyoruz."</p>

<p>Masa düzeni, ayna temizliği, zemin — bunlar bilinçaltına işler. Müşteri çoğunlukla bunları fark etmez ama pislik veya dağınıklık gördüğünde <em>fark eder.</em></p>

<h2>Randevu Sistemi: "Bekleyip Bakayım" Kültürünü Kırın</h2>

<p>Erkek kuaföründe en yaygın şikayet bekleme süresidir. Müşteriler kapıda beklemekten değil, <em>ne kadar bekleyeceklerini bilmemekten</em> şikayet eder.</p>

<p>Online randevu sistemi bu sorunu iki taraflı çözer: müşteri "14:30'da geleceğim" der ve gelir; siz de o saatte hazırsınızdır. Ortada kayıp zaman yoktur. Üstelik randevu alan müşterinin iptal oranı çok daha düşüktür çünkü planlama yapmış biridir.</p>

<p>Hemensalon gibi araçlarla oluşturduğunuz kişisel randevu sayfasını Instagram bio'nuza eklediğinizde, telefon almadan veya WhatsApp'a bakmadan randevu dolmaya başlar.</p>

<h2>Kişiselleştirme: İsim Hatırlamak Büyük Silahtır</h2>

<p>Müşteri ikinci kez geldiğinde "geçen sefer ne istediğini" hatırlamak, o kişiyi sadık müşteriye dönüştürmenin en basit yoludur. Bunu yapmak için hafıza şart değil — bir not sistemi yeterli.</p>

<p>Dijital randevu kartına "soluk kesim, yanlar 3 numara, tepe uzun" gibi bir not düşün. Bir dahaki sefere sormadan hazırlıklı olun. Müşteri bunu hisseder ve anlatır.</p>

<h2>Sadakat Döngüsü Kurun</h2>

<p>Düzenli gelen bir erkek müşteri yılda ortalama 12-18 kez gelir. Bu müşteriyi 3 yıl tutmak, yüzlerce TL değerinde bir varlık anlamına gelir. Bu yüzden sadakat sistemine yatırım yapmak hem etik hem de finansal olarak doğrudur.</p>

<p>"10 ziyarette bir ücretsiz kesim" gibi basit bir program, müşterinin aklında her zaman bir sonraki randevu gerekçesi bırakır. Dijital takip olmadan bu sistemi yönetmek zordur — ama doğru araçlarla neredeyse otomatik çalışır.</p>

<h2>Personel Tutarlılığı: En Çok Göz Ardı Edilen Faktör</h2>

<p>Müşteriler salona değil, <em>berbere</em> bağlanır. Bir personelin ayrılması ciddi müşteri kaybına yol açabilir. Bunu önlemenin yolu personeli mutlu ve motive tutmaktır — bu da adil vardiya planlaması, performansa göre prim ve açık iletişimden geçer.</p>

<p>Aynı zamanda müşteri bilgilerini personele bağlı değil, <em>salona bağlı</em> tutun. Dijital bir sistemde saklanan müşteri notları, yeni personelin hızlıca alışmasını sağlar.</p>

<h2>Google Yorumları: Görünmez Satış Ekibiniz</h2>

<p>Yakınındaki erkek kuaförü arayan biri Google haritasını açtığında ilk baktığı şey yıldız sayısı ve yorumlardır. 4,8 yıldız ile 3,2 yıldız arasındaki fark, çoğu zaman ustalıktan değil — yorumlardan gelir.</p>

<p>Memnun müşteriye nazikçe "Google'da yorum bırakır mısınız?" demek garip gelebilir. Ama bir kez sisteme soktuğunuzda, randevu sonrası otomatik SMS ile yorum daveti göndermek mümkündür. Ayda 4-5 yeni olumlu yorum, arama sıralamalarını ciddi ölçüde etkiler.</p>

<h2>Sonuç</h2>

<p>Erkek kuaföründe rakipten sıyrılmak için devrim gerekmez. Kapıda selam, doğru randevu sistemi, müşteri notları ve düzenli Google yorumları — bu dördü bile sizi mahalledeki en çok tercih edilen salon yapabilir. Gerisi zaman ve tutarlılık meselesidir.</p>`,
  },

  {
    slug: 'guzellik-salonu-acilis-rehberi-2026',
    title: 'Güzellik Salonu Açmak İsteyenlere Adım Adım Rehber: Ruhsat, Ekipman, İlk Müşteri',
    excerpt:
      'Güzellik salonu açma sürecinde ruhsat işlemleri, doğru yer seçimi, başlangıç ekipmanı ve ilk müşteriyi kazanma stratejileri hakkında kapsamlı bir rehber.',
    author: 'Hemensalon Ekibi',
    published: true,
    publishedAt: new Date('2026-04-29'),
    tags: ['güzellik salonu açmak', 'salon ruhsatı', 'yeni iş kurma', 'güzellik', 'girişimcilik'],
    content: `<p>Her yıl binlerce kişi güzellik salonu açmayı hayal eder. Bunların büyük bölümü ilk yılda kapanır. Sebebi çoğunlukla yetersiz usta değil, yetersiz hazırlıktır. Güzellik sektöründe teknik beceri gereklidir ama yalnız başına yetmez — süreç yönetimi, müşteri kazanma ve finansal planlama da eşit derecede önemlidir.</p>

<p>Bu rehber, güzellik salonu açmayı düşünen ya da sürece yeni giren girişimciler için hazırlandı. Hukuki süreçler, ekipman seçimi, lokasyon kararı ve dijital altyapıya kadar her adımı ele alıyoruz.</p>

<h2>1. İş Planı: Kağıda Dökmeden Başlamayın</h2>

<p>İş planı yazmak sıkıcı görünse de sizi en kritik soruların cevabını düşünmeye zorlar: Aylık sabit giderleriniz ne olacak? Başa baş noktasına ulaşmak için kaç randevu almanız gerekiyor? Hedef kitleniz kim?</p>

<p>En basit hesap şudur: kira + personel + sarf malzeme + vergi = aylık sabit maliyet. Bu rakamı ortalama randevu geliriyle böldüğünüzde ayda kaç randevu almanız gerektiğini görürsünüz. Bu sayıya ulaşmak için gerçekçi bir plan yapabilirsiniz.</p>

<h2>2. Yer Seçimi: Trafik ve Hedef Kitle Uyumu</h2>

<p>Güzellik salonu için yer seçimi sadece kira fiyatıyla yapılmaz. Dikkat edilmesi gereken faktörler:</p>

<ul>
  <li><strong>Yaya trafiği:</strong> Güzellik salonu spontane kararlarla da doldurulur; görünür olmak önemlidir.</li>
  <li><strong>Otopark ve ulaşım:</strong> Arabalı müşteri kitlesi varsa park imkânı kritiktir.</li>
  <li><strong>Çevre demografisi:</strong> Öğrenci mahallesi ile üst gelir grubu mahallesi için farklı hizmet karması ve fiyatlandırma gerekir.</li>
  <li><strong>Rakip yoğunluğu:</strong> Aynı sokakta çok fazla salon varsa savaşmak yerine boşluk olan bölgeye gidebilirsiniz.</li>
</ul>

<h2>3. Ruhsat ve Yasal Süreçler</h2>

<p>Türkiye'de güzellik salonu açmak için temel adımlar şunlardır:</p>

<ul>
  <li>Vergi levhası için vergi dairesine başvuru</li>
  <li>Güzellik uzmanı sertifikası (MEB onaylı kurs mezuniyeti)</li>
  <li>Belediyeden işyeri açma ve çalışma ruhsatı</li>
  <li>Sağlık Bakanlığı'ndan güzellik merkezi izni (estetik işlemler yapılacaksa)</li>
  <li>İtfaiye uygunluk belgesi (kalabalık yerlerde zorunlu)</li>
</ul>

<p>Bu süreçler şehre ve belediyeye göre değişebilir. Ticaret odası danışmanlık servisleri ve e-devlet kapısı bu konuda güncel bilgiye ulaşmak için iyi kaynaklardır.</p>

<h2>4. Başlangıç Ekipmanı: Neye İhtiyacınız Var?</h2>

<p>Yeni açılan salonlarda en yaygın hata, gereksiz ekipmana para harcamaktır. Başlangıç için gerçekten gerekenler:</p>

<ul>
  <li>Saç için: kuaför koltuğu, ayna, fön makinesi, makas seti, boyama araçları</li>
  <li>Manikür-pedikür için: müşteri koltuğu, aydınlatmalı masa, dezenfeksiyon kabini</li>
  <li>Kaş-kirpik için: yataklar, büyüteç lambası, kaliteli pigmentler</li>
  <li>Genel: sterilizasyon cihazı, yazarkasa, POS terminali</li>
</ul>

<p>İkinci el profesyonel ekipman satın almak, başlangıç maliyetini önemli ölçüde düşürür. Birçok salon kapanırken satışa çıkan ekipmanlar genellikle iyi durumdadır.</p>

<h2>5. Fiyatlandırma Stratejisi</h2>

<p>Açılışta düşük fiyat müşteri çekmek için cazip görünür. Ancak bu yaklaşım ileride fiyat artırmayı zorlaştırır ve düşük fiyatı bekleyen bir müşteri kitlesine yol açar.</p>

<p>Daha sağlıklı yaklaşım: bölgenizdeki rakiplerin ortalamasına bakın, sunduğunuz hizmet kalitesini dürüstçe değerlendirin ve ortalamada ya da biraz altında başlayın. İlk 6 ayda indirim yerine "açılış haftası" veya "ilk 20 müşteriye özel" kampanyaları yapın.</p>

<h2>6. İlk Müşteriyi Nasıl Bulursunuz?</h2>

<p>Yeni açılan bir salonun en büyük zorluğu sosyal kanıt eksikliğidir. Kimse bilmediğiniz için tercih etmez, tercih edilmediğiniz için bilinmezsiniz.</p>

<p>Bu döngüyü kırmak için etkili yollar:</p>

<ul>
  <li><strong>Çevre ve aile:</strong> İlk müşterileriniz tanıdıklar olacak — onları memnun edin, sözlü tavsiyeyi başlatın.</li>
  <li><strong>Google İşletme Profili:</strong> Hemen açın, fotoğraf ekleyin, birkaç yorum alın. "Yakınımdaki güzellik salonu" aramasında görünmek için şarttır.</li>
  <li><strong>Instagram açılış içeriği:</strong> Salon hazırlığından açılışa kadar süreci paylaşın; insanlar hikayeleri sever.</li>
  <li><strong>Açılış kampanyası:</strong> İlk hafta belirli hizmetlerde indirim veya ilk ziyarette ücretsiz küçük hizmet — kapı trafiği yaratır.</li>
</ul>

<h2>7. Dijital Altyapı: Başından Doğru Kur</h2>

<p>Açılış günü defterle randevu almak normal görünebilir ama birkaç ay içinde kaosa dönüşür. Randevu çakışmaları, unutulan müşteriler, no-show'lar — bunların hepsi bir dijital sistemle önlenebilir.</p>

<p>Online randevu sayfası, otomatik SMS hatırlatması ve müşteri kayıt sistemi ile başlamak; hem profesyonel bir izlenim bırakır hem de zamandan tasarruf sağlar. Hemensalon'un ücretsiz başlangıç planı bu altyapıyı kurulum gerektirmeden sunar.</p>

<h2>En Kritik Tavsiye</h2>

<p>İlk altı ay çok az para kazanacaksınız. Bu normaldir. Asıl önemli olan bu dönemde gelen her müşteriyi birer büyükelçiye dönüştürmektir. Onlar sizin hakkınızda anlattığında, hiçbir reklam bütçesi bu etkiyi veremez.</p>`,
  },

  {
    slug: 'kuafor-ciro-artisi-randevu-yonetimi',
    title: 'Kuaförünüzün Cirosunu Randevu Yönetimiyle Artırmanın Matematiksel Yolu',
    excerpt:
      'Boş kalan her randevu slotu para kaybıdır. Randevu doluluk oranını artırmak, iptalleri azaltmak ve bekleme listesi oluşturmak için veri odaklı yaklaşım.',
    author: 'Hemensalon Ekibi',
    published: true,
    publishedAt: new Date('2026-04-30'),
    tags: ['kuaför ciро', 'randevu yönetimi', 'doluluk oranı', 'kuaför yazılımı', 'salon verimliliği'],
    content: `<p>Bir kuaför salonunun her gün ürettiği en kıymetli kaynak zamandır. Saat 10:00-10:45 boş geçerse o 45 dakika sonsuza kadar kaybolur; depolanamaz, sonraya aktarılamaz. Bu yüzden randevu yönetimi, kuaför salonunun en stratejik operasyonel konusudur.</p>

<p>Bu yazıda soyut önerilerden değil, somut rakamlardan yola çıkacağız.</p>

<h2>Doluluk Oranı Nedir ve Neden Bu Kadar Önemli?</h2>

<p>Doluluk oranı, çalışma saatleriniz içinde fiilen hizmet verdiğiniz zaman dilimidir. Sabah 9'dan akşam 7'ye kadar çalışan, 45 dakikalık hizmetler sunan bir kuaförün teorik kapasitesi günde 13 randevudur.</p>

<p>Gerçekte yüzde 60 doluluk oranıyla çalışan bir salon günde yaklaşık 8 randevu alır. Bunu yüzde 80'e çıkarmak — yani 2 randevu daha eklemek — ayda yaklaşık 50 ekstra randevu demektir. Ortalama randevu geliri 200 TL olsa bu 10.000 TL ek gelir anlamına gelir. Tek bir personel, tek bir salon için.</p>

<h2>Boş Slotların Üç Temel Nedeni</h2>

<p>Salonlarda randevu boşluklarının arkasında genellikle üç neden yatar:</p>

<p><strong>1. Son dakika iptalleri:</strong> Müşteri haberdar etmeden gelmez ya da saatler önce iptal eder. Bu slot çoğunlukla doldurulamaz.</p>

<p><strong>2. No-show:</strong> Randevusu olduğunu unutmak. Yapılan araştırmalara göre SMS hatırlatma almayan müşterilerin no-show oranı, hatırlatma alanların yaklaşık dört katıdır.</p>

<p><strong>3. Talep tahmin hataları:</strong> Pazartesi öğleden sonrası boş kalır ama cuma günleri randevu verilemiyor. Bu asimetriyi fark edip yönlendirme yapmak, doluluk oranını dengeleyebilir.</p>

<h2>SMS Hatırlatmanın Matematiği</h2>

<p>Diyelim ki salonunuzda aylık 200 randevu var ve no-show oranınız yüzde 12, yani 24 boş slot. Otomatik SMS hatırlatmayla bu oran yüzde 4'e düşerse — sektör ortalaması bu yönde — aylık 16 randevu kurtarılır.</p>

<p>16 randevu × 200 TL = 3.200 TL aylık kazanım. SMS maliyeti ise bu tutarın küçük bir fraksiyonudur.</p>

<p>Hemensalon'un otomatik SMS hatırlatma sistemi randevudan 24 saat ve 1 saat önce mesaj gönderir. Ayarlama gerekmez; sistem kendisi çalışır.</p>

<h2>Bekleme Listesi: Görünmez Gelir Kaynağı</h2>

<p>Popüler saatlerde randevu doluysa müşteriye "müsait değiliz" demek gelir kaybıdır. Bunun yerine bekleme listesine almak ve iptal geldiğinde haber vermek çok daha akıllıca bir yaklaşımdır.</p>

<p>Bu sistemi manuel yönetmek güçtür. Ama bir yazılım üzerinde "bekleme listesi" özelliği varsa, iptal gerçekleştiği anda otomatik bildirim gönderilebilir. Slot hiç boş kalmaz.</p>

<h2>Verimli Personel Planlaması: Boş Değil, Dengeli</h2>

<p>Tüm personeli aynı saatte çalıştırmak ve aynı saatte boş bırakmak yerine, talep verilerine göre vardiya planlamak verimliliği artırır. Hangi günler, hangi saatler yoğun? Bunu belirlemek için geçmiş randevu verilerine bakmak yeterlidir.</p>

<p>Randevu takip yazılımları bu raporu otomatik üretir. Kağıt defterde aynı analizi yapmak saatler alır.</p>

<h2>Online Randevunun Doluluk Oranına Etkisi</h2>

<p>Telefonla randevu alındığında süreç şu şekilde işler: müşteri arar, meşgul alır ya da kimse açmaz, tekrar arar, müsait slot bulunur, randevu yazılır. Bu süreçte müşterinin yüzde 30-40'ı arayı keser ve rakip salona geçer.</p>

<p>Online randevuda müşteri istediği saatte sisteme girer, uygun slotu görür ve anında onaylar. Salonu aramaması gerekmez. Bu durum özellikle gece 22:00 veya sabah 07:30 gibi saatlerde yapılan rezervasyonlarda belirgindir — ki bu saatlerde hiçbir salon telefon açmaz ama dijital sistem çalışmaya devam eder.</p>

<h2>İptal Politikası Oluşturun</h2>

<p>Bazı salonlar "24 saatten geç iptal için ücret alıyoruz" politikası uygular. Bu kesinlikle herkese uymaz — ama büyük salonlar veya premium segmentte çalışanlar için no-show oranını ciddi ölçüde düşürür. Önemli olan bu politikayı önceden açıkça iletmektir; sürpriz olmamalı.</p>

<h2>Özet Hesap</h2>

<p>Günlük 2 ekstra randevu × 26 çalışma günü × 200 TL = aylık 10.400 TL. Yıllık yaklaşık 125.000 TL. Bunun için gereken: otomatik hatırlatma, online randevu sistemi ve haftalık 30 dakikalık doluluk analizi.</p>

<p>Bu hesabı kendi salonunuza uyarlayın. Rakamlar değişebilir ama oran değişmez: randevu yönetimine harcanan her lira, en kârlı yatırımlardan biridir.</p>`,
  },
]

async function main() {
  for (const post of posts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } })
    if (existing) {
      console.log(`Zaten var, atlanıyor: ${post.slug}`)
      continue
    }
    await prisma.blogPost.create({ data: post })
    console.log(`✓ Oluşturuldu: ${post.slug}`)
  }
  console.log('Tamamlandı.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
