import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Allow basic diagnostics in production, detailed info only with debug token
  const isDevelopment = process.env.NODE_ENV === 'development';
  const debugToken = request.nextUrl.searchParams.get('token');
  const validDebugToken = process.env.DEBUG_TOKEN;
  const hasValidToken = debugToken && validDebugToken && debugToken === validDebugToken;
  const showDetailedInfo = isDevelopment || hasValidToken;

  const basicDiagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    status: 'Configuration Check',
    environmentVariables: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT_SET',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT_SET',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT_SET',
      NEON_DATABASE_URL: process.env.NEON_DATABASE_URL ? 'SET' : 'NOT_SET',
    },
    expectedCallbackUrls: [
      `${process.env.NEXTAUTH_URL || 'https://www.coverlettergen.cc'}/api/auth/callback/google`,
    ],
    commonIssues: [
      {
        issue: 'NEXTAUTH_URL mismatch',
        description: 'NEXTAUTH_URL must match your production domain exactly',
        currentValue: process.env.NEXTAUTH_URL,
        expectedValue: 'https://www.coverlettergen.cc',
        status: process.env.NEXTAUTH_URL === 'https://www.coverlettergen.cc' ? 'OK' : 'NEEDS_FIX',
      },
      {
        issue: 'Google OAuth redirect URI',
        description: 'Redirect URI in Google Console must match callback URL',
        expectedValue: `${process.env.NEXTAUTH_URL || 'https://www.coverlettergen.cc'}/api/auth/callback/google`,
      },
      {
        issue: 'Authorized domains',
        description: 'Domain must be added to Google OAuth consent screen',
        expectedValue: 'coverlettergen.cc',
      },
    ],
  };

  const detailedDiagnostics = {
    ...basicDiagnostics,
    url: request.url,
    headers: {
      host: request.headers.get('host'),
      'user-agent': request.headers.get('user-agent'),
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
    },
  };

  const diagnostics = showDetailedInfo ? detailedDiagnostics : basicDiagnostics;

  return NextResponse.json(diagnostics, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

export async function POST(request: NextRequest) {
  // Test database connection - require debug token for this
  const isDevelopment = process.env.NODE_ENV === 'development';
  const debugToken = request.nextUrl.searchParams.get('token');
  const validDebugToken = process.env.DEBUG_TOKEN;

  if (!isDevelopment && (!debugToken || debugToken !== validDebugToken)) {
    return NextResponse.json({ error: 'Database testing requires debug token' }, { status: 401 });
  }

  try {
    const { checkDatabaseHealth } = await import('@/lib/neon');
    const dbHealth = await checkDatabaseHealth();
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      database: {
        status: dbHealth ? 'healthy' : 'unhealthy',
        connectionString: process.env.NEON_DATABASE_URL ? 'SET' : 'NOT_SET',
      },
    });
  } catch (error) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      database: {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    }, { status: 500 });
  }
}
