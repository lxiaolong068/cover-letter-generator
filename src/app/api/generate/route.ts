import { streamText } from 'ai';
import { getConfiguredModel } from '@/lib/openrouter';
import { authenticate } from '@/lib/auth';
import { NextRequest } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticate(req);
    if (!user) {
      return new Response('Unauthorized', {
        status: 401,
      });
    }

    const { jobDescription, userProfile, coverLetterType = 'professional' } = await req.json();

    if (!jobDescription || !userProfile) {
      return new Response('Missing required fields: jobDescription and userProfile', {
        status: 400,
      });
    }

    // Get configured model for cover letter generation
    const { model, config } = getConfiguredModel('coverLetter');

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

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
