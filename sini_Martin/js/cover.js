/* -----------------------------------------------------------------
   SINI & MARTIN — PAGE 1 : OPENING (THE SACRED COVER)
   Staged entrance, pointer parallax, and the gestures that carry a
   guest from the cover into the site. The actual fade-out and the
   audio start are owned by js/main.js, which listens on the same
   button — this file only opens the curtain and hands over.
   ----------------------------------------------------------------- */

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.addEventListener('DOMContentLoaded', function () {
    var cover = document.getElementById('page-sacred-opening');
    if (!cover) return;

    var card = cover.querySelector('.cover-card');
    var enterBtn = document.getElementById('btn-begin-journey');

    /* --- Staged entrance ------------------------------------------- */
    // Unlocks the hidden starting states in cover.css.
    cover.classList.add('js');

    var revealed = cover.querySelectorAll('[data-reveal]');
    for (var i = 0; i < revealed.length; i++) {
      revealed[i].style.setProperty('--i', String(i));
    }

    document.body.classList.add('cover-locked');

    // Two frames so the initial hidden state is painted before we animate.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        cover.classList.add('is-ready');
      });
    });

    /* --- Handing over to the site ---------------------------------- */
    var entered = false;

    function release() {
      if (entered) return;
      entered = true;
      document.body.classList.remove('cover-locked');
      detachGestures();
      // Detach without resetting the transforms, so the parallax offset
      // does not snap back part-way through the fade-out.
      cover.removeEventListener('pointermove', onPointerMove);
    }

    if (enterBtn) {
      enterBtn.addEventListener('click', release);
    }

    // Scrolling or swiping is the instinctive gesture on a cover page,
    // so route it through the button and let main.js do the transition.
    function requestEnter() {
      if (entered || !enterBtn) return;
      enterBtn.click();
    }

    var wheelTravel = 0;

    function onWheel(event) {
      if (event.deltaY <= 0) return;
      wheelTravel += event.deltaY;
      if (wheelTravel > 60) requestEnter();
    }

    var touchStartY = null;

    function onTouchStart(event) {
      touchStartY = event.touches[0].clientY;
    }

    function onTouchMove(event) {
      if (touchStartY === null) return;
      if (touchStartY - event.touches[0].clientY > 50) requestEnter();
    }

    function onKeyDown(event) {
      if (event.key === 'ArrowDown' || event.key === 'PageDown') requestEnter();
    }

    function detachGestures() {
      cover.removeEventListener('wheel', onWheel);
      cover.removeEventListener('touchstart', onTouchStart);
      cover.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
    }

    cover.addEventListener('wheel', onWheel, { passive: true });
    cover.addEventListener('touchstart', onTouchStart, { passive: true });
    cover.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    /* --- Pointer parallax ----------------------------------------- */
    var layers = [];
    var parallaxFrame = null;

    function collectLayers() {
      if (!card) return;
      // Scene layers translate in viewBox user units, which the card
      // scales down, so they need larger values than the HTML florals.
      var config = [
        ['.scene-parallax-far', -22],
        ['.scene-parallax-near', 34],
        ['.scene-couple', 14],
        ['.flora-tr', 8],
        ['.flora-bl', -8],
        ['.flora-lm', -5],
        ['.flora-br', 6]
      ];

      for (var n = 0; n < config.length; n++) {
        var el = card.querySelector(config[n][0]);
        if (el) layers.push({ el: el, depth: config[n][1] });
      }
    }

    function onPointerMove(event) {
      if (entered || parallaxFrame !== null) return;

      parallaxFrame = requestAnimationFrame(function () {
        parallaxFrame = null;

        var box = card.getBoundingClientRect();
        var x = (event.clientX - box.left) / box.width - 0.5;
        var y = (event.clientY - box.top) / box.height - 0.5;

        for (var n = 0; n < layers.length; n++) {
          var layer = layers[n];
          layer.el.style.transform =
            'translate(' + (x * layer.depth).toFixed(2) + 'px, ' +
            (y * layer.depth).toFixed(2) + 'px)';
        }
      });
    }

    function stopParallax() {
      cover.removeEventListener('pointermove', onPointerMove);
      if (parallaxFrame !== null) {
        cancelAnimationFrame(parallaxFrame);
        parallaxFrame = null;
      }
      for (var n = 0; n < layers.length; n++) {
        layers[n].el.style.transform = '';
      }
    }

    function startParallax() {
      if (entered || reducedMotion.matches || !card) return;
      if (!window.matchMedia('(hover: hover)').matches) return;
      if (!layers.length) collectLayers();
      cover.addEventListener('pointermove', onPointerMove);
    }

    startParallax();

    if (typeof reducedMotion.addEventListener === 'function') {
      reducedMotion.addEventListener('change', function () {
        stopParallax();
        startParallax();
      });
    }
  });
})();
