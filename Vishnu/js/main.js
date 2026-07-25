/* ============================================================
   Cinematic flow controller
   Landing cover → invitation video → hero → scroll journey
   ============================================================ */
(function () {
  'use strict';

  var body = document.body;
  var landing = document.getElementById('landing');
  var openBtn = document.getElementById('openBtn');
  var revealBox = document.getElementById('reveal');
  var video = document.getElementById('revealVideo');
  var skipBtn = document.getElementById('skipBtn');
  var heroImg = document.getElementById('heroImg');

  /* ---------------------------------------------------------
     1 · Image fallback chain + graceful placeholders
     --------------------------------------------------------- */
  function markMissing(img) {
    img.classList.add('failed');
    var host = img.parentElement;
    if (!host) return;

    if (img.classList.contains('cover-img') || img.classList.contains('hero-img')) {
      host.classList.add('fallback-on');
    } else if (host.classList.contains('portrait') || host.classList.contains('tile')) {
      host.classList.add('is-empty');
      host.setAttribute('data-label', img.getAttribute('data-placeholder') || 'Photo');
    }
  }

  function wireImage(img) {
    var queue = (img.getAttribute('data-fallbacks') || '')
      .split(',').map(function (s) { return s.trim(); }).filter(Boolean);

    img.addEventListener('error', function () {
      if (queue.length) { img.src = queue.shift(); return; }
      markMissing(img);
    });

    /* an already-broken cached image never fires error again */
    if (img.complete && img.naturalWidth === 0) {
      if (queue.length) img.src = queue.shift();
      else markMissing(img);
    }
  }

  Array.prototype.forEach.call(
    document.querySelectorAll('img[data-fallbacks], img[data-placeholder]'),
    wireImage
  );

  /* ---------------------------------------------------------
     2 · Scroll lock
     --------------------------------------------------------- */
  function blockTouch(e) { if (body.classList.contains('is-locked')) e.preventDefault(); }
  document.addEventListener('touchmove', blockTouch, { passive: false });

  /* a reload must never drop the visitor into the middle of the journey */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* html has scroll-behavior:smooth, so a plain scrollTo would animate */
  function jumpToTop() {
    var root = document.documentElement;
    var prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    root.style.scrollBehavior = prev;
  }

  function unlockScroll() {
    body.classList.remove('is-locked');
    jumpToTop();
  }

  /* ---------------------------------------------------------
     3 · Landing → video → hero
     --------------------------------------------------------- */
  var finished = false;
  var safety = 0;

  function finishReveal() {
    if (finished) return;
    finished = true;
    clearTimeout(safety);

    /* Paint the hero underneath first, then dissolve the video off the top.
       The visitor lands on the hero with nothing to scroll for. */
    body.classList.add('is-revealed');
    unlockScroll();
    initReveals();

    revealBox.classList.remove('is-on');
    revealBox.classList.add('is-out');

    setTimeout(function () {
      revealBox.classList.add('is-gone');
      revealBox.setAttribute('aria-hidden', 'true');
      try { video.pause(); video.removeAttribute('src'); video.load(); } catch (e) {}
    }, 1300);
  }

  function playVideo() {
    /* fetch and decode the hero backdrop while the video runs, so the
       hand-off has no blank frame */
    if (heroImg) {
      var pre = new Image();
      pre.src = heroImg.currentSrc || heroImg.src;
      if (pre.decode) pre.decode().catch(function () {});
    }

    revealBox.classList.add('is-on');
    revealBox.removeAttribute('aria-hidden');

    var attempt = video.play();
    if (attempt && attempt.catch) {
      attempt.catch(function () {
        video.muted = true;
        video.setAttribute('muted', '');
        var retry = video.play();
        if (retry && retry.catch) retry.catch(finishReveal);
      });
    }

    setTimeout(function () { if (!finished) skipBtn.hidden = false; }, 5000);
    /* if the file is missing or stalls forever, do not trap the visitor */
    safety = setTimeout(function () {
      if (!finished && (video.readyState < 2 || video.paused)) finishReveal();
    }, 12000);
  }

  function openInvitation() {
    if (landing.classList.contains('is-out')) return;
    openBtn.disabled = true;
    landing.classList.add('is-out');

    setTimeout(function () { landing.classList.add('is-gone'); }, 1200);
    setTimeout(playVideo, 620);
  }

  if (openBtn) openBtn.addEventListener('click', openInvitation);
  if (skipBtn) skipBtn.addEventListener('click', finishReveal);

  if (video) {
    video.addEventListener('ended', finishReveal);
    video.addEventListener('error', finishReveal);
    /* some browsers report the last frame slightly short of duration */
    video.addEventListener('timeupdate', function () {
      if (video.duration && video.duration - video.currentTime < 0.12) finishReveal();
    });
  }

  /* ---------------------------------------------------------
     4 · Scroll reveals
     Observation starts only once the site is on screen, otherwise
     everything above the fold would animate behind the cover.
     --------------------------------------------------------- */
  var revealsStarted = false;
  function initReveals() {
    if (revealsStarted) return;
    revealsStarted = true;

    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------
     5 · Countdown  ·  21 Aug 2026, 11:00 IST
     --------------------------------------------------------- */
  (function countdown() {
    var target = new Date('2026-08-21T11:00:00+05:30').getTime();
    var d = document.getElementById('cdD'),
        h = document.getElementById('cdH'),
        m = document.getElementById('cdM'),
        s = document.getElementById('cdS');
    if (!d || isNaN(target)) return;

    var pad = function (n) { return n < 10 ? '0' + n : String(n); };

    function tick() {
      var left = target - Date.now();
      if (left <= 0) {
        d.textContent = h.textContent = m.textContent = s.textContent = '00';
        clearInterval(timer);
        return;
      }
      var sec = Math.floor(left / 1000);
      d.textContent = pad(Math.floor(sec / 86400));
      h.textContent = pad(Math.floor(sec / 3600) % 24);
      m.textContent = pad(Math.floor(sec / 60) % 60);
      s.textContent = pad(sec % 60);
    }
    tick();
    var timer = setInterval(tick, 1000);
  })();

  /* ---------------------------------------------------------
     6 · Particles + THANK YOU finale
     --------------------------------------------------------- */
  function bootParticles() {
    if (!window.KeralaParticles) return;
    window.KeralaParticles.init();

    /* watch the stage itself — the section is taller than the viewport,
       so its intersection ratio would never reach the trigger point */
    var stage = document.getElementById('finaleStage');
    if (!stage || !('IntersectionObserver' in window)) return;

    var fo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && en.intersectionRatio >= 0.6) {
          window.KeralaParticles.finale(stage);
        } else if (!en.isIntersecting && en.boundingClientRect.top > 0) {
          window.KeralaParticles.reset();
        }
      });
    }, { threshold: [0, 0.6, 0.95] });

    fo.observe(stage);
  }

  if (document.readyState === 'complete') bootParticles();
  else window.addEventListener('load', bootParticles);

  /* ---------------------------------------------------------
     7 · Smooth anchor (respects reduced motion)
     --------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute('href');
    if (!id || id === '#') return;
    var t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

})();
