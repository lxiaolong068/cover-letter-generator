import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication Error - AI Cover Letter Generator',
  description:
    'Authentication error occurred while signing in to AI Cover Letter Generator. Please try again or contact support.',
  keywords: 'AI Cover Letter Generator authentication error, login error, sign in problem',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthErrorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
