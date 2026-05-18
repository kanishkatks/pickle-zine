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
      // Remove from DOM after fade out
      setTimeout(() => authGate.remove(), 500);
      
      // Track unlock in DB (only track when actively unlocking, not on page refresh)
      if (window.db) window.db.trackAppUnlock();
      
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
      // Wrong password
      errorMsg.style.display = 'block';
      authGate.querySelector('.auth-gate__content').classList.add('shake-anim');
      setTimeout(() => {
        authGate.querySelector('.auth-gate__content').classList.remove('shake-anim');
      }, 400);
    }
  }

  // Events
  if (unlockBtn) {
    unlockBtn.addEventListener('click', attemptUnlock);
    codeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') attemptUnlock();
    });
  }
})();
