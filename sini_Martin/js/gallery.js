/* -----------------------------------------------------------------
   SINI & MARTIN — LUXURY INTERACTIVE WEDDING WEBSITE
   Editorial Gallery Lightbox & Interactivity
   ----------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  const galleryItems = document.querySelectorAll('.gallery-item img');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  if (galleryItems.length && lightboxModal && lightboxImg) {
    galleryItems.forEach(img => {
      img.parentElement.addEventListener('click', () => {
        lightboxImg.src = img.src;
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
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // Blessings Form Interactive Handler
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
