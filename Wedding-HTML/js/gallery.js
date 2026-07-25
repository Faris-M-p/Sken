/**
 * Sacred Gallery Controller
 */

(function () {
  function initGallery() {
    const figures = document.querySelectorAll('.gallery-figure');
    if (!figures.length) return;

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target.querySelector('img');
          if (img && img.dataset.src) {
            img.src = img.dataset.src;
          }
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '100px' });

    figures.forEach(function (fig) { observer.observe(fig); });
  }

  window.initGallery = initGallery;
})();
