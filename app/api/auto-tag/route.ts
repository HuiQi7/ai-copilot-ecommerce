import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@/lib/ai';

interface AutoTagRequest {
  review: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AutoTagRequest = await request.json();
    const { review } = body;

    if (!review || typeof review !== 'string' || review.trim() === '') {
      return NextResponse.json(
        { error: 'Missing or invalid review' },
        { status: 400 }
      );
    }

    const tags = await aiClient.tagReview(review);

    return NextResponse.json({ tags });
  } catch (error) {
    console.error('Error tagging review:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
