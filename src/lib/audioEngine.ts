/**
 * Web Audio API Sound Synthesizer for 90s Mechanical & Radio FX
 * Synthesizes sound locally without relying on external audio files.
 */

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private tapeHissNode: AudioBufferSourceNode | null = null;
  private tapeHissGain: GainNode | null = null;
  private isHissPlaying = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Plastic cassette sliding out of wooden shelf slot sound
   */
  public playTapeSlide() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = 0.25;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + duration);
      filter.Q.setValueAtTime(2, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Door snapping shut sound when cassette is loaded into deck
   */
  public playDoorSnap() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // High plastic door latch click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);

      // Sharp snap
      const bufferSize = this.ctx.sampleRate * 0.03;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2200, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.6, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.03);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Heavy mechanical button press CLUNK sound (Play, Stop, Pause, FF, Rew)
   */
  public playButtonSnap() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      // Metallic thud (low freq sine + decay)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);
      
      oscGain.gain.setValueAtTime(0.7, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.08);

      // High plastic click (burst of high pass noise)
      const bufferSize = this.ctx.sampleRate * 0.04;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1800, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.04);
    } catch {
      // Ignore audio autoplay restrictions gracefully
    }
  }

  /**
   * Heavy Eject Pop sound when opening tape door
   */
  public playEjectPop() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Heavy Spring release pop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);

      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Clickable Pencil tape-winding ratchet whirr sound (HB Pencil interaction)
   */
  public playPencilWind() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const clicks = 5; // Rapid ratchet gear clicks

      for (let i = 0; i < clicks; i++) {
        const time = now + i * 0.05;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(850 + Math.random() * 150, time);

        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + 0.03);
      }
    } catch {
      // Audio fallback
    }
  }

  /**
   * Radio tuning static noise burst
   */
  public playRadioStatic(durationMs = 300, intensity = 0.3) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const durationSec = durationMs / 1000;
      const bufferSize = this.ctx.sampleRate * durationSec;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to simulate 90s shortwave/FM radio receiver static
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200 + Math.random() * 800, now);
      filter.Q.setValueAtTime(1.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(intensity, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + durationSec);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + durationSec);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Heavy brass toggle switch click (Mode Switch)
   */
  public playSwitchClick() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Metallic switch click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.06);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Continuous tape hiss background loop
   */
  public toggleTapeHiss(enable: boolean) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (enable && !this.isHissPlaying) {
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.015; // Low warmth hiss
        }

        this.tapeHissNode = this.ctx.createBufferSource();
        this.tapeHissNode.buffer = buffer;
        this.tapeHissNode.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3200, this.ctx.currentTime);

        this.tapeHissGain = this.ctx.createGain();
        this.tapeHissGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

        this.tapeHissNode.connect(filter);
        filter.connect(this.tapeHissGain);
        this.tapeHissGain.connect(this.ctx.destination);

        this.tapeHissNode.start();
        this.isHissPlaying = true;
      } else if (!enable && this.isHissPlaying && this.tapeHissNode) {
        this.tapeHissNode.stop();
        this.tapeHissNode.disconnect();
        this.isHissPlaying = false;
      }
    } catch {
      // Audio fallback
    }
  }
}

export const audioEngine = new SoundEffectsEngine();
