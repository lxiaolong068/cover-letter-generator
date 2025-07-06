import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserByEmail, createUser } from './neon';
import bcrypt from 'bcryptjs';
import type { AuthOptions } from 'next-auth';

interface AuthUser extends NextAuthUser {
  id: string;
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await getUserByEmail(credentials.email);
          if (!user || !user.password) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user, account }: { user: any; account: any }) {
      if (account?.provider === 'google') {
        if (!user.email) {
          console.error('Google sign-in error: Email not provided by Google.');
          return false;
        }
        try {
          const existingUser = await getUserByEmail(user.email);
          if (!existingUser) {
            await createUser({
              email: user.email,
              name: user.name || 'Anonymous User',
              provider: 'google',
            });
          }
          return true;
        } catch (error) {
          console.error('Error during Google sign-in:', error);
          return false;
        }
      }
      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
