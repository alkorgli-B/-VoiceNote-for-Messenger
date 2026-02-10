// Voice to Text using Web Speech API (fallback) or Whisper API

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  // Option 1: Web Speech API (works in browser, free but limited)
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    return transcribeWithWebSpeech(audioBlob);
  }
  
  // Option 2: OpenAI Whisper API (better quality, costs money)
  // return transcribeWithWhisper(audioBlob);
  
  // Fallback: placeholder
  return "النص المستخرج من الصوت سيظهر هنا";
}

async function transcribeWithWebSpeech(audioBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      reject('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA'; // Arabic
    recognition.continuous = true;
    recognition.interimResults = false;

    let finalTranscript = '';

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
    };

    recognition.onerror = (event: any) => {
      reject(event.error);
    };

    recognition.onend = () => {
      resolve(finalTranscript.trim());
    };

    // Play audio to trigger recognition
    const audio = new Audio(URL.createObjectURL(audioBlob));
    audio.onplay = () => recognition.start();
    audio.play();
  });
}

// Optional: Whisper API implementation
async function transcribeWithWhisper(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-1');
  formData.append('language', 'ar');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data.text;
}
