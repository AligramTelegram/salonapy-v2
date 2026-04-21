import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #6d28d9, #4c1d95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontSize: 16,
          fontWeight: 400,
          letterSpacing: -0.5,
        }}
      >
        hs
      </div>
    ),
    { ...size }
  )
}
