'use client';

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  play(soundName: string) {
    switch (soundName) {
      case 'click':
        this.playTone(800, 0.1, 'sine');
        break;
      case 'success':
        this.playTone(523, 0.15, 'sine');
        setTimeout(() => this.playTone(659, 0.15, 'sine'), 100);
        setTimeout(() => this.playTone(784, 0.2, 'sine'), 200);
        break;
      case 'processing':
        this.playTone(440, 0.2, 'triangle');
        break;
      case 'notification':
        this.playTone(880, 0.1, 'sine');
        setTimeout(() => this.playTone(1047, 0.15, 'sine'), 100);
        break;
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

export const soundManager = new SoundManager();
