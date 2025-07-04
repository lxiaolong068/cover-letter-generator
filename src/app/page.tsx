import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Navigation } from '@/components/ui/Navigation';
import { ContextualNav } from '@/components/seo/InternalLinks';
import { Suspense, lazy } from 'react';

const FeatureSection = lazy(() =>
  import('@/components/HomePage/FeatureSection').then(module => ({
    default: module.FeatureSection,
  }))
);

const FAQSection = lazy(() =>
  import('@/components/HomePage/FAQSection').then(module => ({
    default: module.FAQSection,
  }))
);

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/templates', label: 'Templates' },
  { href: '/examples', label: 'Examples' },
  { href: '/pricing', label: 'Pricing' },
];

export default function HomePage() {
  return (
    <>
      {/* Navigation */}
      <Navigation
        items={navigationItems}
        actions={
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        }
      />

      {/* Hero Section */}
      <section className="from-primary-50 to-secondary-50 relative overflow-hidden bg-gradient-to-br py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-on-surface text-4xl font-bold tracking-tight sm:text-6xl">
              AI Cover Letter Generator
            </h1>
            <p className="text-on-surface-variant mx-auto mt-6 max-w-2xl text-lg leading-8">
              Create professional, personalized cover letters instantly with our AI Cover Letter Generator.
              Multiple templates, ATS optimization, and expert-quality results to help you land your dream job.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/dashboard">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/examples">View Examples</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Suspense
        fallback={
          <section className="py-20 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center">
                <div className="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
              </div>
            </div>
          </section>
        }
      >
        <FeatureSection />
      </Suspense>

      {/* FAQ Section */}
      <Suspense
        fallback={
          <section className="py-20 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center">
                <div className="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
              </div>
            </div>
          </section>
        }
      >
        <FAQSection />
      </Suspense>

      {/* Contextual Navigation */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ContextualNav currentPage="home" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start Creating Professional Cover Letters with AI
            </h2>
            <p className="text-primary-100 mx-auto mt-6 max-w-xl text-lg leading-8">
              Join thousands of job seekers using our AI Cover Letter Generator. Create professional,
              ATS-optimized cover letters in minutes and boost your job search success.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/register">Sign Up Free</Link>
              </Button>
              <Button variant="ghost" size="lg" className="hover:bg-primary-700 text-white" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-variant">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-on-surface-variant text-sm">
              © 2024 Cover Letter Generator. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
