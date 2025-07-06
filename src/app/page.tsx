import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FeatureCard, StatsCard } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'AI Cover Letter Generator - Professional & ATS-Optimized',
  description:
    'Generate professional, ATS-optimized cover letters instantly with our AI Cover Letter Generator.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-xl font-bold text-foreground hover:text-primary transition-colors"
              >
                AI Cover Letter Generator
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(148_163_184_/_0.15)_1px,transparent_0)] bg-[length:24px_24px]"></div>

        {/* Floating Elements */}
        <div className="absolute left-10 top-20 h-20 w-20 animate-float rounded-full bg-gradient-to-br from-primary/20 to-primary/30 blur-xl"></div>
        <div className="absolute right-20 top-40 h-12 w-12 animate-float rounded-full bg-gradient-to-br from-secondary/20 to-secondary/30 blur-xl delay-1000"></div>
        <div className="delay-2000 absolute bottom-20 left-20 h-16 w-16 animate-float rounded-full bg-gradient-to-br from-accent/20 to-accent/30 blur-xl"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-card-foreground shadow-sm">
                <span className="animate-pulse">✨</span>
                AI-Powered • Professional • ATS-Optimized
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Create Professional
              <span className="mt-2 block bg-gradient-to-r from-primary to-secondary bg-clip-text font-extrabold text-transparent">
                Cover Letters
              </span>
              <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text font-extrabold text-transparent">
                with AI
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
              Generate ATS-optimized cover letters instantly. Our advanced AI creates personalized,
              professional cover letters that help you stand out and land your dream job.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                leftIcon={<span className="text-xl">🚀</span>}
                asChild
              >
                <Link href="/dashboard/generate">Start Creating Free</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                leftIcon={<span className="text-xl">📄</span>}
                asChild
              >
                <Link href="/examples">View Examples</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-col items-center justify-center gap-6 text-sm text-muted-foreground sm:flex-row">
              <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm border border-border">
                <span className="text-green-500">✓</span>
                <span>100% Free to Start</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm border border-border">
                <span className="text-green-500">✓</span>
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm border border-border">
                <span className="text-green-500">✓</span>
                <span>ATS-Optimized Templates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Choose Our AI Cover Letter Generator?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Join thousands of job seekers who have successfully landed interviews with our
              AI-powered cover letters.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<span className="text-2xl">🤖</span>}
              title="AI-Powered Generation"
              description="Advanced AI analyzes job descriptions and creates personalized cover letters tailored to each position with professional language and industry-specific keywords."
              gradient
            />
            
            <FeatureCard
              icon={<span className="text-2xl">⚡</span>}
              title="Instant Results"
              description="Generate professional cover letters in seconds, not hours. Save time and apply to more jobs with our lightning-fast AI technology."
              gradient
            />
            
            <FeatureCard
              icon={<span className="text-2xl">🎯</span>}
              title="ATS-Optimized"
              description="All templates are designed to pass Applicant Tracking Systems and reach human recruiters with proper formatting and keyword optimization."
              gradient
            />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              value="50K+"
              label="Cover Letters Generated"
              icon={<span className="text-xl">📄</span>}
              trend="up"
              trendValue="+15% this month"
            />
            <StatsCard
              value="95%"
              label="Success Rate"
              icon={<span className="text-xl">✅</span>}
              trend="up"
              trendValue="+2% vs last quarter"
            />
            <StatsCard
              value="24/7"
              label="Available"
              icon={<span className="text-xl">🕒</span>}
              trend="neutral"
              trendValue="Always online"
            />
            <StatsCard
              value="15+"
              label="Industries Covered"
              icon={<span className="text-xl">🏢</span>}
              trend="up"
              trendValue="+3 new industries"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Get your perfect cover letter in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">Upload Job Description</h3>
              <p className="mt-2 text-muted-foreground">
                Paste the job posting or upload the job description you&apos;re applying for.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">AI Generates Content</h3>
              <p className="mt-2 text-muted-foreground">
                Our AI analyzes the job requirements and creates a tailored cover letter for you.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">Download & Apply</h3>
              <p className="mt-2 text-muted-foreground">
                Review, customize if needed, and download your professional cover letter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-card border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-card-foreground sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Join thousands of successful job seekers and create your first cover letter today.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                asChild
              >
                <Link href="/dashboard/generate">Start Creating Now</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                asChild
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 AI Cover Letter Generator. All rights reserved.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
