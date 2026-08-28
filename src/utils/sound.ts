// Web Audio API Ringtone & Chime Sound Synthesizer (100% Offline, Zero External Dependencies)

class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play a pleasant double-chime sound for new orders & general notifications
  public playChimeSound() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Note 1: E5 (659.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      // Note 2: B5 (987.77 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.12);
      gain2.gain.setValueAtTime(0.2, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn('Audio chime play note:', e);
    }
  }

  // Play a high-priority 3-pulse emergency siren for SOS rescue alerts & messages
  public playEmergencySOSRing() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const pulses = [0, 0.18, 0.36];

      pulses.forEach((startTime) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now + startTime); // A5
        osc.frequency.exponentialRampToValueAtTime(1320, now + startTime + 0.12); // E6
        
        gain.gain.setValueAtTime(0.3, now + startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, now + startTime + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + startTime);
        osc.stop(now + startTime + 0.16);
      });
    } catch (e) {
      console.warn('Emergency SOS sound play note:', e);
    }
  }
}

export const soundEngine = new SoundEngine();
