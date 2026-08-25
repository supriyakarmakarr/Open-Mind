/**
 * DESIGN FOR AN OPEN MIND — PROCEDURAL AUDIO SYNTHESIZER
 * Generates ambient neural brainwave drone and synaptic feedback.
 */
class NeuralAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.lfo = null;
    this.lfoGain = null;
    this.filter = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Low-pass Filter
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(180, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(4.0, this.ctx.currentTime);
      this.filter.connect(this.masterGain);

      // Drone Oscillator 1 (Binaural Alpha frequency ~110Hz)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(110, this.ctx.currentTime);

      // Drone Oscillator 2 (Slightly detuned ~114Hz for slow 4Hz alpha pulse)
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(114, this.ctx.currentTime);

      // LFO for organic breathing filter modulation
      this.lfo = this.ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // ~8 sec breath cycle

      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(60, this.ctx.currentTime);

      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.filter.frequency);

      // Connect drone voices
      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.droneOsc1.connect(droneGain);
      this.droneOsc2.connect(droneGain);
      droneGain.connect(this.filter);

      this.droneOsc1.start();
      this.droneOsc2.start();
      this.lfo.start();

      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio API not supported or blocked", e);
    }
  }

  toggle() {
    if (!this.initialized) {
      this.init();
    }
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.masterGain.gain.linearRampToValueAtTime(0.0, this.ctx.currentTime + 0.6);
      this.isPlaying = false;
    } else {
      this.masterGain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 1.2);
      this.isPlaying = true;
      this.playSynapseSpark(440, 0.2);
    }
    return this.isPlaying;
  }

  playSynapseSpark(freq = 520, duration = 0.15) {
    if (!this.initialized || !this.isPlaying || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.6, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  }

  playBreakImpact() {
    if (!this.initialized || !this.isPlaying || !this.ctx) return;
    try {
      // Sub boom
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, this.ctx.currentTime);
      subOsc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.8);

      subGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start();
      subOsc.stop(this.ctx.currentTime + 1.2);
    } catch(e) {}
  }
}

window.neuralAudio = new NeuralAudioEngine();
