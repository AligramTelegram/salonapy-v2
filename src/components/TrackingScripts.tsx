/**
 * TrackingScripts — Server Component
 * Admin panelindeki Analytics ayarlarından (siteSetting tablosu) GA4, GTM ve
 * Facebook Pixel ID'lerini okur ve ilgili scriptleri sayfaya ekler.
 * NEXT_PUBLIC_GA_ID env değişkeni varsa fallback olarak kullanılır.
 */

import Script from 'next/script'
import { prisma } from '@/lib/prisma'

export async function getTrackingIds() {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: ['ga_id', 'gtm_id', 'fb_pixel_id'] } },
      select: { key: true, value: true },
    })
    const map: Record<string, string> = {}
    for (const row of rows) {
      if (row.value?.trim()) map[row.key] = row.value.trim()
    }
    return {
      gaId: map['ga_id'] || process.env.NEXT_PUBLIC_GA_ID || null,
      gtmId: map['gtm_id'] || null,
      fbPixelId: map['fb_pixel_id'] || null,
    }
  } catch {
    return {
      gaId: process.env.NEXT_PUBLIC_GA_ID || null,
      gtmId: null,
      fbPixelId: null,
    }
  }
}

/**
 * <head> içine yerleştirilecek scriptler (GTM + GA4)
 * layout.tsx'in <head> bölümünde kullanılır.
 */
export async function TrackingHeadScripts() {
  const { gaId, gtmId } = await getTrackingIds()

  return (
    <>
      {/* Google Tag Manager — <head> içinde olmalı */}
      {gtmId && (
        <script
          id="gtm-head"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />
      )}

      {/* Google Analytics 4 — GTM yoksa doğrudan */}
      {gaId && !gtmId && (
        <>
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
          <script
            id="ga4-init"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`,
            }}
          />
        </>
      )}

      {/* Google Ads — afterInteractive ile LCP'yi bloklamaz */}
      <Script id="google-ads" strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=AW-17862980295" />
      <Script
        id="google-ads-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-17862980295');`,
        }}
      />
    </>
  )
}

/**
 * <body> içine yerleştirilecek scriptler (GTM noscript + FB Pixel)
 * layout.tsx'in <body> başında kullanılır.
 */
export async function TrackingBodyScripts() {
  const { gtmId, fbPixelId } = await getTrackingIds()

  return (
    <>
      {/* GTM noscript — <body> açılış etiketinin hemen ardında */}
      {gtmId && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}

      {/* Facebook Pixel */}
      {fbPixelId && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${fbPixelId}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  )
}

/** @deprecated TrackingHeadScripts + TrackingBodyScripts kullanın */
export async function TrackingScripts() {
  return <TrackingBodyScripts />
}
