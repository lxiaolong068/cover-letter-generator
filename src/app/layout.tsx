import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

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
  keywords: [
    'AI cover letter generator',
    'cover letter generator',
    'AI cover letter builder',
    'professional cover letter maker',
    'cover letter templates',
    'ATS optimized cover letter',
    'job application letter generator',
    'resume cover letter builder',
    'career tools',
    'job search tools',
    'cover letter AI',
    'automated cover letter',
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
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <div id="root" className="relative flex min-h-screen flex-col">
          <main id="main-content" className="flex-1">
            {children}
          </main>

          {/* Simple Footer */}
          <footer className="border-t border-gray-200 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  &copy; 2024 AI Cover Letter Generator. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
