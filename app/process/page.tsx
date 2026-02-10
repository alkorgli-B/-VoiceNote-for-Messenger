'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MessagePreview from '@/components/MessagePreview';
import { Copy, Send, ChevronRight } from 'lucide-react';

export default function ProcessPage() {
  const [messages, setMessages] = useState([]);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('processedMessages');
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      router.push('/');
    }
  }, [router]);

  const copyAll = () => {
    const text = messages.map((m: any) => 
      `${m.emoji} ${m.topic}\n${m.text}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendToMessenger = () => {
    // TODO: Implement Messenger integration
    alert('قريباً! الآن انسخ واستخدم');
    copyAll();
  };

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">رسائلك جاهزة! ✨</h1>
        <p className="text-gray-600 text-center mb-8">
          {messages.length} رسالة منظمة ومرتبة
        </p>

        <MessagePreview messages={messages} />

        <div className="flex gap-4 mt-8">
          <button
            onClick={copyAll}
            className="flex-1 btn-primary bg-gray-600 hover:bg-gray-700 flex items-center justify-center gap-2"
          >
            {copied ? '✓ تم النسخ' : <><Copy className="w-5 h-5" /> نسخ الكل</>}
          </button>
          
          <button
            onClick={sendToMessenger}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            إرسال لـ Messenger
          </button>
        </div>

        <button
          onClick={() => router.push('/record')}
          className="w-full mt-4 text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2 py-3"
        >
          تسجيل رسالة جديدة
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
