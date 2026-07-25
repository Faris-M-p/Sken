/* -----------------------------------------------------------------
   ACROSS OCEANS, GUIDED BY FAITH - CONTINUOUS SCROLL SYSTEM
   Uses IntersectionObserver & requestAnimationFrame for 60FPS motion
   ----------------------------------------------------------------- */

class ScrollManager {

  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.chapters = document.querySelectorAll('.chapter');
    this.revealElements = document.querySelectorAll('.reveal-up');
    this.currentChapterId = 'chapter-opening';
    this.isTicked = false;

    this.initObserver();
    this.initScrollListener();
  }

  initObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: 0.25
    };

    const chapterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          const id = entry.target.getAttribute('id');
          if (id && id !== this.currentChapterId) {
            this.currentChapterId = id;
            this.onChapterChange(id);
          }
        }
      });
    }, observerOptions);

    this.chapters.forEach((chapter) => chapterObserver.observe(chapter));

    // Reveal Up Elements Observer
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.15 });

    this.revealElements.forEach((el) => revealObserver.observe(el));
  }

  onChapterChange(id) {
    // Dynamic audio feedback on chapter transition
    if (id === 'chapter-hero' || id === 'chapter-thankyou') {
      if (this.audioEngine) this.audioEngine.playChurchBell(261.63); // C4
    } else if (id === 'chapter-wedding') {
      if (this.audioEngine) this.audioEngine.playChurchBell(329.63); // E4
    }
  }

  initScrollListener() {
    window.addEventListener('scroll', () => {
      if (!this.isTicked) {
        window.requestAnimationFrame(() => {
          this.handleParallax();
          this.isTicked = false;
        });
        this.isTicked = true;
      }
    }, { passive: true });
  }

  handleParallax() {
    const scrollY = window.scrollY;
    
    // Parallax background movement
    document.querySelectorAll('.chapter-blurred-bg').forEach((bg) => {
      const parent = bg.closest('.chapter');
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const speed = 0.15;
        const yOffset = (rect.top - window.innerHeight / 2) * speed;
        bg.style.transform = `translate3d(0, ${yOffset}px, 0) scale(1.1)`;
      }
    });

    // Timeline Progress Path Update in Chapter 3
    const timelineProgressPath = document.querySelector('.timeline-progress-path');
    const timelineContainer = document.querySelector('.timeline-container');
    if (timelineProgressPath && timelineContainer) {
      const rect = timelineContainer.getBoundingClientRect();
      const totalHeight = rect.height;
      const visible = Math.max(0, Math.min(totalHeight, window.innerHeight / 2 - rect.top));
      const percentage = visible / totalHeight;
      const pathLength = 1000;
      timelineProgressPath.style.strokeDasharray = pathLength;
      timelineProgressPath.style.strokeDashoffset = pathLength * (1 - percentage);
    }
  }

  scrollToChapter(chapterId) {
    const target = document.getElementById(chapterId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

window.ScrollManager = ScrollManager;

