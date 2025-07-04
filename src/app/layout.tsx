import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SkipLink } from '@/components/accessibility/SkipLink';
import { WebsiteStructuredData, OrganizationStructuredData } from '@/components/seo/StructuredData';
import {
  ServiceWorkerProvider,
  UpdateNotification,
  OfflineIndicator,
} from '@/components/pwa/ServiceWorkerProvider';
import { InstallPrompt, IOSInstallInstructions } from '@/components/pwa/InstallPrompt';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '求职信生成器 - AI智能求职信生成工具',
    template: '%s | 求职信生成器',
  },
  description:
    '使用AI技术快速生成专业、个性化的求职信。支持多种模板，ATS优化，助您在求职路上脱颖而出。',
  keywords: ['求职信生成器', 'AI求职信', '简历', '求职', '职业发展', 'ATS优化', '求职工具'],
  authors: [{ name: '求职信生成器团队' }],
  creator: '求职信生成器',
  publisher: '求职信生成器',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    title: '求职信生成器 - AI智能求职信生成工具',
    description:
      '使用AI技术快速生成专业、个性化的求职信。支持多种模板，ATS优化，助您在求职路上脱颖而出。',
    siteName: '求职信生成器',
  },
  twitter: {
    card: 'summary_large_image',
    title: '求职信生成器 - AI智能求职信生成工具',
    description:
      '使用AI技术快速生成专业、个性化的求职信。支持多种模板，ATS优化，助您在求职路上脱颖而出。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  return (
    <html lang="zh-CN" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch for better performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className="bg-surface text-on-surface min-h-screen antialiased">
        {/* Skip Links for Accessibility */}
        <SkipLink href="#main-content">跳转到主要内容</SkipLink>
        <SkipLink href="#navigation">跳转到导航</SkipLink>

        {/* Structured Data */}
        <WebsiteStructuredData
          name="求职信生成器"
          description="使用AI技术快速生成专业、个性化的求职信。支持多种模板，ATS优化，助您在求职路上脱颖而出。"
          url={baseUrl}
          logo={`${baseUrl}/logo.png`}
          sameAs={[
            'https://github.com/your-username/cover-letter-generator',
            'https://twitter.com/your-handle',
          ]}
        />

        <OrganizationStructuredData
          name="求职信生成器"
          description="专业的AI求职信生成服务提供商"
          url={baseUrl}
          logo={`${baseUrl}/logo.png`}
          contactPoint={{
            telephone: '+86-400-123-4567',
            contactType: 'customer service',
            email: 'support@coverletter-generator.com',
          }}
          sameAs={[
            'https://github.com/your-username/cover-letter-generator',
            'https://twitter.com/your-handle',
          ]}
        />

        <ServiceWorkerProvider>
          <div id="root" className="relative flex min-h-screen flex-col">
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </div>

          {/* PWA Components */}
          <InstallPrompt />
          <IOSInstallInstructions />
          <UpdateNotification />
          <OfflineIndicator />

          {/* Live region for screen reader announcements */}
          <div
            id="live-region"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          />
        </ServiceWorkerProvider>
      </body>
    </html>
  );
}
