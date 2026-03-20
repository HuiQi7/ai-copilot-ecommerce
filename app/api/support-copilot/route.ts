import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@/lib/ai';

interface SupportCopilotRequest {
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SupportCopilotRequest = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'Missing or invalid message' },
        { status: 400 }
      );
    }

    const result = await aiClient.analyzeSupportMessage(message);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing support message:', error);
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
