/* -----------------------------------------------------------------
   ACROSS OCEANS, GUIDED BY FAITH - WEB AUDIO SYNTHESIZER ENGINE
   Generates rich ambient soundscapes directly in the browser:
   - Resonant Cathedral Church Bells
   - Gentle Ocean Wave Pink Noise Engine
   - Romantic Piano Chord Harmonics
   - Soft Choir/String Pads
   ----------------------------------------------------------------- */

class WebAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlaying = false;
    this.masterGain = null;
    this.oceanGain = null;
    this.oceanFilter = null;
    this.currentChapter = 1;
    this.chordInterval = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master Gain Node
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Setup Ocean Wave Noise Generator
    this.setupOceanWaves();
  }

  // --- OCEAN WAVE GENERATOR ---
  setupOceanWaves() {
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Pink noise generation
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      let white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    this.oceanFilter = this.ctx.createBiquadFilter();
    this.oceanFilter.type = 'lowpass';
    this.oceanFilter.frequency.setValueAtTime(400, this.ctx.currentTime);

    this.oceanGain = this.ctx.createGain();
    this.oceanGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    whiteNoise.connect(this.oceanFilter);
    this.oceanFilter.connect(this.oceanGain);
    this.oceanGain.connect(this.masterGain);

    whiteNoise.start();

    // Ocean Swell LFO Modulation
    this.modulateOceanWaves();
  }

  modulateOceanWaves() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Slow swell over 6 seconds
    this.oceanFilter.frequency.linearRampToValueAtTime(800, now + 3);
    this.oceanGain.gain.linearRampToValueAtTime(0.25, now + 3);
    this.oceanFilter.frequency.linearRampToValueAtTime(300, now + 7);
    this.oceanGain.gain.linearRampToValueAtTime(0.08, now + 7);

    setTimeout(() => {
      if (this.isPlaying) this.modulateOceanWaves();
    }, 7000);
  }

  // --- CHURCH BELL SYNTHESIZER ---
  playChurchBell(pitch = 220) {
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, now);
    // Strike overtone
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(pitch, now + 0.4);

    bellGain.gain.setValueAtTime(0.6, now);
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);

    osc.connect(bellGain);
    bellGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 4.5);
  }

  // --- SOFT PIANO CHORD SYNTHESIZER ---
  playPianoNote(freq, delay = 0, duration = 3) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime + delay;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 1.002, now); // subtle warmth detune

    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.2, now + 0.05); // attack
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  playPianoChord(frequencies) {
    frequencies.forEach((freq, index) => {
      this.playPianoNote(freq, index * 0.12, 4);
    });
  }

  startAmbientProgression() {
    // Chords: Cmaj7 -> G/B -> Am7 -> Fmaj7
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [246.94, 293.66, 392.00, 440.00], // G/B
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 261.63, 329.63, 392.00]  // Fmaj7
    ];

    let chordIdx = 0;
    this.playPianoChord(chords[0]);

    this.chordInterval = setInterval(() => {
      if (this.isPlaying && !this.isMuted) {
        chordIdx = (chordIdx + 1) % chords.length;
        this.playPianoChord(chords[chordIdx]);
      }
    }, 6000);
  }

  toggleSound() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    } else {
      this.masterGain.gain.setTargetAtTime(0.5, this.ctx.currentTime, 0.1);
    }
    return !this.isMuted;
  }

  startAudio() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.playChurchBell(220);
    this.startAmbientProgression();
  }
}

window.WebAudioEngine = WebAudioEngine;
window.audioEngine = new WebAudioEngine();

