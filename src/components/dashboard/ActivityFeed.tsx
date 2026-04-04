import { Calendar, UserPlus, CheckCircle2, XCircle, MessageCircle, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ActivityType =
  | 'RANDEVU_OLUSTURULDU'
  | 'RANDEVU_TAMAMLANDI'
  | 'RANDEVU_IPTAL'
  | 'MUSTERI_EKLENDI'
  | 'WHATSAPP_GONDERILDI'

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description?: string
  time: string  // "2 saat önce", "Dün 14:30" vb.
}

const ACTIVITY_CONFIG: Record<
  ActivityType,
  { icon: LucideIcon; iconBg: string; iconColor: string }
> = {
  RANDEVU_OLUSTURULDU: {
    icon: Calendar,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  RANDEVU_TAMAMLANDI: {
    icon: CheckCircle2,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  RANDEVU_IPTAL: {
    icon: XCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
  },
  MUSTERI_EKLENDI: {
    icon: UserPlus,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  WHATSAPP_GONDERILDI: {
    icon: MessageCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
}

interface ActivityFeedProps {
  activities: ActivityItem[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">Henüz aktivite yok.</p>
    )
  }

  return (
    <ol className="relative space-y-0">
      {activities.map((item, index) => {
        const config = ACTIVITY_CONFIG[item.type]
        const Icon = config.icon
        const isLast = index === activities.length - 1

        return (
          <li key={item.id} className="flex gap-3 pb-4 relative">
            {/* Timeline çizgisi */}
            {!isLast && (
              <div className="absolute left-[18px] top-9 bottom-0 w-px bg-purple-100" />
            )}

            {/* İkon */}
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl z-10',
                config.iconBg
              )}
            >
              <Icon className={cn('h-4 w-4', config.iconColor)} />
            </div>

            {/* İçerik */}
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{item.title}</p>
              {item.description && (
                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
              )}
              <p className="text-[11px] text-gray-400 mt-1">{item.time}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
