import { streamText } from 'ai';
import { getConfiguredModel } from '@/lib/openrouter';
import { NextRequest, NextResponse } from 'next/server';
import {
  fullStackApiMiddleware,
  coverLetterGenerationSchema,
  tieredAiGenerationRateLimit,
  AuthenticatedRequest,
  MiddlewareContext
} from '@/lib/middleware';
// import { multiLevelCache, cacheKeys } from '@/lib/cache';
import { logger } from '@/lib/logging';
import { recordAiGeneration } from '@/lib/metrics';
import crypto from 'crypto';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Create enhanced middleware chain for this endpoint
const middleware = fullStackApiMiddleware(coverLetterGenerationSchema, tieredAiGenerationRateLimit);

// Enhanced main handler function with caching and metrics
async function generateCoverLetter(
  req: AuthenticatedRequest,
  context: MiddlewareContext
) {
  const generationStartTime = Date.now();
  const { jobDescription, userProfile, coverLetterType = 'professional' } = req.parsedBody || await req.json();

  // Create cache key based on input hash for potential caching of similar requests
  // const inputHash = crypto
  //   .createHash('sha256')
  //   .update(`${jobDescription}:${userProfile}:${coverLetterType}`)
  //   .digest('hex')
  //   .substring(0, 16);

  // const cacheKey = cacheKeys.config(`ai_generation:${inputHash}`);

  try {
    // Check cache for similar generation (optional, can be disabled for uniqueness)
    // For now, we'll skip caching AI generations to ensure uniqueness
    // const cachedResult = await multiLevelCache.get(cacheKey);
    // if (cachedResult) {
    //   context.metrics.cacheHit = true;
    //   return new NextResponse(cachedResult);
    // }

    // Get configured model for cover letter generation
    const { model, config } = getConfiguredModel('coverLetter');

    // Log AI generation start
    logger.info('AI generation started', {
      requestId: context.metrics.requestId,
      userId: context.user?.id,
      userTier: context.user?.tier,
      model: model.modelId,
      coverLetterType,
      inputLength: jobDescription.length + userProfile.length,
    });

    // Create the system prompt for cover letter generation
    const systemPrompt = `You are an expert cover letter writer. Your task is to create a compelling, personalized cover letter that:

1. Matches the job requirements with the candidate's experience
2. Uses a ${coverLetterType} tone
3. Follows proper cover letter structure (header, greeting, body paragraphs, closing)
4. Is ATS-friendly and keyword-optimized
5. Is concise but impactful (typically 3-4 paragraphs)

Structure your response as follows:
- Opening paragraph: Hook and position statement
- Body paragraph(s): Relevant experience and achievements
- Closing paragraph: Call to action and next steps

Make it personal, specific, and compelling.`;

    const userPrompt = `Job Description:
${jobDescription}

Candidate Profile:
${userProfile}

Please generate a tailored cover letter for this position.`;

    // Stream the response
    const result = await streamText({
      model,
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens: config.maxTokens,
      temperature: config.temperature,
    });

    const generationTime = Date.now() - generationStartTime;
    context.metrics.aiGenerationTime = generationTime;

    // Record AI generation metrics
    recordAiGeneration({
      model: model.modelId,
      tokensUsed: 0, // Will be updated when token usage is available
      generationTime,
      success: true,
      userId: context.user?.id,
      userTier: context.user?.tier,
      timestamp: new Date(),
    });

    // Log successful generation
    logger.info('AI generation completed', {
      requestId: context.metrics.requestId,
      userId: context.user?.id,
      model: model.modelId,
      generationTime,
      success: true,
    });

    const streamResponse = result.toDataStreamResponse();
    return new NextResponse(streamResponse.body, {
      status: streamResponse.status,
      statusText: streamResponse.statusText,
      headers: {
        ...streamResponse.headers,
        'X-Generation-Time': `${generationTime}ms`,
        'X-Model-Used': model.modelId,
      }
    });

  } catch (error) {
    const generationTime = Date.now() - generationStartTime;
    context.metrics.aiGenerationTime = generationTime;

    // Record failed AI generation metrics
    recordAiGeneration({
      model: 'unknown',
      tokensUsed: 0,
      generationTime,
      success: false,
      userId: context.user?.id,
      userTier: context.user?.tier,
      timestamp: new Date(),
      errorType: error instanceof Error ? error.name : 'UNKNOWN_ERROR',
    });

    // Log failed generation
    logger.error('AI generation failed', {
      requestId: context.metrics.requestId,
      userId: context.user?.id,
      error: error instanceof Error ? error.message : 'Unknown error',
      generationTime,
    });

    throw error; // Re-throw to be handled by error middleware
  }
}

export async function POST(req: NextRequest) {
  return middleware.handle(req, generateCoverLetter);
}
