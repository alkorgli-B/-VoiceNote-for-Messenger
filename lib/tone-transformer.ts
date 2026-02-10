import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface Message {
  emoji: string;
  topic: string;
  text: string;
}

export async function transformTone(
  messages: Message[], 
  tone: string
): Promise<Message[]> {
  const tonePrompts = {
    friendly: 'ودّي وحميمي، استخدم تعبيرات ودية',
    professional: 'احترافي ومحترم، استخدم لغة رسمية',
    formal: 'رسمي جداً، للمراسلات الرسمية',
    casual: 'عفوي وبسيط، كأنك تتكلم مع صديق',
  };

  const prompt = tonePrompts[tone as keyof typeof tonePrompts] || tonePrompts.friendly;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `أعد صياغة هذه الرسائل بأسلوب ${prompt}:

${JSON.stringify(messages, null, 2)}

احتفظ بنفس البنية JSON، فقط غيّر النصوص:`,
    }],
  });

  const responseText = response.content[0].type === 'text' 
    ? response.content[0].text 
    : '';
  
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : messages;
}
