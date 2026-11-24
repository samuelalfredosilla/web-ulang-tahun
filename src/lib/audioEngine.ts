// Warm Web Audio API music-box synthesizer for reliable offline/sandbox birthday playback,
// with optional custom MP3 URL support and graceful fallback.

interface MelodyNote {
  freq: number;
  duration: number;
  harmony?: number;
}

const HAPPY_BIRTHDAY_MELODY: MelodyNote[] = [
  // "Happy birthday to you"
  { freq: 392.0, duration: 0.36, harmony: 261.63 },
  { freq: 392.0, duration: 0.22 },
  { freq: 440.0, duration: 0.54, harmony: 261.63 },
  { freq: 392.0, duration: 0.54, harmony: 329.63 },
  { freq: 523.25, duration: 0.54, harmony: 329.63 },
  { freq: 493.88, duration: 1.0, harmony: 293.66 },

  // "Happy birthday to you"
  { freq: 392.0, duration: 0.36, harmony: 246.94 },
  { freq: 392.0, duration: 0.22 },
  { freq: 440.0, duration: 0.54, harmony: 246.94 },
  { freq: 392.0, duration: 0.54, harmony: 293.66 },
  { freq: 587.33, duration: 0.54, harmony: 293.66 },
  { freq: 523.25, duration: 1.0, harmony: 261.63 },

  // "Happy birthday dear..."
  { freq: 392.0, duration: 0.36, harmony: 261.63 },
  { freq: 392.0, duration: 0.22 },
  { freq: 783.99, duration: 0.54, harmony: 329.63 },
  { freq: 659.25, duration: 0.54, harmony: 329.63 },
  { freq: 523.25, duration: 0.54, harmony: 349.23 },
  { freq: 493.88, duration: 0.54, harmony: 293.66 },
  { freq: 440.0, duration: 0.95, harmony: 261.63 },

  // "Happy birthday to you"
  { freq: 698.46, duration: 0.36, harmony: 349.23 },
  { freq: 698.46, duration: 0.22 },
  { freq: 659.25, duration: 0.54, harmony: 329.63 },
  { freq: 523.25, duration: 0.54, harmony: 261.63 },
  { freq: 587.33, duration: 0.54, harmony: 293.66 },
  { freq: 523.25, duration: 1.35, harmony: 261.63 },
];

export class BirthdayAudioPlayer {
  private ctx: AudioContext | null = null;
  private loopTimer: number | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private isPlaying = false;

  private playTone(freq: number, startTime: number, duration: number, gainPeak: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const overtone = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, startTime);

    const overtoneGain = this.ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.14, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(gainPeak, startTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 1.15);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    overtone.start(startTime);
    osc.stop(startTime + duration * 1.2);
    overtone.stop(startTime + duration * 1.2);
  }

  private scheduleMelodyLoop() {
    if (!this.ctx || !this.isPlaying) return;
    let cursor = this.ctx.currentTime + 0.06;

    for (const note of HAPPY_BIRTHDAY_MELODY) {
      this.playTone(note.freq, cursor, note.duration, 0.14);
      if (note.harmony) {
        this.playTone(note.harmony, cursor, note.duration * 1.3, 0.055);
      }
      cursor += note.duration;
    }

    const totalMs = Math.round((cursor - this.ctx.currentTime + 0.6) * 1000);
    this.loopTimer = window.setTimeout(() => {
      this.scheduleMelodyLoop();
    }, totalMs);
  }

  async start(source: 'melody' | 'custom_url', customUrl?: string): Promise<void> {
    this.stop();
    this.isPlaying = true;

    if (source === 'custom_url' && customUrl) {
      try {
        const el = new Audio(customUrl);
        el.loop = true;
        el.volume = 0.65;
        this.audioEl = el;
        await el.play();
        return;
      } catch {
        // Fallback gracefully to built-in Web Audio melody if external URL cannot play
        this.audioEl = null;
      }
    }

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    this.scheduleMelodyLoop();
  }

  stop(): void {
    this.isPlaying = false;
    if (this.loopTimer !== null) {
      window.clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
      this.audioEl = null;
    }
    if (this.ctx && this.ctx.state === 'running') {
      void this.ctx.suspend();
    }
  }

  dispose(): void {
    this.stop();
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
  }
}
