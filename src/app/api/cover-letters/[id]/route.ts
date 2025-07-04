import { NextRequest, NextResponse } from 'next/server';
import { getCoverLetterById, sql } from '@/lib/neon';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Get user ID from session (authentication middleware would handle this)
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const coverLetter = await getCoverLetterById(id);

    if (!coverLetter) {
      return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 });
    }

    // Check if user owns this cover letter
    if (coverLetter.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error('Error fetching cover letter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Get user ID from session (authentication middleware would handle this)
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if cover letter exists and user owns it
    const coverLetter = await getCoverLetterById(id);

    if (!coverLetter) {
      return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 });
    }

    if (coverLetter.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete cover letter
    await sql`DELETE FROM cover_letters WHERE id = ${id}`;

    return NextResponse.json({ message: 'Cover letter deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting cover letter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
