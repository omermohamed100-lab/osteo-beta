import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV !== 'production';
const configuredMediaSources = (process.env.ALLOWED_MEDIA_HOSTS ?? '')
  .split(',')
  .map((host) => host.trim().toLowerCase())
  .filter((host) => /^[a-z0-9.-]+$/.test(host))
  .map((host) => `https://${host}`);

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  `img-src 'self' data: blob:${configuredMediaSources.length ? ` ${configuredMediaSources.join(' ')}` : ''}`,
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  `connect-src 'self' https://vitals.vercel-insights.com${isDevelopment ? ' ws: wss:' : ''}`,
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDevelopment ? [] : ['upgrade-insecure-requests']),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  ...(isDevelopment
    ? []
    : [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }]),
];

const managedMediaCacheHeaders = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=86400, stale-while-revalidate=604800',
  },
];

const managedMediaPaths = [
  '/logo-clean.webp',
  '/hero-hands-rising.webp',
  '/hero-stone-architecture.webp',
  '/path-care-hands.png',
  '/path-study-pillar-v2.webp',
  '/path-practitioner-emblem.png',
  '/closing-emblem-ankh-two-snakes.png',
  '/closing-egypt-skyline-gold.png',
  '/images/osteopaths/:path*',
];

const nextConfig: NextConfig = {
  agentRules: false,
  poweredByHeader: false,
  allowedDevOrigins: ['192.168.1.105'],
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      ...managedMediaPaths.map((source) => ({
        source,
        headers: managedMediaCacheHeaders,
      })),
    ];
  },
};

export default nextConfig;
