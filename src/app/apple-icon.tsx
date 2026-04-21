import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: 'linear-gradient(135deg, #6d28d9, #4c1d95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Daire */}
        <div style={{
          position: 'absolute',
          width: 120,
          height: 120,
          borderRadius: 60,
          border: '3px solid rgba(196,181,253,0.6)',
        }} />
        {/* hs yazısı */}
        <div style={{
          color: 'white',
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontSize: 56,
          fontWeight: 400,
          letterSpacing: -2,
        }}>
          hs
        </div>
      </div>
    ),
    { ...size }
  )
}
