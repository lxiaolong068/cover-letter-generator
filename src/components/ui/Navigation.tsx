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
    <nav className={cn(
      'border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      'sticky top-0 z-50',
      className
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {logo || (
                <Link 
                  href="/" 
                  className="text-xl font-bold text-foreground hover:text-primary transition-colors"
                >
                  Cover Letter Generator
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {items.map(item => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                      'hover:bg-accent hover:text-accent-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      isActive
                        ? 'bg-accent text-accent-foreground shadow-sm'
                        : 'text-foreground/70 hover:text-foreground'
                    )}
                  >
                    {item.icon && (
                      <span className="flex h-4 w-4 items-center justify-center">
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
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">{actions}</div>

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
                className="h-5 w-5 transition-transform duration-200"
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
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out md:hidden',
          'border-t border-border bg-card',
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="space-y-1 p-4">
          {items.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium transition-all duration-200',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'active:scale-95',
                  isActive
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'text-foreground/70 hover:text-foreground'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon && (
                  <span className="flex h-5 w-5 items-center justify-center">
                    {item.icon}
                  </span>
                )}
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
        {actions && (
          <div className="border-t border-border p-4">
            <div className="flex flex-col gap-2">{actions}</div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Enhanced Breadcrumb Component
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
      <ol className="flex items-center space-x-1">
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
                className="mx-2 h-4 w-4 text-muted-foreground"
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
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                itemProp="item"
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span 
                className="text-sm font-medium text-muted-foreground"
                itemProp="name"
                aria-current={index === items.length - 1 ? 'page' : undefined}
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

// Tab Navigation Component
interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

interface TabNavigationProps {
  items: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function TabNavigation({ items, activeTab, onTabChange, className }: TabNavigationProps) {
  return (
    <div className={cn('border-b border-border', className)}>
      <nav className="-mb-px flex space-x-1" aria-label="Tabs">
        {items.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground'
            )}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.icon && (
              <span className="flex h-4 w-4 items-center justify-center">
                {tab.icon}
              </span>
            )}
            {tab.label}
            {tab.badge && (
              <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs text-muted-foreground">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

// Sidebar Navigation Component
interface SidebarNavigationProps {
  items: NavigationItem[];
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function SidebarNavigation({ 
  items, 
  className, 
  collapsible = false, 
  defaultCollapsed = false 
}: SidebarNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const pathname = usePathname();

  return (
    <div className={cn(
      'flex h-full flex-col border-r border-border bg-card',
      isCollapsed ? 'w-16' : 'w-64',
      'transition-all duration-300',
      className
    )}>
      {collapsible && (
        <div className="flex h-16 items-center justify-end px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            <svg
              className={cn('h-4 w-4 transition-transform', isCollapsed && 'rotate-180')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </Button>
        </div>
      )}
      
      <nav className="flex-1 space-y-1 p-2">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                'hover:bg-accent hover:text-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isActive
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-foreground/70 hover:text-foreground'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              {item.icon && (
                <span className="flex h-5 w-5 items-center justify-center flex-shrink-0">
                  {item.icon}
                </span>
              )}
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
