/* ============================================================
   THE COVENANT — ui.js
   Icons, countdown, the map that loads on request,
   and the candlelight dust.
   ============================================================ */

(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     Lucide icons
     ---------------------------------------------------------- */
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { 'stroke-width': 1.4 } });
  }

  /* ----------------------------------------------------------
     Countdown
     The target instant is declared on the element itself, so the
     date lives in one place: index.html.
     ---------------------------------------------------------- */
  function initCountdown(root) {
    const target = new Date(root.dataset.countdown).getTime();
    if (Number.isNaN(target)) return;

    const done = root.querySelector('[data-countdown-done]');
    const fields = {};
    root.querySelectorAll('[data-unit]').forEach((el) => {
      fields[el.dataset.unit] = { el: el, shown: null };
    });

    const write = (key, value) => {
      const field = fields[key];
      if (!field || field.shown === value) return;   // never touch the DOM for nothing
      field.shown = value;
      field.el.textContent = String(value).padStart(2, '0');
    };

    let timer = null;

    function tick() {
      const left = target - Date.now();

      if (left <= 0) {
        root.classList.add('is-complete');
        if (done) done.hidden = false;
        window.clearInterval(timer);
        return;
      }

      const seconds = Math.floor(left / 1000);
      write('days', Math.floor(seconds / 86400));
      write('hours', Math.floor((seconds % 86400) / 3600));
      write('minutes', Math.floor((seconds % 3600) / 60));
      write('seconds', seconds % 60);
    }

    tick();
    timer = window.setInterval(tick, 1000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) tick();
    });
  }

  document.querySelectorAll('[data-countdown]').forEach(initCountdown);

  /* ----------------------------------------------------------
     Google Map — injected only when asked for, so the page
     never pays for a third party iframe it may not need.
     ---------------------------------------------------------- */
  document.querySelectorAll('[data-map]').forEach((figure) => {
    const trigger = figure.querySelector('.map__open');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.src = 'https://www.google.com/maps?q=' + figure.dataset.map + '&output=embed';
      frame.title = 'Map of the wedding venue';
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.setAttribute('allowfullscreen', '');
      figure.appendChild(frame);
      figure.classList.add('is-loaded');
    }, { once: true });
  });

  /* ----------------------------------------------------------
     Dust in the candlelight
     A handful of motes, only painted while the canvas is on
     screen and the tab is in front.
     ---------------------------------------------------------- */
  function initDust(canvas) {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let motes = [];
    let frame = null;
    let onScreen = false;

    function seed() {
      const density = width < 600 ? 26 : 46;
      motes = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.5 + Math.random() * 1.6,
        drift: 0.06 + Math.random() * 0.22,
        sway: 0.15 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.14 + Math.random() * 0.4
      }));
    }

    function resize() {
      const box = canvas.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function paint(time) {
      ctx.clearRect(0, 0, width, height);
      const t = time * 0.001;

      for (const mote of motes) {
        mote.y -= mote.drift;
        if (mote.y < -4) {
          mote.y = height + 4;
          mote.x = Math.random() * width;
        }
        const x = mote.x + Math.sin(t * mote.sway + mote.phase) * 9;
        const twinkle = 0.65 + Math.sin(t * 1.3 + mote.phase) * 0.35;

        ctx.globalAlpha = mote.alpha * twinkle;
        ctx.fillStyle = '#fff6e2';
        ctx.beginPath();
        ctx.arc(x, mote.y, mote.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function loop(time) {
      paint(time);
      frame = window.requestAnimationFrame(loop);
    }

    function start() {
      if (frame || reduced) return;
      frame = window.requestAnimationFrame(loop);
    }
    function stop() {
      if (!frame) return;
      window.cancelAnimationFrame(frame);
      frame = null;
    }

    resize();
    if (reduced) {
      paint(0);
    } else {
      const settle = () => {
        if (onScreen && !document.hidden) start();
        else stop();
      };

      new IntersectionObserver((entries) => {
        onScreen = entries[0].isIntersecting;
        settle();
      }, { rootMargin: '10%' }).observe(canvas);

      document.addEventListener('visibilitychange', settle);
    }

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        if (reduced) paint(0);
      }, 220);
    }, { passive: true });
  }

  document.querySelectorAll('[data-dust]').forEach(initDust);
})();
