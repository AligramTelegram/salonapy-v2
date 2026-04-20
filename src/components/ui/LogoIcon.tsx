export function LogoIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="192" height="192" rx="40" fill="#1a0533"/>
      <circle cx="96" cy="96" r="64" fill="none" stroke="#c084fc" strokeWidth="4"/>
      {/* H */}
      <line x1="68" y1="70" x2="68" y2="122" stroke="#e9d5ff" strokeWidth="7" strokeLinecap="round"/>
      <line x1="68" y1="96" x2="96" y2="96" stroke="#e9d5ff" strokeWidth="7" strokeLinecap="round"/>
      <line x1="96" y1="70" x2="96" y2="122" stroke="#e9d5ff" strokeWidth="7" strokeLinecap="round"/>
      {/* S */}
      <path d="M108 78 Q108 70 124 70 Q140 70 140 82 Q140 96 108 96 Q108 110 124 122 Q140 122 140 114" fill="none" stroke="#c084fc" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
