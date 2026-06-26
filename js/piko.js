/* ═══════════════════════════════════════════════════════════
   PIKO.JS — The Arcade Mascot Reaction Engine
   Internal Name: Piko // External: Mascot
   ═══════════════════════════════════════════════════════════ */

(function () {
  const ASSETS = {
    idle: { type: 'img', src: 'assets/piko/base.png' },
    intro: { type: 'img', src: 'assets/piko/intro.png' },
    success: { type: 'img', src: 'assets/piko/success.png' },
    celebrate: { type: 'img', src: 'assets/piko/celebrate.png' },
    fail: { type: 'video', src: 'assets/piko/fail.mp4' },
    win: { type: 'video', src: 'assets/piko/win.mp4' },
    sour: { type: 'img', src: 'assets/piko/sour.png' },
    'extreme-sour': { type: 'img', src: 'assets/piko/extreme-sour.png' },
    'opposite-sour': { type: 'img', src: 'assets/piko/opposite-sour.png' },
    panic: { type: 'img', src: 'assets/piko/panic.png' },
    wisdom: { type: 'img', src: 'assets/piko/wisdom.png' },
    denied: { type: 'img', src: 'assets/piko/denied.png' },
    unlock: { type: 'img', src: 'assets/piko/celebrate.png' },
    'loving-it': { type: 'img', src: 'assets/piko/loving-it.png' },
    'hating-it': { type: 'img', src: 'assets/piko/hating-it.png' }
  };

  const container = document.getElementById('piko-reaction-container');
  let currentTimer = null;
  let currentEmotion = null;

  // Preload priority images
  ['base.png', 'success.png', 'celebrate.png', 'denied.png'].forEach(file => {
    const img = new Image();
    img.src = `assets/piko/${file}`;
  });

  // Expose context changes (coordinates and classes)
  function setContext(contextName) {
    if (!container) return;
    
    // Strip previous context classes
    container.classList.forEach(className => {
      if (className.startsWith('piko-context-')) {
        container.classList.remove(className);
      }
    });
    
    // Remove the peeking modifier if switching away from home
    if (contextName !== 'home') {
      container.classList.remove('piko-peek');
    }
    
    // Apply new context class
    container.classList.add(`piko-context-${contextName}`);

    // Manage DOM position
    if (contextName === 'auth') {
      const authContent = document.querySelector('.auth-gate__content');
      const unlockBtn = document.getElementById('auth-unlock-btn');
      if (authContent && unlockBtn) {
        authContent.insertBefore(container, unlockBtn);
        container.style.position = 'absolute';
      }
    } else if (contextName === 'auth-focus') {
      // Keep Piko outside the card so it can't block the button
      const authGate = document.getElementById('auth-gate');
      if (authGate) {
        authGate.appendChild(container);
        container.style.position = 'fixed';
      }
    } else {
      document.body.appendChild(container);
      container.style.position = 'fixed';
    }
  }

  function react(emotion, duration = 3000, force = false) {
    if (!container || !ASSETS[emotion]) return;
    if (!force && currentEmotion === emotion && ASSETS[emotion].type !== 'video') return;

    // Trigger squash-and-stretch pop feedback animation
    container.classList.remove('piko-pop');
    void container.offsetWidth; // Force layout reflow
    container.classList.add('piko-pop');

    // Clear previous state (but preserve the speech bubble elements if any)
    if (currentTimer) clearTimeout(currentTimer);
    
    const existingBubble = document.getElementById('piko-speech-bubble-floating');
    container.innerHTML = '';
    if (existingBubble) container.appendChild(existingBubble);
    
    currentEmotion = emotion;
    container.setAttribute('data-emotion', emotion);

    const asset = ASSETS[emotion];
    let el;

    if (asset.type === 'video') {
      el = document.createElement('video');
      el.src = asset.src;
      el.autoplay = true;
      el.muted = true;
      el.loop = true;
      el.playsInline = true;
      el.style.opacity = '0';
      el.oncanplay = () => el.style.opacity = '1';
    } else {
      el = document.createElement('img');
      el.src = asset.src;
      if (emotion === 'intro') {
        el.classList.add('piko-wave-puppet');
      }
      
      // For immediate reactions like 'denied', don't fade in, just show instantly
      if (emotion === 'denied') {
        el.style.opacity = '1';
      } else {
        el.style.opacity = '0';
        el.onload = () => el.style.opacity = '1';
        el.style.transition = 'opacity 0.2s ease-in';
      }
    }

    el.style.width = '100%';
    el.style.height = '100%';
    el.style.objectFit = 'contain';

    container.appendChild(el);

    // Return to idle after duration
    if (duration !== Infinity) {
      currentTimer = setTimeout(() => {
        react('idle', Infinity);
      }, duration);
    }
  }

  // Floating Speech Bubble Helpers
  function speech(text, duration = Infinity, buttonsHTML = '') {
    if (!container) return;
    
    let bubble = document.getElementById('piko-speech-bubble-floating');
    if (!bubble) {
      bubble = document.createElement('div');
      bubble.id = 'piko-speech-bubble-floating';
      bubble.className = 'piko-speech-bubble-floating';
      container.appendChild(bubble);
    }
    
    // Clear previous timeouts on bubble
    if (bubble._timer) clearTimeout(bubble._timer);
    
    bubble.innerHTML = `
      <div style="font-weight: 700; font-family: var(--font-display);">${text}</div>
      ${buttonsHTML ? `<div style="display:flex; justify-content:center; gap:12px; margin-top:10px; pointer-events:auto;">${buttonsHTML}</div>` : ''}
    `;
    
    // Trigger slide-in
    bubble.classList.add('is-active');
    document.dispatchEvent(new CustomEvent('piko:speaking', { detail: { active: true } }));

    if (duration !== Infinity) {
      bubble._timer = setTimeout(() => {
        bubble.classList.remove('is-active');
        document.dispatchEvent(new CustomEvent('piko:speaking', { detail: { active: false } }));
      }, duration);
    }
  }

  function clearSpeech() {
    const bubble = document.getElementById('piko-speech-bubble-floating');
    if (bubble) {
      bubble.classList.remove('is-active');
      if (bubble._timer) clearTimeout(bubble._timer);
      document.dispatchEvent(new CustomEvent('piko:speaking', { detail: { active: false } }));
    }
  }

  // ── Celebration Modal ──────────────────────────────────────
  function showCelebrationModal(callback) {
    let modal = document.getElementById('piko-celebration-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'piko-celebration-modal';
      modal.className = 'wisdom-modal-overlay';
      modal.style.cursor = 'pointer';
      modal.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:var(--gap-md);">
          <img src="assets/piko/celebrate.png" style="width:200px; height:200px; object-fit:contain;" />
          <div class="piko-speech-bubble" style="max-width:280px; font-size:1.4rem;">${window.i18n.t('auth.granted')}</div>
          <div id="celebration-subtitle" style="color:var(--bg); font-family:var(--font-display); font-size:13px; opacity:0.8; margin-top:var(--gap-sm);">${window.i18n.t('walkthrough.tap_continue')}</div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    modal.classList.add('is-active');

    function dismiss() {
      modal.removeEventListener('click', dismiss);
      modal.classList.remove('is-active');
      setTimeout(() => {
        modal.remove();
        if (callback) callback();
      }, 300);
    }

    // Tap to dismiss or auto-dismiss after 5s
    modal.addEventListener('click', dismiss);
    setTimeout(dismiss, 5000);
  }

  // ── Simplified Walkthrough (Full-screen modal style) ───────
  let currentStep = 0;
  let walkthroughModal = null;

  function getSteps() {
    return [
      {
        text: window.i18n.t('walkthrough.step1_text'),
        tab: 'home',
        img: 'assets/piko/intro.png',
        btnText: window.i18n.t('walkthrough.step1_btn')
      },
      {
        text: window.i18n.t('walkthrough.step2_text'),
        tab: 'vinegar',
        img: 'assets/piko/panic.png',
        btnText: window.i18n.t('walkthrough.step2_btn')
      },
      {
        text: window.i18n.t('walkthrough.step3_text'),
        tab: 'ph-scale',
        img: 'assets/piko/sour.png',
        btnText: window.i18n.t('walkthrough.step3_btn')
      },
      {
        text: window.i18n.t('walkthrough.step4_text'),
        tab: 'home',
        img: 'assets/piko/wisdom.png',
        btnText: window.i18n.t('walkthrough.step4_btn')
      }
    ];
  }

  function getWalkthroughModal() {
    if (!walkthroughModal) {
      walkthroughModal = document.createElement('div');
      walkthroughModal.id = 'piko-walkthrough-modal';
      walkthroughModal.className = 'wisdom-modal-overlay';
      document.body.appendChild(walkthroughModal);
    }
    return walkthroughModal;
  }

  function showWalkthroughStep(index) {
    const STEPS = getSteps();
    if (index >= STEPS.length) {
      const modal = getWalkthroughModal();
      modal.classList.remove('is-active');
      setTimeout(() => modal.remove(), 300);
      walkthroughModal = null;
      window.walkthroughActive = false;
      setContext('home');
      react('idle', Infinity);
      localStorage.setItem('zine-walkthrough-completed', 'true');
      return;
    }

    currentStep = index;
    const step = STEPS[index];
    const isLast = index === STEPS.length - 1;

    window.location.hash = '#' + step.tab;

    const modal = getWalkthroughModal();
    modal.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:var(--gap-md); padding:var(--gap-lg);">
        <img src="${step.img}" style="width:180px; height:180px; object-fit:contain;" />
        <div class="piko-speech-bubble" style="max-width:300px; font-size:15px;">${step.text}</div>
        <div style="display:flex; gap:var(--gap-sm); pointer-events:auto;">
          <button id="piko-wt-next" style="background:var(--relish); color:var(--bg); border:2px solid var(--ink); border-radius:var(--radius-md); padding:8px 16px; font-family:var(--font-display); font-weight:700; font-size:13px; cursor:pointer; box-shadow:3px 3px 0 var(--ink);">
            ${step.btnText}
          </button>
          ${!isLast ? `
            <button id="piko-wt-skip" style="background:#ececec; color:#222; border:2px solid #222; border-radius:var(--radius-md); padding:8px 16px; font-family:var(--font-display); font-weight:700; font-size:13px; cursor:pointer; box-shadow:3px 3px 0 #222;">
              ${window.i18n.t('walkthrough.skip')}
            </button>
          ` : ''}
        </div>
      </div>
    `;

    modal.classList.add('is-active');

    setTimeout(() => {
      const nextBtn = document.getElementById('piko-wt-next');
      const skipBtn = document.getElementById('piko-wt-skip');
      if (nextBtn) {
        nextBtn.onclick = (e) => {
          e.stopPropagation();
          showWalkthroughStep(currentStep + 1);
        };
      }
      if (skipBtn) {
        skipBtn.onclick = (e) => {
          e.stopPropagation();
          const m = getWalkthroughModal();
          m.classList.remove('is-active');
          setTimeout(() => m.remove(), 300);
          walkthroughModal = null;
          window.walkthroughActive = false;
          setContext('home');
          react('idle', Infinity);
          localStorage.setItem('zine-walkthrough-completed', 'true');
        };
      }
    }, 50);
  }

  function startGuidedWalkthrough() {
    window.walkthroughActive = true;
    setContext('home');
    showWalkthroughStep(0);
  }

  // Global Access
  function say(text, buttons = []) {
    if (!text) { clearSpeech(); return; }
    let buttonsHTML = '';
    if (buttons && buttons.length > 0) {
      buttons.forEach((btn, idx) => {
        const btnId = `piko-say-btn-${idx}`;
        buttonsHTML += `
          <button id="${btnId}" style="background:var(--relish); color:var(--bg); border:2px solid var(--ink); border-radius:var(--radius-md); padding:4px 12px; font-family:var(--font-display); font-weight:700; font-size:11px; cursor:pointer; box-shadow:3px 3px 0 var(--ink); margin:4px;">
            ${btn.text}
          </button>
        `;
      });
    }
    speech(text, Infinity, buttonsHTML);
    if (buttons && buttons.length > 0) {
      setTimeout(() => {
        buttons.forEach((btn, idx) => {
          const btnEl = document.getElementById(`piko-say-btn-${idx}`);
          if (btnEl) {
            btnEl.onclick = (e) => { e.stopPropagation(); if (btn.action) btn.action(); };
          }
        });
      }, 50);
    }
  }

  window.piko = { react, setContext, speech, clearSpeech, startGuidedWalkthrough, showCelebrationModal, say };

  // Initial boot coordinate selector
  window.addEventListener('load', () => {
    if (!container) return;
    
    const isUnlocked = localStorage.getItem('zine-unlocked') === 'true';
    const isWalkthroughDone = localStorage.getItem('zine-walkthrough-completed') === 'true';
    
    if (!isUnlocked) {
      // App is locked: Piko sits on top of the Auth Gate card immediately!
      setContext('auth');
      react('idle', Infinity);
    } else {
      // App is already unlocked:
      if (!isWalkthroughDone) {
        startGuidedWalkthrough();
      } else {
        // Direct land sitting on Home Hub banner perch
        setContext('home');
        react('idle', Infinity);
      }
    }
  });
})();
