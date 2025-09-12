import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.qrserver.com https://maps.googleapis.com https://maps.gstatic.com",
              "style-src 'self' 'unsafe-inline'", 
              "img-src 'self' data: https: http: https://i.ytimg.com https://img.youtube.com https://maps.googleapis.com https://maps.gstatic.com https://streetviewpixels-pa.googleapis.com",
              "font-src 'self' data:",
              "connect-src 'self' https://api-sandbox.doku.com https://api.doku.com https://sandbox.doku.com https://doku.com https://www.youtube.com https://youtube.com https://i.ytimg.com https://maps.googleapis.com https://maps.gstatic.com",
              "frame-src 'self' https://sandbox.doku.com https://doku.com https://www.youtube.com https://youtube.com https://maps.googleapis.com https://www.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          }
        ]
      },
      {
        // Specific headers for API routes
        source: '/api/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate'
          }
        ]
      },
      {
        // Admin area security
        source: '/admin/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet'
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate'
          }
        ]
      }
    ];
  },
  
  // Redirect HTTP to HTTPS in production
  async redirects() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/:path*',
          has: [
            {
              type: 'header',
              key: 'x-forwarded-proto',
              value: 'http',
            },
          ],
          destination: (process.env.NEXT_PUBLIC_PRODUCTION_URL || 'https://synergyseasummit.co.id') + '/:path*',
          permanent: true,
        },
      ];
    }
    return [];
  }
};

export default nextConfig;
