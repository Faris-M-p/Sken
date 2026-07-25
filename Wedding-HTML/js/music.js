/**
 * Music & Sound Controller
 * Synthesizes church bell chime via Web Audio API and controls background wedding song.
 * Uses global scope window.WeddingMusic to work natively over file:// protocol.
 */

(function () {
  let audioCtx = null;
  let bgAudio = null;
  let isPlaying = false;
  const listeners = new Set();

  function getAudioContext() {
    if (typeof window === 'undefined') return null;
    try {
      if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) audioCtx = new AC();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    } catch (e) {
      return null;
    }
  }

  /** Synthesize a soft, decaying church bell strike */
  function strikeBell(freq, at, gain, dur) {
    gain = gain || 0.14;
    dur = dur || 3;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const partial = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = 'sine';
    partial.type = 'sine';
    osc.frequency.value = freq;
    partial.frequency.value = freq * 2.76; // inharmonic partial for realistic bell timbre

    const startTime = ctx.currentTime + at;
    g.gain.setValueAtTime(0.0001, startTime);
    g.gain.exponentialRampToValueAtTime(gain, startTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

    osc.connect(g);
    partial.connect(g);
    g.connect(ctx.destination);

    osc.start(startTime);
    partial.start(startTime);
    osc.stop(startTime + dur);
    partial.stop(startTime + dur);
  }

  /** Play two gentle church-bell tolls */
  function playBells() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    strikeBell(523.25, 0, 0.12, 3);   // C5 note
    strikeBell(392.00, 0.55, 0.1, 3); // G4 note
  }

  /** Initialize background audio element */
  function ensureAudio() {
    if (typeof window === 'undefined') return null;
    if (!bgAudio) {
      bgAudio = new Audio('assets/audio/wedding-song.mp3');
      bgAudio.loop = true;
      bgAudio.preload = 'auto';
      bgAudio.volume = 0.55;

      bgAudio.addEventListener('play', function () { emitState(true); });
      bgAudio.addEventListener('pause', function () { emitState(false); });
      bgAudio.addEventListener('ended', function () { emitState(false); });
    }
    return bgAudio;
  }

  function emitState(state) {
    isPlaying = state;
    listeners.forEach(function (fn) { fn(state); });
  }

  function playSong() {
    const audio = ensureAudio();
    if (!audio) return;
    audio.play().catch(function () {
      /* Auto-play prevented by browser policy */
    });
  }

  function pauseSong() {
    if (bgAudio) bgAudio.pause();
  }

  function toggleSong() {
    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  }

  function isSongPlaying() {
    return isPlaying;
  }

  function subscribeSongState(callback) {
    listeners.add(callback);
    return function () { listeners.delete(callback); };
  }

  window.WeddingMusic = {
    playBells: playBells,
    playSong: playSong,
    pauseSong: pauseSong,
    toggleSong: toggleSong,
    isSongPlaying: isSongPlaying,
    subscribeSongState: subscribeSongState
  };
})();
