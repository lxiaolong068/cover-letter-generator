import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/neon';

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('session-token')?.value;

    if (sessionToken) {
      // Delete session from database
      await deleteSession(sessionToken);
    }

    // Create response
    const response = NextResponse.json({ message: 'Logout successful' }, { status: 200 });

    // Clear session cookie
    response.cookies.delete('session-token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
