import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { HeaderNavigation } from '@/components/ui/HeaderNavigation';

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
    default: 'AI Cover Letter Generator - Create Professional Cover Letters Instantly',
    template: '%s | AI Cover Letter Generator',
  },
  description:
    'Generate professional, ATS-optimized cover letters instantly with our AI Cover Letter Generator. Free templates, multiple formats, and expert-quality results to help you land your dream job.',
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
    title: 'AI Cover Letter Generator - Create Professional Cover Letters Instantly',
    description:
      'Generate professional, ATS-optimized cover letters instantly with our AI Cover Letter Generator. Free templates, multiple formats, and expert-quality results to help you land your dream job.',
    siteName: 'AI Cover Letter Generator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Cover Letter Generator - Create Professional Cover Letters Instantly',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Cover Letter Generator - Create Professional Cover Letters Instantly',
    description:
      'Generate professional, ATS-optimized cover letters instantly with our AI Cover Letter Generator. Free templates, multiple formats, and expert-quality results.',
    images: ['/og-image.png'],
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
  return (
    <html lang="en-US" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div id="root" className="relative flex min-h-screen flex-col">
          <HeaderNavigation />
          <main id="main-content" className="flex-1">
            {children}
          </main>

          {/* Enhanced Footer */}
          <footer className="border-t border-gray-200 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                {/* Brand */}
                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">
                    AI Cover Letter Generator
                  </h3>
                  <p className="max-w-md text-sm text-gray-600">
                    Create professional, ATS-optimized cover letters instantly with our AI-powered
                    platform. Join thousands of job seekers who have successfully landed interviews.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
                    Quick Links
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="/templates"
                        className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                      >
                        Templates
                      </a>
                    </li>
                    <li>
                      <a
                        href="/examples"
                        className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                      >
                        Examples
                      </a>
                    </li>
                    <li>
                      <a
                        href="/pricing"
                        className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                      >
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a
                        href="/dashboard"
                        className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                      >
                        Dashboard
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
                    Legal
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="/privacy"
                        className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="/terms"
                        className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                      >
                        Terms of Service
                      </a>
                    </li>
                    <li>
                      <a
                        href="mailto:support@ai-coverletter-generator.com"
                        className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                      >
                        Contact Support
                      </a>
                    </li>
                    <li>
                      <a
                        href="/.well-known/security.txt"
                        className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                      >
                        Security
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="mt-8 border-t border-gray-200 pt-8">
                <div className="flex flex-col items-center justify-between md:flex-row">
                  <p className="text-sm text-gray-600">
                    &copy; 2024 AI Cover Letter Generator. All rights reserved.
                  </p>
                  <div className="mt-4 flex space-x-6 md:mt-0">
                    <a
                      href="/privacy"
                      className="text-xs text-gray-500 transition-colors hover:text-gray-700"
                    >
                      Privacy
                    </a>
                    <a
                      href="/terms"
                      className="text-xs text-gray-500 transition-colors hover:text-gray-700"
                    >
                      Terms
                    </a>
                    <a
                      href="mailto:support@ai-coverletter-generator.com"
                      className="text-xs text-gray-500 transition-colors hover:text-gray-700"
                    >
                      Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
