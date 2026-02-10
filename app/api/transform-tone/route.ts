import { NextRequest, NextResponse } from 'next/server';
import { transformTone } from '@/lib/tone-transformer';

export async function POST(request: NextRequest) {
  try {
    const { messages, tone } = await request.json();
    
    const transformedMessages = await transformTone(messages, tone);
    
    return NextResponse.json({ messages: transformedMessages });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'فشل تغيير الأسلوب' },
      { status: 500 }
    );
  }
}
