'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VoiceRecorder from '@/components/VoiceRecorder';
import { Loader2 } from 'lucide-react';

export default function RecordPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        // Send to API
        const response = await fetch('/api/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64Audio }),
        });

        const data = await response.json();
        
        // Store in session/localStorage
        sessionStorage.setItem('processedMessages', JSON.stringify(data.messages));
        
        // Navigate to preview
        router.push('/process');
      };
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
