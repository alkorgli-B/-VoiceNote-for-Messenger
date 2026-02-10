import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { audio } = await request.json();
    
    // TODO: Convert audio to text using Whisper or Web Speech API
    // For now, simulating with placeholder
    const transcription = "هلا حبيبي، بقولك، أمس رحت السوق ولقيت الأسعار غالية مرة، بس المهم خلاص حجزت تذاكر السفر للأسبوع الجاي، آه صحيح نسيت أقولك اجتماع الخميس انلغى، وبعدين لازم نتقابل نحكي عن المشروع الجديد";

    // Process with Claude
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
