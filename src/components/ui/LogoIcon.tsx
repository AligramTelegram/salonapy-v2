export function LogoIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="lbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6d28d9"/>
          <stop offset="100%" stopColor="#4c1d95"/>
        </linearGradient>
      </defs>
      <rect width="192" height="192" rx="40" fill="url(#lbg)"/>
      <circle cx="96" cy="96" r="68" fill="none" stroke="rgba(196,181,253,0.5)" strokeWidth="2.5"/>
      <text
        x="96" y="112"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="64"
        fontStyle="italic"
        fontWeight="400"
        fill="white"
        textAnchor="middle"
        letterSpacing="-2"
      >hs</text>
    </svg>
  )
}
