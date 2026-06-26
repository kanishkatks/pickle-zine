/* ═══════════════════════════════════════════════════════════
   AUTH.JS — Zine Secret Code Gate
   The Pickle-Metric Suite // Global Pickle Zine
═══════════════════════════════════════════════════════════ */

(function () {
  const SECRET_CODE = 'PICKLE2026';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DENIED_DISPLAY_MS = 3000;

  let isDenying = false;
  let failureCount = 0;
  let hasTappedInput = false;

  const authGate = document.getElementById('auth-gate');
  const codeInput = document.getElementById('auth-code-input');
  const unlockBtn = document.getElementById('auth-unlock-btn');
  const errorMsg = document.getElementById('auth-error');

  if (localStorage.getItem('zine-unlocked') === 'true') {
    unlockApp(false);
  }

  // ── Helpers ─────────────────────────────────────────────────
  function showPiko(emotion, message) {
    if (!hasTappedInput) {
      hasTappedInput = true;
      if (window.piko && window.piko.setContext) {
        window.piko.setContext('auth-focus');
      }
    }
    if (window.piko && window.piko.react) {
      window.piko.react(emotion, Infinity, true);
    }
    if (message && window.piko && window.piko.speech) {
      window.piko.speech(message, Infinity);
    }
  }

  // ── Unlock ──────────────────────────────────────────────────
  function unlockApp(animate) {
    document.body.classList.remove('is-locked');
    if (animate) {
      authGate.classList.add('is-unlocked');
      setTimeout(() => authGate.remove(), 500);
      if (window.db) window.db.trackAppUnlock();

      // Show celebration modal, then start walkthrough
      if (window.piko && window.piko.showCelebrationModal) {
        window.piko.showCelebrationModal(() => {
          if (window.piko && window.piko.startGuidedWalkthrough) {
            window.piko.startGuidedWalkthrough();
          }
        });
      }
    } else {
      authGate.remove();
    }
  }

  // ── Attempt Unlock ──────────────────────────────────────────
  function attemptUnlock() {
    if (isDenying) return;

    const enteredCode = codeInput.value.trim().toUpperCase();

    if (enteredCode === SECRET_CODE) {
      errorMsg.style.display = 'none';
      codeInput.disabled = true;
      unlockBtn.disabled = true;
      localStorage.setItem('zine-unlocked', 'true');
      unlockApp(true);
      return;
    }

    // Wrong password
    isDenying = true;
    failureCount++;
    codeInput.disabled = true;
    unlockBtn.disabled = true;

    // Shake card
    errorMsg.style.display = 'block';
    const content = authGate.querySelector('.auth-gate__content');
    content.classList.add('shake-anim');
    setTimeout(() => content.classList.remove('shake-anim'), 400);

    // Progressive feedback
    let emotion = 'denied';
    let message = window.i18n.t('auth.wrong_code');
    if (failureCount >= 5) {
      emotion = 'panic';
      message = window.i18n.t('auth.panic');
    } else if (failureCount >= 3) {
      message = window.i18n.t('auth.hint');
    }

    showPiko(emotion, message);

    // Re-enable after delay
    setTimeout(() => {
      errorMsg.style.display = 'none';
      codeInput.disabled = false;
      unlockBtn.disabled = false;
      codeInput.value = '';
      isDenying = false;

      // Return to friendly
      const PHRASES = [window.i18n.t('auth.retry_1'), window.i18n.t('auth.retry_2'), window.i18n.t('auth.retry_3')];
      showPiko('intro', PHRASES[Math.floor(Math.random() * PHRASES.length)]);
      codeInput.focus();
    }, DENIED_DISPLAY_MS);
  }

  // ── Events ──────────────────────────────────────────────────
  if (unlockBtn) {
    unlockBtn.addEventListener('click', attemptUnlock);
    unlockBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      attemptUnlock();
    });
  }

  if (codeInput) {
    codeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') attemptUnlock();
    });

    const FOCUS_PHRASES = [
      window.i18n.t('auth.focus_1'),
      window.i18n.t('auth.focus_2'),
      window.i18n.t('auth.focus_3'),
      window.i18n.t('auth.focus_4'),
    ];

    codeInput.addEventListener('focus', () => {
      if (isDenying) return;
      const msg = FOCUS_PHRASES[Math.floor(Math.random() * FOCUS_PHRASES.length)];
      showPiko('intro', msg);
    });
  }

  window.attemptUnlock = attemptUnlock;
})();
