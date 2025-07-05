import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Navigation, Breadcrumb } from '@/components/ui/Navigation';
import { ContextualNav } from '@/components/seo/InternalLinks';
import { BreadcrumbStructuredData } from '@/components/seo/StructuredData';

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/generate', label: 'Generate Cover Letter' },
  { href: '/dashboard/templates', label: 'My Templates' },
  { href: '/dashboard/history', label: 'History' },
];

const breadcrumbItems = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { label: 'My Templates' },
];

const userTemplates = [
  {
    id: 'custom-1',
    name: 'My Professional Template',
    description: 'Customized professional template for corporate applications',
    lastUsed: '2024-01-15',
    timesUsed: 8,
    category: 'Professional',
    isCustom: true,
  },
  {
    id: 'custom-2',
    name: 'Tech Startup Template',
    description: 'Tailored template for startup and tech company applications',
    lastUsed: '2024-01-12',
    timesUsed: 5,
    category: 'Technology',
    isCustom: true,
  },
];

const availableTemplates = [
  {
    id: 'professional',
    name: 'Professional Cover Letter Template',
    description: 'Classic professional cover letter template suitable for most corporate positions',
    category: 'Business',
    difficulty: 'Beginner',
    features: ['ATS-Optimized', 'Professional Format', 'Industry Standard'],
    isCustom: false,
  },
  {
    id: 'creative',
    name: 'Creative Cover Letter Template',
    description: 'Dynamic cover letter template perfect for design and creative positions',
    category: 'Creative',
    difficulty: 'Intermediate',
    features: ['Visual Appeal', 'Creative Layout', 'Industry-Specific'],
    isCustom: false,
  },
  {
    id: 'executive',
    name: 'Executive Cover Letter Template',
    description: 'Premium executive-level cover letter template for senior management positions',
    category: 'Executive',
    difficulty: 'Advanced',
    features: ['Executive Format', 'Leadership Focus', 'Strategic Emphasis'],
    isCustom: false,
  },
  {
    id: 'tech',
    name: 'Technology Cover Letter Template',
    description: 'Specialized template for software developers and tech professionals',
    category: 'Technology',
    difficulty: 'Intermediate',
    features: ['Tech-Focused', 'Project Highlights', 'Skills Matrix'],
    isCustom: false,
  },
];

export const metadata: Metadata = {
  title: 'My Templates - Dashboard | AI Cover Letter Generator',
  description: 'Manage your custom cover letter templates and browse available templates. Create, edit, and organize your personalized cover letter templates.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardTemplatesPage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  const breadcrumbStructuredData = [
    { name: 'Home', url: baseUrl },
    { name: 'Dashboard', url: `${baseUrl}/dashboard` },
    { name: 'My Templates', url: `${baseUrl}/dashboard/templates` },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbStructuredData} />
      
      {/* Navigation */}
      <Navigation
        items={navigationItems}
        actions={
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Help
            </Button>
            <Button variant="outline" size="sm">
              Logout
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

      {/* Page Header */}
      <div className="bg-surface py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-on-surface text-3xl font-bold">My Templates</h1>
              <p className="text-on-surface-variant mt-2">
                Manage your custom templates and browse available options
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/templates/create">Create New Template</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* My Custom Templates */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-on-surface text-2xl font-bold">My Custom Templates</h2>
            <p className="text-on-surface-variant mt-1">
              Templates you&apos;ve created and customized
            </p>
          </div>

          {userTemplates.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userTemplates.map((template) => (
                <Card key={template.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="bg-primary-100 text-primary-700 rounded-full px-3 py-1 text-sm font-medium">
                        {template.category}
                      </span>
                      <span className="bg-success-100 text-success-700 rounded-full px-2 py-1 text-xs font-medium">
                        Custom
                      </span>
                    </div>
                    <CardTitle className="text-xl">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">Last used:</span>
                        <span className="text-on-surface">{template.lastUsed}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">Times used:</span>
                        <span className="text-on-surface">{template.timesUsed}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" asChild>
                        <Link href={`/dashboard/generate?template=${template.id}`}>
                          Use Template
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/dashboard/templates/${template.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-on-surface-variant mb-4 text-6xl">📄</div>
                <h3 className="text-on-surface mb-2 text-lg font-semibold">No Custom Templates Yet</h3>
                <p className="text-on-surface-variant mb-6">
                  Create your first custom template to get started
                </p>
                <Button asChild>
                  <Link href="/dashboard/templates/create">Create Template</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Available Templates */}
      <section className="bg-surface-container py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-on-surface text-2xl font-bold">Available Templates</h2>
            <p className="text-on-surface-variant mt-1">
              Professional templates ready to use
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableTemplates.map((template) => (
              <Card key={template.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="bg-secondary-100 text-secondary-700 rounded-full px-3 py-1 text-sm font-medium">
                      {template.category}
                    </span>
                    <span className="text-on-surface-variant text-sm">{template.difficulty}</span>
                  </div>
                  <CardTitle className="text-xl">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h4 className="text-on-surface mb-2 font-medium">Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.features.map((feature) => (
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
                      <Link href={`/dashboard/generate?template=${template.id}`}>
                        Use Template
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/templates?preview=${template.id}`}>
                        Preview
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Template Tips */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-50 rounded-lg p-6">
            <h3 className="text-primary-900 mb-4 text-lg font-semibold">Template Tips</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <h4 className="text-primary-800 mb-2 font-medium">Customize for Your Industry</h4>
                <p className="text-primary-700 text-sm">
                  Tailor templates to match your target industry&apos;s expectations and terminology
                </p>
              </div>
              <div>
                <h4 className="text-primary-800 mb-2 font-medium">Keep It ATS-Friendly</h4>
                <p className="text-primary-700 text-sm">
                  Ensure your custom templates maintain ATS compatibility for better results
                </p>
              </div>
              <div>
                <h4 className="text-primary-800 mb-2 font-medium">Test and Iterate</h4>
                <p className="text-primary-700 text-sm">
                  Use analytics to see which templates perform best and refine accordingly
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contextual Navigation */}
      <ContextualNav currentPage="templates" />
    </>
  );
}
