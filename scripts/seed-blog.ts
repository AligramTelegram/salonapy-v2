/**
 * Run: npx ts-node --project tsconfig.json scripts/seed-blog.ts
 * Or: npx tsx scripts/seed-blog.ts
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding blog posts and site settings...')

  // ── Blog posts ────────────────────────────────────────────────────────────
  const posts = [
    {
      title: 'Randevu Sistemlerinin İşletmelere Faydaları',
      slug: 'randevu-sistemlerinin-isletmelere-faydalari',
      excerpt: 'Online randevu sistemi kurmanın salonunuza kazandıracağı faydaları keşfedin: zaman tasarrufu, müşteri memnuniyeti ve daha az iptal.',
      content: `<p>Her geçen gün daha fazla salon ve klinik, online randevu sistemine geçiş yapıyor. Peki bu sistemler gerçekten fark yaratıyor mu?</p>
<h2>1. Zaman Tasarrufu</h2>
<p>Telefon trafiğini ortadan kaldırır. Personeliniz müşteriyle vakit geçirirken sistem randevuları kendisi yönetir.</p>
<h2>2. Daha Az İptal</h2>
<p>Otomatik hatırlatma mesajları, iptal oranını ortalama %30 düşürüyor. Her hafta kaybedilen randevular artık geçmişte kalıyor.</p>
<h2>3. 7/24 Erişim</h2>
<p>Müşteriler gece yarısı bile randevu alabilir. Siz uyurken sisteminiz çalışmaya devam ediyor.</p>
<h2>4. Müşteri Profili</h2>
<p>Her randevu, müşteri geçmişine eklenir. Bir sonraki ziyarette tercihlerini hatırlarsınız.</p>
<p>Salonapy ile bu avantajların tamamını bugün kullanmaya başlayabilirsiniz.</p>`,
      author: 'Salonapy',
      published: true,
      publishedAt: new Date('2026-03-15'),
      tags: ['Randevu', 'Dijitalleşme', 'İpuçları'],
    },
    {
      title: 'WhatsApp ile Müşteri İletişimi Nasıl Güçlendirilir',
      slug: 'whatsapp-ile-musteri-iletisimi',
      excerpt: 'WhatsApp Business entegrasyonuyla müşteri iletişimini otomatikleştirin, hatırlatmalar gönderin ve memnuniyeti artırın.',
      content: `<p>WhatsApp, Türkiye'de en çok kullanılan mesajlaşma uygulaması. Salonunuzun müşterileri de büyük ihtimalle WhatsApp kullanıyor.</p>
<h2>Otomatik Hatırlatmalar</h2>
<p>Randevu öncesi <strong>24 saat</strong> ve <strong>1 saat</strong> hatırlatması gönderilen müşterilerin iptal oranı %32 daha düşük.</p>
<h2>Anlık Onay Mesajı</h2>
<p>Randevu alındığı anda müşteriye otomatik onay mesajı gönderilir. Güven oluşturur, soru işaretlerini giderir.</p>
<h2>Kişisel Dokunuş</h2>
<p>İsim bazlı kişiselleştirilmiş mesajlar, müşterinin kendini özel hissetmesini sağlar.</p>
<blockquote>Merhaba Ayşe Hanım, yarın saat 14:00'teki randevunuzu hatırlatıyoruz. Görüşmek üzere!</blockquote>
<h2>Nasıl Kurulur?</h2>
<p>Salonapy'de WhatsApp entegrasyonu birkaç tıklamayla aktif edilir. Ayarlar → WhatsApp bölümünden başlayabilirsiniz.</p>`,
      author: 'Salonapy',
      published: true,
      publishedAt: new Date('2026-03-10'),
      tags: ['WhatsApp', 'Otomasyon', 'Müşteri Deneyimi'],
    },
    {
      title: 'Kuaför Salonları İçin Dijitalleşme Rehberi',
      slug: 'kuafor-salonlari-icin-dijitalleme-rehberi',
      excerpt: 'Kuaför salonunuzu dijitalleştirmenin adım adım rehberi: online randevudan finansal takibe, personel yönetiminden müşteri CRM\'e.',
      content: `<p>Dijitalleşme yalnızca büyük işletmeler için değil. Tek kişilik kuaför salonundan zincir salona kadar dijital araçlar her ölçekte fark yaratır.</p>
<h2>Adım 1: Online Randevu</h2>
<p>İlk adım her zaman randevu sistemidir. Telefonla randevu almanın yerini, müşterilerin 7/24 kendi randevusunu alabildiği bir sistem alır.</p>
<h2>Adım 2: Müşteri Kaydı</h2>
<p>Her müşterinin adı, telefonu, ziyaret geçmişi ve notları dijital ortamda saklanır. Kâğıt deftere veda edin.</p>
<h2>Adım 3: WhatsApp Bildirimleri</h2>
<p>Randevu onayı, hatırlatma ve teşekkür mesajları otomatik olarak gönderilir.</p>
<h2>Adım 4: Finansal Takip</h2>
<p>Günlük, haftalık ve aylık gelir/gider raporları sayesinde salonunuzun mali durumunu anlık görürsünüz.</p>
<h2>Adım 5: Raporlar ve Analiz</h2>
<p>Hangi hizmet en çok tercih ediliyor? Hangi personel en yüksek geliri üretiyor? Veriye dayalı kararlar alın.</p>
<p>Tüm bu adımları Salonapy tek platformda sunar. <a href="/kayit">Ücretsiz başlayın</a>.</p>`,
      author: 'Salonapy',
      published: true,
      publishedAt: new Date('2026-03-01'),
      tags: ['Dijitalleşme', 'Yönetim', 'İpuçları'],
    },
  ]

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      create: post,
      update: { title: post.title, excerpt: post.excerpt, published: post.published },
    })
    console.log(`  ✓ Blog: ${post.slug}`)
  }

  // ── Site settings ─────────────────────────────────────────────────────────
  const settings = [
    { key: 'site_name', value: 'Salonapy', category: 'general' },
    { key: 'site_slogan', value: 'Randevunuzu otomatikleştirin', category: 'general' },
    { key: 'seo_title', value: 'Salonapy — Salon Randevu Yönetimi', category: 'seo' },
    { key: 'seo_description', value: 'Salonapy ile salonunuzu dijitalleştirin. Online randevu, WhatsApp bildirimleri, finansal takip ve daha fazlası.', category: 'seo' },
    { key: 'contact_email', value: 'destek@salonapy.com', category: 'contact' },
    { key: 'contact_phone', value: '', category: 'contact' },
    { key: 'contact_address', value: 'İstanbul, Türkiye', category: 'contact' },
    { key: 'social_instagram', value: '', category: 'contact' },
    { key: 'ga_id', value: '', category: 'analytics' },
    { key: 'gtm_id', value: '', category: 'analytics' },
    { key: 'fb_pixel_id', value: '', category: 'analytics' },
  ]

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      create: s,
      update: {},
    })
    console.log(`  ✓ Setting: ${s.key}`)
  }

  console.log('Done!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
