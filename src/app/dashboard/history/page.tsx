'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Navigation, Breadcrumb } from '@/components/ui/Navigation';
import { ContextualNav } from '@/components/seo/InternalLinks';
import { BreadcrumbStructuredData } from '@/components/seo/StructuredData';
import { dashboardNavigation, createBreadcrumbs } from '@/lib/navigation';
import { Input } from '@/components/ui/Input';

const navigationItems = dashboardNavigation;
const breadcrumbItems = createBreadcrumbs('/dashboard/history');

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
  description:
    'View and manage your cover letter history. Track applications, download previous cover letters, and monitor your job search progress.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState('all');

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const breadcrumbStructuredData = [
    { name: 'Home', url: baseUrl },
    { name: 'Dashboard', url: `${baseUrl}/dashboard` },
    { name: 'History', url: `${baseUrl}/dashboard/history` },
  ];

  // Filter cover letters based on search and filter criteria
  const filteredCoverLetters = coverLetterHistory.filter(cl => {
    const matchesSearch =
      cl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cl.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cl.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || cl.applicationStatus === selectedStatus;
    const matchesTemplate = selectedTemplate === 'all' || cl.template === selectedTemplate;

    return matchesSearch && matchesStatus && matchesTemplate;
  });

  const stats = {
    total: coverLetterHistory.length,
    applied: coverLetterHistory.filter(cl => cl.status === 'Applied').length,
    interviews: coverLetterHistory.filter(cl => cl.applicationStatus === 'Interview Scheduled')
      .length,
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

      {/* Stats Overview */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                      <span className="text-xl">📄</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-on-surface-variant">Total Created</p>
                    <p className="text-2xl font-bold text-on-surface">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-100 text-secondary-600">
                      <span className="text-xl">📤</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-on-surface-variant">Applications Sent</p>
                    <p className="text-2xl font-bold text-on-surface">{stats.applied}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning-100 text-warning-600">
                      <span className="text-xl">🗣️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-on-surface-variant">Interviews</p>
                    <p className="text-2xl font-bold text-on-surface">{stats.interviews}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success-100 text-success-600">
                      <span className="text-xl">🎉</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-on-surface-variant">Job Offers</p>
                    <p className="text-2xl font-bold text-on-surface">{stats.hired}</p>
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
            <h2 className="text-2xl font-bold text-on-surface">Recent Cover Letters</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by job title, company, or position..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="block w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface transition-colors focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="all">All Statuses</option>
                <option value="Hired">Hired</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Under Review">Under Review</option>
                <option value="Rejected">Rejected</option>
                <option value="Not Applied">Not Applied</option>
              </select>
            </div>
            <div>
              <select
                value={selectedTemplate}
                onChange={e => setSelectedTemplate(e.target.value)}
                className="block w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface transition-colors focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="all">All Templates</option>
                <option value="Professional">Professional</option>
                <option value="Executive">Executive</option>
                <option value="Creative">Creative</option>
                <option value="Technical">Technical</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-on-surface-variant">
            Showing {filteredCoverLetters.length} of {coverLetterHistory.length} cover letters
          </div>

          <div className="space-y-4">
            {filteredCoverLetters.map(coverLetter => (
              <Card key={coverLetter.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-on-surface">
                            {coverLetter.title}
                          </h3>
                          <p className="text-sm text-on-surface-variant">
                            {coverLetter.company} • {coverLetter.position}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
                            {coverLetter.template}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(coverLetter.applicationStatus)}`}
                          >
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
                          <p className="text-on-surface">
                            {coverLetter.tokensUsed.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-on-surface-variant">Generation Time:</span>
                          <p className="text-on-surface">{coverLetter.generationTime}s</p>
                        </div>
                      </div>
                    </div>

                    <div className="ml-6 flex flex-col gap-2">
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/history/${coverLetter.id}`}>View</Link>
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

          {filteredCoverLetters.length === 0 && coverLetterHistory.length > 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mb-4 text-6xl text-on-surface-variant">🔍</div>
                <h3 className="mb-2 text-lg font-semibold text-on-surface">No Results Found</h3>
                <p className="mb-6 text-on-surface-variant">
                  Try adjusting your search terms or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStatus('all');
                    setSelectedTemplate('all');
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {coverLetterHistory.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mb-4 text-6xl text-on-surface-variant">📄</div>
                <h3 className="mb-2 text-lg font-semibold text-on-surface">No Cover Letters Yet</h3>
                <p className="mb-6 text-on-surface-variant">
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
