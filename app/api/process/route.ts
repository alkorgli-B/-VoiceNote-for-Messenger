import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { audio } = await request.json();
    
    // Mock transcription for now
    const transcription = "هلا حبيبي، بقولك، أمس رحت السوق ولقيت الأسعار غالية مرة، بس المهم خلاص حجزت تذاكر السفر للأسبوع الجاي، آه صحيح نسيت أقولك اجتماع الخميس انلغى، وبعدين لازم نتقابل نحكي عن المشروع الجديد";

    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      // Mock response
      return NextResponse.json({
        messages: [
          { emoji: "🛒", topic: "السوق", text: "رحت السوق أمس ولقيت الأسعار غالية جداً" },
          { emoji: "✈️", topic: "السفر", text: "حجزت تذاكر السفر للأسبوع الجاي، كل شي جاهز" },
          { emoji: "📅", topic: "الاجتماع", text: "اجتماع الخميس انلغى" },
          { emoji: "💼", topic: "المشروع", text: "لازم نتقابل نحكي عن المشروع الجديد" }
        ]
      });
    }

    // Groq API Call
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
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

JSON فقط، بدون أي نص آخر:`
        }],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '{}';
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
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
