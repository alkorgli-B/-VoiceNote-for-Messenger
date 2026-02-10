import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();
    
    // Use the real transcript from speech recognition
    const transcription = transcript || "النص غير متوفر";

    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      // Mock response for testing
      console.log('🔧 Running in mock mode (no API key)');
      console.log('📝 Transcript received:', transcription);
      
      return NextResponse.json({
        messages: [
          {
            emoji: "🎤",
            topic: "الرسالة الصوتية",
            text: transcription
          }
        ]
      });
    }

    // Real Groq API Call
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
5. إذا كان النص قصير أو موضوع واحد، اجعله رسالة واحدة فقط
6. رد بـ JSON فقط بهذا الشكل:
{
  "messages": [
    {"emoji": "🛒", "topic": "الموضوع", "text": "النص المنظم"}
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
    
    console.log('✅ AI Response:', content);
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : { 
      messages: [{
        emoji: "🎤",
        topic: "الرسالة",
        text: transcription
      }]
    };

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'فشلت المعالجة' },
      { status: 500 }
    );
  }
}
