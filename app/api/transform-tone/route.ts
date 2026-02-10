import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const mockTransformations: Record<string, any> = {
  friendly: {
    emoji: "🛒",
    topic: "السوق",
    text: "يا رجال، رحت السوق أمس والله غالي مرة! 😅"
  },
  professional: {
    emoji: "🛒",
    topic: "السوق",
    text: "تمت زيارة السوق أمس، ولوحظ ارتفاع ملحوظ في الأسعار."
  },
  formal: {
    emoji: "🛒",
    topic: "السوق",
    text: "أود إعلامكم بأنني قمت بزيارة السوق أمس، وقد لاحظت ارتفاعاً كبيراً في الأسعار."
  },
  casual: {
    emoji: "🛒",
    topic: "السوق",
    text: "رحت السوق أمس، غالي شوي بس عادي 😊"
  }
};

export async function POST(request: NextRequest) {
  try {
    const { messages, tone } = await request.json();
    
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      // Mock transformation
      console.log('🔧 Running tone transform in mock mode');
      const transformed = messages.map((msg: any, idx: number) => {
        const mock = mockTransformations[tone];
        return {
          ...msg,
          text: mock ? mock.text : msg.text
        };
      });
      return NextResponse.json({ messages: transformed });
    }

    // Real transformation
    const anthropic = new Anthropic({ apiKey });
    
    const tonePrompts: Record<string, string> = {
      friendly: 'ودّي وحميمي، استخدم تعبيرات ودية',
      professional: 'احترافي ومحترم، استخدم لغة رسمية',
      formal: 'رسمي جداً، للمراسلات الرسمية',
      casual: 'عفوي وبسيط، كأنك تتكلم مع صديق',
    };

    const prompt = tonePrompts[tone] || tonePrompts.friendly;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `أعد صياغة هذه الرسائل بأسلوب ${prompt}:

${JSON.stringify(messages, null, 2)}

احتفظ بنفس البنية JSON، فقط غيّر النصوص. رد بـ JSON array فقط:`,
      }],
    });

    const responseText = response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';
    
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    const transformedMessages = jsonMatch ? JSON.parse(jsonMatch[0]) : messages;
    
    return NextResponse.json({ messages: transformedMessages });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'فشل تغيير الأسلوب' },
      { status: 500 }
    );
  }
}
