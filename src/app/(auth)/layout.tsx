import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Giriş Yap',
    template: '%s | Hemensalon',
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
