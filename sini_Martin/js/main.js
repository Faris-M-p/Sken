/* -----------------------------------------------------------------
   ACROSS OCEANS, GUIDED BY FAITH - MAIN ENTRY POINT
   Initializes all modules on DOMContentLoaded
   ----------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  const audioEngine = window.audioEngine;
  const ScrollManager = window.ScrollManager;
  const CountdownTimer = window.CountdownTimer;
  const NavigationManager = window.NavigationManager;
  const GalleryManager = window.GalleryManager;
  const ParticleEngine = window.ParticleEngine;
  const MapRouteEngine = window.MapRouteEngine;

  // 1. Particle Canvas Initialization
  if (ParticleEngine) new ParticleEngine('particle-canvas');
  if (MapRouteEngine) new MapRouteEngine('map-canvas');

  // 2. Scroll Manager Initialization
  const scrollManager = ScrollManager ? new ScrollManager(audioEngine) : null;

  // 3. Countdown Timer (24 August 2026 11:00:00)
  if (CountdownTimer) new CountdownTimer('2026-08-24T11:00:00', '.countdown-grid');

  // 4. Navigation & Gallery Managers
  if (NavigationManager) new NavigationManager();
  if (GalleryManager) new GalleryManager();

  // 5. Audio Control Widget & "Tap to Begin" Unlocking
  const audioBtn = document.getElementById('audio-toggle-btn');
  const tapToBeginBtn = document.getElementById('tap-to-begin-btn');
  const beginStoryBtn = document.getElementById('begin-story-btn');

  if (tapToBeginBtn) {
    tapToBeginBtn.addEventListener('click', () => {
      if (audioEngine) audioEngine.startAudio();
      if (audioBtn) audioBtn.classList.add('playing');
      if (scrollManager) scrollManager.scrollToChapter('chapter-hero');
    });
  }

  if (beginStoryBtn) {
    beginStoryBtn.addEventListener('click', () => {
      if (scrollManager) scrollManager.scrollToChapter('chapter-journey');
    });
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (audioEngine) {
        const isNowPlaying = audioEngine.toggleSound();
        if (isNowPlaying) {
          audioBtn.classList.add('playing');
        } else {
          audioBtn.classList.remove('playing');
        }
      }
    });
  }
});

