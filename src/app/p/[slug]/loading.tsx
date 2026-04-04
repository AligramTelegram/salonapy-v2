import { Skeleton } from '@/components/ui/skeleton'

export default function StaffLoading() {
  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>

      {/* Next appointment */}
      <Skeleton className="h-32 w-full rounded-2xl" />

      {/* Title */}
      <Skeleton className="h-5 w-36" />

      {/* Appointment list */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3">
            <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-7 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
