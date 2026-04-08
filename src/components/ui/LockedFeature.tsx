import Link from 'next/link'
import { Lock, Sparkles } from 'lucide-react'

interface LockedFeatureProps {
  featureName: string
  slug: string
  requiredPlan?: string
}

export function LockedFeature({ featureName, slug, requiredPlan = 'Profesyonel' }: LockedFeatureProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="h-20 w-20 rounded-2xl bg-purple-50 flex items-center justify-center mb-5">
        <Lock className="h-10 w-10 text-purple-300" />
      </div>
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">{featureName} Kilitli</h2>
      <p className="text-gray-500 mb-1 max-w-sm">
        Bu özellik <span className="font-semibold text-purple-600">{requiredPlan}</span> ve üzeri paketlerde kullanılabilir.
      </p>
      <p className="text-sm text-gray-400 mb-8 max-w-sm">
        Paketinizi yükselterek bu özelliğe ve daha fazlasına erişin.
      </p>
      <Link
        href={`/b/${slug}/upgrade`}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors shadow-md shadow-purple-200"
      >
        <Sparkles className="h-4 w-4" />
        Paketi Yükselt
      </Link>
    </div>
  )
}
