/* ═══════════════════════════════════════════════════════════
   PIKO.JS — The Arcade Mascot Reaction Engine
   Internal Name: Piko // External: Mascot
═══════════════════════════════════════════════════════════ */

(function () {
  // Asset Mapping
  const ASSETS = {
    idle: { type: 'img', src: 'assets/piko/base.png' },
    success: { type: 'img', src: 'assets/piko/success.png' },
    celebrate: { type: 'img', src: 'assets/piko/celebrate.png' },
    fail: { type: 'video', src: 'assets/piko/fail.mp4' },
    win: { type: 'video', src: 'assets/piko/win.mp4' },
    streak: { type: 'video', src: 'assets/piko/streak.mp4' },
    sour: { type: 'img', src: 'assets/piko/sour.png' },
    panic: { type: 'video', src: 'assets/piko/panic.mp4' }
  };

  const container = document.getElementById('piko-reaction-container');
  let currentTimer = null;
  let currentEmotion = null;

  // Preload priority images
  ['base.png', 'success.png', 'celebrate.png'].forEach(file => {
    const img = new Image();
    img.src = `assets/piko/${file}`;
  });

  function react(emotion, duration = 3000) {
    if (!container || !ASSETS[emotion]) return;
    if (currentEmotion === emotion && ASSETS[emotion].type !== 'video') return;

    // Clear previous state
    if (currentTimer) clearTimeout(currentTimer);
    container.innerHTML = '';
    
    // Ensure container is visible
    container.classList.add('is-active');
    currentEmotion = emotion;

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
      el.style.opacity = '0';
      el.onload = () => el.style.opacity = '1';
    }

    el.style.width = '100%';
    el.style.height = '100%';
    el.style.objectFit = 'contain';
    el.style.transition = 'opacity 0.2s ease-in';

    container.appendChild(el);

    // Return to idle after duration
    if (duration !== Infinity) {
      currentTimer = setTimeout(() => {
        // Return to idle but keep it subtle
        react('idle', Infinity);
        // On idle, we can optionally hide Piko or keep him there
        // container.classList.remove('is-active'); 
      }, duration);
    }
  }

  // Global Access
  window.piko = { react };

  // Initialize with idle
  window.addEventListener('load', () => {
    setTimeout(() => react('idle', Infinity), 1000);
  });
})();
