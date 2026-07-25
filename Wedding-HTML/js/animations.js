/**
 * GSAP & Ambient Animations Controller
 */

(function () {
  function initAnimations() {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize GSAP ScrollTrigger if GSAP vendor is available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      if (!reduceMotion) {
        const heroBg = document.getElementById('hero-bg');
        const heroSection = document.getElementById('hero');

        if (heroBg && heroSection) {
          // Hero slow endless breathing zoom
          gsap.fromTo(heroBg, 
            { scale: 1.06 }, 
            {
              scale: 1.16,
              duration: 24,
              ease: 'none',
              repeat: -1,
              yoyo: true
            }
          );

          // Hero parallax scroll drift
          gsap.to(heroBg, {
            yPercent: 14,
            ease: 'none',
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: true
            }
          });
        }
      }

      // Scroll reveal for all elements with .reveal class
      document.querySelectorAll('.reveal').forEach(function (el) {
        gsap.fromTo(el,
          { opacity: 0, y: reduceMotion ? 0 : 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true
            }
          }
        );
      });
    } else {
      // Fallback if GSAP is not loaded: make all reveal elements visible
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }

    // Generate ambient hero elements (Clouds, Particles, Birds) if reduced motion is disabled
    if (!reduceMotion) {
      createAmbientClouds();
      createAmbientParticles();
      createAmbientBirds();
    }
  }

  function createAmbientClouds() {
    const container = document.getElementById('hero-clouds');
    if (!container) return;

    const clouds = [
      { top: '14%', size: 340, dur: 90, delay: 0, o: 0.12 },
      { top: '30%', size: 260, dur: 120, delay: -30, o: 0.09 },
      { top: '8%', size: 200, dur: 150, delay: -70, o: 0.08 }
    ];

    clouds.forEach(function (c) {
      const div = document.createElement('div');
      div.className = 'cloud-puff cloud-animate';
      div.style.top = c.top;
      div.style.width = c.size + 'px';
      div.style.height = (c.size * 0.45) + 'px';
      div.style.opacity = c.o;
      div.style.setProperty('--duration', c.dur + 's');
      div.style.setProperty('--delay', c.delay + 's');
      container.appendChild(div);
    });
  }

  function createAmbientParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;

    for (let i = 0; i < 18; i++) {
      const left = (i * 53) % 100;
      const dur = 9 + (i % 6);
      const delay = (i % 9) * -1.3;
      const size = 2 + (i % 3);

      const span = document.createElement('span');
      span.className = 'hero-particle particle-animate';
      span.style.left = left + '%';
      span.style.bottom = '-10px';
      span.style.width = size + 'px';
      span.style.height = size + 'px';
      span.style.opacity = '0.5';
      span.style.setProperty('--duration', dur + 's');
      span.style.setProperty('--delay', delay + 's');
      container.appendChild(span);
    }
  }

  function createAmbientBirds() {
    const container = document.getElementById('hero-birds');
    if (!container) return;

    const birds = [
      { top: '22%', dur: 34, delay: 4, scale: 1 },
      { top: '26%', dur: 34, delay: 4.5, scale: 0.8 },
      { top: '19%', dur: 42, delay: 18, scale: 0.7 }
    ];

    birds.forEach(function (b) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 8');
      svg.className.baseVal = 'hero-bird bird-animate';
      svg.style.top = b.top;
      svg.style.width = (24 * b.scale) + 'px';
      svg.style.setProperty('--duration', b.dur + 's');
      svg.style.setProperty('--delay', b.delay + 's');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M1 6 Q6 1 11 5 Q16 1 23 6');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '1');
      path.setAttribute('stroke-linecap', 'round');

      svg.appendChild(path);
      container.appendChild(svg);
    });
  }

  window.initAnimations = initAnimations;
})();
