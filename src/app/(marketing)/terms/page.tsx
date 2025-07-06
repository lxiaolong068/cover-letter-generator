import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata('terms');

export default function TermsOfServicePage() {
  const lastUpdated = 'December 15, 2024';

  return (
    <>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold text-primary-600 transition-colors hover:text-primary-700"
            >
              AI Cover Letter Generator
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 transition-colors hover:text-gray-900">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </Container>
      </nav>

      <main className="min-h-screen bg-gray-50 py-12">
        <Container size="md">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">Terms of Service</h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Please read these terms and conditions carefully before using our AI Cover Letter
              Generator service.
            </p>
            <p className="mt-4 text-sm text-gray-500">Last updated: {lastUpdated}</p>
          </div>

          {/* Terms Content */}
          <Card className="prose prose-lg max-w-none">
            <div className="space-y-8 p-8">
              {/* Introduction */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">1. Agreement to Terms</h2>
                <p className="leading-relaxed text-gray-700">
                  By accessing and using AI Cover Letter Generator (&ldquo;Service&rdquo;), you
                  accept and agree to be bound by the terms and provision of this agreement. If you
                  do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              {/* Service Description */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">2. Service Description</h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  AI Cover Letter Generator provides an AI-powered platform for creating
                  professional cover letters. Our service includes:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>AI-generated cover letter content based on user input</li>
                  <li>Professional templates and formatting options</li>
                  <li>User account management and document storage</li>
                  <li>Export functionality in various formats</li>
                </ul>
              </section>

              {/* User Accounts */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">3. User Accounts</h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  To access certain features of our service, you must create an account. You agree
                  to:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </section>

              {/* Acceptable Use */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">4. Acceptable Use Policy</h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  You agree not to use the service to:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>Generate false, misleading, or fraudulent content</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Distribute malware or harmful content</li>
                  <li>Use the service for commercial purposes without authorization</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  5. Intellectual Property Rights
                </h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  The service and its original content, features, and functionality are owned by AI
                  Cover Letter Generator and are protected by international copyright, trademark,
                  patent, trade secret, and other intellectual property laws.
                </p>
                <p className="leading-relaxed text-gray-700">
                  You retain ownership of the content you create using our service, including
                  generated cover letters. However, you grant us a license to use, store, and
                  process this content to provide our services.
                </p>
              </section>

              {/* Payment Terms */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  6. Payment and Subscription Terms
                </h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  Our service offers both free and paid subscription plans:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>Free plans have usage limitations as specified on our pricing page</li>
                  <li>Paid subscriptions are billed in advance on a monthly or annual basis</li>
                  <li>All fees are non-refundable except as required by law</li>
                  <li>You may cancel your subscription at any time</li>
                  <li>Price changes will be communicated with 30 days notice</li>
                </ul>
              </section>

              {/* Privacy and Data */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  7. Privacy and Data Protection
                </h2>
                <p className="leading-relaxed text-gray-700">
                  Your privacy is important to us. Please review our{' '}
                  <Link
                    href="/privacy"
                    className="text-primary-600 underline hover:text-primary-700"
                  >
                    Privacy Policy
                  </Link>{' '}
                  to understand how we collect, use, and protect your information.
                </p>
              </section>

              {/* Disclaimers */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">8. Disclaimers</h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  The service is provided &ldquo;as is&rdquo; without warranties of any kind. We
                  disclaim all warranties, express or implied, including:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>Merchantability and fitness for a particular purpose</li>
                  <li>Non-infringement of third-party rights</li>
                  <li>Accuracy or completeness of generated content</li>
                  <li>Uninterrupted or error-free service</li>
                </ul>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  9. Limitation of Liability
                </h2>
                <p className="leading-relaxed text-gray-700">
                  To the maximum extent permitted by law, AI Cover Letter Generator shall not be
                  liable for any indirect, incidental, special, consequential, or punitive damages,
                  including without limitation, loss of profits, data, use, goodwill, or other
                  intangible losses.
                </p>
              </section>

              {/* Termination */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">10. Termination</h2>
                <p className="leading-relaxed text-gray-700">
                  We may terminate or suspend your account and access to the service immediately,
                  without prior notice, for conduct that we believe violates these Terms of Service
                  or is harmful to other users, us, or third parties.
                </p>
              </section>

              {/* Changes to Terms */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">11. Changes to Terms</h2>
                <p className="leading-relaxed text-gray-700">
                  We reserve the right to modify these terms at any time. We will notify users of
                  any material changes via email or through our service. Your continued use of the
                  service after such modifications constitutes acceptance of the updated terms.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">12. Contact Information</h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="rounded-lg bg-gray-50 p-6">
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Email:</strong>{' '}
                      <a
                        href="mailto:legal@ai-coverletter-generator.com"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        legal@ai-coverletter-generator.com
                      </a>
                    </p>
                    <p>
                      <strong>Support:</strong>{' '}
                      <a
                        href="mailto:support@ai-coverletter-generator.com"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        support@ai-coverletter-generator.com
                      </a>
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </Card>

          {/* Quick Links */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-primary-600 transition-colors hover:text-primary-700"
              >
                Privacy Policy
              </Link>
              <Link
                href="/contact"
                className="text-primary-600 transition-colors hover:text-primary-700"
              >
                Contact Us
              </Link>
              <Link href="/" className="text-primary-600 transition-colors hover:text-primary-700">
                Back to Home
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
