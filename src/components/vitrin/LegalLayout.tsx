import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'

interface Section {
  heading: string
  body: React.ReactNode
}

interface LegalLayoutProps {
  badge: string
  title: string
  lastUpdated: string
  sections: Section[]
}

export function LegalLayout({ badge, title, lastUpdated, sections }: LegalLayoutProps) {
  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <section className="pb-8 pt-12">
        <div className="container-custom max-w-3xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-purple-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Ana Sayfaya Dön
          </Link>

          <div className="mb-3">
            <span className="inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
              {badge}
            </span>
          </div>

          <h1 className="mb-4 font-display text-3xl font-bold text-gray-900 md:text-4xl">
            {title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>Son güncelleme: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="container-custom max-w-3xl">
          <div className="glass-card p-8 md:p-12">
            <div className="legal-content space-y-10">
              {sections.map((section, i) => (
                <div key={i}>
                  <h2 className="mb-4 font-display text-lg font-bold text-gray-900">
                    {i + 1}. {section.heading}
                  </h2>
                  <div className="space-y-3 text-sm leading-relaxed text-gray-600">
                    {section.body}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-12 rounded-xl border border-purple-100 bg-purple-50 p-6 text-center">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Bu sayfa hakkında sorularınız mı var?
              </p>
              <Link
                href="/iletisim"
                className="text-sm font-semibold text-purple-600 hover:text-purple-700"
              >
                Bize yazın →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
