'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Navigation } from '@/components/ui/Navigation';

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/templates', label: 'Templates' },
  { href: '/examples', label: 'Examples' },
  { href: '/pricing', label: 'Pricing' },
];

const errorMessages = {
  AccessDenied: {
    title: 'Access Denied',
    description: 'Your sign-in attempt was denied. This could be due to:',
    reasons: [
      'You cancelled the Google sign-in process',
      'Your Google account doesn&apos;t have the required permissions',
      'There was a temporary issue with our authentication system',
    ],
    action: 'Please try signing in again, or contact support if the problem persists.',
  },
  Configuration: {
    title: 'Configuration Error',
    description: "There's an issue with our authentication setup.",
    reasons: [
      'OAuth client configuration error',
      'Invalid redirect URI',
      'Missing environment variables',
    ],
    action: 'Please contact our support team to resolve this issue.',
  },
  Verification: {
    title: 'Verification Error',
    description: "We couldn't verify your identity.",
    reasons: [
      'Invalid or expired verification token',
      'Email verification required',
      'Account verification pending',
    ],
    action: 'Please check your email for verification instructions or try again.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred during sign-in.',
    reasons: [
      'Temporary server issue',
      'Network connectivity problem',
      'Invalid authentication state',
    ],
    action: 'Please try again in a few moments.',
  },
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';

  const errorInfo = errorMessages[error as keyof typeof errorMessages] || errorMessages.Default;

  return (
    <>
      {/* Navigation */}
      <Navigation
        items={navigationItems}
        actions={
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        }
      />

      {/* Error Content */}
      <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-on-surface">{errorInfo.title}</h1>
            <p className="mt-2 text-on-surface-variant">{errorInfo.description}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What happened?</CardTitle>
              <CardDescription>Possible reasons for this error:</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                {errorInfo.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 space-y-3">
                <p className="text-sm text-on-surface">{errorInfo.action}</p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="flex-1">
                    <Link href="/login">Try Again</Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/">Go Home</Link>
                  </Button>
                </div>
              </div>

              {error === 'AccessDenied' && (
                <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
                  <p className="font-medium">Need help?</p>
                  <p className="mt-1">
                    If you continue to experience issues, please ensure you&apos;re using a valid
                    Google account and have allowed our application to access your basic profile
                    information.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-xs text-on-surface-variant">
              Error Code: {error} | Need support?{' '}
              <Link href="/contact" className="text-primary-600 hover:text-primary-500">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
