import { neon, neonConfig, Pool, Client } from '@neondatabase/serverless';
import { logger } from './logging';
import { multiLevelCache, cacheKeys } from './cache';

// Configure Neon for serverless environments
if (typeof window === 'undefined') {
  // Only configure WebSocket in Node.js environments
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ws = require('ws');
    neonConfig.webSocketConstructor = ws;
  } catch {
    // WebSocket not available, will use HTTP-only mode
    logger.warn('WebSocket not available, using HTTP-only mode');
  }
}

// Validate environment variables
if (!process.env.NEON_DATABASE_URL) {
  throw new Error('NEON_DATABASE_URL environment variable is required');
}

// Enhanced database configuration with connection pooling
export const DATABASE_CONFIG = {
  connectionString: process.env.NEON_DATABASE_URL,
  unpooledConnectionString: process.env.NEON_DATABASE_URL_UNPOOLED || process.env.NEON_DATABASE_URL,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || '20'), // Maximum connections
    min: parseInt(process.env.DB_POOL_MIN || '5'),  // Minimum connections
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'), // 30 seconds
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000'), // 5 seconds
    acquireTimeoutMillis: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '60000'), // 60 seconds
  },
};

// Create the main SQL query function with enhanced error handling
export const sql = neon(process.env.NEON_DATABASE_URL);

// Create SQL query function with full results (includes metadata)
export const sqlWithMetadata = neon(process.env.NEON_DATABASE_URL, {
  fullResults: true,
});

// Connection pool instance
let connectionPool: Pool | null = null;

// Create a connection pool for complex operations with enhanced configuration
export function createPool(): Pool {
  if (!connectionPool) {
    connectionPool = new Pool({
      connectionString: DATABASE_CONFIG.connectionString,
      max: DATABASE_CONFIG.pool.max,
      min: DATABASE_CONFIG.pool.min,
      idleTimeoutMillis: DATABASE_CONFIG.pool.idleTimeoutMillis,
      connectionTimeoutMillis: DATABASE_CONFIG.pool.connectionTimeoutMillis,
    });

    // Add pool event listeners for monitoring
    connectionPool.on('connect', (client) => {
      logger.debug('Database pool connection established', {
        totalCount: connectionPool?.totalCount,
        idleCount: connectionPool?.idleCount,
        waitingCount: connectionPool?.waitingCount,
      });
    });

    connectionPool.on('error', (err) => {
      logger.error('Database pool error', { error: err.message });
    });

    connectionPool.on('remove', () => {
      logger.debug('Database pool connection removed', {
        totalCount: connectionPool?.totalCount,
        idleCount: connectionPool?.idleCount,
      });
    });
  }

  return connectionPool;
}

// Create a single client connection
export function createClient(): Client {
  return new Client(DATABASE_CONFIG.connectionString);
}

// Get pool statistics
export function getPoolStats() {
  if (!connectionPool) return null;

  return {
    totalCount: connectionPool.totalCount,
    idleCount: connectionPool.idleCount,
    waitingCount: connectionPool.waitingCount,
  };
}

