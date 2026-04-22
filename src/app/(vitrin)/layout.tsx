import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CookieBanner } from '@/components/vitrin/CookieBanner'
import { MotionProvider } from '@/components/vitrin/MotionProvider'

export default function VitrinLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CookieBanner />
    </MotionProvider>
  )
}
