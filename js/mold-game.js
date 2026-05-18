/* ═══════════════════════════════════════════════════════════
   WHACK-A-MOLD GAME: THE MICROBIOME MAYHEM
   The Pickle-Metric Suite // Global Pickle Zine
═══════════════════════════════════════════════════════════ */

(function () {
  // Game Config
  const GAME_DURATION = 30; // seconds
  const BASE_SPAWN_TIME = 1000; // ms
  const MIN_SPAWN_TIME = 400; // ms
  
  // Microbiome Species Library
  const SPECIES = [
    // BAD GUYS (Weight: high)
    { id: 'mold',  emoji: '🦠', type: 'bad',  score: 10,  weight: 50, lifetime: 800 },
    { id: 'kahm',  emoji: '☁️', type: 'bad',  score: 25,  weight: 15, lifetime: 450 }, // fast
    { id: 'black', emoji: '🌚', type: 'bad',  score: 15,  weight: 10, lifetime: 1200, drain: true }, // score drain
    
    // GOOD GUYS (Weight: medium)
    { id: 'lacto', emoji: '🧫', type: 'good', score: -20, weight: 15, lifetime: 800 },
    { id: 'garlic',emoji: '🧄', type: 'good', score: -15, weight: 10, lifetime: 800 },
    { id: 'dill',  emoji: '🌿', type: 'good', score: -25, weight: 8,  lifetime: 800 },
    { id: 'scallion',emoji:'🧅', type: 'good', score: -15, weight: 10, lifetime: 800 },
    
    // POWER-UPS (Weight: low)
    { id: 'splash',emoji: '🌊', type: 'power', effect: 'clear', weight: 5,  lifetime: 700 },
    { id: 'freeze',emoji: '🧊', type: 'power', effect: 'freeze', weight: 4, lifetime: 700 }
  ];

  // State
  let score = 0;
  let timeLeft = GAME_DURATION;
  let isPlaying = false;
  let isFrozen = false;
  let gameTimer = null;
  let spawnTimer = null;
  let activeHole = null;
  let drainInterval = null;

  // DOM Refs
  const holes = document.querySelectorAll('.mold-hole');
  const scoreDisplay = document.getElementById('mold-score');
  const timerDisplay = document.getElementById('mold-timer');
  const overlay = document.getElementById('mold-overlay');
  const overlayTitle = document.getElementById('mold-overlay-title');
  const overlayDesc = document.getElementById('mold-overlay-desc');
  const overlayScore = document.getElementById('mold-overlay-score');
  const btnStart = document.getElementById('btn-start-mold');
  const btnShowGuide = document.getElementById('btn-show-guide');
  const fieldGuide = document.getElementById('field-guide');
  const btnCloseGuide = document.getElementById('close-guide');
  const gridContainer = document.getElementById('mold-grid');
  
  const nameEntry = document.getElementById('mold-arcade-name-entry');
  const nameInput = document.getElementById('mold-arcade-name');
  const btnSubmitScore = document.getElementById('btn-submit-mold-score');

  function init() {
    btnStart.addEventListener('click', startCountdown);
    btnShowGuide.addEventListener('click', () => fieldGuide.style.display = 'flex');
    btnCloseGuide.addEventListener('click', () => fieldGuide.style.display = 'none');
    holes.forEach(hole => hole.addEventListener('click', handleHoleClick));

    btnSubmitScore.addEventListener('click', async () => {
      const initials = nameInput.value.trim().toUpperCase();
      if (initials.length === 3) {
        btnSubmitScore.disabled = true;
        btnSubmitScore.textContent = 'Submitting...';
        const success = await window.db.submitScore(initials, score);
        if (success) {
          btnSubmitScore.textContent = '✅ Submitted!';
          setTimeout(() => {
            nameEntry.style.display = 'none';
            btnSubmitScore.disabled = false;
            btnSubmitScore.textContent = 'Submit Score';
          }, 1500);
        } else {
          btnSubmitScore.textContent = '❌ Error';
          btnSubmitScore.disabled = false;
        }
      } else {
        alert("Please enter 3 initials!");
      }
    });
  }

  function startCountdown() {
    overlayTitle.textContent = "Get Ready!";
    btnStart.style.display = 'none';
    btnShowGuide.style.display = 'none';
    
    let count = 3;
    overlayDesc.textContent = count;
    
    const countTimer = setInterval(() => {
      count--;
      if (count > 0) {
        overlayDesc.textContent = count;
      } else {
        clearInterval(countTimer);
        startGame();
      }
    }, 1000);
  }

  function startGame() {
    score = 0;
    timeLeft = GAME_DURATION;
    isPlaying = true;
    isFrozen = false;

    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft + 's';
    overlay.style.display = 'none';
    btnStart.style.display = 'inline-block';
    btnShowGuide.style.display = 'inline-block';

    gameTimer = setInterval(updateTimer, 1000);
    drainInterval = setInterval(checkScoreDrain, 1000);
    spawnLoop();
  }

  function updateTimer() {
    if (isFrozen) return; // Time freeze power-up
    timeLeft--;
    timerDisplay.textContent = timeLeft + 's';

    if (timeLeft <= 0) {
      endGame();
    }
  }

  function checkScoreDrain() {
    if (!isPlaying) return;
    // Check if any black mold 🌚 is currently active
    const activeBlackMold = Array.from(holes).some(h => h.classList.contains('is-active') && h.dataset.species === 'black');
    if (activeBlackMold) {
      score = Math.max(0, score - 2);
      scoreDisplay.textContent = score;
      // Visual hint
      scoreDisplay.style.color = 'var(--rust)';
      setTimeout(() => scoreDisplay.style.color = '', 500);
    }
  }

  function spawnLoop() {
    if (!isPlaying) return;

    // Calculate spawn rate based on time remaining (faster over time)
    const progress = (GAME_DURATION - timeLeft) / GAME_DURATION;
    let currentSpawnTime = BASE_SPAWN_TIME - (progress * (BASE_SPAWN_TIME - MIN_SPAWN_TIME));
    
    if (isFrozen) currentSpawnTime *= 2.5; // Slow down spawn loop during freeze

    spawnItem();

    spawnTimer = setTimeout(spawnLoop, currentSpawnTime);
  }

  function spawnItem() {
    // Clear previous holes if multiple items are somehow active (cleanup)
    // Only spawn if no hole is currently active to keep it simple whack-a-mole style
    const activeHoles = Array.from(holes).filter(h => h.classList.contains('is-active'));
    if (activeHoles.length >= 2) return; // Max 2 items at once

    // Pick random species based on weight
    const species = getRandomSpecies();
    
    // Pick random hole that isn't active
    const inactiveHoles = Array.from(holes).filter(h => !h.classList.contains('is-active'));
    if (inactiveHoles.length === 0) return;
    const hole = inactiveHoles[Math.floor(Math.random() * inactiveHoles.length)];

    hole.textContent = species.emoji;
    hole.dataset.type = species.type;
    hole.dataset.species = species.id;
    hole.dataset.effect = species.effect || '';
    hole.dataset.score = species.score || 0;
    hole.classList.add('is-active');

    // Auto clear after lifetime
    setTimeout(() => {
      if (hole.dataset.species === species.id && hole.classList.contains('is-active')) {
        hole.classList.remove('is-active');
        hole.textContent = '';
      }
    }, species.lifetime * (isFrozen ? 2 : 1));
  }

  function getRandomSpecies() {
    const totalWeight = SPECIES.reduce((acc, s) => acc + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const s of SPECIES) {
      if (random < s.weight) return s;
      random -= s.weight;
    }
    return SPECIES[0];
  }

  function handleHoleClick(e) {
    if (!isPlaying) return;
    const hole = e.currentTarget;

    if (hole.classList.contains('is-active')) {
      const type = hole.dataset.type;
      const hScore = parseInt(hole.dataset.score);
      const effect = hole.dataset.effect;

      if (type === 'bad') {
        score += hScore;
        showFeedback(hole, `+${hScore}`, 'var(--relish)');
        window.piko.react('success', 1000);
      } else if (type === 'good') {
        score = Math.max(0, score + hScore); // hScore is negative
        showFeedback(hole, hScore, 'var(--rust)');
        triggerShake();
        window.piko.react('fail', 2000);
      } else if (type === 'power') {
        handlePowerUp(effect, hole);
      }

      scoreDisplay.textContent = score;
      hole.classList.remove('is-active');
      hole.textContent = '';
    }
  }

  function handlePowerUp(effect, hole) {
    if (effect === 'clear') {
      showFeedback(hole, 'SPLASH!', 'var(--dill-bright)');
      // Clear all active bad mold
      holes.forEach(h => {
        if (h.classList.contains('is-active') && h.dataset.type === 'bad') {
          h.classList.remove('is-active');
          h.textContent = '';
        }
      });
      // Visual effect
      gridContainer.classList.add('mold-grid-splash');
      setTimeout(() => gridContainer.classList.remove('mold-grid-splash'), 500);
    } else if (effect === 'freeze') {
      showFeedback(hole, 'FREEZE!', 'var(--dill-bright)');
      isFrozen = true;
      gridContainer.classList.add('mold-grid-frozen');
      setTimeout(() => {
        isFrozen = false;
        gridContainer.classList.remove('mold-grid-frozen');
      }, 5000);
    }
  }

  function showFeedback(el, text, color) {
    const feedback = document.createElement('div');
    feedback.textContent = text;
    feedback.style.position = 'absolute';
    feedback.style.color = color;
    feedback.style.fontWeight = 'bold';
    feedback.style.fontSize = '1.5rem';
    feedback.style.pointerEvents = 'none';
    feedback.style.zIndex = '5';
    feedback.style.animation = 'floatUp 0.6s ease-out forwards';
    el.appendChild(feedback);
    setTimeout(() => feedback.remove(), 600);
  }

  function triggerShake() {
    gridContainer.style.animation = 'shake 0.3s ease-in-out';
    setTimeout(() => gridContainer.style.animation = '', 300);
  }

  function endGame() {
    isPlaying = false;
    clearInterval(gameTimer);
    clearInterval(drainInterval);
    clearTimeout(spawnTimer);
    
    holes.forEach(hole => {
      hole.classList.remove('is-active');
      hole.textContent = '';
    });

    overlay.style.display = 'flex';
    overlayTitle.textContent = "Jar Saved!";
    overlayDesc.textContent = "Final Score:";
    overlayScore.style.display = 'block';
    overlayScore.textContent = score;
    
    nameEntry.style.display = score > 0 ? 'block' : 'none';
    window.piko.react('win', 5000);
    
    btnStart.textContent = "Play Again";
    btnStart.style.display = 'inline-block';
    btnShowGuide.style.display = 'inline-block';
  }

  init();
})();
