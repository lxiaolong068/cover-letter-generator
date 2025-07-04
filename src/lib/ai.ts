import { generateText, streamText } from 'ai';
import { getConfiguredModel, getModel, type ModelKey } from './openrouter';

// Types for AI operations
export interface CoverLetterRequest {
  jobDescription: string;
  userProfile: string;
  coverLetterType?: 'professional' | 'creative' | 'technical' | 'executive';
  additionalInstructions?: string;
}

export interface CoverLetterResponse {
  content: string;
  metadata: {
    modelUsed: string;
    tokensUsed?: number;
    generationTime: number;
  };
}

// Generate cover letter (non-streaming)
export async function generateCoverLetter(
  request: CoverLetterRequest
): Promise<CoverLetterResponse> {
  const startTime = Date.now();
  const { model, config } = getConfiguredModel('coverLetter');

  const systemPrompt = createCoverLetterSystemPrompt(request.coverLetterType || 'professional');
  const userPrompt = createCoverLetterUserPrompt(request);

  try {
    const result = await generateText({
      model,
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens: config.maxTokens,
      temperature: config.temperature,
    });

    return {
      content: result.text,
      metadata: {
        modelUsed: 'gpt-4o-mini', // This should match the actual model used
        tokensUsed: result.usage?.totalTokens,
        generationTime: Date.now() - startTime,
      },
    };
  } catch (error) {
    console.error('Error generating cover letter:', error);
    throw new Error('Failed to generate cover letter');
  }
}

// Stream cover letter generation
export async function streamCoverLetter(request: CoverLetterRequest) {
  const { model, config } = getConfiguredModel('coverLetter');

  const systemPrompt = createCoverLetterSystemPrompt(request.coverLetterType || 'professional');
  const userPrompt = createCoverLetterUserPrompt(request);

  return streamText({
    model,
    system: systemPrompt,
    prompt: userPrompt,
    maxTokens: config.maxTokens,
    temperature: config.temperature,
  });
}

// Analyze job description
export async function analyzeJobDescription(jobDescription: string) {
  const { model, config } = getConfiguredModel('analysis');

  const systemPrompt = `You are an expert job market analyst. Analyze the provided job description and extract:

1. Key requirements and qualifications
2. Important skills and technologies mentioned
3. Company culture indicators
4. Salary range (if mentioned)
5. Level of seniority required
6. Industry and role type
7. Keywords that should be included in a cover letter

Provide your analysis in a structured JSON format.`;

  try {
    const result = await generateText({
      model,
      system: systemPrompt,
      prompt: `Job Description:\n${jobDescription}`,
      maxTokens: config.maxTokens,
      temperature: config.temperature,
    });

    return result.text;
  } catch (error) {
    console.error('Error analyzing job description:', error);
    throw new Error('Failed to analyze job description');
  }
}

// Helper functions
function createCoverLetterSystemPrompt(type: string): string {
  const basePrompt = `You are an expert cover letter writer with years of experience in recruitment and career coaching.`;

  const typeSpecificPrompts = {
    professional: `Create a professional, polished cover letter that emphasizes achievements and qualifications.`,
    creative: `Create a creative, engaging cover letter that showcases personality while maintaining professionalism.`,
    technical: `Create a technical cover letter that highlights specific skills, technologies, and problem-solving abilities.`,
    executive: `Create an executive-level cover letter that emphasizes leadership, strategic thinking, and high-level achievements.`,
  };

  return `${basePrompt} ${typeSpecificPrompts[type as keyof typeof typeSpecificPrompts] || typeSpecificPrompts.professional}

Your cover letter should:
1. Have a compelling opening that grabs attention
2. Clearly connect the candidate's experience to the job requirements
3. Include specific examples and achievements
4. Use industry-appropriate keywords for ATS optimization
5. End with a strong call to action
6. Be concise but impactful (3-4 paragraphs)
7. Maintain a confident, professional tone

Format the response as a complete cover letter ready to send.`;
}

function createCoverLetterUserPrompt(request: CoverLetterRequest): string {
  let prompt = `Job Description:
${request.jobDescription}

Candidate Profile:
${request.userProfile}`;

  if (request.additionalInstructions) {
    prompt += `\n\nAdditional Instructions:
${request.additionalInstructions}`;
  }

  prompt += `\n\nPlease generate a tailored cover letter for this position.`;

  return prompt;
}

// Quick response for simple queries
export async function quickResponse(prompt: string, modelKey?: ModelKey) {
  const model = getModel(modelKey || 'gpt-3.5-turbo');

  try {
    const result = await generateText({
      model,
      prompt,
      maxTokens: 500,
      temperature: 0.5,
    });

    return result.text;
  } catch (error) {
    console.error('Error generating quick response:', error);
    throw new Error('Failed to generate response');
  }
}
