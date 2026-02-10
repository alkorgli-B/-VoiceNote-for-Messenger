'use client';

interface Message {
  emoji: string;
  topic: string;
  text: string;
}

interface MessagePreviewProps {
  messages: Message[];
}

export default function MessagePreview({ messages }: MessagePreviewProps) {
  return (
    <div className="space-y-4">
      {messages.map((msg, index) => (
        <div 
          key={index}
          className="card hover:shadow-2xl transition-all duration-300 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start gap-3">
            <span className="text-4xl">{msg.emoji}</span>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                {msg.topic}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {msg.text}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
