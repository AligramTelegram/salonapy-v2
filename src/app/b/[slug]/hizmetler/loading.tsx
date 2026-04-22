import { Skeleton } from '@/components/ui/skeleton'

export default function HizmetlerLoading() {
  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-9 w-32 rounded-lg shrink-0" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-6 rounded-lg shrink-0" />
            </div>
            <Skeleton className="h-3 w-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
