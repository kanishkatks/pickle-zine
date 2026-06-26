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
  let countdownTimer = null;

  // Mascot Tutorial State
  let tutorialInterval = null;
  let tutorialStep = 0;

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
  const gridContainer = document.getElementById('mold-grid');
  
  const nameEntry = document.getElementById('mold-arcade-name-entry');
  const nameInput = document.getElementById('mold-arcade-name');
  const btnSubmitScore = document.getElementById('btn-submit-mold-score');
  const btnExitMoldArcade = document.getElementById('btn-exit-mold-arcade');

  function init() {
    btnStart.addEventListener('click', startCountdown);
    btnShowGuide.addEventListener('click', startInteractiveTutorial);
    if (btnExitMoldArcade) {
      btnExitMoldArcade.addEventListener('click', exitArcadeMode);
    }
    holes.forEach(hole => hole.addEventListener('click', handleHoleClick));

    btnSubmitScore.addEventListener('click', async () => {
      const initials = nameInput.value.trim().toUpperCase();
      if (initials.length === 3) {
        btnSubmitScore.disabled = true;
        btnSubmitScore.textContent = window.i18n.t('mold.submitting');
        const success = await window.db.submitScore(initials, score);
        if (success) {
          btnSubmitScore.textContent = '✅ ' + window.i18n.t('mold.submitted');
          setTimeout(() => {
            nameEntry.style.display = 'none';
            btnSubmitScore.disabled = false;
            btnSubmitScore.textContent = window.i18n.t('mold.submit');
          }, 1500);
        } else {
          btnSubmitScore.textContent = '❌ ' + window.i18n.t('mold.error');
          btnSubmitScore.disabled = false;
        }
      } else {
        alert(window.i18n.t('mold.initials_error'));
      }
    });

    // Register active page listeners for dynamic tutorial activation
    window.addEventListener('hashchange', handlePageChange);
    window.addEventListener('load', handlePageChange);
    // Initial trigger
    setTimeout(handlePageChange, 500);
  }

  function handlePageChange() {
    if (window.walkthroughActive) return;
    const hash = window.location.hash.replace('#', '') || 'home';
    if (hash === 'vinegar') {
      if (!isPlaying) {
        startTutorialLoop();
      }
    } else {
      stopTutorialLoop();
      if (isPlaying) {
        endGame();
      }
    }
  }

  function startTutorialLoop() {
    if (tutorialInterval) clearInterval(tutorialInterval);

    // Dock Piko in game tutorial context
    if (window.piko && window.piko.setContext) {
      window.piko.setContext('game-tutorial');
    }

    // Move Piko into the spot div so it's in document flow
    const pikoEl = document.getElementById('piko-reaction-container');
    const spot = document.getElementById('piko-mold-spot');
    if (pikoEl && spot && pikoEl.parentNode !== spot) {
      spot.appendChild(pikoEl);
      pikoEl.style.position = 'relative';
    }

    const badCard = document.getElementById('mold-tut-bad-card');
    const goodCard = document.getElementById('mold-tut-good-card');
    const mascotEl = document.getElementById('piko-reaction-container');

    function runStep() {
      if (isPlaying) return;
      if (tutorialStep === 0) {
        // Step 1: Highlight Bad Spore card, react hating-it
        if (badCard) {
          badCard.style.transform = 'scale(1.06)';
          badCard.style.borderColor = 'var(--rust)';
          badCard.style.boxShadow = '0 0 12px var(--rust)';
        }
        if (goodCard) {
          goodCard.style.transform = 'scale(1)';
          goodCard.style.borderColor = 'var(--ink)';
          goodCard.style.boxShadow = '3px 3px 0 var(--ink)';
        }
        if (window.piko && window.piko.react) {
          window.piko.react('hating-it', 2200);
        }
        tutorialStep = 1;
      } else {
        // Step 2: Highlight Good Bacteria card, react loving-it
        if (goodCard) {
          goodCard.style.transform = 'scale(1.06)';
          goodCard.style.borderColor = 'var(--relish)';
          goodCard.style.boxShadow = '0 0 12px var(--relish)';
        }
        if (badCard) {
          badCard.style.transform = 'scale(1)';
          badCard.style.borderColor = 'var(--ink)';
          badCard.style.boxShadow = '3px 3px 0 var(--ink)';
        }
        if (window.piko && window.piko.react) {
          window.piko.react('loving-it', 2200);
        }
        tutorialStep = 0;
      }
    }

    runStep();
    tutorialInterval = setInterval(runStep, 2500);
  }

  function stopTutorialLoop() {
    if (tutorialInterval) {
      clearInterval(tutorialInterval);
      tutorialInterval = null;
    }
    const badCard = document.getElementById('mold-tut-bad-card');
    const goodCard = document.getElementById('mold-tut-good-card');
    if (badCard) {
      badCard.style.transform = '';
      badCard.style.borderColor = '';
      badCard.style.boxShadow = '';
    }
    if (goodCard) {
      goodCard.style.transform = '';
      goodCard.style.borderColor = '';
      goodCard.style.boxShadow = '';
    }
  }

  function enterArcadeMode() {
    const workspaceCard = document.querySelector('#vinegar .tool-workspace-card');
    if (workspaceCard) {
      workspaceCard.classList.add('is-arcade-active');
    }
    document.body.style.overflow = 'hidden'; // lock scroll!
    if (btnExitMoldArcade) btnExitMoldArcade.style.display = 'block'; // show exit button!
    stopTutorialLoop();
  }

  function exitArcadeMode() {
    if (window.piko && window.piko.say) {
      window.piko.say('');
    }
    isPlaying = false;
    clearInterval(gameTimer);
    clearInterval(drainInterval);
    clearTimeout(spawnTimer);
    clearInterval(countdownTimer);
    countdownTimer = null;

    stopInteractiveTutorial();
    
    const workspaceCard = document.querySelector('#vinegar .tool-workspace-card');
    if (workspaceCard) {
      workspaceCard.classList.remove('is-arcade-active');
    }
    document.body.style.overflow = ''; // unlock scroll!
    if (btnExitMoldArcade) btnExitMoldArcade.style.display = 'none'; // hide exit button!
    
    overlay.style.display = 'flex';
    overlayScore.style.display = 'none';
    nameEntry.style.display = 'none';
    overlayTitle.textContent = window.i18n.t('mold.title');
    overlayDesc.textContent = window.i18n.t('mold.desc');
    btnStart.textContent = window.i18n.t('mold.start') + " 🕹️";
    btnStart.style.display = 'inline-block';
    btnShowGuide.style.display = 'inline-block';
    
    startTutorialLoop();
  }

  function startInteractiveTutorial() {
    enterArcadeMode();
    overlay.style.display = 'none';
    
    if (window.piko && window.piko.setContext) {
      window.piko.setContext('game-tutorial');
    }

    const badCard = document.getElementById('mold-tut-bad-card');
    const goodCard = document.getElementById('mold-tut-good-card');
    const mascotEl = document.getElementById('piko-reaction-container');

    function runTutorialStep(step) {
      if (step === 0) {
        if (badCard) {
          badCard.style.transform = 'scale(1.1)';
          badCard.style.borderColor = 'var(--rust)';
          badCard.style.boxShadow = '0 0 16px var(--rust)';
        }
        if (goodCard) {
          goodCard.style.transform = 'scale(1)';
          goodCard.style.borderColor = '';
          goodCard.style.boxShadow = '';
        }
        if (window.piko && window.piko.react) {
          window.piko.react('hating-it');
        }
        if (window.piko && window.piko.say) {
          window.piko.say('🦠 ' + window.i18n.t('mold.tut_bad') + ' ❌', [
            { text: window.i18n.t('mold.got_it') + ' 👉', action: () => runTutorialStep(1) }
          ]);
        }
      } else if (step === 1) {
        if (goodCard) {
          goodCard.style.transform = 'scale(1.1)';
          goodCard.style.borderColor = 'var(--relish)';
          goodCard.style.boxShadow = '0 0 16px var(--relish)';
        }
        if (badCard) {
          badCard.style.transform = 'scale(1)';
          badCard.style.borderColor = '';
          badCard.style.boxShadow = '';
        }
        if (window.piko && window.piko.react) {
          window.piko.react('loving-it');
        }
        if (window.piko && window.piko.say) {
          window.piko.say('🧫 ' + window.i18n.t('mold.tut_good') + ' ❤️', [
            { text: window.i18n.t('mold.start_game_tut') + ' ⚡', action: () => {
              stopInteractiveTutorial();
              startCountdown();
            }}
          ]);
        }
      }
    }

    runTutorialStep(0);
  }

  function stopInteractiveTutorial() {
    if (window.piko && window.piko.say) {
      window.piko.say('');
    }
    const badCard = document.getElementById('mold-tut-bad-card');
    const goodCard = document.getElementById('mold-tut-good-card');
    if (badCard) {
      badCard.style.transform = '';
      badCard.style.borderColor = '';
      badCard.style.boxShadow = '';
    }
    if (goodCard) {
      goodCard.style.transform = '';
      goodCard.style.borderColor = '';
      goodCard.style.boxShadow = '';
    }
  }

  function startCountdown() {
    enterArcadeMode();
    stopTutorialLoop();
    stopInteractiveTutorial();
    
    // Smooth glide Piko from tutorial shelf to the active Timer card header!
    if (window.piko && window.piko.setContext) {
      window.piko.setContext('game-active');
    }

    overlayTitle.textContent = window.i18n.t('mold.get_ready');
    btnStart.style.display = 'none';
    btnShowGuide.style.display = 'none';
    if (btnExitMoldArcade) btnExitMoldArcade.style.display = 'none'; // hide exit button during active play
    
    let count = 3;
    overlayDesc.textContent = count;
    
    countdownTimer = setInterval(() => {
      count--;
      if (count > 0) {
        overlayDesc.textContent = count;
      } else {
        clearInterval(countdownTimer);
        countdownTimer = null;
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

    // 10 Second countdown panic trigger
    if (timeLeft === 10) {
      if (window.piko && window.piko.react) {
        window.piko.react('panic', 10000); // Trigger sweating panic loop
      }
    }

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

      // Immediately deactivate black mold on click so score drain stops instantly
      if (hole.dataset.species === 'black') {
        hole.classList.remove('is-active');
        hole.textContent = '';
      }

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
    overlayTitle.textContent = window.i18n.t('mold.game_over');
    overlayDesc.textContent = window.i18n.t('mold.final_score');
    overlayScore.style.display = 'block';
    overlayScore.textContent = score;
    
    nameEntry.style.display = score > 0 ? 'block' : 'none';
    
    // Choose dynamic post-game reaction based on target score threshold (100)
    if (window.piko && window.piko.react) {
      window.piko.react(score >= 100 ? 'win' : 'fail', 5000);
    }
    
    btnStart.textContent = window.i18n.t('mold.play_again');
    btnStart.style.display = 'inline-block';
    btnShowGuide.style.display = 'inline-block';
    if (btnExitMoldArcade) btnExitMoldArcade.style.display = 'block';

    // After celebration completes, resume attract-mode loop if still on this tab and not in arcade mode
    setTimeout(() => {
      const hash = window.location.hash.replace('#', '') || 'home';
      const workspaceCard = document.querySelector('#vinegar .tool-workspace-card');
      const isArcade = workspaceCard && workspaceCard.classList.contains('is-arcade-active');
      if (!isPlaying && hash === 'vinegar' && !isArcade) {
        startTutorialLoop();
      }
    }, 5200);
  }

  init();
})();
