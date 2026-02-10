'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VoiceRecorder from '@/components/VoiceRecorder';
import { Loader2 } from 'lucide-react';

export default function RecordPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleRecordingComplete = async (audioBlob: Blob, transcript: string) => {
    setIsProcessing(true);
    
    try {
      // Send transcript to API for processing
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript: transcript || "لم يتم التعرف على الصوت بشكل صحيح"
        }),
      });

      const data = await response.json();
      
      // Store in sessionStorage
      sessionStorage.setItem('processedMessages', JSON.stringify(data.messages));
      sessionStorage.setItem('originalTranscript', transcript);
      
      // Navigate to preview
      router.push('/process');
    } catch (error) {
      console.error('خطأ في المعالجة:', error);
      alert('حدث خطأ، حاول مرة أخرى');
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">جاري المعالجة...</h2>
          <p className="text-gray-600">AI يحلل رسالتك ويرتبها</p>
          <div className="mt-4 text-sm text-gray-500">
            هذا قد يستغرق بضع ثوانٍ...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
      </div>
    </div>
  );
}
