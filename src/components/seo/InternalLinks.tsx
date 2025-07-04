import Link from 'next/link';

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
    { href: '/', label: 'Home', description: 'AI Cover Letter Generator homepage' },
    { href: '/dashboard', label: 'Dashboard', description: 'Your cover letter dashboard' },
    { href: '/dashboard/generate', label: 'Generate', description: 'Create new cover letter' },
    { href: '/dashboard/templates', label: 'Templates', description: 'Browse templates' },
    { href: '/dashboard/history', label: 'History', description: 'View past cover letters' },
  ],
  resources: [
    { href: '/examples', label: 'Examples', description: 'Cover letter examples' },
    { href: '/templates', label: 'Templates', description: 'Professional templates' },
    { href: '/pricing', label: 'Pricing', description: 'Plans and pricing' },
    { href: '/help', label: 'Help', description: 'Support and documentation' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy', description: 'Privacy and data protection' },
    { href: '/terms', label: 'Terms of Service', description: 'Terms and conditions' },
    { href: '/contact', label: 'Contact', description: 'Get in touch' },
  ],
};

export function ContextualNav({ currentPage }: ContextualNavProps) {
  const getRelevantLinks = (page: string): NavigationItem[] => {
    switch (page) {
      case 'home':
        return [
          navigationSections.main[1], // Dashboard
          navigationSections.main[2], // Generate
          navigationSections.resources[0], // Examples
          navigationSections.resources[1], // Templates
        ];
      case 'dashboard':
        return [
          navigationSections.main[2], // Generate
          navigationSections.main[3], // Templates
          navigationSections.main[4], // History
          navigationSections.resources[3], // Help
        ];
      case 'generate':
        return [
          navigationSections.main[1], // Dashboard
          navigationSections.main[3], // Templates
          navigationSections.resources[0], // Examples
          navigationSections.resources[3], // Help
        ];
      default:
        return navigationSections.main.slice(0, 4);
    }
  };

  const relevantLinks = getRelevantLinks(currentPage);

  return (
    <nav className="py-8" aria-label="Contextual navigation">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-on-surface mb-6 text-xl font-semibold">Related Pages</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {relevantLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="group border-outline-variant hover:border-primary-300 rounded-lg border p-4 transition-all hover:shadow-sm"
            >
              <h3 className="text-on-surface group-hover:text-primary-600 font-medium">
                {link.label}
              </h3>
              <p className="text-on-surface-variant mt-1 text-sm">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export function FooterLinks({ className = '' }: FooterLinksProps) {
  return (
    <div className={`grid grid-cols-1 gap-8 md:grid-cols-3 ${className}`}>
      {/* Main Navigation */}
      <div>
        <h3 className="text-on-surface mb-4 text-sm font-semibold tracking-wider uppercase">
          Navigation
        </h3>
        <ul className="space-y-3">
          {navigationSections.main.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-on-surface-variant hover:text-on-surface text-sm transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Resources */}
      <div>
        <h3 className="text-on-surface mb-4 text-sm font-semibold tracking-wider uppercase">
          Resources
        </h3>
        <ul className="space-y-3">
          {navigationSections.resources.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-on-surface-variant hover:text-on-surface text-sm transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Legal */}
      <div>
        <h3 className="text-on-surface mb-4 text-sm font-semibold tracking-wider uppercase">
          Legal
        </h3>
        <ul className="space-y-3">
          {navigationSections.legal.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-on-surface-variant hover:text-on-surface text-sm transition-colors"
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
