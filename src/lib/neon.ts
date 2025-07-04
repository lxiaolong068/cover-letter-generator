import { neon, neonConfig, Pool, Client } from '@neondatabase/serverless';

// Configure Neon for serverless environments
if (typeof window === 'undefined') {
  // Only configure WebSocket in Node.js environments
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ws = require('ws');
    neonConfig.webSocketConstructor = ws;
  } catch {
    // WebSocket not available, will use HTTP-only mode
    console.warn('WebSocket not available, using HTTP-only mode');
  }
}

// Validate environment variables
if (!process.env.NEON_DATABASE_URL) {
  throw new Error('NEON_DATABASE_URL environment variable is required');
}

// Create the main SQL query function
export const sql = neon(process.env.NEON_DATABASE_URL);

// Create SQL query function with full results (includes metadata)
export const sqlWithMetadata = neon(process.env.NEON_DATABASE_URL, {
  fullResults: true,
});

// Database connection configuration
export const DATABASE_CONFIG = {
  connectionString: process.env.NEON_DATABASE_URL,
  // Unpooled connection for migrations and admin tasks
  unpooledConnectionString: process.env.NEON_DATABASE_URL_UNPOOLED || process.env.NEON_DATABASE_URL,
};

// Create a connection pool for complex operations
export function createPool() {
  return new Pool({
    connectionString: DATABASE_CONFIG.connectionString,
  });
}

// Create a single client connection
export function createClient() {
  return new Client(DATABASE_CONFIG.connectionString);
}

// Database schema types
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface CoverLetter {
  id: string;
  user_id: string;
  title: string;
  content: string;
  job_description: string;
  user_profile: string;
  cover_letter_type: 'professional' | 'creative' | 'technical' | 'executive';
  model_used: string;
  tokens_used?: number;
  generation_time: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  expires_at: Date;
  created_at: Date;
}

// Database utility functions
export async function executeTransaction<T = unknown>(
  queries: Array<ReturnType<typeof sql>>,
  options?: {
    isolationLevel?: 'ReadCommitted' | 'RepeatableRead' | 'Serializable';
    readOnly?: boolean;
  }
): Promise<T[]> {
  return sql.transaction(queries, options) as Promise<T[]>;
}

// User management functions
export async function createUser(userData: { email: string; name: string }): Promise<User> {
  const [user] = await sql`
    INSERT INTO users (email, name)
    VALUES (${userData.email}, ${userData.name})
    RETURNING *
  `;
  return user as User;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [user] = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  return user as User | null;
}

export async function getUserById(id: string): Promise<User | null> {
  const [user] = await sql`
    SELECT * FROM users WHERE id = ${id}
  `;
  return user as User | null;
}

// Cover letter management functions
export async function saveCoverLetter(data: {
  user_id: string;
  title: string;
  content: string;
  job_description: string;
  user_profile: string;
  cover_letter_type: CoverLetter['cover_letter_type'];
  model_used: string;
  tokens_used?: number;
  generation_time: number;
}): Promise<CoverLetter> {
  const [coverLetter] = await sql`
    INSERT INTO cover_letters (
      user_id, title, content, job_description, user_profile,
      cover_letter_type, model_used, tokens_used, generation_time
    )
    VALUES (
      ${data.user_id}, ${data.title}, ${data.content}, ${data.job_description},
      ${data.user_profile}, ${data.cover_letter_type}, ${data.model_used},
      ${data.tokens_used}, ${data.generation_time}
    )
    RETURNING *
  `;
  return coverLetter as CoverLetter;
}

export async function getCoverLettersByUserId(userId: string): Promise<CoverLetter[]> {
  const coverLetters = await sql`
    SELECT * FROM cover_letters 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
  return coverLetters as CoverLetter[];
}

export async function getCoverLetterById(id: string): Promise<CoverLetter | null> {
  const [coverLetter] = await sql`
    SELECT * FROM cover_letters WHERE id = ${id}
  `;
  return coverLetter as CoverLetter | null;
}

// Session management functions
export async function createSession(userId: string): Promise<UserSession> {
  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const [session] = await sql`
    INSERT INTO user_sessions (user_id, session_token, expires_at)
    VALUES (${userId}, ${sessionToken}, ${expiresAt})
    RETURNING *
  `;
  return session as UserSession;
}

export async function getSessionByToken(token: string): Promise<UserSession | null> {
  const [session] = await sql`
    SELECT * FROM user_sessions 
    WHERE session_token = ${token} AND expires_at > NOW()
  `;
  return session as UserSession | null;
}

export async function deleteSession(token: string): Promise<void> {
  await sql`
    DELETE FROM user_sessions WHERE session_token = ${token}
  `;
}

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}
