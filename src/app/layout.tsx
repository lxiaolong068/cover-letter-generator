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
import { SoftwareApplicationStructuredData } from '@/components/seo/StructuredData';
import { FooterLinks } from '@/components/seo/InternalLinks';

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
    default: 'AI Cover Letter Generator - Create Professional Cover Letters with AI',
    template: '%s | AI Cover Letter Generator',
  },
  description:
    'Create professional, personalized cover letters instantly with our AI Cover Letter Generator. Multiple templates, ATS optimization, and expert-quality results to help you land your dream job.',
  keywords: [
    'AI cover letter generator',
    'cover letter generator',
    'AI cover letter',
    'professional cover letter',
    'cover letter templates',
    'ATS optimized cover letter',
    'job application letter',
    'resume cover letter',
    'career tools',
    'job search tools',
  ],
  authors: [{ name: 'AI Cover Letter Generator Team' }],
  creator: 'AI Cover Letter Generator',
  publisher: 'AI Cover Letter Generator',
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
    title: 'AI Cover Letter Generator - Create Professional Cover Letters with AI',
    description:
      'Create professional, personalized cover letters instantly with our AI Cover Letter Generator. Multiple templates, ATS optimization, and expert-quality results to help you land your dream job.',
    siteName: 'AI Cover Letter Generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Cover Letter Generator - Create Professional Cover Letters with AI',
    description:
      'Create professional, personalized cover letters instantly with our AI Cover Letter Generator. Multiple templates, ATS optimization, and expert-quality results.',
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
          name="AI Cover Letter Generator"
          description="Create professional, personalized cover letters instantly with our AI Cover Letter Generator. Multiple templates, ATS optimization, and expert-quality results to help you land your dream job."
          url={baseUrl}
          logo={`${baseUrl}/logo.png`}
          sameAs={[
            'https://github.com/your-username/cover-letter-generator',
            'https://twitter.com/your-handle',
          ]}
        />

        <OrganizationStructuredData
          name="AI Cover Letter Generator"
          description="Leading AI-powered cover letter generation service providing professional, ATS-optimized cover letters for job seekers worldwide."
          url={baseUrl}
          logo={`${baseUrl}/logo.png`}
          contactPoint={{
            telephone: '+1-800-123-4567',
            contactType: 'customer service',
            email: 'support@ai-coverletter-generator.com',
          }}
          sameAs={[
            'https://github.com/your-username/cover-letter-generator',
            'https://twitter.com/your-handle',
          ]}
        />

        <SoftwareApplicationStructuredData
          name="AI Cover Letter Generator"
          description="Professional AI-powered cover letter generator that creates personalized, ATS-optimized cover letters instantly. Features multiple templates, expert-quality results, and seamless PDF export."
          url={baseUrl}
          applicationCategory="BusinessApplication"
          operatingSystem="Web Browser, iOS, Android"
          author={{
            '@type': 'Organization',
            name: 'AI Cover Letter Generator Team',
            url: baseUrl,
          }}
          offers={{
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            category: 'Free with Premium Options',
          }}
          aggregateRating={{
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1247',
            bestRating: '5',
            worstRating: '1',
          }}
        />

        <ServiceWorkerProvider>
          <div id="root" className="relative flex min-h-screen flex-col">
            <main id="main-content" className="flex-1">
              {children}
            </main>

            {/* SEO-Optimized Footer */}
            <footer className="bg-surface-variant border-t border-outline-variant">
              <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <FooterLinks />

                <div className="mt-8 pt-8 border-t border-outline-variant">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-on-surface-variant text-sm">
                      <p>&copy; 2024 AI Cover Letter Generator. All rights reserved.</p>
                      <p className="mt-1">Create professional, ATS-optimized cover letters with AI technology.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-6">
                      <a href="/privacy" className="text-on-surface-variant hover:text-on-surface text-sm">
                        Privacy Policy
                      </a>
                      <a href="/terms" className="text-on-surface-variant hover:text-on-surface text-sm">
                        Terms of Service
                      </a>
                      <a href="/sitemap.xml" className="text-on-surface-variant hover:text-on-surface text-sm">
                        Sitemap
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
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
