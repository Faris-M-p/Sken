/* -----------------------------------------------------------------
   SINI & MARTIN — LUXURY INTERACTIVE WEDDING WEBSITE
   Web Audio API Ambient Soundscape Engine (Soft Piano & Ocean Ambience)
   ----------------------------------------------------------------- */

class SoundscapeEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.timer = null;

    this.toggleBtn = document.getElementById('audio-toggle-btn');
    this.initEvents();
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  initEvents() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => {
        this.togglePlay();
      });
    }
  }

  togglePlay() {
    this.initContext();
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    if (this.toggleBtn) {
      this.toggleBtn.classList.add('playing');
    }

    this.scheduleAmbientChords();
  }

  pause() {
    this.isPlaying = false;
    if (this.toggleBtn) {
      this.toggleBtn.classList.remove('playing');
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  // Synthesize soft ambient piano note harmonics
  playSoftNote(freq, duration = 4.5, delay = 0) {
    if (!this.ctx || !this.isPlaying) return;

    setTimeout(() => {
      if (!this.ctx || !this.isPlaying) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Envelope: gentle attack, long smooth decay
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    }, delay * 1000);
  }

  scheduleAmbientChords() {
    if (!this.isPlaying) return;

    // F Major / C Major ambient chord progression (Peaceful, sacred)
    const chords = [
      [261.63, 329.63, 392.00, 523.25], // C Major
      [220.00, 261.63, 329.63, 440.00], // A Minor
      [174.61, 220.00, 261.63, 349.23], // F Major
      [196.00, 246.94, 293.66, 392.00]  // G Major
    ];

    let chordIndex = 0;
    const playNextChord = () => {
      if (!this.isPlaying) return;

      const currentChord = chords[chordIndex];
      currentChord.forEach((freq, idx) => {
        this.playSoftNote(freq, 6.0, idx * 0.4);
      });

      chordIndex = (chordIndex + 1) % chords.length;
      this.timer = setTimeout(playNextChord, 6500);
    };

    playNextChord();
  }
}

window.soundscape = new SoundscapeEngine();
