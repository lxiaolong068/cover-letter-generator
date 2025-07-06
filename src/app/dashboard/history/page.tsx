import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Navigation, Breadcrumb } from '@/components/ui/Navigation';
import { ContextualNav } from '@/components/seo/InternalLinks';
import { BreadcrumbStructuredData } from '@/components/seo/StructuredData';
import { dashboardNavigation, createBreadcrumbs } from '@/lib/navigation';
import { HistoryContent } from './HistoryContent';
import type { Metadata } from 'next';

const navigationItems = dashboardNavigation;
const breadcrumbItems = createBreadcrumbs('/dashboard/history');

export const metadata: Metadata = {
  title: 'Cover Letter History - Dashboard | AI Cover Letter Generator',
  description:
    'View and manage your cover letter history. Track applications, download previous cover letters, and monitor your job search progress.',
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
      <div className="border-b border-outline-variant bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-surface py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-on-surface">Cover Letter History</h1>
              <p className="mt-2 text-on-surface-variant">
                Track your applications and manage your cover letters
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/generate">Create New Cover Letter</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* History Content */}
      <HistoryContent />

      {/* Contextual Navigation */}
      <ContextualNav currentPage="history" />
    </>
  );
}
