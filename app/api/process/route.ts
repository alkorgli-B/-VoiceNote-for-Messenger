import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  try {
    const { audio } = await request.json();
    
    // Simulate transcription (replace with real Whisper API later)
    const transcription = "هلا حبيبي، بقولك، أمس رحت السوق ولقيت الأسعار غالية مرة، بس المهم خلاص حجزت تذاكر السفر للأسبوع الجاي، آه صحيح نسيت أقولك اجتماع الخميس انلغى، وبعدين لازم نتقابل نحكي عن المشروع الجديد";

    // Check if API key exists (for Vercel deployment)
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      // Mock response for testing without API key
      console.log('🔧 Running in mock mode (no API key)');
      return NextResponse.json({
        messages: [
          {
            emoji: "🛒",
            topic: "السوق",
            text: "رحت السوق أمس ولقيت الأسعار غالية جداً"
          },
          {
            emoji: "✈️",
            topic: "السفر",
            text: "حجزت تذاكر السفر للأسبوع الجاي، كل شي جاهز"
          },
          {
            emoji: "📅",
            topic: "الاجتماع",
            text: "اجتماع الخميس انلغى"
          },
          {
            emoji: "💼",
            topic: "المشروع",
            text: "لازم نتقابل نحكي عن المشروع الجديد"
          }
        ]
      });
    }

    // Real API call when key exists
    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `أنت مساعد ذكي متخصص في تنظيم الرسائل الصوتية.

المهمة: حول هذا النص الصوتي إلى رسائل منفصلة منظمة.

النص:
"${transcription}"

التعليمات:
1. افصل المواضيع المختلفة
2. كل موضوع = رسالة منفصلة
3. أضف emoji مناسب لكل رسالة
4. اجعل الصياغة واضحة ومختصرة
5. رد بـ JSON فقط بهذا الشكل:
{
  "messages": [
    {"emoji": "🛒", "topic": "السوق", "text": "..."},
    {"emoji": "✈️", "topic": "السفر", "text": "..."}
  ]
}

JSON فقط، بدون أي نص آخر:`,
      }],
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : { messages: [] };

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'فشلت المعالجة' },
      { status: 500 }
    );
  }
}
