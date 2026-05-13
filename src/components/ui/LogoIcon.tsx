import Image from 'next/image'

export function LogoIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <Image
      src="/images/logo.png"
      alt="HemenSalon"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'cover', borderRadius: '22%' }}
      priority
    />
  )
}
