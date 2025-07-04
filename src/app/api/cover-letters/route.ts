import { NextRequest, NextResponse } from 'next/server';
import { getCoverLettersByUserId, saveCoverLetter } from '@/lib/neon';

export async function GET(req: NextRequest) {
  try {
    // Get user ID from session (authentication middleware would handle this)
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const coverLetters = await getCoverLettersByUserId(userId);

    return NextResponse.json({
      coverLetters,
      total: coverLetters.length,
    });
  } catch (error) {
    console.error('Error fetching cover letters:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get user ID from session (authentication middleware would handle this)
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      title,
      content,
      jobDescription,
      userProfile,
      coverLetterType = 'professional',
      modelUsed,
      tokensUsed,
      generationTime,
    } = await req.json();

    // Basic validation
    if (!title || !content || !jobDescription || !userProfile || !modelUsed || !generationTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save cover letter
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

    return NextResponse.json(
      {
        coverLetter,
        message: 'Cover letter saved successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving cover letter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
