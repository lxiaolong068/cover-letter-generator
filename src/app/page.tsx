import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Cover Letter Generator - Create Professional Cover Letters Instantly',
  description:
    'Generate professional, ATS-optimized cover letters instantly with our AI Cover Letter Generator.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="border-b border-outline-variant bg-surface shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-primary text-xl font-bold transition-colors hover:text-primary-600"
              >
                AI Cover Letter Generator
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-primary rounded-lg px-4 py-2 text-sm font-semibold text-on-primary shadow-md transition-all duration-200 hover:bg-primary-600 hover:shadow-lg focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">
        {/* Background Pattern */}
        <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800 ring-1 ring-inset ring-primary-600/20">
                ✨ AI-Powered • Professional • ATS-Optimized
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-on-surface sm:text-6xl lg:text-7xl">
              Create Professional
              <span className="text-primary mt-2 block">Cover Letters</span>
              <span className="text-secondary">with AI</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-on-surface-variant sm:text-xl">
              Generate ATS-optimized cover letters instantly. Our advanced AI creates personalized,
              professional cover letters that help you stand out and land your dream job.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/generator"
                className="bg-primary w-full transform rounded-lg px-8 py-4 text-lg font-semibold text-on-primary shadow-lg transition-all duration-200 hover:scale-105 hover:bg-primary-600 hover:shadow-xl focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
              >
                🚀 Start Creating Free
              </Link>
              <Link
                href="/examples"
                className="hover:text-primary hover:border-primary w-full rounded-lg border-2 border-outline px-8 py-4 text-lg font-semibold text-on-surface transition-all duration-200 hover:bg-surface-variant sm:w-auto"
              >
                📄 View Examples
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-col items-center justify-center gap-6 text-sm text-on-surface-variant sm:flex-row">
              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>100% Free to Start</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>ATS-Optimized Templates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Preview Section */}
      <div className="bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-on-surface sm:text-4xl">
              Why Choose Our AI Cover Letter Generator?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-on-surface-variant">
              Join thousands of job seekers who have successfully landed interviews with our
              AI-powered cover letters.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl bg-surface-variant p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <span className="text-primary text-2xl">🤖</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-on-surface">AI-Powered Generation</h3>
              <p className="text-on-surface-variant">
                Advanced AI analyzes job descriptions and creates personalized cover letters
                tailored to each position.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl bg-surface-variant p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-100">
                <span className="text-secondary text-2xl">⚡</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-on-surface">Instant Results</h3>
              <p className="text-on-surface-variant">
                Generate professional cover letters in seconds, not hours. Save time and apply to
                more jobs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl bg-surface-variant p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success-100">
                <span className="text-success text-2xl">🎯</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-on-surface">ATS-Optimized</h3>
              <p className="text-on-surface-variant">
                All templates are designed to pass Applicant Tracking Systems and reach human
                recruiters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
