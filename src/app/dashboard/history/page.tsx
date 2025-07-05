import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
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
  { label: 'History' },
];

const coverLetterHistory = [
  {
    id: 'cl-001',
    title: 'Software Engineer - TechCorp',
    company: 'TechCorp',
    position: 'Software Engineer',
    createdAt: '2024-01-15T10:30:00Z',
    template: 'Professional',
    status: 'Applied',
    aiModel: 'GPT-4',
    tokensUsed: 1250,
    generationTime: 3.2,
    applicationStatus: 'Interview Scheduled',
  },
  {
    id: 'cl-002',
    title: 'Marketing Manager - Digital Solutions',
    company: 'Digital Solutions Inc',
    position: 'Marketing Manager',
    createdAt: '2024-01-12T14:15:00Z',
    template: 'Executive',
    status: 'Draft',
    aiModel: 'GPT-4',
    tokensUsed: 1180,
    generationTime: 2.8,
    applicationStatus: 'Not Applied',
  },
  {
    id: 'cl-003',
    title: 'Data Analyst - Analytics Pro',
    company: 'Analytics Pro',
    position: 'Data Analyst',
    createdAt: '2024-01-10T09:45:00Z',
    template: 'Professional',
    status: 'Applied',
    aiModel: 'GPT-4',
    tokensUsed: 1320,
    generationTime: 3.5,
    applicationStatus: 'Under Review',
  },
  {
    id: 'cl-004',
    title: 'UX Designer - Design Studio',
    company: 'Design Studio',
    position: 'UX Designer',
    createdAt: '2024-01-08T16:20:00Z',
    template: 'Creative',
    status: 'Applied',
    aiModel: 'GPT-4',
    tokensUsed: 1150,
    generationTime: 2.9,
    applicationStatus: 'Rejected',
  },
  {
    id: 'cl-005',
    title: 'Project Manager - BuildCorp',
    company: 'BuildCorp',
    position: 'Project Manager',
    createdAt: '2024-01-05T11:10:00Z',
    template: 'Executive',
    status: 'Applied',
    aiModel: 'GPT-4',
    tokensUsed: 1280,
    generationTime: 3.1,
    applicationStatus: 'Hired',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Hired':
      return 'bg-success-100 text-success-700';
    case 'Interview Scheduled':
      return 'bg-primary-100 text-primary-700';
    case 'Under Review':
      return 'bg-warning-100 text-warning-700';
    case 'Rejected':
      return 'bg-error-100 text-error-700';
    case 'Not Applied':
      return 'bg-surface-container text-on-surface-variant';
    default:
      return 'bg-surface-container text-on-surface-variant';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const metadata: Metadata = {
  title: 'Cover Letter History - Dashboard | AI Cover Letter Generator',
  description: 'View and manage your cover letter history. Track applications, download previous cover letters, and monitor your job search progress.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardHistoryPage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  const breadcrumbStructuredData = [
    { name: 'Home', url: baseUrl },
    { name: 'Dashboard', url: `${baseUrl}/dashboard` },
    { name: 'History', url: `${baseUrl}/dashboard/history` },
  ];

  const stats = {
    total: coverLetterHistory.length,
    applied: coverLetterHistory.filter(cl => cl.status === 'Applied').length,
    interviews: coverLetterHistory.filter(cl => cl.applicationStatus === 'Interview Scheduled').length,
    hired: coverLetterHistory.filter(cl => cl.applicationStatus === 'Hired').length,
  };

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
              <h1 className="text-on-surface text-3xl font-bold">Cover Letter History</h1>
              <p className="text-on-surface-variant mt-2">
                Track your applications and manage your cover letters
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/generate">Create New Cover Letter</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-primary-100 text-primary-600 flex h-12 w-12 items-center justify-center rounded-lg">
                      <span className="text-xl">📄</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-on-surface-variant text-sm font-medium">Total Created</p>
                    <p className="text-on-surface text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-secondary-100 text-secondary-600 flex h-12 w-12 items-center justify-center rounded-lg">
                      <span className="text-xl">📤</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-on-surface-variant text-sm font-medium">Applications Sent</p>
                    <p className="text-on-surface text-2xl font-bold">{stats.applied}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-warning-100 text-warning-600 flex h-12 w-12 items-center justify-center rounded-lg">
                      <span className="text-xl">🗣️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-on-surface-variant text-sm font-medium">Interviews</p>
                    <p className="text-on-surface text-2xl font-bold">{stats.interviews}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-success-100 text-success-600 flex h-12 w-12 items-center justify-center rounded-lg">
                      <span className="text-xl">🎉</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-on-surface-variant text-sm font-medium">Job Offers</p>
                    <p className="text-on-surface text-2xl font-bold">{stats.hired}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cover Letter History */}
      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-on-surface text-2xl font-bold">Recent Cover Letters</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {coverLetterHistory.map((coverLetter) => (
              <Card key={coverLetter.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="text-on-surface text-lg font-semibold">
                            {coverLetter.title}
                          </h3>
                          <p className="text-on-surface-variant text-sm">
                            {coverLetter.company} • {coverLetter.position}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <span className="bg-primary-100 text-primary-700 rounded-full px-3 py-1 text-sm font-medium">
                            {coverLetter.template}
                          </span>
                          <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(coverLetter.applicationStatus)}`}>
                            {coverLetter.applicationStatus}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                        <div>
                          <span className="text-on-surface-variant">Created:</span>
                          <p className="text-on-surface">{formatDate(coverLetter.createdAt)}</p>
                        </div>
                        <div>
                          <span className="text-on-surface-variant">AI Model:</span>
                          <p className="text-on-surface">{coverLetter.aiModel}</p>
                        </div>
                        <div>
                          <span className="text-on-surface-variant">Tokens:</span>
                          <p className="text-on-surface">{coverLetter.tokensUsed.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-on-surface-variant">Generation Time:</span>
                          <p className="text-on-surface">{coverLetter.generationTime}s</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6 flex flex-col gap-2">
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/history/${coverLetter.id}`}>
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/generate?duplicate=${coverLetter.id}`}>
                          Duplicate
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {coverLetterHistory.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-on-surface-variant mb-4 text-6xl">📄</div>
                <h3 className="text-on-surface mb-2 text-lg font-semibold">No Cover Letters Yet</h3>
                <p className="text-on-surface-variant mb-6">
                  Create your first AI-generated cover letter to get started
                </p>
                <Button asChild>
                  <Link href="/dashboard/generate">Generate Cover Letter</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Contextual Navigation */}
      <ContextualNav currentPage="history" />
    </>
  );
}
