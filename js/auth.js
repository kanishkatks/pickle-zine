/* ═══════════════════════════════════════════════════════════
   AUTH.JS — Zine Secret Code Gate
   The Pickle-Metric Suite // Global Pickle Zine
═══════════════════════════════════════════════════════════ */

(function () {
  const SECRET_CODE = 'PICKLE2026';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EXIT_MS = reducedMotion ? 0 : 400;
  const RETURN_MS = reducedMotion ? 0 : 350;
  const DENIED_DISPLAY_MS = 3000;

  // State
  let isDenying = false;
  let failureCount = 0;

  // DOM Refs
  const authGate = document.getElementById('auth-gate');
  const codeInput = document.getElementById('auth-code-input');
  const unlockBtn = document.getElementById('auth-unlock-btn');
  const errorMsg = document.getElementById('auth-error');

  // Check if already unlocked from a previous visit
  if (localStorage.getItem('zine-unlocked') === 'true') {
    unlockApp(false);
  }

  // ── Peek Pause Helpers ────────────────────────────────────
  function pausePeek() {
    const pikoEl = document.getElementById('piko-reaction-container');
    if (pikoEl) pikoEl.classList.add('piko-peek-paused');
  }

  function resumePeek() {
    const pikoEl = document.getElementById('piko-reaction-container');
    if (pikoEl) pikoEl.classList.remove('piko-peek-paused');
  }

  // ── Unlock Flow ───────────────────────────────────────────
  function unlockApp(animate) {
    document.body.classList.remove('is-locked');
    if (animate) {
      // Celebration bounce
      const pikoEl = document.getElementById('piko-reaction-container');
      if (pikoEl) pikoEl.classList.add('piko-unlock-celebrate');

      setTimeout(() => {
        if (pikoEl) pikoEl.classList.remove('piko-unlock-celebrate');

        authGate.classList.add('is-unlocked');

        if (window.piko && window.piko.react) {
          window.piko.react('unlock', 2000);
          window.piko.speech("ACCESS GRANTED!", 1800);
        }

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

  // ── Attempt Unlock ────────────────────────────────────────
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

    // ── Wrong Password ──────────────────────────────────────
    isDenying = true;
    failureCount++;
    pausePeek();

    codeInput.disabled = true;
    unlockBtn.disabled = true;

    // Shake card
    errorMsg.style.display = 'block';
    const content = authGate.querySelector('.auth-gate__content');
    content.classList.add('shake-anim');
    setTimeout(() => content.classList.remove('shake-anim'), 400);

    // Choose emotion and message based on failure count
    let emotion = 'denied';
    let message = 'Access Denied! Check the zine!';
    if (failureCount >= 5) {
      emotion = 'panic';
      message = 'Oh no! Are you sure you have the zine??';
    } else if (failureCount >= 3) {
      message = 'Still wrong... Hint: check the first page!';
    }

    const pikoEl = document.getElementById('piko-reaction-container');
    const unlockBtnEl = document.getElementById('auth-unlock-btn');

    // Smooth exit: animate out of sandwich
    if (pikoEl) {
      pikoEl.classList.add('piko-denied-exit');
    }

    setTimeout(() => {
      // Reparent and switch context after exit animation
      if (pikoEl) {
        pikoEl.classList.remove('piko-denied-exit', 'piko-pop');
        document.body.appendChild(pikoEl);
        pikoEl.classList.remove('piko-context-auth');
        pikoEl.classList.add('piko-context-denied');
      }

      if (window.piko && window.piko.react) {
        window.piko.react(emotion, DENIED_DISPLAY_MS);
        window.piko.speech(message, DENIED_DISPLAY_MS - 200);
      }

      // Return after denied display
      setTimeout(() => {
        if (pikoEl) {
          pikoEl.classList.add('piko-denied-return');
        }

        setTimeout(() => {
          // Restore into card sandwich
          if (pikoEl && content && unlockBtnEl) {
            pikoEl.classList.remove('piko-context-denied', 'piko-denied-return');
            pikoEl.classList.add('piko-context-auth');
            content.insertBefore(pikoEl, unlockBtnEl);
            pikoEl.style.position = 'absolute';
          }

          errorMsg.style.display = 'none';
          codeInput.disabled = false;
          unlockBtn.disabled = false;
          codeInput.value = '';
          codeInput.focus();
          isDenying = false;
          resumePeek();

          if (window.piko && window.piko.react) {
            window.piko.react('idle', Infinity);
          }
        }, RETURN_MS);
      }, DENIED_DISPLAY_MS);
    }, EXIT_MS);
  }

  // ── Event Listeners ───────────────────────────────────────
  if (unlockBtn) {
    unlockBtn.addEventListener('click', attemptUnlock);
    unlockBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      attemptUnlock();
    });
    codeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') attemptUnlock();
    });
  }

  // ── Micro-interactions ────────────────────────────────────
  if (codeInput) {
    codeInput.addEventListener('focus', () => {
      if (isDenying) return;
      pausePeek();
      if (window.piko && window.piko.react) {
        window.piko.react('intro', Infinity);
      }
    });

    codeInput.addEventListener('blur', () => {
      if (isDenying) return;
      resumePeek();
      if (window.piko && window.piko.react) {
        window.piko.react('idle', Infinity);
      }
    });

    let typingTimer = null;
    codeInput.addEventListener('input', () => {
      if (isDenying) return;
      if (!typingTimer && window.piko && window.piko.react) {
        window.piko.react('intro', Infinity);
      }
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => { typingTimer = null; }, 800);
    });
  }

  if (unlockBtn) {
    unlockBtn.addEventListener('mouseenter', () => {
      if (isDenying) return;
      if (window.piko && window.piko.react) {
        window.piko.react('panic', 1500);
      }
    });
    unlockBtn.addEventListener('mouseleave', () => {
      if (isDenying) return;
      if (window.piko && window.piko.react) {
        window.piko.react('idle', Infinity);
      }
    });
  }

  // Pause peek when Piko is speaking
  document.addEventListener('piko:speaking', (e) => {
    if (!authGate || !authGate.isConnected) return;
    if (e.detail.active) {
      pausePeek();
    } else if (codeInput && !codeInput.matches(':focus')) {
      resumePeek();
    }
  });

  // Expose globally as fallback for inline onclick
  window.attemptUnlock = attemptUnlock;
})();
