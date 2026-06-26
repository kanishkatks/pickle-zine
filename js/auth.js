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
      // Move Piko out of auth gate before removing it
      if (window.piko && window.piko.setContext) {
        window.piko.setContext('home');
      }

      const pikoEl = document.getElementById('piko-reaction-container');
      if (pikoEl) pikoEl.classList.add('piko-unlock-celebrate');

      if (window.piko && window.piko.react) {
        window.piko.react('unlock', 2000, true);
        window.piko.speech("ACCESS GRANTED!", 1800);
      }

      setTimeout(() => {
        if (pikoEl) pikoEl.classList.remove('piko-unlock-celebrate');
        authGate.classList.add('is-unlocked');

        setTimeout(() => authGate.remove(), 800);
        if (window.db) window.db.trackAppUnlock();

        setTimeout(() => {
          if (window.piko && window.piko.startGuidedWalkthrough) {
            window.piko.startGuidedWalkthrough();
          }
        }, 2000);
      }, reducedMotion ? 0 : 600);
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
    let message = 'Wrong code! Check the zine!';
    if (failureCount >= 5) {
      emotion = 'panic';
      message = 'Are you sure you have the zine??';
    } else if (failureCount >= 3) {
      message = 'Find the password in the zine!';
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
      const PHRASES = ["Try again!", "You got this!", "One more try!"];
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
      "Psst! What's the code?",
      "Check your zine!",
      "I believe in you!",
      "Type it in!",
    ];

    codeInput.addEventListener('focus', () => {
      if (isDenying) return;
      const msg = FOCUS_PHRASES[Math.floor(Math.random() * FOCUS_PHRASES.length)];
      showPiko('intro', msg);
    });
  }

  window.attemptUnlock = attemptUnlock;
})();
