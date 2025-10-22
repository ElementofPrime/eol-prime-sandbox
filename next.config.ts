import type { NextConfig } from 'next';

const securityHeaders = [
  // Force HTTPS for 6 months (adjust if needed)
  { key: 'Strict-Transport-Security', value: 'max-age=15552000; includeSubDomains; preload' },
  // Basic hardening (tune CSP as you add domains)
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
    ];
  },
};

export default nextConfig;
