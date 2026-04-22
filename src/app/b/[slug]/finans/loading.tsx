import { Skeleton } from '@/components/ui/skeleton'

export default function FinansLoading() {
  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-9 w-32 rounded-lg shrink-0" />
      </div>
      {/* Özet kartlar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
      {/* Graf */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <Skeleton className="h-5 w-40 mb-5" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
      {/* İşlem listesi */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
        <Skeleton className="h-5 w-32 mb-2" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}
