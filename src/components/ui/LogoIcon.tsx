export function LogoIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="lbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6d28d9"/>
          <stop offset="100%" stopColor="#4f46e5"/>
        </linearGradient>
        <linearGradient id="lin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd"/>
          <stop offset="100%" stopColor="#818cf8"/>
        </linearGradient>
      </defs>
      <rect width="192" height="192" rx="48" fill="url(#lbg)"/>
      <path d="M138 58 A58 58 0 1 0 138 134 L118 134 A38 38 0 1 1 118 58 Z" fill="white" opacity="0.95"/>
      <path d="M122 78 A30 30 0 1 0 122 114 L106 114 A14 14 0 1 1 106 78 Z" fill="url(#lin)"/>
    </svg>
  )
}
