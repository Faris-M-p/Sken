/* ============================================================
   THE COVENANT — motion.js
   Smooth scroll, the breaking of the seal, and the reveal
   choreography for every page of the book.
   ============================================================ */

(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);

  const root = document.documentElement;
  const doors = document.getElementById('doors');
  const sealBtn = document.querySelector('[data-open]');

  /* ----------------------------------------------------------
     No libraries, or motion is unwelcome: show the whole book
     immediately and let the browser scroll it natively.
     ---------------------------------------------------------- */
  if (!hasGsap || reduced) {
    /* dropping the flag switches off every reveal start-state at once,
       while leaving the doors working as a gate */
    root.classList.remove('motion');
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      el.classList.add('is-revealed');
    });
    if (sealBtn) sealBtn.addEventListener('click', plainOpen);
    if (doors) doors.addEventListener('wheel', plainOpen, { passive: true });
    return;
  }

  function plainOpen() {
    root.classList.remove('is-sealed');
    if (doors) doors.style.display = 'none';
  }

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  /* ----------------------------------------------------------
     Lenis — one long, weighted scroll for the whole book
     ---------------------------------------------------------- */
  let lenis = null;

  if (window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  /* ==========================================================
     REVEALS
     Seven techniques, chosen per element, choreographed as one
     entrance per page instead of a page full of separate fades.
     ========================================================== */
  const splits = [];

  function split(el, types) {
    if (!window.SplitType) return null;
    const instance = new window.SplitType(el, { types: types, tagName: 'span' });
    splits.push({ el: el, instance: instance, types: types, done: false });
    return instance;
  }

  function addReveal(tl, el, at) {
    const kind = el.dataset.reveal;

    switch (kind) {

      /* words settling into place, letter by letter */
      case 'chars': {
        const instance = split(el, 'words,chars');
        if (!instance || !instance.chars.length) return fade(tl, el, at);
        tl.set(el, { opacity: 1 }, at);
        tl.from(instance.chars, {
          yPercent: 55,
          opacity: 0,
          rotate: 1.5,
          duration: 1.1,
          ease: 'power3.out',
          stagger: { each: 0.026, from: 'start' }
        }, at);
        return;
      }

      /* a paragraph rising line by line */
      case 'lines': {
        const instance = split(el, 'lines');
        if (!instance || !instance.lines.length) return fade(tl, el, at);
        tl.set(el, { opacity: 1 }, at);
        tl.from(instance.lines, {
          y: 22,
          opacity: 0,
          duration: 1.25,
          ease: 'power3.out',
          stagger: 0.13
        }, at);
        return;
      }

      /* tracked capitals drawing together */
      case 'letter': {
        const end = parseFloat(window.getComputedStyle(el).letterSpacing) || 0;
        tl.fromTo(el,
          { opacity: 0, letterSpacing: (end + 10) + 'px' },
          { opacity: 1, letterSpacing: end + 'px', duration: 1.5, ease: 'power3.out' },
          at);
        return;
      }

      /* a gold rule drawn outward from its centre */
      case 'rule':
        tl.fromTo(el,
          { opacity: 0, scaleX: 0.2 },
          { opacity: 1, scaleX: 1, duration: 1.4, ease: 'power3.out' },
          at);
        return;

      /* an ornament opening like a flower */
      case 'bloom':
        tl.fromTo(el,
          { opacity: 0, scale: 0.86 },
          { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
          at);
        return;

      /* paper unveiled from the top down */
      case 'mask':
        tl.fromTo(el,
          { opacity: 0, clipPath: 'inset(0% 0% 100% 0%)', y: 14 },
          { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.5, ease: 'power3.out' },
          at);
        return;

      default:
        return fade(tl, el, at);
    }
  }

  function fade(tl, el, at) {
    tl.fromTo(el,
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
      at);
  }

  function choreograph(scope, options) {
    const targets = gsap.utils.toArray('[data-reveal]', scope);
    if (!targets.length) return null;

    const tl = gsap.timeline(Object.assign({
      defaults: { overwrite: 'auto' },
      onComplete: () => targets.forEach((el) => el.classList.add('is-revealed'))
    }, options || {}));

    targets.forEach((el, i) => addReveal(tl, el, i * 0.12));
    return tl;
  }

  /* ==========================================================
     THE BOOK — built only once the doors begin to part, so the
     first page reveals itself into the widening gap rather than
     behind a closed invitation.
     ========================================================== */
  let built = false;

  function buildBook() {
    if (built) return;
    built = true;

    /* per-page entrance */
    gsap.utils.toArray('.page').forEach((page, index) => {
      choreograph(page, {
        scrollTrigger: {
          trigger: page,
          start: index === 0 ? 'top bottom' : 'top 72%',
          once: true
        }
      });
    });

    /* artwork drifting behind the words */
    gsap.utils.toArray('.page__media').forEach((media) => {
      const amount = parseFloat(media.dataset.parallax) || 6;
      gsap.fromTo(media,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: {
            trigger: media.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
    });

    /* the silk marker tracking your progress through the book */
    gsap.to('.thread__fill', {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4
      }
    });

    ScrollTrigger.refresh();
  }

  /* ==========================================================
     PAGE 1 — the doors, and the breaking of the seal
     ========================================================== */
  let doorBreath = null;
  let opening = false;

  /* Line splitting measures text, so the real fonts have to be in place
     before the doors animate. Never wait longer than a moment for them. */
  const fontsReady = window.document.fonts
    ? Promise.race([
        document.fonts.ready,
        new Promise((resolve) => window.setTimeout(resolve, 1200))
      ])
    : Promise.resolve();

  if (doors) {
    fontsReady.then(() => {
      if (opening) return;

      /* the doors resting there, breathing very slightly */
      doorBreath = gsap.to('.door__face', {
        scale: 1.04,
        duration: 24,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });

      choreograph(doors, { delay: 0.2 });
    });
  }

  function breakSeal() {
    if (opening || !doors) return;
    opening = true;

    if (doorBreath) doorBreath.kill();
    doors.classList.add('is-opening');   /* hands the seal over to GSAP */

    const tl = gsap.timeline();

    /* the seal gives way */
    tl.to('.crest__label', { opacity: 0, y: 8, duration: 0.4, ease: 'power2.in' })
      .to('.crest__halo', { scale: 1.5, opacity: 0, duration: 0.9, ease: 'power2.out' }, '-=0.35')
      .to('.crest__seal', { scale: 0.82, rotate: -14, opacity: 0, duration: 0.7, ease: 'power2.inOut' }, '<')

      /* whatever straddles the seam settles back into the paper */
      .to(['.wordmark', '.doors__verse'], { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, '-=0.3')
      .to('.doors__seam', { opacity: 0, duration: 0.5 }, '<')

      /* and the two leaves part */
      .to('.door--left', {
        xPercent: -100,
        duration: 1.6,
        ease: 'power3.inOut',
        onStart: () => {
          root.classList.remove('is-sealed');
          if (lenis) {
            lenis.start();
            lenis.scrollTo(0, { immediate: true });
          }
          buildBook();
        }
      }, '-=0.2')
      .to('.door--right', { xPercent: 100, duration: 1.6, ease: 'power3.inOut' }, '<')

      /* each name is printed on a door, so it travels with that door.
         Measured in viewport widths, not its own, to keep pace exactly. */
      .to('.doors__name:first-child', { x: '-50vw', duration: 1.6, ease: 'power3.inOut' }, '<')
      .to('.doors__name:last-child', { x: '50vw', duration: 1.6, ease: 'power3.inOut' }, '<')
      .to('.doors__names', { opacity: 0, duration: 0.5, ease: 'power2.in' }, '-=0.55')

      /* the shadow at the meeting edge lifts as the gap widens */
      .to('.door__lip', { opacity: 0, duration: 1.2, ease: 'power2.in' }, '<')

      .set(doors, { display: 'none' });
  }

  if (sealBtn) sealBtn.addEventListener('click', breakSeal);

  /* a scroll on a closed invitation means "open it" */
  if (doors) {
    doors.addEventListener('wheel', breakSeal, { passive: true });
    doors.addEventListener('touchmove', breakSeal, { passive: true });
  }

  /* ----------------------------------------------------------
     Line splits are measured, so they have to be measured again
     when the viewport changes shape.
     ---------------------------------------------------------- */
  let resizeTimer = null;

  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      splits.forEach((record) => {
        if (record.types !== 'lines' || record.done) return;
        /* already on screen: give the markup back, the words have arrived */
        if (record.el.classList.contains('is-revealed')) {
          record.instance.revert();
          record.el.style.opacity = '';
          record.done = true;
        } else {
          record.instance.split({ types: 'lines' });
        }
      });
      ScrollTrigger.refresh();
    }, 240);
  }, { passive: true });

  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
