/* ═══════════════════════════════════════════════════════════
   AUTH.JS — Zine Secret Code Gate
   The Pickle-Metric Suite // Global Pickle Zine
═══════════════════════════════════════════════════════════ */

(function () {
  // THE SECRET PASSWORD (all uppercase for easy matching)
  // You can easily change this whenever you print a new zine!
  const SECRET_CODE = 'PICKLE2026';
  
  // DOM Refs
  const authGate = document.getElementById('auth-gate');
  const codeInput = document.getElementById('auth-code-input');
  const unlockBtn = document.getElementById('auth-unlock-btn');
  const errorMsg = document.getElementById('auth-error');

  // Check if already unlocked from a previous visit
  if (localStorage.getItem('zine-unlocked') === 'true') {
    unlockApp(false);
  }

  function unlockApp(animate) {
    document.body.classList.remove('is-locked');
    if (animate) {
      authGate.classList.add('is-unlocked');
      
      // 1. Play Piko unlock cheer and speech bubble
      if (window.piko && window.piko.react) {
        window.piko.react('unlock', 2000);
        window.piko.speech("ACCESS GRANTED! 🔓", 1800);
      }

      // Remove auth gate from DOM after fade out
      setTimeout(() => authGate.remove(), 500);
      
      // Track unlock in DB
      if (window.db) window.db.trackAppUnlock();
      
      // 2. Initiate guided welcome walkthrough drop-and-land sequence
      setTimeout(() => {
        if (window.piko && window.piko.startGuidedWalkthrough) {
          window.piko.startGuidedWalkthrough();
        }
      }, 2000);
      
    } else {
      authGate.remove();
    }
  }

  function attemptUnlock() {
    const enteredCode = codeInput.value.trim().toUpperCase();
    
    if (enteredCode === SECRET_CODE) {
      errorMsg.style.display = 'none';
      localStorage.setItem('zine-unlocked', 'true');
      unlockApp(true);
    } else {
      // Wrong password — shake card
      errorMsg.style.display = 'block';
      authGate.querySelector('.auth-gate__content').classList.add('shake-anim');
      setTimeout(() => {
        authGate.querySelector('.auth-gate__content').classList.remove('shake-anim');
      }, 400);

      const pikoEl = document.getElementById('piko-reaction-container');
      const authContent = authGate.querySelector('.auth-gate__content');
      const unlockBtnEl = document.getElementById('auth-unlock-btn');

      if (pikoEl) {
        // Kill transition AND pop animation so he doesn't fly to the right
        pikoEl.style.transition = 'none';
        pikoEl.classList.remove('piko-pop');
        document.body.appendChild(pikoEl);
        pikoEl.classList.remove('piko-context-auth');
        pikoEl.classList.add('piko-context-denied');
      }

      // Trigger denied reaction and speech bubble
      if (window.piko && window.piko.react) {
        window.piko.react('denied', 5000);
        window.piko.speech("Access Denied! Check the zine! ❌", 5000);
      }

      // After 5 seconds, restore Piko back into the auth card sandwich
      setTimeout(() => {
        if (pikoEl && authContent && unlockBtnEl) {
          pikoEl.style.transition = 'none';
          pikoEl.style.transform = 'none';

          pikoEl.classList.remove('piko-context-denied');
          pikoEl.classList.add('piko-context-auth');
          authContent.insertBefore(pikoEl, unlockBtnEl);
          pikoEl.style.position = 'absolute';
          errorMsg.style.display = 'none'; // Clear error message

          if (window.piko && window.piko.react) {
            window.piko.react('idle', Infinity);
          }

          // Re-enable transitions after paint settles (2 frames)
          requestAnimationFrame(() => requestAnimationFrame(() => {
            pikoEl.style.transition = '';
            pikoEl.style.transform = '';
          }));
        }
      }, 5200);
    }
  }

  // Events
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

  // Expose globally as fallback for inline onclick
  window.attemptUnlock = attemptUnlock;
})();
