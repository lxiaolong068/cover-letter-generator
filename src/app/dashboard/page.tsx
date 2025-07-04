import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Navigation, Breadcrumb } from '@/components/ui/Navigation';
import { ContextualNav } from '@/components/seo/InternalLinks';

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/generate', label: 'Generate Cover Letter' },
  { href: '/dashboard/templates', label: 'My Templates' },
  { href: '/dashboard/history', label: 'History' },
];

const breadcrumbItems = [{ href: '/', label: 'Home' }, { label: 'Dashboard' }];

const quickActions = [
  {
    title: 'Generate AI Cover Letter',
    description: 'Create professional, ATS-optimized cover letters instantly with our AI Cover Letter Generator',
    href: '/dashboard/generate',
    icon: '✨',
    color: 'bg-primary-500',
  },
  {
    title: 'Browse Cover Letter Templates',
    description: 'Select from professional cover letter templates designed for different industries and roles',
    href: '/dashboard/templates',
    icon: '📄',
    color: 'bg-secondary-500',
  },
  {
    title: 'View Cover Letter History',
    description: 'Manage and edit your AI-generated cover letters, download PDFs, and track applications',
    href: '/dashboard/history',
    icon: '📚',
    color: 'bg-success-500',
  },
  {
    title: 'Profile & Preferences',
    description: 'Update personal information, job preferences, and AI Cover Letter Generator settings',
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
  return (
    <>
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

      <div className="bg-surface-variant min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} className="mb-8" />

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-on-surface text-3xl font-bold">AI Cover Letter Dashboard</h1>
            <p className="text-on-surface-variant mt-2">
              Welcome back! Manage your AI-generated cover letters, view statistics, and create new professional cover letters.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-on-surface-variant text-sm font-medium">{stat.label}</p>
                      <p className="text-on-surface text-2xl font-bold">{stat.value}</p>
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
                        className="group border-outline-variant hover:border-primary-300 relative overflow-hidden rounded-lg border p-6 transition-all hover:shadow-md"
                      >
                        <div className="flex items-start space-x-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-lg ${action.color} text-white`}
                          >
                            <span className="text-xl">{action.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-on-surface group-hover:text-primary-600 font-semibold">
                              {action.title}
                            </h3>
                            <p className="text-on-surface-variant mt-1 text-sm">
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
                  <CardTitle>最近的求职信</CardTitle>
                  <CardDescription>您最近创建的求职信</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCoverLetters.map(letter => (
                      <div
                        key={letter.id}
                        className="border-outline-variant flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex-1">
                          <h4 className="text-on-surface font-medium">{letter.title}</h4>
                          <p className="text-on-surface-variant text-sm">{letter.createdAt}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              letter.status === '已完成'
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
                      <Link href="/dashboard/history">查看全部</Link>
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
