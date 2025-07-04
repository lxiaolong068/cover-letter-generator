import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createSession } from '@/lib/neon';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Password verification would be implemented here
    // For now, we'll create a session assuming credentials are valid

    // Create session
    const session = await createSession(user.id);

    // Set session cookie
    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        message: 'Login successful',
      },
      { status: 200 }
    );

    // Set httpOnly cookie with session token
    response.cookies.set('session-token', session.session_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
