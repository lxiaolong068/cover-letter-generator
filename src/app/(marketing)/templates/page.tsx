import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Navigation, Breadcrumb } from '@/components/ui/Navigation';
import { ContextualNav } from '@/components/seo/InternalLinks';
import { BreadcrumbStructuredData } from '@/components/seo/StructuredData';

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/templates', label: 'Templates' },
  { href: '/examples', label: 'Examples' },
  { href: '/pricing', label: 'Pricing' },
];

const breadcrumbItems = [{ href: '/', label: 'Home' }, { label: 'Cover Letter Templates' }];

const templates = [
  {
    id: 'professional',
    name: 'Professional Cover Letter Template',
    description:
      'Classic professional cover letter template suitable for most corporate positions and industries',
    preview: 'Formal, ATS-optimized format highlighting professional skills and experience',
    category: 'Business',
    difficulty: 'Beginner',
    features: ['ATS-Optimized', 'Professional Format', 'Industry Standard'],
  },
  {
    id: 'creative',
    name: 'Creative Cover Letter Template',
    description:
      'Dynamic cover letter template perfect for design, marketing, and creative industry positions',
    preview: 'Creative layout with personalized expression and visual appeal',
    category: 'Creative',
    difficulty: 'Intermediate',
    features: ['Visual Appeal', 'Creative Layout', 'Industry-Specific'],
  },
  {
    id: 'executive',
    name: 'Executive Cover Letter Template',
    description:
      'Premium executive-level cover letter template for senior management and C-suite positions',
    preview: 'Executive-focused format emphasizing leadership and strategic achievements',
    category: 'Executive',
    difficulty: 'Advanced',
    features: ['Executive Format', 'Leadership Focus', 'Strategic Emphasis'],
  },
  {
    id: 'entry-level',
    name: 'Entry-Level Cover Letter Template',
    description: 'Perfect template for recent graduates and entry-level job seekers',
    preview: 'Focuses on education, internships, and transferable skills',
    category: 'Entry-Level',
    difficulty: 'Beginner',
    features: ['Graduate-Friendly', 'Skills-Focused', 'Education Emphasis'],
  },
  {
    id: 'tech',
    name: 'Technology Cover Letter Template',
    description: 'Specialized template for software developers, engineers, and tech professionals',
    preview: 'Technical skills emphasis with project highlights and achievements',
    category: 'Technology',
    difficulty: 'Intermediate',
    features: ['Tech-Focused', 'Project Highlights', 'Skills Matrix'],
  },
  {
    id: 'healthcare',
    name: 'Healthcare Cover Letter Template',
    description: 'Medical and healthcare professional cover letter template',
    preview: 'Healthcare-specific format with patient care and clinical experience focus',
    category: 'Healthcare',
    difficulty: 'Intermediate',
    features: ['Healthcare-Specific', 'Clinical Focus', 'Patient Care'],
  },
];

import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata('templates');

export default function TemplatesPage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const breadcrumbStructuredData = [
    { name: 'Home', url: baseUrl },
    { name: 'Cover Letter Templates', url: `${baseUrl}/templates` },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbStructuredData} />

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
              AI Cover Letter Templates - Professional & ATS-Optimized
            </h1>
            <p className="text-on-surface-variant mx-auto mt-6 max-w-3xl text-lg leading-8">
              Choose from our collection of AI-powered, ATS-optimized cover letter templates
              designed by career experts. Each AI cover letter template is crafted for specific
              industries and career levels to help you land your dream job.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/dashboard/generate">Start Creating</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/examples">View Examples</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-on-surface text-3xl font-bold">Choose Your Perfect Template</h2>
            <p className="text-on-surface-variant mt-4 text-lg">
              All templates are ATS-optimized and designed to pass applicant tracking systems
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {templates.map(template => (
              <Card key={template.id} className="group transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="bg-primary-100 text-primary-700 rounded-full px-3 py-1 text-sm font-medium">
                      {template.category}
                    </span>
                    <span className="text-on-surface-variant text-sm">{template.difficulty}</span>
                  </div>
                  <CardTitle className="text-xl">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-on-surface-variant text-sm italic">
                      &ldquo;{template.preview}&rdquo;
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-on-surface mb-2 font-medium">Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.features.map(feature => (
                        <span
                          key={feature}
                          className="bg-surface-container text-on-surface-variant rounded-md px-2 py-1 text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" asChild>
                      <Link href={`/dashboard/generate?template=${template.id}`}>Use Template</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/examples?template=${template.id}`}>Preview</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to Create Your Perfect Cover Letter?
            </h2>
            <p className="text-primary-100 mt-4 text-xl">
              Get started with our AI Cover Letter Generator and land your dream job today.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/dashboard/generate">Generate Cover Letter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contextual Navigation */}
      <ContextualNav currentPage="templates" />
    </>
  );
}
