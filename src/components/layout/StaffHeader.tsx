import Image from 'next/image'

interface StaffHeaderProps {
  staffName: string
  tenantName: string
  avatarUrl?: string | null
}

export function StaffHeader({ staffName, tenantName, avatarUrl }: StaffHeaderProps) {
  const initials = staffName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-purple-100/60">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 shadow-sm shadow-purple-200">
            <span className="font-display text-sm font-bold text-white leading-none">S</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">{staffName}</p>
            <p className="text-[11px] text-purple-500 font-medium">{tenantName}</p>
          </div>
        </div>

        <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-sm font-bold shrink-0 overflow-hidden">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={staffName} width={36} height={36} className="h-full w-full object-cover" unoptimized />
          ) : (
            initials
          )}
        </div>
      </div>
    </header>
  )
}
