import Link from 'next/link';
import { lazy, Suspense } from 'react';

interface NavigationItem {
  href: string;
  label: string;
  description?: string;
}

interface ContextualNavProps {
  currentPage: string;
}

interface FooterLinksProps {
  className?: string;
}

const navigationSections = {
  main: [
    {
      href: '/',
      label: 'AI Cover Letter Generator',
      description: 'Professional AI Cover Letter Generator homepage',
    },
    {
      href: '/dashboard',
      label: 'Cover Letter Dashboard',
      description: 'Your AI cover letter dashboard and management center',
    },
    {
      href: '/dashboard/generate',
      label: 'Generate AI Cover Letter',
      description: 'Create professional cover letters with AI technology',
    },
    {
      href: '/dashboard/templates',
      label: 'AI Cover Letter Templates',
      description: 'Browse professional AI cover letter templates',
    },
    {
      href: '/dashboard/history',
      label: 'Cover Letter History',
      description: 'View and manage your AI-generated cover letters',
    },
  ],
  resources: [
    {
      href: '/examples',
      label: 'AI Cover Letter Examples',
      description: 'Professional cover letter examples and samples',
    },
    {
      href: '/templates',
      label: 'Professional Cover Letter Templates',
      description: 'ATS-optimized AI cover letter templates',
    },
    {
      href: '/pricing',
      label: 'AI Cover Letter Generator Pricing',
      description: 'Affordable plans for professional cover letter generation',
    },
    {
      href: '/help',
      label: 'Cover Letter Help & Support',
      description: 'Expert guidance for AI cover letter creation',
    },
  ],
  legal: [
    {
      href: '/privacy',
      label: 'Privacy Policy',
      description: 'AI Cover Letter Generator privacy and data protection',
    },
    {
      href: '/terms',
      label: 'Terms of Service',
      description: 'AI Cover Letter Generator terms and conditions',
    },
    {
      href: '/contact',
      label: 'Contact Support',
      description: 'Get help with your AI cover letter generation',
    },
  ],
};

export function ContextualNav({ currentPage }: ContextualNavProps) {
  const getRelevantLinks = (page: string): NavigationItem[] => {
    switch (page) {
      case 'home':
        return [
          navigationSections.main[2], // Generate AI Cover Letter
          navigationSections.resources[1], // Professional Cover Letter Templates
          navigationSections.resources[0], // AI Cover Letter Examples
          navigationSections.resources[2], // AI Cover Letter Generator Pricing
        ];
      case 'dashboard':
        return [
          navigationSections.main[2], // Generate AI Cover Letter
          navigationSections.main[3], // AI Cover Letter Templates
          navigationSections.main[4], // Cover Letter History
          navigationSections.resources[3], // Cover Letter Help & Support
        ];
      case 'generate':
        return [
          navigationSections.main[3], // AI Cover Letter Templates
          navigationSections.resources[0], // AI Cover Letter Examples
          navigationSections.main[1], // Cover Letter Dashboard
          navigationSections.resources[3], // Cover Letter Help & Support
        ];
      case 'templates':
        return [
          navigationSections.main[2], // Generate AI Cover Letter
          navigationSections.resources[0], // AI Cover Letter Examples
          navigationSections.main[1], // Cover Letter Dashboard
          navigationSections.resources[2], // AI Cover Letter Generator Pricing
        ];
      case 'examples':
        return [
          navigationSections.main[2], // Generate AI Cover Letter
          navigationSections.resources[1], // Professional Cover Letter Templates
          navigationSections.main[1], // Cover Letter Dashboard
          navigationSections.resources[2], // AI Cover Letter Generator Pricing
        ];
      case 'pricing':
        return [
          navigationSections.main[2], // Generate AI Cover Letter
          navigationSections.resources[1], // Professional Cover Letter Templates
          navigationSections.resources[0], // AI Cover Letter Examples
          navigationSections.main[1], // Cover Letter Dashboard
        ];
      case 'history':
        return [
          navigationSections.main[2], // Generate AI Cover Letter
          navigationSections.main[3], // AI Cover Letter Templates
          navigationSections.resources[0], // AI Cover Letter Examples
          navigationSections.main[1], // Cover Letter Dashboard
        ];
      default:
        return [
          navigationSections.main[2], // Generate AI Cover Letter
          navigationSections.resources[1], // Professional Cover Letter Templates
          navigationSections.resources[0], // AI Cover Letter Examples
          navigationSections.main[1], // Cover Letter Dashboard
        ];
    }
  };

  const relevantLinks = getRelevantLinks(currentPage);

  return (
    <nav className="py-8" aria-label="Contextual navigation">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-xl font-semibold text-on-surface">
          Explore More AI Cover Letter Tools
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {relevantLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-lg border border-outline-variant p-4 transition-all hover:border-primary-300 hover:shadow-sm"
            >
              <h3 className="font-medium text-on-surface group-hover:text-primary-600">
                {link.label}
              </h3>
              <p className="mt-1 text-sm text-on-surface-variant">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

// Lazy-loaded version of ContextualNav for better performance
export function LazyContextualNav({ currentPage }: ContextualNavProps) {
  return (
    <Suspense
      fallback={
        <div className="py-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 h-8 w-64 animate-pulse rounded bg-surface-container"></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-lg border border-outline-variant p-4">
                  <div className="mb-2 h-5 animate-pulse rounded bg-surface-container"></div>
                  <div className="h-4 w-3/4 animate-pulse rounded bg-surface-container"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ContextualNav currentPage={currentPage} />
    </Suspense>
  );
}

export function FooterLinks({ className = '' }: FooterLinksProps) {
  return (
    <div className={`grid grid-cols-1 gap-8 md:grid-cols-3 ${className}`}>
      {/* Main Navigation */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-on-surface">
          Navigation
        </h3>
        <ul className="space-y-3">
          {navigationSections.main.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Resources */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-on-surface">
          Resources
        </h3>
        <ul className="space-y-3">
          {navigationSections.resources.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Legal */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-on-surface">
          Legal
        </h3>
        <ul className="space-y-3">
          {navigationSections.legal.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
