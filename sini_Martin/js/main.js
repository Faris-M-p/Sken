/* -----------------------------------------------------------------
   SINI & MARTIN — LUXURY INTERACTIVE WEDDING WEBSITE
   Master JavaScript Orchestration & Floating Particle Canvas
   ----------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  const sacredOpening = document.getElementById('page-sacred-opening');
  const btnBeginJourney = document.getElementById('btn-begin-journey');

  // Cover → Page 2: button click only. Zoom + fade, then reveal hero.
  if (btnBeginJourney && sacredOpening) {
    let entering = false;

    btnBeginJourney.addEventListener('click', () => {
      if (entering) return;
      entering = true;

      btnBeginJourney.disabled = true;
      document.body.classList.add('cover-exiting');
      document.body.classList.remove('cover-locked');
      sacredOpening.classList.add('is-leaving');

      if (window.soundscape) {
        window.soundscape.play();
      }

      const heroLanding = document.getElementById('page-hero-landing');
      if (heroLanding) {
        // Jump behind the fading cover so Page 2 is already in place.
        heroLanding.scrollIntoView({ behavior: 'auto', block: 'start' });
      }

      // After the cover finishes leaving, drop it from the stacking context.
      window.setTimeout(() => {
        sacredOpening.classList.add('faded-out');
        sacredOpening.style.display = 'none';
        document.body.classList.remove('cover-exiting');

        // Re-trigger scroll reveals that may have fired under the cover.
        document.querySelectorAll('#page-hero-landing .reveal-on-scroll').forEach((el) => {
          el.classList.add('is-visible');
        });
      }, 1200);
    });
  }

  // Floating Watercolor Petals & Gold Particle Canvas
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 30), 45);

    class FloatingParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1.5;
        this.speedY = Math.random() * 0.4 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.4 ? 'rgba(197, 160, 89, ' : 'rgba(162, 189, 208, ';
      }

      update() {
        this.y -= this.speedY;
        this.x += Math.sin(this.y * 0.01) * 0.4 + this.speedX;

        if (this.y < -10) {
          this.y = height + 10;
          this.x = Math.random() * width;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(197, 160, 89, 0.4)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new FloatingParticle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }
});
