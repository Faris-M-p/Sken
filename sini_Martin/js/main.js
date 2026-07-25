/* -----------------------------------------------------------------
   SINI & MARTIN — LUXURY INTERACTIVE WEDDING WEBSITE
   Master JavaScript Orchestration & Floating Particle Canvas
   ----------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Sacred Opening Fade-Out & Music Start Trigger
  const sacredOpening = document.getElementById('page-sacred-opening');
  const btnBeginJourney = document.getElementById('btn-begin-journey');

  if (btnBeginJourney && sacredOpening) {
    btnBeginJourney.addEventListener('click', () => {
      sacredOpening.classList.add('faded-out');

      // Start ambient audio soundscape upon first interaction
      if (window.soundscape) {
        window.soundscape.play();
      }

      // Smooth scroll to Page 2 (Hero Landing)
      setTimeout(() => {
        const heroLanding = document.getElementById('page-hero-landing');
        if (heroLanding) {
          heroLanding.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
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
