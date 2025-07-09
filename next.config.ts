import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@tanstack/react-query',
      'react-hook-form',
      'framer-motion',
      'date-fns',
    ],
    // Enable modern bundling optimizations
    optimizeCss: true,
    // Enable server components optimization
    // serverComponentsExternalPackages: ['winston', 'ioredis', 'nodemailer'], // moved to serverExternalPackages
    // Note: ppr (partial prerendering) is only available in canary versions
    // ppr: true,
  },

  // Server external packages (moved from experimental)
  serverExternalPackages: [
    'winston',
    'ioredis',
    'nodemailer',
    'next-auth',
    'twilio',
    'qrcode',
    'speakeasy',
  ],

  // Turbopack configuration (moved out of experimental)
  turbopack: {
    rules: {
      '*.svg': ['@svgr/webpack'],
    },
  },

  // Enhanced image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable image optimization for external domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Enable placeholder blur for better UX
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Enhanced compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
    // Enable React compiler optimizations
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // Output optimization - remove standalone for Vercel deployment
  // output: 'standalone',

  // Bundle analysis
  bundlePagesRouterDependencies: true,

  // Enable compression
  compress: true,

  // Enable static optimization
  trailingSlash: false,

  // Power optimizations
  poweredByHeader: false,

  // Enhanced Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Simplified bundle splitting strategy for Vercel compatibility
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          chunks: 'all',
        },
        common: {
          minChunks: 2,
          priority: -10,
          reuseExistingChunk: true,
        },
      },
    };

    // Tree shaking optimization
    config.optimization.sideEffects = false;
    config.optimization.usedExports = true;

    // Module concatenation for better performance
    if (!dev) {
      config.optimization.concatenateModules = true;
    }

    // Resolve optimizations
    config.resolve.alias = {
      ...config.resolve.alias,
      // Optimize React imports
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
    };

    // Disable performance hints for deployment compatibility
    config.performance = {
      hints: false,
    };

    // Optimize module resolution
    config.resolve.modules = ['node_modules'];
    config.resolve.symlinks = false;

    return config;
  },

  // Enhanced headers for better caching and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Static assets caching
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Next.js static files
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Images caching
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // API routes caching
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      // Service worker
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      // PWA manifest
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Fonts caching
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
