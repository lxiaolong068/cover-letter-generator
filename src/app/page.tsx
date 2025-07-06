import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'AI Cover Letter Generator - Professional & ATS-Optimized',
  description:
    'Generate professional, ATS-optimized cover letters instantly with our AI Cover Letter Generator.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen animate-fade-in bg-gradient-to-br from-background via-background-variant to-background">
      {/* Navigation */}
      <nav className="nav-modern sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-xl font-bold transition-all duration-200 gradient-text hover:scale-105"
              >
                AI Cover Letter Generator
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="button-hover-lift" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="primary" size="sm" className="button-hover-lift" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-secondary-50/20 to-accent-50/30"></div>
        <div className="bg-dot-pattern absolute inset-0 opacity-20"></div>

        {/* Floating Elements */}
        <div className="absolute left-10 top-20 h-20 w-20 animate-float rounded-full bg-gradient-to-br from-primary-400 to-primary-600 opacity-20"></div>
        <div className="absolute right-20 top-40 h-12 w-12 animate-float rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 opacity-20 delay-1000"></div>
        <div className="delay-2000 absolute bottom-20 left-20 h-16 w-16 animate-float rounded-full bg-gradient-to-br from-accent-400 to-accent-600 opacity-20"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-8 animate-bounce-in">
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 px-4 py-2 text-sm font-semibold text-primary-800 shadow-soft ring-1 ring-primary-200/50">
                <span className="animate-pulse">✨</span>
                AI-Powered • Professional • ATS-Optimized
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="animate-slide-up text-4xl font-bold tracking-tight text-on-background sm:text-6xl lg:text-7xl">
              Create Professional
              <span className="mt-2 block animate-slide-up delay-150 gradient-text">
                Cover Letters
              </span>
              <span className="animate-slide-up bg-gradient-to-r from-secondary-600 to-accent-600 bg-clip-text text-transparent delay-300">
                with AI
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl animate-slide-up text-lg leading-8 text-on-surface-variant delay-500 sm:text-xl">
              Generate ATS-optimized cover letters instantly. Our advanced AI creates personalized,
              professional cover letters that help you stand out and land your dream job.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex animate-slide-up flex-col items-center justify-center gap-4 delay-700 sm:flex-row sm:gap-6">
              <Button
                variant="primary"
                size="lg"
                className="button-hover-lift w-full sm:w-auto"
                leftIcon={<span className="text-xl">🚀</span>}
                asChild
              >
                <Link href="/dashboard/generate">Start Creating Free</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="button-hover-lift w-full sm:w-auto"
                leftIcon={<span className="text-xl">📄</span>}
                asChild
              >
                <Link href="/examples">View Examples</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex animate-slide-up flex-col items-center justify-center gap-6 text-sm text-on-surface-variant delay-1000 sm:flex-row">
              <div className="flex items-center gap-2 rounded-full px-4 py-2 surface-container">
                <span className="text-success-500">✓</span>
                <span>100% Free to Start</span>
              </div>
              <div className="flex items-center gap-2 rounded-full px-4 py-2 surface-container">
                <span className="text-success-500">✓</span>
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2 rounded-full px-4 py-2 surface-container">
                <span className="text-success-500">✓</span>
                <span>ATS-Optimized Templates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="animate-slide-up text-3xl font-bold text-on-background sm:text-4xl">
              Why Choose Our AI Cover Letter Generator?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl animate-slide-up text-lg text-on-surface-variant delay-150">
              Join thousands of job seekers who have successfully landed interviews with our
              AI-powered cover letters.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="card-modern group animate-slide-up p-8 delay-300">
              <div className="group-hover:shadow-glow-primary/50 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-glow-primary transition-all duration-300">
                <span className="animate-bounce text-2xl">🤖</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-on-surface">AI-Powered Generation</h3>
              <p className="leading-relaxed text-on-surface-variant">
                Advanced AI analyzes job descriptions and creates personalized cover letters
                tailored to each position with professional language and industry-specific keywords.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-modern group animate-slide-up p-8 delay-500">
              <div className="group-hover:shadow-glow-secondary/50 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-600 shadow-glow-secondary transition-all duration-300">
                <span className="animate-bounce text-2xl delay-150">⚡</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-on-surface">Instant Results</h3>
              <p className="leading-relaxed text-on-surface-variant">
                Generate professional cover letters in seconds, not hours. Save time and apply to
                more jobs with our lightning-fast AI technology.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-modern group animate-slide-up p-8 delay-700">
              <div className="group-hover:shadow-glow-accent/50 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 shadow-glow-accent transition-all duration-300">
                <span className="animate-bounce text-2xl delay-300">🎯</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-on-surface">ATS-Optimized</h3>
              <p className="leading-relaxed text-on-surface-variant">
                All templates are designed to pass Applicant Tracking Systems and reach human
                recruiters with proper formatting and keyword optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gradient-to-r from-surface-container to-surface-variant py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="animate-scale-in p-6 text-center surface-elevated">
              <div className="mb-2 text-3xl font-bold text-primary-600">50K+</div>
              <div className="text-sm text-on-surface-variant">Cover Letters Generated</div>
            </div>
            <div className="animate-scale-in p-6 text-center delay-150 surface-elevated">
              <div className="mb-2 text-3xl font-bold text-secondary-600">95%</div>
              <div className="text-sm text-on-surface-variant">Success Rate</div>
            </div>
            <div className="animate-scale-in p-6 text-center delay-300 surface-elevated">
              <div className="mb-2 text-3xl font-bold text-accent-600">24/7</div>
              <div className="text-sm text-on-surface-variant">Available</div>
            </div>
            <div className="animate-scale-in p-6 text-center delay-500 surface-elevated">
              <div className="mb-2 text-3xl font-bold text-success-600">15+</div>
              <div className="text-sm text-on-surface-variant">Industries Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-secondary-600 py-16 text-white sm:py-24">
        <div className="bg-grid-pattern absolute inset-0 opacity-10"></div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 animate-slide-up text-3xl font-bold sm:text-4xl">
            Ready to Land Your Dream Job?
          </h2>
          <p className="mb-8 animate-slide-up text-xl opacity-90 delay-150">
            Join thousands of successful job seekers who used our AI-powered cover letter generator
            to get more interviews and job offers.
          </p>
          <Button
            variant="accent"
            size="xl"
            className="button-hover-lift animate-bounce-in delay-300"
            leftIcon={<span className="text-2xl">🚀</span>}
            asChild
          >
            <Link href="/dashboard/generate">Start Creating Your Cover Letter</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
