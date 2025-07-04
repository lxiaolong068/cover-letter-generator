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
    default: 'Cover Letter Generator - AI-Powered Cover Letter Tool',
    template: '%s | Cover Letter Generator',
  },
  description:
    'Generate professional, personalized cover letters using AI technology. Multiple templates, ATS optimization, helping you stand out in your job search.',
  keywords: [
    'cover letter generator',
    'AI cover letter',
    'resume',
    'job search',
    'career development',
    'ATS optimization',
    'job tools',
  ],
  authors: [{ name: 'Cover Letter Generator Team' }],
  creator: 'Cover Letter Generator',
  publisher: 'Cover Letter Generator',
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
    locale: 'en_US',
    url: '/',
    title: 'Cover Letter Generator - AI-Powered Cover Letter Tool',
    description:
      'Generate professional, personalized cover letters using AI technology. Multiple templates, ATS optimization, helping you stand out in your job search.',
    siteName: 'Cover Letter Generator',
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
    <html lang="en-US" className={`${inter.variable} ${jetbrainsMono.variable}`}>
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
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <SkipLink href="#navigation">Skip to navigation</SkipLink>

        {/* Structured Data */}
        <WebsiteStructuredData
          name="Cover Letter Generator"
          description="Generate professional, personalized cover letters using AI technology. Multiple templates, ATS optimization, helping you stand out in your job search."
          url={baseUrl}
          logo={`${baseUrl}/logo.png`}
          sameAs={[
            'https://github.com/your-username/cover-letter-generator',
            'https://twitter.com/your-handle',
          ]}
        />

        <OrganizationStructuredData
          name="Cover Letter Generator"
          description="Professional AI cover letter generation service provider"
          url={baseUrl}
          logo={`${baseUrl}/logo.png`}
          contactPoint={{
            telephone: '+1-800-123-4567',
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
