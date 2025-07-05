import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// @ts-expect-error - NextAuth v4 typing issue
const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
