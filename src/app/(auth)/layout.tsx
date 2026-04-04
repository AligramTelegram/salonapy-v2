import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Giriş Yap',
    template: '%s | Salonapy',
  },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#faf8ff]" style={{ backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,58,237,0.18) 0%, transparent 70%)' }}>
      {children}
    </div>
  )
}
