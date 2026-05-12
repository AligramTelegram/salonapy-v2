import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import { Features } from '@/components/vitrin/Features'
import { ArrowRight } from 'lucide-react'

const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL ?? '#'
const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? '#'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('ozellikler')
  return {
    title: t('h1') + ' – Hemensalon',
    description: t('subtitle'),
  }
}

export default async function OzelliklerPage() {
  const t = await getTranslations('ozellikler')

  return (
    <div className="min-h-screen pt-24">
      <section className="pb-8 pt-12 text-center">
        <div className="container-custom">
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            {t('badge')}
          </span>
          <h1 className="mb-4 font-display text-4xl font-bold text-gray-900 md:text-5xl">
            {t('h1')}
          </h1>
          <p className="mx-auto mb-6 max-w-xl text-lg leading-relaxed text-gray-500">
            {t('subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-gray-900"
            >
              {t('download_appstore')}
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200/60 transition-colors hover:bg-purple-700"
            >
              {t('download_play')}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <Features />

      <section className="pb-24">
        <div className="container-custom">
          <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-violet-700 p-12 text-center shadow-xl shadow-purple-300/30">
            <h2 className="mb-3 font-display text-3xl font-bold text-white">
              {t('cta_title')}
            </h2>
            <p className="mb-8 text-purple-100">{t('cta_subtitle')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-bold text-purple-700 shadow-lg transition-colors hover:bg-purple-50"
              >
                {t('cta_download')}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
              >
                {t('read_guides')}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
