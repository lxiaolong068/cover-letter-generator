import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata('privacy');

export default function PrivacyPolicyPage() {
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
            <h1 className="mb-4 text-4xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Your privacy is important to us. This policy explains how we collect, use, and protect
              your personal information.
            </p>
            <p className="mt-4 text-sm text-gray-500">Last updated: {lastUpdated}</p>
          </div>

          {/* Privacy Policy Content */}
          <Card className="prose prose-lg max-w-none">
            <div className="space-y-8 p-8">
              {/* Introduction */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">1. Introduction</h2>
                <p className="leading-relaxed text-gray-700">
                  AI Cover Letter Generator (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
                  &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy
                  explains how we collect, use, disclose, and safeguard your information when you
                  use our AI-powered cover letter generation service.
                </p>
                <p className="mt-4 leading-relaxed text-gray-700">
                  By using our service, you agree to the collection and use of information in
                  accordance with this policy. If you do not agree with our policies and practices,
                  do not use our service.
                </p>
              </section>

              {/* Information We Collect */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">2. Information We Collect</h2>

                <h3 className="mb-3 text-xl font-semibold text-gray-800">
                  2.1 Personal Information
                </h3>
                <p className="mb-4 leading-relaxed text-gray-700">
                  We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>Name and email address when you create an account</li>
                  <li>
                    Profile information including work experience, skills, and career objectives
                  </li>
                  <li>
                    Job descriptions and application details you input for cover letter generation
                  </li>
                  <li>Generated cover letters and related content</li>
                  <li>Communication preferences and feedback</li>
                </ul>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-800">
                  2.2 Automatically Collected Information
                </h3>
                <p className="mb-4 leading-relaxed text-gray-700">
                  When you use our service, we automatically collect:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>Device information (browser type, operating system, device identifiers)</li>
                  <li>Usage data (pages visited, features used, time spent on service)</li>
                  <li>IP address and general location information</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              {/* How We Use Information */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  3. How We Use Your Information
                </h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  We use the information we collect to:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>Provide, maintain, and improve our AI cover letter generation service</li>
                  <li>
                    Generate personalized cover letters based on your profile and job requirements
                  </li>
                  <li>Create and manage your user account</li>
                  <li>Process payments and manage subscriptions</li>
                  <li>Send you service-related communications and updates</li>
                  <li>Provide customer support and respond to your inquiries</li>
                  <li>Analyze usage patterns to improve our service</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              {/* AI and Data Processing */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  4. AI Processing and Data Security
                </h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  Our AI cover letter generation service processes your personal and professional
                  information to create customized cover letters. Here&rsquo;s how we handle this
                  process:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>Your data is processed using secure, encrypted connections</li>
                  <li>
                    AI processing is performed on secure servers with industry-standard security
                    measures
                  </li>
                  <li>We do not use your personal information to train our AI models</li>
                  <li>
                    Generated content is stored securely and associated only with your account
                  </li>
                  <li>
                    We implement data minimization principles, processing only necessary information
                  </li>
                </ul>
              </section>

              {/* Information Sharing */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  5. Information Sharing and Disclosure
                </h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  We do not sell, trade, or rent your personal information to third parties. We may
                  share your information only in the following circumstances:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>
                    <strong>Service Providers:</strong> With trusted third-party service providers
                    who assist in operating our service
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law or to protect our
                    rights and safety
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with a merger, acquisition,
                    or sale of assets
                  </li>
                  <li>
                    <strong>Consent:</strong> With your explicit consent for specific purposes
                  </li>
                </ul>
              </section>

              {/* Data Retention */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">6. Data Retention</h2>
                <p className="leading-relaxed text-gray-700">
                  We retain your personal information for as long as necessary to provide our
                  services and fulfill the purposes outlined in this policy. Specifically:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
                  <li>Account information is retained while your account is active</li>
                  <li>Generated cover letters are stored for your convenience and future access</li>
                  <li>
                    Usage data may be retained for analytical purposes in aggregated, anonymized
                    form
                  </li>
                  <li>
                    We will delete your data upon account deletion or as required by applicable law
                  </li>
                </ul>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">7. Your Privacy Rights</h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  Depending on your location, you may have the following rights regarding your
                  personal information:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>
                    <strong>Access:</strong> Request access to your personal information
                  </li>
                  <li>
                    <strong>Correction:</strong> Request correction of inaccurate or incomplete
                    information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal information
                  </li>
                  <li>
                    <strong>Portability:</strong> Request a copy of your data in a portable format
                  </li>
                  <li>
                    <strong>Restriction:</strong> Request restriction of processing in certain
                    circumstances
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to processing based on legitimate interests
                  </li>
                  <li>
                    <strong>Withdraw Consent:</strong> Withdraw consent where processing is based on
                    consent
                  </li>
                </ul>
                <p className="mt-4 leading-relaxed text-gray-700">
                  To exercise these rights, please contact us at{' '}
                  <a
                    href="mailto:privacy@ai-coverletter-generator.com"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    privacy@ai-coverletter-generator.com
                  </a>
                </p>
              </section>

              {/* Cookies and Tracking */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  8. Cookies and Tracking Technologies
                </h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  We use cookies and similar tracking technologies to enhance your experience:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>
                    <strong>Essential Cookies:</strong> Required for basic functionality and
                    security
                  </li>
                  <li>
                    <strong>Functional Cookies:</strong> Remember your preferences and settings
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Help us understand how you use our service
                  </li>
                  <li>
                    <strong>Performance Cookies:</strong> Monitor and improve service performance
                  </li>
                </ul>
                <p className="mt-4 leading-relaxed text-gray-700">
                  You can control cookies through your browser settings, though this may affect
                  service functionality.
                </p>
              </section>

              {/* Security */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">9. Security Measures</h2>
                <p className="leading-relaxed text-gray-700">
                  We implement comprehensive security measures to protect your information:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Secure data centers and infrastructure</li>
                  <li>Employee training on data protection practices</li>
                  <li>Incident response procedures</li>
                </ul>
              </section>

              {/* International Transfers */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  10. International Data Transfers
                </h2>
                <p className="leading-relaxed text-gray-700">
                  Your information may be transferred to and processed in countries other than your
                  own. We ensure appropriate safeguards are in place for international transfers,
                  including:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
                  <li>Adequacy decisions by relevant data protection authorities</li>
                  <li>Standard contractual clauses approved by regulatory authorities</li>
                  <li>Certification schemes and codes of conduct</li>
                  <li>Other legally recognized transfer mechanisms</li>
                </ul>
              </section>

              {/* Children's Privacy */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  11. Children&rsquo;s Privacy
                </h2>
                <p className="leading-relaxed text-gray-700">
                  Our service is not intended for children under 16 years of age. We do not
                  knowingly collect personal information from children under 16. If we become aware
                  that we have collected personal information from a child under 16, we will take
                  steps to delete such information promptly.
                </p>
              </section>

              {/* Third-Party Links */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  12. Third-Party Links and Services
                </h2>
                <p className="leading-relaxed text-gray-700">
                  Our service may contain links to third-party websites or services. We are not
                  responsible for the privacy practices of these third parties. We encourage you to
                  review the privacy policies of any third-party services you access through our
                  platform.
                </p>
              </section>

              {/* Changes to Privacy Policy */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  13. Changes to This Privacy Policy
                </h2>
                <p className="leading-relaxed text-gray-700">
                  We may update this Privacy Policy from time to time. We will notify you of any
                  material changes by posting the new Privacy Policy on this page and updating the
                  &ldquo;Last updated&rdquo; date. We encourage you to review this Privacy Policy
                  periodically for any changes.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">14. Contact Us</h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  If you have any questions about this Privacy Policy or our privacy practices,
                  please contact us:
                </p>
                <div className="rounded-lg bg-gray-50 p-6">
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Email:</strong>{' '}
                      <a
                        href="mailto:privacy@ai-coverletter-generator.com"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        privacy@ai-coverletter-generator.com
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
                    <p>
                      <strong>Address:</strong> AI Cover Letter Generator, Data Protection Officer
                    </p>
                  </div>
                </div>
              </section>

              {/* GDPR Specific Rights */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  15. GDPR Rights (EU Residents)
                </h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  If you are a resident of the European Union, you have additional rights under the
                  General Data Protection Regulation (GDPR):
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>Right to be informed about data processing</li>
                  <li>Right of access to your personal data</li>
                  <li>Right to rectification of inaccurate data</li>
                  <li>Right to erasure (&ldquo;right to be forgotten&rdquo;)</li>
                  <li>Right to restrict processing</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                  <li>Rights related to automated decision making and profiling</li>
                </ul>
                <p className="mt-4 leading-relaxed text-gray-700">
                  You also have the right to lodge a complaint with your local data protection
                  authority if you believe we have not complied with applicable data protection
                  laws.
                </p>
              </section>

              {/* Legal Basis for Processing */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  16. Legal Basis for Processing (GDPR)
                </h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  We process your personal data based on the following legal grounds:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>
                    <strong>Contract:</strong> Processing necessary for the performance of our
                    service contract
                  </li>
                  <li>
                    <strong>Consent:</strong> Where you have given specific consent for processing
                  </li>
                  <li>
                    <strong>Legitimate Interest:</strong> For service improvement, security, and
                    business operations
                  </li>
                  <li>
                    <strong>Legal Obligation:</strong> Where processing is required by law
                  </li>
                </ul>
              </section>
            </div>
          </Card>

          {/* Quick Links */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                href="/terms"
                className="text-primary-600 transition-colors hover:text-primary-700"
              >
                Terms of Service
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
