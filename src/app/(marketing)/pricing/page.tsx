import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Navigation, Breadcrumb } from '@/components/ui/Navigation';
import { ContextualNav } from '@/components/seo/InternalLinks';
import { BreadcrumbStructuredData, FAQStructuredData } from '@/components/seo/StructuredData';

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/templates', label: 'Templates' },
  { href: '/examples', label: 'Examples' },
  { href: '/pricing', label: 'Pricing' },
];

const breadcrumbItems = [{ href: '/', label: 'Home' }, { label: 'Pricing' }];

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out our AI Cover Letter Generator',
    features: [
      '3 cover letters per month',
      'Basic templates',
      'Standard AI generation',
      'PDF download',
      'Email support',
    ],
    limitations: ['Limited customization', 'Basic templates only', 'Standard processing speed'],
    cta: 'Get Started Free',
    href: '/register',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'per month',
    description: 'Best for active job seekers and career changers',
    features: [
      'Unlimited cover letters',
      'All premium templates',
      'Advanced AI generation',
      'Multiple file formats (PDF, DOCX)',
      'Priority email support',
      'Cover letter analytics',
      'ATS optimization score',
      'Custom branding removal',
    ],
    limitations: [],
    cta: 'Start Pro Trial',
    href: '/register?plan=pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For teams, recruiters, and career services',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Bulk generation',
      'Custom templates',
      'API access',
      'Dedicated support',
      'White-label solution',
      'Advanced analytics',
      'SSO integration',
    ],
    limitations: [],
    cta: 'Contact Sales',
    href: '/contact',
    popular: false,
  },
];

const faqs = [
  {
    question: 'How does the AI Cover Letter Generator work?',
    answer:
      'Our AI analyzes your job description and profile to create personalized, ATS-optimized cover letters. Simply input your information, select a template, and get a professional cover letter in seconds.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      "Yes, you can cancel your Pro subscription at any time. Your access will continue until the end of your current billing period, and you won't be charged again.",
  },
  {
    question: 'Are the cover letters ATS-optimized?',
    answer:
      'Absolutely! All our templates and AI-generated content are designed to pass Applicant Tracking Systems (ATS) used by most companies today.',
  },
  {
    question: 'What file formats are supported?',
    answer:
      'Free users can download PDF files. Pro users get access to both PDF and DOCX formats for maximum compatibility with different application systems.',
  },
  {
    question: 'Is there a free trial for the Pro plan?',
    answer:
      'Yes! We offer a 7-day free trial for the Pro plan. You can cancel anytime during the trial period without being charged.',
  },
  {
    question: 'How many cover letters can I generate?',
    answer:
      'Free users can generate 3 cover letters per month. Pro users have unlimited generations. Enterprise plans include bulk generation capabilities.',
  },
];

import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata('pricing');

export default function PricingPage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const breadcrumbStructuredData = [
    { name: 'Home', url: baseUrl },
    { name: 'Pricing', url: `${baseUrl}/pricing` },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbStructuredData} />
      <FAQStructuredData faqs={faqs} />

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

      {/* Breadcrumb */}
      <div className="border-outline-variant bg-surface border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="from-primary-50 to-secondary-50 bg-gradient-to-br py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-on-surface text-4xl font-bold tracking-tight sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="text-on-surface-variant mx-auto mt-6 max-w-3xl text-lg leading-8">
              Choose the perfect plan for your job search journey. Start free and upgrade when you
              need more features. All plans include ATS-optimized templates and professional
              formatting.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {plans.map(plan => (
              <Card
                key={plan.name}
                className={`relative ${plan.popular ? 'ring-primary-500 shadow-lg ring-2' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-500 rounded-full px-4 py-1 text-sm font-medium text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-primary-600 text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-on-surface-variant ml-2 text-lg">/{plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="mt-4">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-center">
                        <span className="text-success-500 mr-3 text-lg">✓</span>
                        <span className="text-on-surface text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map(limitation => (
                      <li key={limitation} className="flex items-center">
                        <span className="text-on-surface-variant mr-3 text-lg">−</span>
                        <span className="text-on-surface-variant text-sm">{limitation}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Button
                      className="w-full"
                      variant={plan.popular ? 'primary' : 'outline'}
                      size="lg"
                      asChild
                    >
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="bg-surface-container py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-on-surface text-3xl font-bold">
              Why Choose Our AI Cover Letter Generator?
            </h2>
            <p className="text-on-surface-variant mt-4 text-lg">
              Trusted by thousands of job seekers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="bg-primary-100 text-primary-600 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-on-surface mb-2 text-lg font-semibold">AI-Powered</h3>
              <p className="text-on-surface-variant text-sm">
                Advanced AI creates personalized cover letters tailored to each job application
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary-100 text-secondary-600 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-on-surface mb-2 text-lg font-semibold">Lightning Fast</h3>
              <p className="text-on-surface-variant text-sm">
                Generate professional cover letters in seconds, not hours
              </p>
            </div>

            <div className="text-center">
              <div className="bg-success-100 text-success-600 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-on-surface mb-2 text-lg font-semibold">ATS Optimized</h3>
              <p className="text-on-surface-variant text-sm">
                All templates pass applicant tracking systems used by employers
              </p>
            </div>

            <div className="text-center">
              <div className="bg-warning-100 text-warning-600 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-on-surface mb-2 text-lg font-semibold">Job-Specific</h3>
              <p className="text-on-surface-variant text-sm">
                Each cover letter is customized for the specific role and company
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-on-surface text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-on-surface-variant mt-4 text-lg">
              Everything you need to know about our AI Cover Letter Generator
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-outline-variant border-b pb-6">
                <h3 className="text-on-surface mb-3 text-lg font-semibold">{faq.question}</h3>
                <p className="text-on-surface-variant">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Ready to Land Your Dream Job?</h2>
            <p className="text-primary-100 mt-4 text-xl">
              Join thousands of successful job seekers using our AI Cover Letter Generator.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">Start Free Trial</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="hover:text-primary-600 border-white text-white hover:bg-white"
                asChild
              >
                <Link href="/examples">View Examples</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contextual Navigation */}
      <ContextualNav currentPage="pricing" />
    </>
  );
}
