import { NextRequest, NextResponse } from 'next/server';
import { getCoverLettersByUserId, saveCoverLetter } from '@/lib/neon';
import {
  fullStackApiMiddleware,
  coverLetterSaveSchema,
  tieredGeneralRateLimit,
  tieredCoverLetterSaveRateLimit,
  AuthenticatedRequest,
  MiddlewareContext
} from '@/lib/middleware';
import { multiLevelCache, cacheKeys } from '@/lib/cache';
import { logger } from '@/lib/logging';
import { recordUserActivity } from '@/lib/metrics';

// Create enhanced middleware chains for authenticated endpoints
const authMiddleware = fullStackApiMiddleware(undefined, tieredGeneralRateLimit);
const saveMiddleware = fullStackApiMiddleware(coverLetterSaveSchema, tieredCoverLetterSaveRateLimit);

// Enhanced GET handler - fetch user's cover letters with caching
async function getCoverLetters(
  req: AuthenticatedRequest,
  context: MiddlewareContext
) {
  const dbStartTime = Date.now();
  const userId = context.user!.id;
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');

  // Create cache key for user's cover letters
  const cacheKey = cacheKeys.coverLetters(userId, page);

  try {
    // Try to get from cache first
    const cachedCoverLetters = await multiLevelCache.get(cacheKey);
    if (cachedCoverLetters) {
      context.metrics.cacheHit = true;

      logger.debug('Cover letters cache hit', {
        requestId: context.metrics.requestId,
        userId,
        page,
        cacheKey,
      });

      return NextResponse.json(cachedCoverLetters);
    }

    // Fetch from database
    const coverLetters = await getCoverLettersByUserId(userId);
    const dbQueryTime = Date.now() - dbStartTime;
    context.metrics.dbQueryTime = dbQueryTime;

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCoverLetters = coverLetters.slice(startIndex, endIndex);

    const response = {
      coverLetters: paginatedCoverLetters,
      total: coverLetters.length,
      page,
      limit,
      totalPages: Math.ceil(coverLetters.length / limit),
    };

    // Cache the result
    await multiLevelCache.set(cacheKey, response, {
      memory: 2 * 60 * 1000, // 2 minutes in memory
      redis: 10 * 60 * 1000, // 10 minutes in Redis
    });

    // Record user activity
    recordUserActivity({
      userId,
      action: 'fetch_cover_letters',
      duration: Date.now() - context.startTime,
      success: true,
      timestamp: new Date(),
      metadata: {
        page,
        limit,
        total: coverLetters.length,
        dbQueryTime,
      },
    });

    logger.info('Cover letters fetched from database', {
      requestId: context.metrics.requestId,
      userId,
      total: coverLetters.length,
      page,
      dbQueryTime,
    });

    return NextResponse.json(response);

  } catch (error) {
    logger.error('Failed to fetch cover letters', {
      requestId: context.metrics.requestId,
      userId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    throw error; // Re-throw to be handled by error middleware
  }
}

// Enhanced POST handler - save a new cover letter with cache invalidation
async function saveCoverLetterHandler(
  req: AuthenticatedRequest,
  context: MiddlewareContext
) {
  const dbStartTime = Date.now();
  const userId = context.user!.id;

  const {
    title,
    content,
    jobDescription,
    userProfile,
    coverLetterType = 'professional',
    modelUsed,
    tokensUsed,
    generationTime,
  } = req.parsedBody || await req.json();

  try {
    // Save cover letter to database
    const coverLetter = await saveCoverLetter({
      user_id: userId,
      title,
      content,
      job_description: jobDescription,
      user_profile: userProfile,
      cover_letter_type: coverLetterType,
      model_used: modelUsed,
      tokens_used: tokensUsed,
      generation_time: generationTime,
    });

    const dbQueryTime = Date.now() - dbStartTime;
    context.metrics.dbQueryTime = dbQueryTime;

    // Invalidate cache for user's cover letters (all pages)
    const cacheKeysToInvalidate = [
      cacheKeys.coverLetters(userId, 1),
      cacheKeys.coverLetters(userId, 2),
      cacheKeys.coverLetters(userId, 3),
      // Could be more sophisticated with a cache tag system
    ];

    for (const key of cacheKeysToInvalidate) {
      await multiLevelCache.delete(key);
    }

    // Cache the individual cover letter
    const coverLetterCacheKey = cacheKeys.coverLetter(coverLetter.id);
    await multiLevelCache.set(coverLetterCacheKey, coverLetter, {
      memory: 5 * 60 * 1000, // 5 minutes in memory
      redis: 30 * 60 * 1000, // 30 minutes in Redis
    });

    // Record user activity
    recordUserActivity({
      userId,
      action: 'save_cover_letter',
      duration: Date.now() - context.startTime,
      success: true,
      timestamp: new Date(),
      metadata: {
        coverLetterId: coverLetter.id,
        title,
        coverLetterType,
        modelUsed,
        tokensUsed,
        generationTime,
        dbQueryTime,
      },
    });

    logger.info('Cover letter saved successfully', {
      requestId: context.metrics.requestId,
      userId,
      coverLetterId: coverLetter.id,
      title,
      dbQueryTime,
    });

    return NextResponse.json(
      {
        coverLetter,
        message: 'Cover letter saved successfully',
      },
      { status: 201 }
    );

  } catch (error) {
    logger.error('Failed to save cover letter', {
      requestId: context.metrics.requestId,
      userId,
      title,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    throw error; // Re-throw to be handled by error middleware
  }
}

export async function GET(req: NextRequest) {
  return authMiddleware.handle(req, getCoverLetters);
}

export async function POST(req: NextRequest) {
  return saveMiddleware.handle(req, saveCoverLetterHandler);
}
