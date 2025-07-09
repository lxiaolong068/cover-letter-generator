'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface NavigationItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  description?: string;
}

interface HeaderNavigationProps {
  className?: string;
}

const mainNavigationItems: NavigationItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    description: 'AI Cover Letter Generator homepage',
  },
  {
    href: '/templates',
    label: 'Templates',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    description: 'Professional cover letter templates',
  },
  {
    href: '/examples',
    label: 'Examples',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    ),
    description: 'Cover letter examples and samples',
  },
  {
    href: '/pricing',
    label: 'Pricing',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
        />
      </svg>
    ),
    description: 'Pricing plans and features',
  },
];

export function HeaderNavigation({ className }: HeaderNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  // Temporarily disable session for build
  const session = null;
  const status = 'unauthenticated' as const;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'border-b border-border bg-background/95 shadow-sm backdrop-blur-md'
          : 'bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 text-xl font-bold text-foreground transition-colors duration-200 hover:text-primary"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10,9 9,9 8,9" />
                </svg>
              </div>
              <span className="hidden sm:block">AI Cover Letter Generator</span>
              <span className="sm:hidden">AI Cover Letter</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {mainNavigationItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    isActive
                      ? 'bg-accent text-accent-foreground shadow-sm'
                      : 'text-foreground/70 hover:text-foreground'
                  )}
                  title={item.description}
                >
                  {item.icon && (
                    <span className="flex h-4 w-4 items-center justify-center transition-transform group-hover:scale-110">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                  {item.badge && (
                    <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {false ? (
              <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
            ) : session ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/generate">Generate</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button variant="primary" size="sm" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              className="h-9 w-9"
            >
              <svg
                className={cn(
                  'h-5 w-5 transition-transform duration-200',
                  isMobileMenuOpen && 'rotate-90'
                )}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    isMobileMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                  }
                />
              </svg>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out md:hidden',
          'border-t border-border bg-card/95 backdrop-blur-md',
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="space-y-1 p-4">
          {mainNavigationItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-all duration-200',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'active:scale-95',
                  isActive
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'text-foreground/70 hover:text-foreground'
                )}
                onClick={closeMobileMenu}
              >
                {item.icon && (
                  <span className="flex h-5 w-5 items-center justify-center">{item.icon}</span>
                )}
                <div className="flex-1">
                  <div>{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  )}
                </div>
                {item.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Actions */}
        <div className="border-t border-border p-4">
          <div className="flex flex-col gap-2">
            {false ? (
              <div className="h-10 animate-pulse rounded-md bg-muted" />
            ) : session ? (
              <>
                <Button variant="outline" size="sm" fullWidth asChild>
                  <Link href="/dashboard" onClick={closeMobileMenu}>
                    Dashboard
                  </Link>
                </Button>
                <Button variant="primary" size="sm" fullWidth asChild>
                  <Link href="/dashboard/generate" onClick={closeMobileMenu}>
                    Generate Cover Letter
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" fullWidth asChild>
                  <Link href="/login" onClick={closeMobileMenu}>
                    Login
                  </Link>
                </Button>
                <Button variant="primary" size="sm" fullWidth asChild>
                  <Link href="/register" onClick={closeMobileMenu}>
                    Get Started Free
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
