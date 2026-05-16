import { MotionProvider } from '@/components/vitrin/MotionProvider'

export default function VitrinLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      {children}
    </MotionProvider>
  )
}
