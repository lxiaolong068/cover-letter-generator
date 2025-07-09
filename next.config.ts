import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Minimal configuration for Vercel deployment
  experimental: {
    // Only keep essential optimizations
    optimizeCss: true,
  },

  // Server external packages
  serverExternalPackages: [
    'winston',
    'ioredis',
    'nodemailer',
    'next-auth',
    'twilio',
    'qrcode',
    'speakeasy',
  ],

  // Basic image optimization
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Minimal compiler settings
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Disable problematic features
  poweredByHeader: false,
  trailingSlash: false,
};

export default nextConfig;
