/* -----------------------------------------------------------------
   ACROSS OCEANS, GUIDED BY FAITH - COUNTDOWN TIMER
   Live flip counter calculation to 24 August 2026
   ----------------------------------------------------------------- */

class CountdownTimer {
  constructor(targetDateString, containerSelector) {
    this.targetDate = new Date(targetDateString).getTime();
    this.daysEl = document.getElementById('cd-days');
    this.hoursEl = document.getElementById('cd-hours');
    this.minutesEl = document.getElementById('cd-minutes');
    this.secondsEl = document.getElementById('cd-seconds');
    this.timerInterval = null;

    if (this.daysEl && this.hoursEl && this.minutesEl && this.secondsEl) {
      this.start();
    }
  }

  start() {
    this.update();
    this.timerInterval = setInterval(() => this.update(), 1000);
  }

  update() {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    if (distance < 0) {
      if (this.daysEl) this.daysEl.textContent = '00';
      if (this.hoursEl) this.hoursEl.textContent = '00';
      if (this.minutesEl) this.minutesEl.textContent = '00';
      if (this.secondsEl) this.secondsEl.textContent = '00';
      clearInterval(this.timerInterval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.animateDigit(this.daysEl, days.toString().padStart(2, '0'));
    this.animateDigit(this.hoursEl, hours.toString().padStart(2, '0'));
    this.animateDigit(this.minutesEl, minutes.toString().padStart(2, '0'));
    this.animateDigit(this.secondsEl, seconds.toString().padStart(2, '0'));
  }

  animateDigit(element, newValue) {
    if (!element) return;
    if (element.textContent !== newValue) {
      element.style.transform = 'scale(1.15)';
      element.style.transition = 'transform 0.2s ease';
      element.textContent = newValue;
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, 200);
    }
  }
}

window.CountdownTimer = CountdownTimer;

