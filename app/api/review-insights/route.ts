import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@/lib/ai';

interface ReviewInsightsRequest {
  reviews: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ReviewInsightsRequest = await request.json();
    const { reviews } = body;

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid reviews' },
        { status: 400 }
      );
    }

    const insights = await aiClient.analyzeReviews(reviews);

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error analyzing reviews:', error);
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
