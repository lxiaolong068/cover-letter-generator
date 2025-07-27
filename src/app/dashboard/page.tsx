import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Navigation, Breadcrumb } from '@/components/ui/Navigation';
import { ContextualNav } from '@/components/seo/InternalLinks';
import { BreadcrumbStructuredData } from '@/components/seo/StructuredData';
import { dashboardNavigation, createBreadcrumbs } from '@/lib/navigation';

const navigationItems = dashboardNavigation;
const breadcrumbItems = createBreadcrumbs('/dashboard');

const quickActions = [
  {
    title: 'Generate AI Cover Letter',
    description:
      'Create professional, ATS-optimized cover letters instantly with our AI Cover Letter Generator',
    href: '/dashboard/generate',
    icon: '✨',
    color: 'bg-primary-500',
  },
  {
    title: 'Browse Cover Letter Templates',
    description:
      'Select from professional cover letter templates designed for different industries and roles',
    href: '/dashboard/templates',
    icon: '📄',
    color: 'bg-secondary-500',
  },
  {
    title: 'View Cover Letter History',
    description:
      'Manage and edit your AI-generated cover letters, download PDFs, and track applications',
    href: '/dashboard/history',
    icon: '📚',
    color: 'bg-success-500',
  },
  {
    title: 'Profile & Preferences',
    description:
      'Update personal information, job preferences, and AI Cover Letter Generator settings',
    href: '/dashboard/settings',
    icon: '⚙️',
    color: 'bg-warning-500',
  },
];

const recentCoverLetters = [
  {
    id: 1,
    title: 'Frontend Developer - Google',
    createdAt: '2024-01-15',
    status: 'Completed',
  },
  {
    id: 2,
    title: 'Product Manager - Microsoft',
    createdAt: '2024-01-14',
    status: 'Draft',
  },
  {
    id: 3,
    title: 'UI Designer - Apple',
    createdAt: '2024-01-13',
    status: 'Completed',
  },
];

const stats = [
  {
    label: 'Total Cover Letters',
    value: '12',
    change: '+2',
    changeType: 'increase' as const,
  },
  {
    label: 'Generated This Month',
    value: '5',
    change: '+1',
    changeType: 'increase' as const,
  },
  {
    label: 'Successfully Submitted',
    value: '8',
    change: '+3',
    changeType: 'increase' as const,
  },
  {
    label: 'Interview Invitations',
    value: '3',
    change: '+1',
    changeType: 'increase' as const,
  },
];

export default function DashboardPage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const breadcrumbStructuredData = [
    { name: 'Home', url: baseUrl },
    { name: 'Dashboard', url: `${baseUrl}/dashboard` },
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

      <div className="min-h-screen bg-surface-variant">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} className="mb-8" />

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-on-surface">AI Cover Letter Dashboard</h1>
            <p className="mt-2 text-on-surface-variant">
              Welcome back! Manage your AI-generated cover letters, view statistics, and create new
              professional cover letters.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-on-surface-variant">{stat.label}</p>
                      <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
                    </div>
                    <div className="flex items-center text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          stat.changeType === 'increase'
                            ? 'bg-success-100 text-success-800'
                            : 'bg-error-100 text-error-800'
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Choose an action below to quickly start your cover letter creation process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {quickActions.map((action, index) => (
                      <Link
                        key={index}
                        href={action.href}
                        className="group relative overflow-hidden rounded-lg border border-outline-variant p-6 transition-all hover:border-primary-300 hover:shadow-md"
                      >
                        <div className="flex items-start space-x-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-lg ${action.color} text-white`}
                          >
                            <span className="text-xl">{action.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-on-surface group-hover:text-primary-600">
                              {action.title}
                            </h3>
                            <p className="mt-1 text-sm text-on-surface-variant">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Cover Letters */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Cover Letters</CardTitle>
                  <CardDescription>Your recently created cover letters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCoverLetters.map(letter => (
                      <div
                        key={letter.id}
                        className="flex items-center justify-between rounded-lg border border-outline-variant p-4"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-on-surface">{letter.title}</h4>
                          <p className="text-sm text-on-surface-variant">{letter.createdAt}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              letter.status === 'Completed'
                                ? 'bg-success-100 text-success-800'
                                : 'bg-warning-100 text-warning-800'
                            }`}
                          >
                            {letter.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button variant="outline" fullWidth asChild>
                      <Link href="/dashboard/history">View All</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contextual Navigation */}
          <ContextualNav currentPage="dashboard" />
        </div>
      </div>
    </>
  );
}
