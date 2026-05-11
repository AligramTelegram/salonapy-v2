/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // iyzipay uses dynamic requires internally; mark as external to avoid bundling
    serverComponentsExternalPackages: ['iyzipay'],
  },
  async headers() {
    return [
      {
        // Admin sayfalarında Tiptap için unsafe-eval'e izin ver
        source: '/admin/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval'; object-src 'none';",
          },
        ],
      },
    ]
  },
}

export default nextConfig
