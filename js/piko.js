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
    streak: { type: 'video', src: 'assets/piko/streak.mp4' },
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

  // Interactive Guided App Walkthrough Loop
  let currentStep = 0;
  const STEPS = [
    {
      text: "Welcome to The Global Pickle Zine! I'm Piko, your brine buddy. 🥒 Let me show you around!",
      tab: 'home',
      btnText: 'Show me! 👉'
    },
    {
      text: "This is the Hub! Check out your stats, view high scores, and unlock premium stickers.",
      tab: 'home',
      btnText: 'Next Game 🕹️'
    },
    {
      text: "Tap the Vinegar bottle to play Whack-A-Mold! Save the fermentation jar from fuzzy spores. 🦠",
      tab: 'vinegar',
      btnText: 'Next Game ⚡'
    },
    {
      text: "Tap the Bolt to play Sour Blitz! Test your chemistry knowledge on the pH sourness spectrum. 🧪",
      tab: 'ph-scale',
      btnText: 'Final Tip 💡'
    },
    {
      text: "And click 'Reveal Brine Wisdom' anytime at the bottom to get fun facts! Let's get pickling! 📖",
      tab: 'home',
      btnText: 'Got it! 🥒'
    }
  ];

  function showWalkthroughStep(index) {
    if (index >= STEPS.length) {
      clearSpeech();
      react('idle', Infinity);
      localStorage.setItem('zine-walkthrough-completed', 'true');
      return;
    }
    
    currentStep = index;
    const step = STEPS[index];
    
    // Switch tabs programmatically
    window.location.hash = '#' + step.tab;
    
    // Let Piko glide first, then display speech bubble
    setTimeout(() => {
      react('intro', Infinity);
      
      const buttonsHTML = `
        <button id="piko-wt-next" class="bttn-jelly bttn-xs custom-btn-relish neo-btn-shadow" style="font-weight:700; font-size:11px; padding:4px 10px; font-family:var(--font-display); width: auto;">
          ${step.btnText}
        </button>
        ${index < STEPS.length - 1 ? `
          <button id="piko-wt-skip" class="bttn-jelly bttn-xs custom-btn-wisdom neo-btn-shadow" style="font-weight:700; font-size:11px; padding:4px 10px; font-family:var(--font-display); background:#ececec; color:#222; border-color:#222; width: auto;">
            Skip
          </button>
        ` : ''}
      `;
      
      speech(step.text, Infinity, buttonsHTML);
      
      // Bind action buttons after rendering
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
            clearSpeech();
            react('idle', Infinity);
            localStorage.setItem('zine-walkthrough-completed', 'true');
          };
        }
      }, 50);
    }, 450); // Match slide transition glide timing
  }

  function startGuidedWalkthrough() {
    clearSpeech();
    
    // 1. Initial drop-off sequence: Set to ceiling hang peek state first
    setContext('home');
    container.classList.add('piko-peek');
    
    setTimeout(() => {
      // 2. Remove peek, apply physical land-bounce animation class
      container.classList.remove('piko-peek');
      container.classList.add('piko-land-bounce');
      
      // Play waving hello welcome
      react('intro', Infinity);
      
      // 3. Clean up landing bounce utility class after execution
      setTimeout(() => {
        container.classList.remove('piko-land-bounce');
        // Start showing the first dialogue bubble
        showWalkthroughStep(0);
      }, 950);
    }, 600);
  }

  function say(text, buttons = []) {
    if (!text) {
      clearSpeech();
      return;
    }
    
    // Generate HTML for buttons if any
    let buttonsHTML = '';
    if (buttons && buttons.length > 0) {
      buttons.forEach((btn, idx) => {
        const btnId = `piko-say-btn-${idx}`;
        const isWisdom = btn.text.toLowerCase().includes('got it') || btn.text.toLowerCase().includes('next');
        const btnClass = isWisdom ? 'custom-btn-wisdom' : 'custom-btn-relish';
        buttonsHTML += `
          <button id="${btnId}" class="bttn-jelly bttn-xs ${btnClass} neo-btn-shadow" style="font-weight:700; font-size:11px; padding:4px 10px; font-family:var(--font-display); width: auto; margin: 4px;">
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
            btnEl.onclick = (e) => {
              e.stopPropagation();
              if (btn.action) btn.action();
            };
          }
        });
      }, 50);
    }
  }

  // Global Access
  window.piko = { react, setContext, speech, clearSpeech, startGuidedWalkthrough, say };

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
