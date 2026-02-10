'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '@/lib/sound-effects';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

export default function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const startRecording = async () => {
    soundManager.play('click');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
          animationRef.current = requestAnimationFrame(updateLevel);
        }
      };
      updateLevel();

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        soundManager.play('success');
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('خطأ في الوصول للميكروفون:', error);
      alert('الرجاء السماح بالوصول للميكروفون');
    }
  };

  const stopRecording = () => {
    soundManager.play('click');
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingTime(0);
      setAudioLevel(0);
    }
  };

  const toggleSound = () => {
    const enabled = soundManager.toggle();
    setSoundEnabled(enabled);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card text-center relative">
      {/* Sound Toggle */}
      <button
        onClick={toggleSound}
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        title={soundEnabled ? 'إيقاف الأصوات' : 'تشغيل الأصوات'}
      >
        {soundEnabled ? (
          <Volume2 className="w-5 h-5 text-gray-600" />
        ) : (
          <VolumeX className="w-5 h-5 text-gray-400" />
        )}
      </button>

      <h2 className="text-2xl font-bold mb-6">سجل رسالتك الصوتية</h2>
      
      {/* Visualizer with Pulse Animation */}
      <div className="relative w-48 h-48 mx-auto mb-8">
        {/* Outer pulse */}
        <div 
          className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 ${
            isRecording ? 'animate-ping' : ''
          }`}
          style={{
            transform: `scale(${1 + (audioLevel / 255) * 0.5})`,
            transition: 'transform 0.1s ease-out'
          }}
        />
        
        {/* Middle pulse */}
        <div 
          className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-40"
          style={{
            transform: `scale(${1 + (audioLevel / 255) * 0.3})`,
            transition: 'transform 0.1s ease-out'
          }}
        />
        
        {/* Record Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`absolute inset-8 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-2xl'
          }`}
        >
          {isRecording ? (
            <Square className="w-12 h-12 text-white" fill="white" />
          ) : (
            <Mic className="w-12 h-12 text-white" />
          )}
        </button>
      </div>

      {/* Timer */}
      {isRecording && (
        <div className="text-3xl font-mono font-bold text-red-600 mb-4 animate-pulse">
          ⏺ {formatTime(recordingTime)}
        </div>
      )}

      {/* Instructions */}
      <p className="text-gray-600 animate-fade-in">
        {isRecording 
          ? '🎤 تكلم براحتك... اضغط المربع للإيقاف'
          : '👆 اضغط الميكروفون للبدء'}
      </p>
    </div>
  );
}
