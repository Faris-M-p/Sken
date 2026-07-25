/* -----------------------------------------------------------------
   ACROSS OCEANS, GUIDED BY FAITH - MEMORIES LIGHTBOX GALLERY
   Masonry gallery with full resolution zoom modal for Chapter 12
   ----------------------------------------------------------------- */

class GalleryManager {
  constructor() {
    this.modal = document.getElementById('lightbox-modal');
    this.modalImg = document.getElementById('lightbox-img');
    this.captionEl = document.getElementById('lightbox-caption');
    this.closeBtn = document.getElementById('lightbox-close');
    this.galleryItems = document.querySelectorAll('.gallery-item');

    this.init();
  }

  init() {
    if (!this.modal || !this.galleryItems.length) return;

    this.galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('.gallery-img');
        const caption = item.querySelector('.gallery-caption');
        if (img) {
          this.openLightbox(img.src, caption ? caption.textContent : '');
        }
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeLightbox());
    }

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeLightbox();
      }
    });
  }

  openLightbox(src, captionText) {
    if (this.modalImg) this.modalImg.src = src;
    if (this.captionEl) this.captionEl.textContent = captionText;
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

window.GalleryManager = GalleryManager;

