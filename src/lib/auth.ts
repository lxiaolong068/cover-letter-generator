import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken, getUserById } from './neon';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
}

export async function authenticate(req: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const sessionToken = req.cookies.get('session-token')?.value;

    if (!sessionToken) {
      return null;
    }

    // Get session from database
    const session = await getSessionByToken(sessionToken);

    if (!session) {
      return null;
    }

    // Get user data
    const user = await getUserById(session.user_id);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export function createAuthMiddleware(
  handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const user = await authenticate(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return handler(req, user);
  };
}

export function requireAuth(
  handler: (req: NextRequest, context?: unknown) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: unknown) => {
    const user = await authenticate(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Add user to request headers for downstream handlers
    const headers = new Headers(req.headers);
    headers.set('x-user-id', user.id);
    headers.set('x-user-email', user.email);

    const newRequest = new NextRequest(req.url, {
      method: req.method,
      headers,
      body: req.body,
    });

    return handler(newRequest, context);
  };
}
