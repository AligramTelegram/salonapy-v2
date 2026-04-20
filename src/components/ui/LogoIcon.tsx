export function LogoIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="lbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8a7a5a"/>
          <stop offset="100%" stopColor="#2d6060"/>
        </linearGradient>
      </defs>
      <rect width="192" height="192" rx="28" fill="url(#lbg)"/>
      {/* Sol çift dikey çizgi */}
      <line x1="62" y1="56" x2="62" y2="136" stroke="white" strokeWidth="7" strokeLinecap="round"/>
      <line x1="74" y1="56" x2="74" y2="136" stroke="white" strokeWidth="7" strokeLinecap="round"/>
      {/* Sağ çift dikey çizgi */}
      <line x1="118" y1="56" x2="118" y2="136" stroke="white" strokeWidth="7" strokeLinecap="round"/>
      <line x1="130" y1="56" x2="130" y2="136" stroke="white" strokeWidth="7" strokeLinecap="round"/>
      {/* Çapraz köprü çizgisi */}
      <path d="M74 120 L110 72 Q116 64 122 70" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
