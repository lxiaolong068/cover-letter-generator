'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface InternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  rel?: string;
}

/**
 * SEO-optimized internal link component
 */
export const InternalLink = React.memo(({ 
  href, 
  children, 
  className, 
  title, 
  rel = 'internal' 
}: InternalLinkProps) => (
  <Link
    href={href}
    className={cn(
      'text-primary-600 hover:text-primary-700 underline transition-colors duration-200',
      className
    )}
    title={title}
    rel={rel}
  >
    {children}
  </Link>
));

InternalLink.displayName = 'InternalLink';

/**
 * Related links section for SEO
 */
interface RelatedLinksProps {
  title?: string;
  links: Array<{
    href: string;
    title: string;
    description?: string;
  }>;
  className?: string;
}

export const RelatedLinks = React.memo(({ 
  title = 'Related Pages', 
  links, 
  className 
}: RelatedLinksProps) => (
  <section className={cn('mt-12 p-6 bg-surface-container rounded-lg', className)}>
    <h3 className="text-on-surface text-xl font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {links.map((link) => (
        <div key={link.href} className="border-l-4 border-primary-500 pl-4">
          <InternalLink 
            href={link.href}
            className="text-lg font-medium block mb-1"
            title={`Visit ${link.title} - AI Cover Letter Generator`}
          >
            {link.title}
          </InternalLink>
          {link.description && (
            <p className="text-on-surface-variant text-sm">{link.description}</p>
          )}
        </div>
      ))}
    </div>
  </section>
));

RelatedLinks.displayName = 'RelatedLinks';

/**
 * Breadcrumb navigation with SEO optimization
 */
interface BreadcrumbItem {
  href?: string;
  label: string;
}

interface SEOBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const SEOBreadcrumb = React.memo(({ items, className }: SEOBreadcrumbProps) => (
  <nav 
    aria-label="Breadcrumb navigation for AI Cover Letter Generator"
    className={cn('flex items-center space-x-2 text-sm', className)}
  >
    {items.map((item, index) => (
      <React.Fragment key={index}>
        {index > 0 && (
          <span className="text-on-surface-variant" aria-hidden="true">
            /
          </span>
        )}
        {item.href ? (
          <InternalLink
            href={item.href}
            className="text-on-surface-variant hover:text-on-surface no-underline"
            title={`Navigate to ${item.label} - AI Cover Letter Generator`}
          >
            {item.label}
          </InternalLink>
        ) : (
          <span className="text-on-surface font-medium" aria-current="page">
            {item.label}
          </span>
        )}
      </React.Fragment>
    ))}
  </nav>
));

SEOBreadcrumb.displayName = 'SEOBreadcrumb';

/**
 * Footer links with SEO optimization
 */
export const FooterLinks = React.memo(() => {
  const linkSections = [
    {
      title: 'AI Cover Letter Generator',
      links: [
        { href: '/', title: 'Home', description: 'AI Cover Letter Generator homepage' },
        { href: '/dashboard', title: 'Create Cover Letter', description: 'Generate AI cover letters' },
        { href: '/templates', title: 'Cover Letter Templates', description: 'Professional templates' },
        { href: '/examples', title: 'Cover Letter Examples', description: 'Sample cover letters' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { href: '/guides/how-to-write-cover-letter', title: 'How to Write a Cover Letter', description: 'Complete guide' },
        { href: '/guides/ats-optimization', title: 'ATS Optimization Guide', description: 'Beat applicant tracking systems' },
        { href: '/guides/job-search-tips', title: 'Job Search Tips', description: 'Career advice' },
        { href: '/pricing', title: 'Pricing', description: 'Affordable plans' },
      ],
    },
    {
      title: 'Support',
      links: [
        { href: '/help', title: 'Help Center', description: 'Get support' },
        { href: '/contact', title: 'Contact Us', description: 'Reach our team' },
        { href: '/about', title: 'About Us', description: 'Learn about our mission' },
        { href: '/privacy', title: 'Privacy Policy', description: 'Data protection' },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {linkSections.map((section) => (
        <div key={section.title}>
          <h4 className="text-on-surface font-semibold mb-4">{section.title}</h4>
          <ul className="space-y-2">
            {section.links.map((link) => (
              <li key={link.href}>
                <InternalLink
                  href={link.href}
                  className="text-on-surface-variant hover:text-on-surface no-underline text-sm"
                  title={link.description}
                >
                  {link.title}
                </InternalLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
});

FooterLinks.displayName = 'FooterLinks';

/**
 * Contextual navigation for specific pages
 */
interface ContextualNavProps {
  currentPage: 'home' | 'dashboard' | 'templates' | 'examples' | 'generate';
  className?: string;
}

export const ContextualNav = React.memo(({ currentPage, className }: ContextualNavProps) => {
  const getContextualLinks = () => {
    switch (currentPage) {
      case 'home':
        return [
          { href: '/dashboard', title: 'Start Creating Cover Letters', description: 'Begin with our AI generator' },
          { href: '/templates', title: 'Browse Templates', description: 'View professional designs' },
          { href: '/examples', title: 'See Examples', description: 'Real cover letter samples' },
        ];
      
      case 'dashboard':
        return [
          { href: '/dashboard/generate', title: 'Generate New Cover Letter', description: 'Create with AI' },
          { href: '/templates', title: 'Choose Template', description: 'Select design' },
          { href: '/dashboard/history', title: 'View History', description: 'Manage saved letters' },
        ];
      
      case 'templates':
        return [
          { href: '/dashboard/generate', title: 'Use This Template', description: 'Start creating' },
          { href: '/examples', title: 'See Examples', description: 'View samples' },
          { href: '/guides/how-to-write-cover-letter', title: 'Writing Guide', description: 'Learn best practices' },
        ];
      
      case 'examples':
        return [
          { href: '/dashboard/generate', title: 'Create Similar Letter', description: 'Use AI generator' },
          { href: '/templates', title: 'Browse Templates', description: 'Find your style' },
          { href: '/guides/ats-optimization', title: 'ATS Tips', description: 'Optimize for systems' },
        ];
      
      case 'generate':
        return [
          { href: '/templates', title: 'Change Template', description: 'Select different design' },
          { href: '/examples', title: 'View Examples', description: 'Get inspiration' },
          { href: '/dashboard/history', title: 'Previous Letters', description: 'Access saved work' },
        ];
      
      default:
        return [];
    }
  };

  const links = getContextualLinks();

  if (links.length === 0) return null;

  return (
    <RelatedLinks
      title="Quick Actions"
      links={links}
      className={className}
    />
  );
});

ContextualNav.displayName = 'ContextualNav';
