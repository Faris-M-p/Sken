/**
 * Navigation & Door Intro Controller
 * Handles 3D door opening ceremony, body scroll lock, and floating music player UI.
 */

(function () {
  function initNavigation() {
    const doorIntro = document.getElementById('door-intro');
    const btnOpenDoor = document.getElementById('btn-open-door');
    const musicBtn = document.getElementById('music-player-btn');
    const musicLabel = document.getElementById('music-hover-text');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');

    // Lock scroll while doors are active
    if (doorIntro && !doorIntro.classList.contains('hidden')) {
      document.body.style.overflow = 'hidden';
    }

    function openDoors() {
      if (!doorIntro || doorIntro.classList.contains('opening')) return;

      doorIntro.classList.add('opening');
      if (window.WeddingMusic) {
        window.WeddingMusic.playBells();
        window.WeddingMusic.playSong();
      }

      // Fade away door intro container after animation completes
      setTimeout(function () {
        doorIntro.classList.add('hidden');
        document.body.style.overflow = '';
      }, 1800);
    }

    if (btnOpenDoor) {
      btnOpenDoor.addEventListener('click', openDoors);
    }

    // Keyboard navigation (Enter / Escape keys to open doors)
    window.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === 'Escape') && doorIntro && !doorIntro.classList.contains('opening') && !doorIntro.classList.contains('hidden')) {
        openDoors();
      }
    });

    // Music Player button listener
    if (musicBtn && window.WeddingMusic) {
      musicBtn.addEventListener('click', function () {
        window.WeddingMusic.toggleSong();
      });

      window.WeddingMusic.subscribeSongState(function (playing) {
        if (playing) {
          musicBtn.classList.add('playing');
          musicBtn.setAttribute('aria-pressed', 'true');
          if (musicLabel) musicLabel.textContent = 'Pause';
          if (iconPlay) iconPlay.style.display = 'none';
          if (iconPause) iconPause.style.display = 'block';
        } else {
          musicBtn.classList.remove('playing');
          musicBtn.setAttribute('aria-pressed', 'false');
          if (musicLabel) musicLabel.textContent = 'Music';
          if (iconPlay) iconPlay.style.display = 'block';
          if (iconPause) iconPause.style.display = 'none';
        }
      });
    }

    // Smooth scroll links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  window.initNavigation = initNavigation;
})();
