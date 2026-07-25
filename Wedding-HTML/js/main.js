/**
 * Main Application Bootstrap & Form Controller
 */

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    if (window.initNavigation) window.initNavigation();
    if (window.initCountdown) window.initCountdown();
    if (window.initGallery) window.initGallery();
    if (window.initAnimations) window.initAnimations();

    setupRsvpForm();
    setupBlessingsForm();
  });

  /* ------------------------------------------------------------------ */
  /*  RSVP Form Handling                                                */
  /* ------------------------------------------------------------------ */
  function setupRsvpForm() {
    const form = document.getElementById('rsvp-form');
    const successState = document.getElementById('rsvp-success');
    const btnReset = document.getElementById('btn-rsvp-reset');

    if (!form) return;

    const attendanceRadios = form.querySelectorAll('input[name="attendance"]');
    attendanceRadios.forEach(function (radio) {
      radio.addEventListener('change', function (e) {
        form.querySelectorAll('.radio-btn-label').forEach(function (lbl) { lbl.classList.remove('active'); });
        const label = e.target.closest('.radio-btn-label');
        if (label) label.classList.add('active');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = form.querySelector('#rsvp-name');
      const phoneInput = form.querySelector('#rsvp-phone');
      const guestsInput = form.querySelector('#rsvp-guests');
      const attendanceRadio = form.querySelector('input[name="attendance"]:checked');
      const submitBtn = form.querySelector('button[type="submit"]');

      const nameErr = document.getElementById('err-rsvp-name');
      const phoneErr = document.getElementById('err-rsvp-phone');
      const guestErr = document.getElementById('err-rsvp-guests');
      const formBannerErr = document.getElementById('err-rsvp-banner');

      // Reset error messages
      if (nameErr) nameErr.textContent = '';
      if (phoneErr) phoneErr.textContent = '';
      if (guestErr) guestErr.textContent = '';
      if (formBannerErr) formBannerErr.style.display = 'none';

      let hasError = false;
      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const guests = parseInt(guestsInput ? guestsInput.value : '1', 10);
      const attendance = attendanceRadio ? attendanceRadio.value : 'accept';

      if (!name) {
        if (nameErr) nameErr.textContent = 'Please enter your name.';
        hasError = true;
      }

      const digits = (phone.match(/\d/g) || []).length;
      if (!phone) {
        if (phoneErr) phoneErr.textContent = 'Please enter your phone number.';
        hasError = true;
      } else if (!/^[+\d][\d\s-]*$/.test(phone) || digits < 7 || digits > 15) {
        if (phoneErr) phoneErr.textContent = 'Please enter a valid phone number.';
        hasError = true;
      }

      if (isNaN(guests) || guests < 1) {
        if (guestErr) guestErr.textContent = 'At least one guest is required.';
        hasError = true;
      }

      if (hasError) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      const payload = {
        type: 'rsvp',
        name: name,
        phone: phone,
        guestCount: guests,
        attendance: attendance,
        submittedAt: new Date().toISOString()
      };

      try {
        const prev = JSON.parse(localStorage.getItem('rsvps') || '[]');
        localStorage.setItem('rsvps', JSON.stringify(prev.concat([payload])));

        setTimeout(function () {
          form.style.display = 'none';
          if (successState) successState.style.display = 'flex';
        }, 600);
      } catch (err) {
        if (formBannerErr) {
          formBannerErr.textContent = 'Unable to submit RSVP. Please try again.';
          formBannerErr.style.display = 'flex';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send RSVP';
        }
      }
    });

    if (btnReset) {
      btnReset.addEventListener('click', function () {
        form.reset();
        form.querySelectorAll('.radio-btn-label').forEach(function (lbl) { lbl.classList.remove('active'); });
        const defaultRadio = form.querySelector('input[value="accept"]');
        if (defaultRadio) {
          defaultRadio.checked = true;
          const lbl = defaultRadio.closest('.radio-btn-label');
          if (lbl) lbl.classList.add('active');
        }
        if (successState) successState.style.display = 'none';
        form.style.display = 'flex';
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Blessings Form Handling                                           */
  /* ------------------------------------------------------------------ */
  function setupBlessingsForm() {
    const form = document.getElementById('blessings-form');
    const successState = document.getElementById('blessings-success');
    const btnReset = document.getElementById('btn-blessings-reset');
    const textarea = document.getElementById('blessing-custom');
    const charCountEl = document.getElementById('blessing-char-count');
    const guestMasonry = document.getElementById('guest-blessings-masonry');

    if (!form) return;

    // Character Counter for Textarea
    if (textarea && charCountEl) {
      textarea.addEventListener('input', function () {
        const len = textarea.value.length;
        charCountEl.textContent = len + '/300';

        if (len > 0) {
          form.querySelectorAll('.predefined-wish-option').forEach(function (opt) { opt.classList.remove('active'); });
          form.querySelectorAll('input[name="blessing"]').forEach(function (r) { r.checked = false; });
        }
      });
    }

    // Predefined radios toggle
    const wishOptions = form.querySelectorAll('.predefined-wish-option');
    wishOptions.forEach(function (opt) {
      opt.addEventListener('click', function () {
        wishOptions.forEach(function (o) { o.classList.remove('active'); });
        opt.classList.add('active');
        if (textarea) {
          textarea.value = '';
          if (charCountEl) charCountEl.textContent = '0/300';
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = form.querySelector('#blessing-name');
      const phoneInput = form.querySelector('#blessing-phone');
      const selectedRadio = form.querySelector('input[name="blessing"]:checked');
      const customWish = textarea ? textarea.value.trim() : '';
      const submitBtn = form.querySelector('button[type="submit"]');

      const nameErr = document.getElementById('err-blessing-name');
      const wishErr = document.getElementById('err-blessing-wish');

      if (nameErr) nameErr.textContent = '';
      if (wishErr) wishErr.textContent = '';

      let hasError = false;
      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const wish = customWish !== '' ? customWish : (selectedRadio ? selectedRadio.value : '');

      if (!name) {
        if (nameErr) nameErr.textContent = 'Please enter your name.';
        hasError = true;
      }

      if (!wish) {
        if (wishErr) wishErr.textContent = 'Choose a blessing or write your own.';
        hasError = true;
      }

      if (hasError) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      const payload = {
        type: 'blessing',
        name: name,
        phone: phone,
        wish: wish,
        submittedAt: new Date().toISOString()
      };

      try {
        const prev = JSON.parse(localStorage.getItem('blessings') || '[]');
        localStorage.setItem('blessings', JSON.stringify([payload].concat(prev)));

        if (guestMasonry) {
          const wrap = document.createElement('div');
          wrap.className = 'guest-blessing-wrap reveal';
          wrap.innerHTML = `
            <blockquote class="blessing-card-item">
              <p>${escapeHtml(wish)}</p>
              <footer>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                ${escapeHtml(name)}
              </footer>
            </blockquote>
          `;
          guestMasonry.insertBefore(wrap, guestMasonry.firstChild);
          wrap.style.opacity = '1';
          wrap.style.transform = 'none';
        }

        setTimeout(function () {
          form.style.display = 'none';
          if (successState) successState.style.display = 'flex';
        }, 500);
      } catch (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Blessing';
        }
      }
    });

    if (btnReset) {
      btnReset.addEventListener('click', function () {
        form.reset();
        wishOptions.forEach(function (opt) { opt.classList.remove('active'); });
        if (textarea) textarea.value = '';
        if (charCountEl) charCountEl.textContent = '0/300';
        if (successState) successState.style.display = 'none';
        form.style.display = 'flex';
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Blessing';
        }
      });
    }
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[m];
    });
  }
})();
