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

const breadcrumbItems = [
  { href: '/', label: 'Home' },
  { label: 'Cover Letter Examples' },
];

const examples = [
  {
    id: 'software-engineer',
    title: 'Software Engineer Cover Letter Example',
    industry: 'Technology',
    level: 'Mid-Level',
    description: 'Professional cover letter example for a software engineer position at a tech startup',
    preview: 'Dear Hiring Manager, I am excited to apply for the Software Engineer position at TechCorp. With 3+ years of experience in full-stack development...',
    skills: ['React', 'Node.js', 'Python', 'AWS'],
    company: 'TechCorp',
  },
  {
    id: 'marketing-manager',
    title: 'Marketing Manager Cover Letter Example',
    industry: 'Marketing',
    level: 'Senior',
    description: 'Executive-level cover letter example for a marketing manager role in digital marketing',
    preview: 'Dear Ms. Johnson, I am writing to express my strong interest in the Marketing Manager position at Digital Solutions Inc...',
    skills: ['Digital Marketing', 'SEO/SEM', 'Analytics', 'Team Leadership'],
    company: 'Digital Solutions Inc',
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst Cover Letter Example',
    industry: 'Analytics',
    level: 'Entry-Level',
    description: 'Entry-level cover letter example for recent graduate applying for data analyst position',
    preview: 'Dear Hiring Team, As a recent graduate with a Master\'s in Data Science, I am thrilled to apply for the Data Analyst position...',
    skills: ['Python', 'SQL', 'Tableau', 'Statistics'],
    company: 'Analytics Pro',
  },
  {
    id: 'project-manager',
    title: 'Project Manager Cover Letter Example',
    industry: 'Management',
    level: 'Senior',
    description: 'Senior-level cover letter example for project manager role in construction industry',
    preview: 'Dear Mr. Smith, With over 8 years of project management experience in the construction industry, I am excited to apply...',
    skills: ['PMP Certified', 'Agile', 'Risk Management', 'Stakeholder Management'],
    company: 'BuildCorp',
  },
  {
    id: 'ux-designer',
    title: 'UX Designer Cover Letter Example',
    industry: 'Design',
    level: 'Mid-Level',
    description: 'Creative cover letter example for UX designer position at design agency',
    preview: 'Dear Creative Team, I am passionate about creating user-centered designs that solve real problems. I am excited to apply...',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    company: 'Design Studio',
  },
  {
    id: 'sales-representative',
    title: 'Sales Representative Cover Letter Example',
    industry: 'Sales',
    level: 'Entry-Level',
    description: 'Entry-level cover letter example for sales representative position in B2B sales',
    preview: 'Dear Sales Manager, I am excited to begin my career in sales and believe the Sales Representative position at SalesCorp...',
    skills: ['Communication', 'CRM Software', 'Lead Generation', 'Negotiation'],
    company: 'SalesCorp',
  },
];

import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata('examples');

export default function ExamplesPage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  const breadcrumbStructuredData = [
    { name: 'Home', url: baseUrl },
    { name: 'Cover Letter Examples', url: `${baseUrl}/examples` },
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
      <div className="border-outline-variant border-b bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="from-primary-50 to-secondary-50 bg-gradient-to-br py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-on-surface text-4xl font-bold tracking-tight sm:text-5xl">
              Professional Cover Letter Examples
            </h1>
            <p className="text-on-surface-variant mx-auto mt-6 max-w-3xl text-lg leading-8">
              Get inspired by real cover letter examples from successful job applications. 
              Browse samples across different industries, career levels, and job roles to craft your perfect cover letter.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/dashboard/generate">Create Your Own</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/templates">Browse Templates</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-on-surface text-3xl font-bold">Real Cover Letter Examples</h2>
            <p className="text-on-surface-variant mt-4 text-lg">
              Learn from successful cover letters across various industries and experience levels
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {examples.map((example) => (
              <Card key={example.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="bg-secondary-100 text-secondary-700 rounded-full px-3 py-1 text-sm font-medium">
                      {example.industry}
                    </span>
                    <span className="text-on-surface-variant text-sm">{example.level}</span>
                  </div>
                  <CardTitle className="text-xl">{example.title}</CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-on-surface-variant text-sm italic line-clamp-3">
                      &ldquo;{example.preview}&rdquo;
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-on-surface text-sm">
                      <span className="font-medium">Target Company:</span> {example.company}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-on-surface mb-2 font-medium">Key Skills Highlighted:</h4>
                    <div className="flex flex-wrap gap-2">
                      {example.skills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-surface-container text-on-surface-variant rounded-md px-2 py-1 text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" asChild>
                      <Link href={`/examples/${example.id}`}>
                        View Full Example
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/dashboard/generate?example=${example.id}`}>
                        Use as Template
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="bg-surface-container py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-on-surface text-3xl font-bold">Cover Letter Writing Tips</h2>
            <p className="text-on-surface-variant mt-4 text-lg">
              Learn what makes these examples effective
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary-100 text-primary-600 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <span className="text-xl">🎯</span>
              </div>
              <h3 className="text-on-surface mb-2 text-lg font-semibold">Targeted Content</h3>
              <p className="text-on-surface-variant text-sm">
                Each example is tailored to specific job requirements and company culture
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-secondary-100 text-secondary-600 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <span className="text-xl">📊</span>
              </div>
              <h3 className="text-on-surface mb-2 text-lg font-semibold">Quantified Achievements</h3>
              <p className="text-on-surface-variant text-sm">
                Examples include specific metrics and measurable accomplishments
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-success-100 text-success-600 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <span className="text-xl">✅</span>
              </div>
              <h3 className="text-on-surface mb-2 text-lg font-semibold">ATS Optimized</h3>
              <p className="text-on-surface-variant text-sm">
                All examples are formatted to pass applicant tracking systems
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to Create Your Own Cover Letter?
            </h2>
            <p className="mt-4 text-xl text-primary-100">
              Use our AI Cover Letter Generator to create a personalized cover letter in minutes.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/dashboard/generate">Start Generating</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contextual Navigation */}
      <ContextualNav currentPage="examples" />
    </>
  );
}
