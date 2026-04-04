import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  trend?: {
    value: number   // yüzde, pozitif = artış, negatif = düşüş
    label?: string  // "geçen aya göre"
  }
  /** progress bar için: 0-100 */
  progress?: {
    value: number
    max: number
    label?: string
  }
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-purple-600',
  iconBg = 'bg-purple-100',
  trend,
  progress,
}: StatsCardProps) {
  const TrendIcon =
    !trend ? null
    : trend.value > 0 ? TrendingUp
    : trend.value < 0 ? TrendingDown
    : Minus

  const trendColor =
    !trend ? ''
    : trend.value > 0 ? 'text-emerald-600'
    : trend.value < 0 ? 'text-red-500'
    : 'text-gray-400'

  const progressPercent = progress
    ? Math.min(100, Math.round((progress.value / progress.max) * 100))
    : null

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      {/* Üst satır: ikon + başlık */}
      <div className="flex items-start justify-between">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl shrink-0', iconBg)}>
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
        {trend && TrendIcon && (
          <div className={cn('flex items-center gap-1 text-xs font-semibold', trendColor)}>
            <TrendIcon className="h-3.5 w-3.5" />
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {/* Değer + başlık */}
      <div>
        <p className="text-2xl font-display font-bold text-gray-900 leading-tight">{value}</p>
        <p className="mt-0.5 text-sm font-medium text-gray-500">{title}</p>
        {subtitle && (
          <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
        )}
        {trend && (
          <p className={cn('mt-1 text-xs font-medium', trendColor)}>
            {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label ?? 'geçen aya göre'}
          </p>
        )}
      </div>

      {/* Progress bar (isteğe bağlı) */}
      {progress && progressPercent !== null && (
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-purple-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-purple-500 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400">
            {progress.value.toLocaleString('tr-TR')} / {progress.max.toLocaleString('tr-TR')}
            {progress.label && ` ${progress.label}`}
          </p>
        </div>
      )}
    </div>
  )
}
