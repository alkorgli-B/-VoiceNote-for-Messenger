'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MessagePreview from '@/components/MessagePreview';
import ToneSelector from '@/components/ToneSelector';
import { Copy, Send, ChevronRight, Loader2 } from 'lucide-react';

export default function ProcessPage() {
  const [messages, setMessages] = useState([]);
  const [originalMessages, setOriginalMessages] = useState([]);
  const [selectedTone, setSelectedTone] = useState('friendly');
  const [copied, setCopied] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('processedMessages');
    if (stored) {
      const parsed = JSON.parse(stored);
      setMessages(parsed);
      setOriginalMessages(parsed);
    } else {
      router.push('/');
    }
  }, [router]);

  const handleToneChange = async (tone: string) => {
    setSelectedTone(tone);
    setIsTransforming(true);

    try {
      const response = await fetch('/api/transform-tone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: originalMessages, tone }),
      });

      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error transforming tone:', error);
      setMessages(originalMessages);
    } finally {
      setIsTransforming(false);
    }
  };

  const copyAll = () => {
    const text = messages.map((m: any) => 
      `${m.emoji} ${m.topic}\n${m.text}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendToMessenger = () => {
    // Create shareable text
    const text = messages.map((m: any) => 
      `${m.emoji} *${m.topic}*\n${m.text}`
    ).join('\n\n');
    
    // Messenger share URL
    const messengerUrl = `fb-messenger://share?link=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
    
    // Try to open Messenger, fallback to copy
    window.location.href = messengerUrl;
    
    setTimeout(() => {
      copyAll();
      alert('تم نسخ الرسائل! الصقها في Messenger');
    }, 1000);
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

        {/* Tone Selector */}
        <div className="mb-6">
          <ToneSelector 
            onToneSelect={handleToneChange} 
            selectedTone={selectedTone}
          />
        </div>

        {/* Loading state during transformation */}
        {isTransforming && (
          <div className="card text-center mb-6">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-600">جاري تغيير الأسلوب...</p>
          </div>
        )}

        {/* Messages Preview */}
        <MessagePreview messages={messages} />

        {/* Actions */}
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
