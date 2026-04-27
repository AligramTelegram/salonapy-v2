import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const posts = [
  {
    slug: 'salon-gelir-artirma-yontemleri-2026',
    title: 'Kuaför ve Güzellik Salonunuzun Gelirini 2026\'da Artırmanın 7 Yolu',
    excerpt:
      'Randevu başına kazancınızı yükseltmek, boş saatleri doldurmak ve müşteri başına harcamayı artırmak için kanıtlanmış gelir optimizasyon stratejileri.',
    author: 'Hemensalon',
    published: true,
    publishedAt: new Date('2026-04-20'),
    tags: ['salon yönetimi', 'gelir artırma', 'kuaför', 'güzellik salonu', 'işletme'],
    content: `
<h2>Neden Bazı Salonlar Aynı Müşteriyle Daha Fazla Kazanıyor?</h2>
<p>Türkiye'de bir güzellik salonu sahibinin en büyük sorularından biri şu: "Daha fazla müşteri mi çekmeliyim, yoksa mevcut müşterilerden daha mı iyi kazanmalıyım?" Cevap ikisi de — ama sırası önemli.</p>
<p>Yeni müşteri kazanmak, mevcut müşteriyi elde tutmaktan ortalama 5 kat daha pahalıdır. Bu yüzden salonunuzun gelirini artırmak istiyorsanız önce kendi müşteri tabanınıza bakmalısınız.</p>

<h2>1. Hizmet Paketleri Oluşturun</h2>
<p>Tek hizmet yerine paket satışları hem müşteri için avantajlı hem de salon için öngörülebilir gelir demektir. Örneğin "Aylık Bakım Paketi" adıyla saç kesimi + saç bakımı + fön kombinasyonu sunmak, müşteriyi her ay geri getirir.</p>
<p><strong>Uygulama önerisi:</strong> Hemensalon'un paket yönetimi özelliğiyle her müşteriye özel paket tanımlayabilir, kalan seansları otomatik takip edebilirsiniz.</p>

<h2>2. Upsell ve Cross-sell Yapın</h2>
<p>Müşteri saç boyası için geldiğinde "Saç boyasıyla birlikte onarıcı bakım ekleyelim mi?" diye sormak, randevu başına ortalama geliri yüzde 20-30 artırabilir. Bu tekniğe <strong>upsell</strong> denir ve çoğu salon bunu sistematik yapmaz.</p>
<p>Cross-sell ise farklı hizmetlere yönlendirmektir: "Tırnak bakımımız da var, ister misiniz?" Bunları personele hatırlatmak için randevu notlarını kullanın.</p>

<h2>3. Boş Saatleri "Son Dakika Fırsatı" ile Doldurun</h2>
<p>Her salonun hafta içi öğleden sonraları veya sabah saatlerinde boş kalan slotları vardır. Bu saatleri WhatsApp veya SMS ile "bugüne özel %15 indirim" mesajıyla mevcut müşterilere duyurmak, sıfır pazarlama maliyetiyle randevu doldurur.</p>
<p>Hemensalon'un SMS hatırlatma sistemiyle bu mesajları otomatik gönderebilirsiniz.</p>

<h2>4. Randevu İptallerini Minimize Edin</h2>
<p>Bir iptal, sadece o randevunun gelirini değil; o saati başkasına verememenin fırsatını da kaybettirir. Araştırmalar, otomatik SMS hatırlatma kullanan salonların iptal oranını yüzde 40'a kadar düşürebildiğini gösteriyor.</p>
<p>Randevudan 24 saat ve 1 saat önce gönderilen otomatik hatırlatmalar bu konuda en etkili araçtır.</p>

<h2>5. Sadık Müşterileri Ödüllendirin</h2>
<p>10 ziyaret tamamlayan müşteriye ücretsiz bir hizmet sunmak, hem sadakat hem de sözlü tavsiye üretir. Dijital takip olmadan bu sistemi çalıştırmak çok zordur; ancak doğru bir salon yönetim yazılımıyla tamamen otomatikleştirilebilir.</p>

<h2>6. Fiyatları Hizmet Değerine Göre Belirleyin</h2>
<p>Birçok salon sahibi fiyatları rakiplere bakarak belirler. Ancak sunduğunuz deneyim — konforts bekleme alanı, kişisel ilgi, kaliteli ürünler — fiyatın üzerinde tutulmasını meşrulaştırır. Müşterilerinize neden daha pahalı olduğunuzu gösterin; sadece fiyat listesi değil, değer önerisi sunun.</p>

<h2>7. Online Randevu ile 7/24 Erişim Sağlayın</h2>
<p>Araştırmalara göre online randevuların yüzde 30'undan fazlası mesai saatleri dışında alınıyor. Eğer salonunuzun online randevu sistemi yoksa, rakipleriniz bu saatte sizin potansiyel müşterilerinizi kapıyor demektir.</p>
<p>Hemensalon'un ücretsiz başlangıç planıyla bugün online randevu sayfanızı oluşturabilirsiniz.</p>

<h2>Sonuç: Küçük Değişiklikler, Büyük Fark</h2>
<p>Yukarıdaki 7 stratejiyi hepsini aynı anda uygulamanıza gerek yok. Önce en kolay ikisini seçin — örneğin otomatik hatırlatmalar ve hizmet paketleri — ve 3 ay sonra rakamlarınıza bakın. Büyük olasılıkla gördüğünüz fark sizi şaşırtacak.</p>
`,
  },
  {
    slug: 'guzellik-salonu-sosyal-medya-stratejisi',
    title: 'Güzellik Salonunuz İçin Instagram ve TikTok Stratejisi: Müşteri Kazanmanın Yeni Yolu',
    excerpt:
      'Sosyal medyayı aktif kullanan güzellik salonları nasıl daha fazla randevu alıyor? İçerik fikirleri, yayın takvimi ve dönüşüm artırıcı tüyolar.',
    author: 'Hemensalon',
    published: true,
    publishedAt: new Date('2026-04-25'),
    tags: ['sosyal medya', 'instagram', 'tiktok', 'güzellik salonu', 'dijital pazarlama'],
    content: `
<h2>Sosyal Medya Artık Salon İçin Zorunlu</h2>
<p>Birkaç yıl önce sosyal medya hesabı açmak "güzel olur" kategorisindeydi. Bugün ise Instagram veya TikTok'ta görünmemek, potansiyel müşterilere "biz yokuz" demekle eşdeğer. Türkiye'de güzellik hizmetleri arayanların yüzde 70'inden fazlası karar vermeden önce sosyal medyayı kontrol ediyor.</p>
<p>Peki herkesin instagram'da aktif olduğu bir ortamda nasıl öne çıkarsınız?</p>

<h2>Instagram: Görsel Güven İnşa Edin</h2>
<p>Instagram güzellik salonları için hâlâ en güçlü platform. Ancak sadece "öncesi-sonrası" fotoğrafı paylaşmak artık yetmiyor.</p>

<h3>Çalışan içerik formatları:</h3>
<ul>
  <li><strong>Reels (kısa video):</strong> "Bu hafta en çok istenen saç rengi" veya "30 saniyede saç bakım rutini" gibi videolar organik erişimi en yüksek içeriklerdir.</li>
  <li><strong>Hikayeler (Stories):</strong> Günlük salon hayatı, müşteri memnuniyeti anları, o günkü boş randevu slotları. Hikayeler yakınlık hissi yaratır.</li>
  <li><strong>Kaydedilebilir gönderiler:</strong> "2026 Yaz Saç Rengi Trendleri" gibi infografik veya rehber niteliğindeki gönderiler sürekli kaydedilerek erişiminizi artırır.</li>
</ul>

<h2>TikTok: Yeni Müşteri Kaynağı</h2>
<p>TikTok'un algoritması küçük hesaplara büyük hesaplarla eşit şans tanır. Bu, 200 takipçisi olan bir salonun 50.000 kişiye ulaşabileceği anlamına gelir — üstelik reklam harcamadan.</p>

<h3>TikTok'ta işe yarayan salon içerikleri:</h3>
<ul>
  <li>Dönüşüm videoları (saç boyama süreci, hızlandırılmış)</li>
  <li>Müşteri tepkisi videoları (ayna önü gerçek an)</li>
  <li>"Salonumuza bir günlük bakış" vlog tarzı içerikler</li>
  <li>Trend sese sahip "beklenti vs gerçek" formatı</li>
</ul>

<h2>Haftada Kaç İçerik Paylaşmalısınız?</h2>
<p>Çoğu salon sahibi "her gün içerik üretemedim" diye tamamen bırakır. Oysa tutarlılık miktardan önemlidir.</p>
<p>Önerilen minimum takvim:</p>
<ul>
  <li>Instagram Feed: haftada 3 gönderi</li>
  <li>Instagram Reels: haftada 2 video</li>
  <li>Hikayeler: haftada 5 gün (birkaç story bile yeterli)</li>
  <li>TikTok: haftada 2-3 video</li>
</ul>

<h2>Randevuya Dönüşümü Artırın</h2>
<p>İçerik üretmek güzel ama asıl hedef randevu almak. Bunun için:</p>
<ul>
  <li>Bio'nuzda online randevu bağlantısını bulundurun</li>
  <li>Her postun altına "Randevu için bağlantı bio'da" yazın</li>
  <li>Hikayelere "Randevu Al" düğmesi ekleyin (link sticker)</li>
  <li>DM'lere hızlı yanıt verin — bekleme süresi müşteri kaybettirir</li>
</ul>
<p>Hemensalon'un online randevu sayfanızı doğrudan Instagram bio'nuzla entegre etmeniz, takipçiyi müşteriye dönüştürmenin en kısa yoludur.</p>

<h2>Yerel Hashtag Kullanımı</h2>
<p>Ulusal hashtagler (#güzelliksalonu gibi) yerine şehir bazlı hashtagler çok daha hedefli müşteri getirir. Örneğin:</p>
<ul>
  <li>#ankarakuaför</li>
  <li>#izmirguzelliksalonu</li>
  <li>#kadıköymanikür</li>
</ul>
<p>Bu hashtagleri kullanan kişiler zaten yakınınızdaki potansiyel müşterilerdir.</p>

<h2>Google İşletme Profili'ni Unutmayın</h2>
<p>Sosyal medya kadar önemli olan bir diğer platform Google İşletme Profili'dir. "Yakınımdaki kuaför" arayan birinin sizi bulabilmesi için profilinizi eksiksiz doldurmanız, fotoğraf eklemeniz ve müşteri yorumlarına yanıt vermeniz gerekir. Bu ücretsiz ve son derece etkili bir yerel SEO aracıdır.</p>

<h2>Özet: Sistematik Ol, Tutarlı Kal</h2>
<p>Sosyal medyada başarı tek viral videodan gelmiyor; düzenli içerik üretimine ve sahici etkileşime dayanıyor. Haftada birkaç saat ayırarak oluşturduğunuz içerik takvimi, altı ay içinde salonunuza ciddi sayıda yeni müşteri getirebilir.</p>
<p>Hemensalon gibi bir randevu yönetim sistemiyle hem içerik üretimine daha fazla zaman ayırabilir, hem de gelen randevuları otomatik yönetebilirsiniz.</p>
`,
  },
]

async function main() {
  for (const post of posts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } })
    if (existing) {
      console.log(`Zaten var: ${post.slug}`)
      continue
    }
    await prisma.blogPost.create({ data: post })
    console.log(`Oluşturuldu: ${post.slug}`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
