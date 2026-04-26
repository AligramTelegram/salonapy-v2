import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const posts = [
  {
    slug: 'kuafor-randevu-programi-secimi',
    title: 'Kuaför Randevu Programı Seçerken Dikkat Edilmesi Gereken 8 Şey',
    excerpt: 'Yüzlerce kuaför yazılımı arasında kaybolmayın. İşletmenize gerçekten uygun randevu programını seçmek için bilmeniz gerekenler.',
    author: 'Hemensalon Ekibi',
    published: true,
    publishedAt: new Date('2026-04-20'),
    tags: ['Kuaför Programı', 'Yazılım', 'Randevu Sistemi'],
    content: [
      '<p>Bir kuaför veya güzellik salonu açtığınızda en kritik kararlardan biri <strong>hangi randevu programını kullanacağınızdır</strong>. Yanlış seçim, hem zaman hem de para kaybına yol açar. Bu yazıda doğru programı seçmek için nelere bakmanız gerektiğini sade bir şekilde anlatıyorum.</p>',
      '<h2>1. Kurulum Gerektirmeyen Bulut Tabanlı Sistemleri Tercih Edin</h2>',
      '<p>Bilgisayara kurulan eski tip programlar giderek tarihe karışıyor. Bulut tabanlı bir <strong>kuaför randevu sistemi</strong> seçerseniz hem telefondan hem bilgisayardan, hem de salonunuzun dışındayken erişebilirsiniz. Güncelleme sorunu yoktur, veri kaybı riski minimumdur.</p>',
      '<h2>2. SMS Hatırlatma Özelliğine Bakın</h2>',
      '<p>Randevu iptalleri salonların en büyük gelir kaybı nedeni. <strong>Otomatik SMS hatırlatma</strong> gönderen bir program seçmek, bu kaybın önüne geçer. Randevudan 24 saat ve 1 saat önce giden hatırlatmalar, iptal oranını ciddi ölçüde düşürür. Bu özellik olmayan bir programa para vermek uzun vadede daha pahalıya gelir.</p>',
      '<h2>3. Personel Bazlı Takvim Şart</h2>',
      '<p>Birden fazla çalışanınız varsa, her birinin ayrı takviminin olması ve müşterilerin hangi personelle çalışmak istediğini seçebilmesi gerekir. Bu özelliği olmayan sistemler kısa sürede yetersiz kalır.</p>',
      '<h2>4. Müşteri Kayıt ve Geçmiş Takibi</h2>',
      '<p>İyi bir <strong>salon yönetim programı</strong> sadece randevu almaz; müşterinin geçmiş ziyaretlerini, hangi hizmetleri aldığını ve notlarınızı saklar. "Bu müşteri geçen sefer ne demişti?" sorusunu hiç sormamak hem profesyonel görünmenizi sağlar hem de müşteri memnuniyetini artırır.</p>',
      '<h2>5. Online Randevu Sayfası Sunuyor mu?</h2>',
      '<p>Program size özel bir randevu linki oluşturabiliyorsa, bu linki Instagram biyografinize, Google işletme profilinize ve WhatsApp durumunuza ekleyebilirsiniz. Müşteriler sizi aramadan, sizin müsait olmanızı beklemeden randevu alır. Bu özellik başlı başına müşteri portföyünüzü büyütür.</p>',
      '<h2>6. Fiyatı Performansla Karşılaştırın</h2>',
      '<p>Aylık birkaç bin lira isteyen programlar mutlaka daha iyi değildir. Küçük ve orta ölçekli salonlar için temel özellikler yeterlidir. Kullanmayacağınız özellikler için fazla ödeme yapmayın. Ücretsiz deneme sunan programları mutlaka deneyin.</p>',
      '<h2>7. Mobil Uyumluluk</h2>',
      '<p>Salonunuzdaki en yoğun anlarda masa başına geçemezsiniz. Telefona gelen bildirim, anlık randevu ekleme ve takvim görüntüleme hayat kurtarır. Programı seçmeden önce mutlaka telefondan deneyin.</p>',
      '<h2>8. Müşteri Desteği ve Türkçe Arayüz</h2>',
      '<p>Sorun yaşadığınızda ulaşabileceğiniz bir destek hattı veya chat özelliği olan programları tercih edin. Türkçe arayüz, personelin sisteme alışma süresini kısaltır. Yabancı kaynaklı programlarda dil sorunu hem sizi hem personelinizi yavaşlatır.</p>',
      '<h2>Sonuç</h2>',
      '<p>İdeal <strong>kuaför randevu programı</strong>; bulut tabanlı, SMS hatırlatmalı, personel takvimine sahip, müşteri geçmişi kaydeden ve online randevu sayfası sunan bir sistem olmalıdır. Bu kriterlerin tamamını karşılayan Hemensalon\'u 3 gün ücretsiz deneyebilir, işletmenize uyup uymadığına kendiniz karar verebilirsiniz.</p>',
    ].join('\n'),
    seo: {
      metaTitle: 'Kuaför Randevu Programı Seçimi: 8 Kritik Özellik | Hemensalon',
      metaDescription: 'Kuaförünüze uygun randevu programını nasıl seçersiniz? SMS hatırlatma, personel takvimi, online randevu sayfası ve daha fazlası için rehber.',
    },
  },
  {
    slug: 'guzellik-salonu-musteri-sadakati',
    title: 'Güzellik Salonunda Müşteri Sadakati Nasıl Sağlanır?',
    excerpt: 'Yeni müşteri kazanmak, mevcut müşteriyi tutmaktan 5 kat daha pahalıdır. Salonunuzda sadık müşteri kitlesi oluşturmanın yolları.',
    author: 'Hemensalon Ekibi',
    published: true,
    publishedAt: new Date('2026-04-10'),
    tags: ['Müşteri Sadakati', 'Salon Yönetimi', 'Pazarlama'],
    content: [
      '<p>Pazarlama dünyasında kabul görmüş bir gerçek var: <strong>yeni bir müşteri kazanmak, mevcut müşteriyi elde tutmaktan 5 kat daha pahalıdır</strong>. Güzellik salonları için bu oran bazen daha da yüksektir. O yüzden sadık bir müşteri tabanı oluşturmak, reklam bütçesi harcamaktan çok daha akıllıca bir yatırımdır.</p>',
      '<h2>Müşteri Neden Başka Salona Geçer?</h2>',
      '<p>Hizmet kalitesi düşmedikçe bile müşteriler başka salona geçebilir. Bunun başlıca sebepleri:</p>',
      '<ul><li>Randevu almak için çok uğraşmak zorunda kalmak</li><li>Randevu saatine uyulmaması, bekleme</li><li>Personelin değişmesi ve kişisel ilişkinin kopması</li><li>Tercihlerinin hatırlanmaması</li><li>Herhangi bir özel gün hatırlatması veya ilgi görmemesi</li></ul>',
      '<p>Bu sebeplerin büyük çoğunluğu hizmet kalitesiyle değil, <strong>deneyimle</strong> ilgili. Yani teknik beceri tek başına yeterli olmayabilir.</p>',
      '<h2>1. Müşteriyi Tanıyın, Hatırlayın</h2>',
      '<p>Müşterinin hangi boyayı tercih ettiğini, hassasiyetlerini, çocuklarının adını bilmek küçük ama etkili bir bağ kurar. Bir <strong>müşteri takip sistemi</strong> kullanıyorsanız ziyaret notları bölümüne bunları kaydedin. Bir sonraki randevuda sormadan bilmek, müşteriye "burada önemli biriyim" hissi verir.</p>',
      '<h2>2. Doğum Günü Mesajı Gönderin</h2>',
      '<p>Müşterinizin doğum gününde kısa bir kutlama mesajı göndermek, rakip salonların neredeyse hiçbirinin yapmadığı bir şeydir. Buna küçük bir indirim veya hediye hizmet eklerseniz, o müşteriyi kaybetme ihtimaliniz dramatik biçimde düşer.</p>',
      '<h2>3. Düzenli Geri Bildirim Alın</h2>',
      '<p>Hizmetten memnun olmayan müşteri genellikle söylemez; sessizce gider. Randevudan sonra kısa bir "nasıldı?" mesajı göndermek hem geri bildirim almanızı sağlar hem de müşteriye değer verildiğini hissettirir.</p>',
      '<h2>4. SMS Hatırlatmaları ile Bağı Canlı Tutun</h2>',
      '<p>Müşteri son ziyaretinden 45-60 gün geçmişse otomatik bir hatırlatma mesajı gönderin. "Sizi özledik, yeni sezon renkleri geldi" gibi kısa bir metin bile aylarca gelmemiş müşteriyi geri getirebilir. Bu işlemi otomatik yapan bir <strong>salon randevu programı</strong> kullanmak hem zaman kazandırır hem de hiçbir müşteriyi gözden kaçırmamanızı sağlar.</p>',
      '<h2>5. Sadakat Programı Kurun</h2>',
      '<p>Karmaşık olmak zorunda değil. "10 ziyarette bir hizmet bedava" gibi basit bir kart bile müşteriyi bağlar. Müşteri her geldiğinde birikim yaptığını bilirse, başka salonu denemek için daha az nedeni olur.</p>',
      '<h2>6. Online Randevuyu Kolaylaştırın</h2>',
      '<p>Müşteri randevu almak için sizi aramak, WhatsApp\'ta cevap beklemek zorunda kalmamalı. 7/24 <strong>online randevu</strong> alabileceği bir sistem sunduğunuzda, hem randevu almak daha kolay olur hem de sizi tercih etmek için bir neden daha oluşur.</p>',
      '<h2>Sonuç</h2>',
      '<p>Hemensalon, müşteri geçmişi takibi ve otomatik hatırlatmalarıyla bu sürecin büyük bölümünü sizin yerinize halleder. 3 gün ücretsiz deneyebilirsiniz.</p>',
    ].join('\n'),
    seo: {
      metaTitle: 'Güzellik Salonunda Müşteri Sadakati: 6 Pratik Strateji | Hemensalon',
      metaDescription: 'Güzellik salonunuzda müşteri sadakatini artırmanın 6 yolu. Doğum günü mesajları, SMS hatırlatma ve online randevu ile müşteri kaybını önleyin.',
    },
  },
]

async function main() {
  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    })
    console.log('Eklendi:', post.slug)
  }
  await prisma.$disconnect()
}

main().catch(console.error)