// Enhanced query wrapper with logging and metrics
export async function executeQuery<T = any>(
  query: string,
  params: any[] = [],
  options: {
    usePool?: boolean;
    cacheTTL?: number;
    cacheKey?: string;
    logQuery?: boolean;
  } = {}
): Promise<T[]> {
  const startTime = Date.now();
  const queryId = `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    // Check cache if cache key is provided
    if (options.cacheKey) {
      const cached = await multiLevelCache.get<T[]>(options.cacheKey);
      if (cached) {
        logger.debug('Database query cache hit', {
          queryId,
          cacheKey: options.cacheKey,
          duration: Date.now() - startTime,
        });
        return cached;
      }
    }

    // Log query if enabled
    if (options.logQuery) {
      logger.debug('Executing database query', {
        queryId,
        query: query.substring(0, 200) + (query.length > 200 ? '...' : ''),
        paramCount: params.length,
      });
    }

    let result: T[];

    if (options.usePool) {
      const pool = createPool();
      const client = await pool.connect();
      try {
        result = await client.query(query, params);
      } finally {
        client.release();
      }
    } else {
      result = await sql(query, params) as T[];
    }

    const duration = Date.now() - startTime;

    // Cache result if cache key is provided
    if (options.cacheKey && options.cacheTTL) {
      await multiLevelCache.set(options.cacheKey, result, {
        memory: Math.min(options.cacheTTL, 5 * 60 * 1000), // Max 5 minutes in memory
        redis: options.cacheTTL,
      });
    }

    logger.debug('Database query completed', {
      queryId,
      duration,
      resultCount: result.length,
      cached: !!options.cacheKey,
    });

    return result;

  } catch (error) {
    const duration = Date.now() - startTime;

    logger.error('Database query failed', {
      queryId,
      query: query.substring(0, 200),
      error: error instanceof Error ? error.message : 'Unknown error',
      duration,
    });

    throw error;
  }
}

// Database schema types
export type UserTier = 'free' | 'premium' | 'enterprise';

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  tier: UserTier;
  subscription_expires_at?: Date;
  monthly_ai_usage: number;
  monthly_usage_reset_at: Date;
  mfa_config?: string; // JSON string containing MFA configuration
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

// Enhanced user management functions with caching and optimization
export async function createUser(userData: {
  email: string;
  name: string;
  password?: string;
  provider?: string;
}): Promise<User> {
  try {
    const [user] = await executeQuery<User>(
      `INSERT INTO users (email, name, password)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userData.email, userData.name, userData.password || null],
      { logQuery: true }
    );

    // Cache the new user
    const userCacheKey = cacheKeys.user(user.id);
    await multiLevelCache.set(userCacheKey, user, {
      memory: 5 * 60 * 1000, // 5 minutes
      redis: 30 * 60 * 1000, // 30 minutes
    });

    // Also cache by email for faster lookups
    const emailCacheKey = `user:email:${userData.email}`;
    await multiLevelCache.set(emailCacheKey, user, {
      memory: 5 * 60 * 1000,
      redis: 30 * 60 * 1000,
    });

    logger.info('User created successfully', {
      userId: user.id,
      email: userData.email,
      provider: userData.provider,
    });

    return user;
  } catch (error) {
    logger.error('Failed to create user', {
      email: userData.email,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const cacheKey = `user:email:${email}`;

  try {
    const users = await executeQuery<User>(
      `SELECT id, email, name, tier, subscription_expires_at,
              monthly_ai_usage, monthly_usage_reset_at, created_at, updated_at
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email],
      {
        cacheKey,
        cacheTTL: 15 * 60 * 1000, // 15 minutes
        logQuery: true,
      }
    );

    return users[0] || null;
  } catch (error) {
    logger.error('Failed to get user by email', {
      email,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const cacheKey = cacheKeys.user(id);

  try {
    const users = await executeQuery<User>(
      `SELECT id, email, name, tier, subscription_expires_at,
              monthly_ai_usage, monthly_usage_reset_at, created_at, updated_at
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [id],
      {
        cacheKey,
        cacheTTL: 15 * 60 * 1000, // 15 minutes
        logQuery: true,
      }
    );

    return users[0] || null;
  } catch (error) {
    logger.error('Failed to get user by ID', {
      userId: id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

// Update user with cache invalidation
export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  try {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = [id, ...Object.values(updates)];

    const [user] = await executeQuery<User>(
      `UPDATE users
       SET ${setClause}, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      values,
      { logQuery: true }
    );

    if (user) {
      // Invalidate caches
      await multiLevelCache.delete(cacheKeys.user(id));
      if (user.email) {
        await multiLevelCache.delete(`user:email:${user.email}`);
      }

      logger.info('User updated successfully', {
        userId: id,
        updatedFields: Object.keys(updates),
      });
    }

    return user || null;
  } catch (error) {
    logger.error('Failed to update user', {
      userId: id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

// Enhanced cover letter management functions with optimization and caching
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
  try {
    const [coverLetter] = await executeQuery<CoverLetter>(
      `INSERT INTO cover_letters (
        user_id, title, content, job_description, user_profile,
        cover_letter_type, model_used, tokens_used, generation_time
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        data.user_id, data.title, data.content, data.job_description,
        data.user_profile, data.cover_letter_type, data.model_used,
        data.tokens_used, data.generation_time
      ],
      { logQuery: true }
    );

    // Cache the new cover letter
    const coverLetterCacheKey = cacheKeys.coverLetter(coverLetter.id);
    await multiLevelCache.set(coverLetterCacheKey, coverLetter, {
      memory: 5 * 60 * 1000, // 5 minutes
      redis: 30 * 60 * 1000, // 30 minutes
    });

    // Invalidate user's cover letters cache
    for (let page = 1; page <= 5; page++) {
      await multiLevelCache.delete(cacheKeys.coverLetters(data.user_id, page));
    }

    logger.info('Cover letter saved successfully', {
      coverLetterId: coverLetter.id,
      userId: data.user_id,
      title: data.title,
      modelUsed: data.model_used,
      generationTime: data.generation_time,
    });

    return coverLetter;
  } catch (error) {
    logger.error('Failed to save cover letter', {
      userId: data.user_id,
      title: data.title,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

export async function getCoverLettersByUserId(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    orderBy?: 'created_at' | 'updated_at' | 'title';
    orderDirection?: 'ASC' | 'DESC';
  } = {}
): Promise<CoverLetter[]> {
  const {
    limit = 50,
    offset = 0,
    orderBy = 'created_at',
    orderDirection = 'DESC'
  } = options;

  try {
    const coverLetters = await executeQuery<CoverLetter>(
      `SELECT cl.id, cl.user_id, cl.title, cl.content, cl.job_description,
              cl.user_profile, cl.cover_letter_type, cl.model_used,
              cl.tokens_used, cl.generation_time, cl.created_at, cl.updated_at
       FROM cover_letters cl
       WHERE cl.user_id = $1
       ORDER BY cl.${orderBy} ${orderDirection}
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
      {
        cacheKey: `${cacheKeys.coverLetters(userId, Math.floor(offset / limit) + 1)}:${orderBy}:${orderDirection}`,
        cacheTTL: 10 * 60 * 1000, // 10 minutes
        logQuery: true,
      }
    );

    return coverLetters;
  } catch (error) {
    logger.error('Failed to get cover letters by user ID', {
      userId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

export async function getCoverLetterById(id: string): Promise<CoverLetter | null> {
  const cacheKey = cacheKeys.coverLetter(id);

  try {
    const coverLetters = await executeQuery<CoverLetter>(
      `SELECT * FROM cover_letters WHERE id = $1 LIMIT 1`,
      [id],
      {
        cacheKey,
        cacheTTL: 30 * 60 * 1000, // 30 minutes
        logQuery: true,
      }
    );

    return coverLetters[0] || null;
  } catch (error) {
    logger.error('Failed to get cover letter by ID', {
      coverLetterId: id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

// Update cover letter with cache invalidation
export async function updateCoverLetter(
  id: string,
  updates: Partial<Omit<CoverLetter, 'id' | 'user_id' | 'created_at'>>
): Promise<CoverLetter | null> {
  try {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = [id, ...Object.values(updates)];

    const [coverLetter] = await executeQuery<CoverLetter>(
      `UPDATE cover_letters
       SET ${setClause}, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      values,
      { logQuery: true }
    );

    if (coverLetter) {
      // Invalidate caches
      await multiLevelCache.delete(cacheKeys.coverLetter(id));

      // Invalidate user's cover letters cache
      for (let page = 1; page <= 5; page++) {
        await multiLevelCache.delete(cacheKeys.coverLetters(coverLetter.user_id, page));
      }

      logger.info('Cover letter updated successfully', {
        coverLetterId: id,
        updatedFields: Object.keys(updates),
      });
    }

    return coverLetter || null;
  } catch (error) {
    logger.error('Failed to update cover letter', {
      coverLetterId: id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

// Delete cover letter with cache invalidation
export async function deleteCoverLetter(id: string): Promise<boolean> {
  try {
    // First get the cover letter to know the user_id for cache invalidation
    const coverLetter = await getCoverLetterById(id);
    if (!coverLetter) return false;

    const [result] = await executeQuery<{ success: boolean }>(
      `DELETE FROM cover_letters WHERE id = $1 RETURNING true as success`,
      [id],
      { logQuery: true }
    );

    if (result?.success) {
      // Invalidate caches
      await multiLevelCache.delete(cacheKeys.coverLetter(id));

      // Invalidate user's cover letters cache
      for (let page = 1; page <= 5; page++) {
        await multiLevelCache.delete(cacheKeys.coverLetters(coverLetter.user_id, page));
      }

      logger.info('Cover letter deleted successfully', {
        coverLetterId: id,
        userId: coverLetter.user_id,
      });

      return true;
    }

    return false;
  } catch (error) {
    logger.error('Failed to delete cover letter', {
      coverLetterId: id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
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
