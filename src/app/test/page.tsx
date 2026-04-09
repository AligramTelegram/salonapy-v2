// Tasarım Sistemi Test Sayfası - Oturum 3

export default function TestPage() {
  return (
    <div className="min-h-screen bg-[#faf8ff] p-8">
      {/* Başlık */}
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Font Test */}
        <section>
          <p className="text-sm font-medium text-purple-600 mb-3 tracking-wide uppercase">
            Font Sistemi
          </p>
          <h1 className="font-display font-bold text-5xl text-gray-900 mb-2">
            Sora Font — Başlık
          </h1>
          <h2 className="font-display font-bold text-3xl text-purple-600 mb-2">
            Randevu Yönetim Platformu
          </h2>
          <p className="font-sans text-lg text-gray-600 leading-relaxed">
            Inter font — gövde metni. Kuaför, berber, güzellik merkezi ve
            klinikler için akıllı randevu yönetim sistemi.
          </p>
        </section>

        {/* Renk Paleti */}
        <section>
          <p className="text-sm font-medium text-purple-600 mb-4 tracking-wide uppercase">
            Mor Renk Paleti
          </p>
          <div className="flex gap-3 flex-wrap">
            {[
              { bg: 'bg-purple-50', text: '50', hex: '#f5f3ff' },
              { bg: 'bg-purple-100', text: '100', hex: '#ede9fe' },
              { bg: 'bg-purple-200', text: '200', hex: '#ddd6fe' },
              { bg: 'bg-purple-300', text: '300', hex: '#c4b5fd' },
              { bg: 'bg-purple-400', text: '400', hex: '#a78bfa' },
              { bg: 'bg-purple-500', text: '500', hex: '#8b5cf6' },
              { bg: 'bg-purple-600', text: '600 ★', hex: '#7c3aed' },
              { bg: 'bg-purple-700', text: '700', hex: '#6d28d9' },
              { bg: 'bg-purple-800', text: '800', hex: '#5b21b6' },
              { bg: 'bg-purple-900', text: '900', hex: '#4c1d95' },
            ].map((color) => (
              <div key={color.text} className="flex flex-col items-center gap-1">
                <div
                  className={`${color.bg} w-14 h-14 rounded-xl border border-white/50 shadow-sm`}
                />
                <span className="text-xs font-medium text-gray-700">{color.text}</span>
                <span className="text-[10px] text-gray-400">{color.hex}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Glass Card */}
        <section>
          <p className="text-sm font-medium text-purple-600 mb-4 tracking-wide uppercase">
            Glass Card Efekti
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Glass Card 1 */}
            <div className="glass-card p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="font-display font-bold text-lg text-gray-900 mb-2">
                Randevu Yönetimi
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Tüm randevularınızı tek ekranda görün ve yönetin.
              </p>
            </div>

            {/* Glass Card 2 */}
            <div className="glass-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-display font-bold text-lg text-gray-900 mb-2">
                WhatsApp Bildirimleri
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Müşterilere otomatik hatırlatmalar gönderin.
              </p>
            </div>

            {/* Glass Card 3 */}
            <div className="glass-card p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-display font-bold text-lg text-gray-900 mb-2">
                Gelir Raporları
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Günlük, haftalık ve aylık gelir takibi.
              </p>
            </div>
          </div>
        </section>

        {/* Gradient Card */}
        <section>
          <p className="text-sm font-medium text-purple-600 mb-4 tracking-wide uppercase">
            Gradient Border Card
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-px bg-gradient-to-br from-purple-200 via-white to-purple-100">
              <div className="bg-white rounded-2xl p-6 h-full">
                <h3 className="font-display font-bold text-xl text-gray-900 mb-2">
                  Gradient Border
                </h3>
                <p className="text-gray-500 text-sm">
                  21st.dev referanslı gradient border efekti.
                </p>
              </div>
            </div>
            <div className="rounded-2xl p-px bg-gradient-to-br from-purple-600 to-purple-400">
              <div className="bg-white rounded-2xl p-6 h-full">
                <h3 className="font-display font-bold text-xl bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">
                  Mor Gradient Text
                </h3>
                <p className="text-gray-500 text-sm">
                  Başlıklar için gradient text efekti.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Butonlar */}
        <section>
          <p className="text-sm font-medium text-purple-600 mb-4 tracking-wide uppercase">
            Button Sistemi
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-purple-sm hover:shadow-purple-md hover:-translate-y-0.5">
              Primary Button
            </button>
            <button className="bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold px-6 py-2.5 rounded-xl transition-all duration-200">
              Outline Button
            </button>
            <button className="bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold px-6 py-2.5 rounded-xl transition-all duration-200">
              Ghost Button
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold px-8 py-3 rounded-xl shadow-purple-md hover:shadow-purple-lg transition-all duration-300 hover:-translate-y-0.5">
              Gradient Button
            </button>
          </div>
        </section>

        {/* Badge'ler */}
        <section>
          <p className="text-sm font-medium text-purple-600 mb-4 tracking-wide uppercase">
            Badge / Etiket Sistemi
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
              Onaylandı
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              Tamamlandı
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
              Bekliyor
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
              İptal
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
              Gelmedi
            </span>
          </div>
        </section>

        {/* Typography Scale */}
        <section>
          <p className="text-sm font-medium text-purple-600 mb-4 tracking-wide uppercase">
            Typography Scale
          </p>
          <div className="space-y-3 bg-white rounded-2xl p-6 shadow-card">
            <p className="font-display font-extrabold text-5xl text-gray-900">H1 — 48px Sora 800</p>
            <p className="font-display font-bold text-4xl text-gray-900">H2 — 36px Sora 700</p>
            <p className="font-display font-bold text-3xl text-gray-800">H3 — 30px Sora 700</p>
            <p className="font-display font-semibold text-2xl text-gray-800">H4 — 24px Sora 600</p>
            <p className="font-sans font-semibold text-xl text-gray-700">H5 — 20px Inter 600</p>
            <p className="font-sans text-base text-gray-600">Body — 16px Inter 400. Normal metin için kullanılır.</p>
            <p className="font-sans text-sm text-gray-500">Small — 14px Inter 400. Açıklamalar ve yardımcı metinler.</p>
            <p className="font-sans text-xs text-gray-400">XS — 12px Inter 400. Etiket ve meta bilgiler.</p>
          </div>
        </section>

        {/* Hero Örnek */}
        <section>
          <p className="text-sm font-medium text-purple-600 mb-4 tracking-wide uppercase">
            Hero Bölüm Önizleme
          </p>
          <div className="bg-gradient-to-br from-[#faf8ff] via-[#ede9fe] to-[#f5f3ff] rounded-3xl p-12 text-center relative overflow-hidden">
            {/* Dekoratif daireler */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/30 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />

            <div className="relative z-10">
              <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full mb-6">
                🚀 3 Gün Ücretsiz Deneyin
              </span>
              <h1 className="font-display font-extrabold text-5xl md:text-6xl text-gray-900 mb-4 leading-tight">
                Randevunuzu{' '}
                <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                  Akıllıca
                </span>{' '}
                Yönetin
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                Kuaför, berber ve güzellik merkezleri için WhatsApp entegrasyonlu
                randevu yönetim platformu.
              </p>
              <div className="flex gap-4 justify-center">
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-purple-md hover:shadow-purple-lg transition-all duration-300 hover:-translate-y-0.5 text-lg">
                  Ücretsiz Başla
                </button>
                <button className="bg-white/80 backdrop-blur text-gray-700 font-semibold px-8 py-3.5 rounded-xl border border-purple-200 hover:border-purple-400 transition-all duration-200 text-lg">
                  Nasıl Çalışır?
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Durum */}
        <div className="text-center pb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Oturum 3 — Tasarım sistemi kuruldu
          </span>
        </div>

      </div>
    </div>
  )
}
