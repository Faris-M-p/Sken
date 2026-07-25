/* -----------------------------------------------------------------
   SINI & MARTIN — Gallery album interactions + lightbox + blessings
   ----------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  /* ---- Scrapbook reveal ---- */
  const albumPhotos = document.querySelectorAll('.album-photo');

  albumPhotos.forEach((photo) => {
    const rot = photo.getAttribute('data-rot') || '0';
    photo.style.setProperty('--rot', rot + 'deg');
  });

  if (albumPhotos.length && 'IntersectionObserver' in window) {
    const albumObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.18
      }
    );

    albumPhotos.forEach((photo) => albumObserver.observe(photo));
  } else {
    albumPhotos.forEach((photo) => photo.classList.add('is-in'));
  }

  /* ---- Lightbox ---- */
  const frames = document.querySelectorAll('.album-frame');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  if (frames.length && lightboxModal && lightboxImg) {
    frames.forEach((frame) => {
      const img = frame.querySelector('img');
      if (!img) return;

      frame.addEventListener('click', () => {
        lightboxImg.src = img.currentSrc || img.src;
        lightboxImg.alt = img.alt || 'Gallery detail view';
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* ---- Blessings form ---- */
  const blessingsForm = document.getElementById('blessings-form');
  const blessingsFeed = document.getElementById('blessings-feed');

  if (blessingsForm && blessingsFeed) {
    blessingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('blessing-name');
      const msgInput = document.getElementById('blessing-msg');

      if (nameInput.value.trim() && msgInput.value.trim()) {
        const newItem = document.createElement('div');
        newItem.className = 'blessing-item';
        newItem.innerHTML = `
          <p class="blessing-author">${escapeHtml(nameInput.value.trim())}</p>
          <p class="blessing-text">“${escapeHtml(msgInput.value.trim())}”</p>
        `;
        blessingsFeed.prepend(newItem);
        nameInput.value = '';
        msgInput.value = '';
      }
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
