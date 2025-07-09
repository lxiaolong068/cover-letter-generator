'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  // During build time, session might not be available, so we provide a fallback
  const session = typeof window !== 'undefined' ? undefined : null;

  return <NextAuthSessionProvider session={session}>{children}</NextAuthSessionProvider>;
}
