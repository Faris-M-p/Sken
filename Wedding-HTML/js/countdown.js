/**
 * Countdown Timer Controller
 * Target: August 23, 2026 12:05:00 (+05:30)
 */

(function () {
  const TARGET_DATE = new Date("2026-08-23T12:05:00+05:30").getTime();

  function initCountdown() {
    const daysEl = document.getElementById("count-days");
    const hoursEl = document.getElementById("count-hours");
    const minutesEl = document.getElementById("count-minutes");
    const secondsEl = document.getElementById("count-seconds");
    const doneMsgEl = document.getElementById("countdown-done");
    const gridEl = document.getElementById("countdown-grid");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const ringDays = document.getElementById("ring-days");
    const ringHours = document.getElementById("ring-hours");
    const ringMinutes = document.getElementById("ring-minutes");
    const ringSeconds = document.getElementById("ring-seconds");

    // SVG Circumference: radius r = (138 - 2.5) / 2 = 67.75px -> Circumference = 2 * PI * r ≈ 425.685px
    const R = 67.75;
    const CIRCUMFERENCE = 2 * Math.PI * R;

    function update() {
      const now = Date.now();
      const diff = TARGET_DATE - now;

      if (diff <= 0) {
        if (gridEl) gridEl.style.display = "none";
        if (doneMsgEl) doneMsgEl.style.display = "block";
        return;
      }

      const totalSecs = Math.floor(diff / 1000);
      const days = Math.floor(totalSecs / 86400);
      const hours = Math.floor((totalSecs % 86400) / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minutesEl.textContent = String(minutes).padStart(2, "0");
      secondsEl.textContent = String(seconds).padStart(2, "0");

      // Update SVG progress ring dashoffsets
      if (ringDays) setOffset(ringDays, days, 365, CIRCUMFERENCE);
      if (ringHours) setOffset(ringHours, hours, 24, CIRCUMFERENCE);
      if (ringMinutes) setOffset(ringMinutes, minutes, 60, CIRCUMFERENCE);
      if (ringSeconds) setOffset(ringSeconds, seconds, 60, CIRCUMFERENCE);
    }

    function setOffset(circle, val, max, c) {
      const pct = Math.min(val / max, 1);
      const offset = c * (1 - pct);
      circle.style.strokeDasharray = `${c}`;
      circle.style.strokeDashoffset = `${offset}`;
    }

    update();
    setInterval(update, 1000);
  }

  window.initCountdown = initCountdown;
})();
