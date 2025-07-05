'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface NavigationItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface NavigationProps {
  items: NavigationItem[];
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function Navigation({ items, logo, actions, className }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={cn('bg-surface border-outline-variant border-b', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {logo || (
                <Link href="/" className="text-primary-600 text-xl font-bold">
                  Cover Letter Generator
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {items.map(item => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    )}
                  >
                    {item.icon}
                    {item.label}
                    {item.badge && (
                      <span className="bg-primary-500 ml-1 rounded-full px-2 py-0.5 text-xs text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:block">{actions}</div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="h-6 w-6 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
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
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out md:hidden',
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          {items.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface active:scale-95'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                {item.label}
                {item.badge && (
                  <span className="bg-primary-500 ml-auto rounded-full px-2 py-0.5 text-xs text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
        {actions && (
          <div className="border-outline-variant border-t px-2 pt-4 pb-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">{actions}</div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Breadcrumb Component
interface BreadcrumbItem {
  href?: string;
  label: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      className={cn('flex', className)}
      aria-label="Breadcrumb navigation"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <meta itemProp="position" content={String(index + 1)} />
            {index > 0 && (
              <svg
                className="text-on-surface-variant mx-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                itemProp="item"
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span
                className="text-on-surface-variant text-sm font-medium"
                itemProp="name"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
