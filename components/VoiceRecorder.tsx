'use client';

import { useState, useRef } from 'react';
import { Mic, Square, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '@/lib/sound-effects';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, transcript: string) => void;
}

export default function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [transcript, setTranscript] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  const startRecording = async () => {
    soundManager.play('click');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Audio visualization
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

      // Media Recorder for audio
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        soundManager.play('success');
        
        // Pass both audio blob and transcript
        onRecordingComplete(audioBlob, transcript);
        
        stream.getTracks().forEach(track => track.stop());
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };

      mediaRecorder.start();

      // Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || 
                               (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ar-SA'; // Arabic
        recognition.continuous = true;
        recognition.interimResults = true;

        let finalTranscript = '';

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPiece = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
              finalTranscript += transcriptPiece + ' ';
            } else {
              interimTranscript += transcriptPiece;
            }
          }
          
          setTranscript(finalTranscript + interimTranscript);
        };

        recognition.onerror = (event: any) => {
          console.log('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
          console.log('Speech recognition ended');
        };

        recognition.start();
        recognitionRef.current = recognition;
      } else {
        console.warn('Speech Recognition not supported');
        setTranscript('التعرف على الصوت غير مدعوم في هذا المتصفح');
      }

      setIsRecording(true);
      
      // Timer
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
      
      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
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
      
      {/* Visualizer */}
      <div className="relative w-48 h-48 mx-auto mb-8">
        <div 
          className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 ${
            isRecording ? 'animate-ping' : ''
          }`}
          style={{
            transform: `scale(${1 + (audioLevel / 255) * 0.5})`,
            transition: 'transform 0.1s ease-out'
          }}
        />
        
        <div 
          className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-40"
          style={{
            transform: `scale(${1 + (audioLevel / 255) * 0.3})`,
            transition: 'transform 0.1s ease-out'
          }}
        />
        
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

      {/* Live Transcript */}
      {isRecording && transcript && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200 max-h-32 overflow-y-auto">
          <p className="text-sm text-gray-700 text-right leading-relaxed">
            {transcript}
          </p>
        </div>
      )}

      {/* Instructions */}
      <p className="text-gray-600 animate-fade-in">
        {isRecording 
          ? '🎤 تكلم براحتك... اضغط المربع للإيقاف'
          : '👆 اضغط الميكروفون للبدء'}
      </p>
      
      {!isRecording && (
        <p className="text-xs text-gray-500 mt-2">
          يعمل بشكل أفضل في Chrome/Edge على الموبايل
        </p>
      )}
    </div>
  );
}
