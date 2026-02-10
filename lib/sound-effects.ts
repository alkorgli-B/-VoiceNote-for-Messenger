'use client';

class SoundManager {
  private sounds: Record<string, HTMLAudioElement> = {};
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadSounds();
    }
  }

  private loadSounds() {
    const soundFiles = {
      click: '/sounds/click.mp3',
      success: '/sounds/success.mp3',
      processing: '/sounds/processing.mp3',
      notification: '/sounds/notification.mp3',
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.volume = 0.3; // 30% volume
      this.sounds[key] = audio;
    });
  }

  play(soundName: keyof typeof this.sounds) {
    if (!this.enabled) return;
    
    try {
      const sound = this.sounds[soundName];
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Sound play failed:', e));
      }
    } catch (error) {
      console.log('Sound error:', error);
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
