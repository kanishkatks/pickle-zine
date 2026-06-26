/* ═══════════════════════════════════════════════════════════
   PH-SCALE.JS — "Sour Blitz" 60-Second Game
   The Pickle-Metric Suite // Global Pickle Zine
═══════════════════════════════════════════════════════════ */

(function () {

  /* ── GAME DATA ──────────────────────────────────────────── */
  const BASE_PH = 7.0; // Pure Water
  const BLITZ_SECONDS = 60;

  // A massive library of funky, weird, and everyday items
  const GAME_ITEMS = [
    { name: 'Vulture Stomach Acid', emoji: '🦅', ph: 1.0 },
    { name: 'Battery Acid', emoji: '🔋', ph: 1.0 },
    { name: 'Your Stomach Acid', emoji: '🤢', ph: 1.5 },
    { name: 'Lemon Juice',  emoji: '🍋', ph: 2.0 },
    { name: 'Cola Soda',    emoji: '🥤', ph: 2.5 },
    { name: 'Ant Venom',    emoji: '🐜', ph: 3.0 },
    { name: 'Apple',        emoji: '🍎', ph: 3.0 },
    { name: 'Grape Juice',  emoji: '🍇', ph: 3.3 },
    { name: 'The Perfect Pickle', emoji: '🥒', ph: 3.5 },
    { name: 'Honey',        emoji: '🍯', ph: 3.9 },
    { name: 'Ketchup',      emoji: '🥫', ph: 3.9 },
    { name: 'Tomato',       emoji: '🍅', ph: 4.0 },
    { name: 'Black Coffee', emoji: '☕', ph: 5.0 },
    { name: 'Bee Venom',    emoji: '🐝', ph: 5.2 },
    { name: 'Rainwater',    emoji: '🌧️', ph: 5.5 },
    { name: 'Cheddar Cheese',emoji:'🧀', ph: 5.9 },
    { name: 'Cow Milk',     emoji: '🥛', ph: 6.5 },
    { name: 'Human Tears',  emoji: '😢', ph: 7.2 },
    { name: 'Human Blood',  emoji: '🩸', ph: 7.4 },
    { name: 'Snail Slime',  emoji: '🐌', ph: 7.5 },
    { name: 'Dog Saliva',   emoji: '🐶', ph: 7.5 },
    { name: 'Sea Water',    emoji: '🌊', ph: 8.0 },
    { name: 'Egg Whites',   emoji: '🥚', ph: 8.0 },
    { name: 'Toothpaste',   emoji: '🪥', ph: 8.5 },
    { name: 'Baking Soda',  emoji: '🧂', ph: 9.0 },
    { name: 'Hand Soap',    emoji: '🧼', ph: 10.0 },
    { name: 'Heartburn Meds',emoji:'💊', ph: 10.0 },
    { name: 'Wood Ash',     emoji: '🪵', ph: 11.0 },
    { name: 'Century Egg',  emoji: '🏺', ph: 11.0 },
    { name: 'Ammonia',      emoji: '🧴', ph: 11.5 },
    { name: 'Bleach',       emoji: '⚠️', ph: 12.5 },
    { name: 'Pretzel Bath (Lye)', emoji: '🥨', ph: 13.0 },
    { name: 'Drain Cleaner',emoji: '🧽', ph: 14.0 },
    { name: 'Orange Juice', emoji: '🍊', ph: 3.5 },
    { name: 'Black Tea',    emoji: '🍵', ph: 4.9 },
    { name: 'Ice Cream',    emoji: '🍦', ph: 6.5 },
    { name: 'Matcha Tea',   emoji: '🍵', ph: 8.0 },
    { name: 'Laundry Soap', emoji: '🧺', ph: 10.0 },
    { name: 'Shaving Cream',emoji: '🫧', ph: 8.0 }
  ];

/* ── GAME STATE ─────────────────────────────────────────── */
  let score = 0;
  let timeLeft = BLITZ_SECONDS;
  let currentItem = null;
  let timerInterval = null;
  let isPlaying = false;
  let availableItems = [];

  // Mascot Tutorial State
  let tutorialInterval = null;
  let tutorialStep = 0;

  /* ── DOM REFS ───────────────────────────────────────────── */
  const scoreDisplay  = document.getElementById('game-score');
  const timerDisplay  = document.getElementById('game-timer');
  const emojiDisplay  = document.getElementById('game-item-emoji');
  const nameDisplay   = document.getElementById('game-item-name');
  const displayCard   = document.getElementById('game-item-display');
  
  const btnMoreSour   = document.getElementById('btn-more-sour');
  const btnLessSour   = document.getElementById('btn-less-sour');
  const btnStart      = document.getElementById('btn-start-game');
  const btnShowGuide  = document.getElementById('btn-show-blitz-guide');
  const btnExitBlitzArcade = document.getElementById('btn-exit-blitz-arcade');
  
  const overlay       = document.getElementById('game-overlay');
  const overlayTitle  = document.getElementById('game-overlay-title');
  const overlayDesc   = document.getElementById('game-overlay-desc');
  const overlayScore  = document.getElementById('game-overlay-score');
  
  const arcadeEntry   = document.getElementById('arcade-name-entry');
  const arcadeInput   = document.getElementById('arcade-name');
  const btnSubmit     = document.getElementById('btn-submit-score');
  
  const leaderboardList = document.getElementById('leaderboard-list');
  const btnRefreshLdb   = document.getElementById('btn-refresh-leaderboard');

  /* ── LEADERBOARD LOGIC ──────────────────────────────────── */
  async function updateLeaderboardUI() {
    leaderboardList.innerHTML = '<div style="text-align:center; color:var(--ink-muted);">' + window.i18n.t('ph.loading') + '</div>';
    if (!window.db) return;
    
    const scores = await window.db.fetchLeaderboard();
    if (scores.length === 0) {
      leaderboardList.innerHTML = '<div style="text-align:center; color:var(--ink-muted);">' + window.i18n.t('ph.no_scores') + '</div>';
      return;
    }
    
    let html = '';
    scores.forEach((s, idx) => {
      let medal = '';
      if (idx === 0) medal = '🥇 ';
      else if (idx === 1) medal = '🥈 ';
      else if (idx === 2) medal = '🥉 ';
      else medal = `<span style="display:inline-block; width:20px;">${idx+1}.</span>`;
      
      html += `
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(0,0,0,0.1); padding:4px 0;">
          <span>${medal} <strong>${s.player_name}</strong></span>
          <span>${s.score} pts</span>
        </div>
      `;
    });
    leaderboardList.innerHTML = html;
  }

  /* ── GAME LOGIC ─────────────────────────────────────────── */

  function enterArcadeMode() {
    const workspaceCard = document.querySelector('#ph-scale .tool-workspace-card');
    if (workspaceCard) {
      workspaceCard.classList.add('is-arcade-active');
    }
    document.body.style.overflow = 'hidden'; // lock scroll!
    if (btnExitBlitzArcade) btnExitBlitzArcade.style.display = 'block'; // show exit button!
    stopTutorialLoop();
  }

  function exitArcadeMode() {
    if (window.piko && window.piko.say) {
      window.piko.say('');
    }
    isPlaying = false;
    clearInterval(timerInterval);
    
    stopInteractiveTutorial();
    
    const workspaceCard = document.querySelector('#ph-scale .tool-workspace-card');
    if (workspaceCard) {
      workspaceCard.classList.remove('is-arcade-active');
    }
    document.body.style.overflow = ''; // unlock scroll!
    if (btnExitBlitzArcade) btnExitBlitzArcade.style.display = 'none'; // hide exit button!
    
    overlay.style.display = 'flex';
    overlayScore.style.display = 'none';
    arcadeEntry.style.display = 'none';
    overlayTitle.textContent = window.i18n.t('ph.title') + " ⏱️";
    overlayDesc.textContent = window.i18n.t('ph.desc');
    btnStart.textContent = window.i18n.t('ph.start') + " 🕹️";
    btnStart.style.display = 'inline-block';
    if (btnShowGuide) btnShowGuide.style.display = 'inline-block';
    
    emojiDisplay.textContent = "🍋";
    nameDisplay.textContent = window.i18n.t('ph.title');
    
    startTutorialLoop();
  }

  function startInteractiveTutorial() {
    enterArcadeMode();
    overlay.style.display = 'none';
    
    if (window.piko && window.piko.setContext) {
      window.piko.setContext('game-tutorial');
    }

    const pointer = document.getElementById('ph-scale-pointer');
    const labelAcid = document.getElementById('ph-label-acid');
    const labelNeutral = document.getElementById('ph-label-neutral');
    const labelAlk = document.getElementById('ph-label-alk');
    const feedbackText = document.getElementById('ph-scale-feedback-text');

    function runTutorialStep(step) {
      if (step === 0) {
        if (pointer) pointer.style.left = '15%';
        if (labelAcid) labelAcid.style.transform = 'scale(1.2)';
        if (labelNeutral) labelNeutral.style.transform = 'scale(1)';
        if (labelAlk) labelAlk.style.transform = 'scale(1)';
        if (feedbackText) {
          feedbackText.textContent = '🍋 pH 3.0: Puckering & Acidic!';
          feedbackText.style.color = 'var(--rust)';
        }
        if (window.piko && window.piko.react) {
          window.piko.react('extreme-sour');
        }
        if (window.piko && window.piko.say) {
          window.piko.say('🍋 ' + window.i18n.t('ph.tut_acid') + ' 🍋', [
            { text: window.i18n.t('mold.got_it') + ' 👉', action: () => runTutorialStep(1) }
          ]);
        }
      } else if (step === 1) {
        if (pointer) pointer.style.left = '85%';
        if (labelAlk) labelAlk.style.transform = 'scale(1.2)';
        if (labelAcid) labelAcid.style.transform = 'scale(1)';
        if (labelNeutral) labelNeutral.style.transform = 'scale(1)';
        if (feedbackText) {
          feedbackText.textContent = '🫧 pH 10.0: Soapy & Alkaline!';
          feedbackText.style.color = '#5f4bff';
        }
        if (window.piko && window.piko.react) {
          window.piko.react('opposite-sour');
        }
        if (window.piko && window.piko.say) {
          window.piko.say('🫧 ' + window.i18n.t('ph.tut_alkaline') + ' 🫧', [
            { text: window.i18n.t('ph.start_blitz') + ' ⚡', action: () => {
              stopInteractiveTutorial();
              startBlitz();
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
    const pointer = document.getElementById('ph-scale-pointer');
    const labelAcid = document.getElementById('ph-label-acid');
    const labelNeutral = document.getElementById('ph-label-neutral');
    const labelAlk = document.getElementById('ph-label-alk');
    const feedbackText = document.getElementById('ph-scale-feedback-text');

    if (pointer) pointer.style.left = '50%';
    if (labelAcid) labelAcid.style.transform = '';
    if (labelNeutral) labelNeutral.style.transform = '';
    if (labelAlk) labelAlk.style.transform = '';
    if (feedbackText) {
      feedbackText.textContent = window.i18n.t('ph.tasting_spectra');
      feedbackText.style.color = '';
    }
  }

  function startBlitz() {
    enterArcadeMode();
    stopTutorialLoop();
    stopInteractiveTutorial();

    if (window.piko && window.piko.setContext) {
      window.piko.setContext('game-active');
    }

    // Reset State
    score = 0;
    timeLeft = BLITZ_SECONDS;
    isPlaying = true;
    availableItems = [...GAME_ITEMS];
    
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft + 's';
    
    // Hide Overlay, Enable Buttons
    overlay.style.display = 'none';
    arcadeEntry.style.display = 'none';
    btnStart.style.display = 'none'; // hide during gameplay
    if (btnShowGuide) btnShowGuide.style.display = 'none';
    if (btnExitBlitzArcade) btnExitBlitzArcade.style.display = 'none'; // hide exit during active gameplay
    
    btnMoreSour.disabled = false;
    btnLessSour.disabled = false;

    // Start Timer
    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft + 's';

      if (timeLeft === 10) {
        if (window.piko && window.piko.react) {
          window.piko.react('panic', 10000);
        }
      }

      if (timeLeft <= 0) endGame();
    }, 1000);

    // Load first item
    nextItem();
  }

  function endGame() {
    isPlaying = false;
    clearInterval(timerInterval);
    
    btnMoreSour.disabled = true;
    btnLessSour.disabled = true;

    overlay.style.display = 'flex';
    overlayTitle.textContent = window.i18n.t('ph.times_up');
    overlayDesc.textContent = window.i18n.t('ph.final_score');
    overlayScore.style.display = 'block';
    overlayScore.textContent = score;
    
    if (btnExitBlitzArcade) btnExitBlitzArcade.style.display = 'block'; // Make sure exit arcade button is visible!
    
    if (score > 0) {
      arcadeEntry.style.display = 'block';
      btnStart.style.display = 'none';
      if (btnShowGuide) btnShowGuide.style.display = 'none';
      arcadeInput.value = '';
      arcadeInput.focus();
      
      if (window.piko && window.piko.react) {
        window.piko.react(score >= 800 ? 'win' : 'fail', 5000);
      }
    } else {
      btnStart.textContent = window.i18n.t('ph.play_again');
      btnStart.style.display = 'block';
      if (btnShowGuide) btnShowGuide.style.display = 'block';
      if (window.piko && window.piko.react) {
        window.piko.react('fail', 5000);
      }
    }

    emojiDisplay.textContent = "🏁";
    nameDisplay.textContent = window.i18n.t('ph.game_over');

    setTimeout(() => {
      const hash = window.location.hash.replace('#', '') || 'home';
      const workspaceCard = document.querySelector('#ph-scale .tool-workspace-card');
      const isArcade = workspaceCard && workspaceCard.classList.contains('is-arcade-active');
      if (!isPlaying && hash === 'ph-scale' && !isArcade) {
        startTutorialLoop();
      }
    }, 5200);
  }

  function nextItem() {
    if (!isPlaying) return;
    
    // Refill bag if empty (very rare to answer 40+ items in 60s, but just in case)
    if (availableItems.length === 0) {
      availableItems = [...GAME_ITEMS];
    }
    
    // Pick random item from available pool
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    currentItem = availableItems[randomIndex];
    
    // Remove it so it doesn't repeat this round
    availableItems.splice(randomIndex, 1);
    
    emojiDisplay.textContent = currentItem.emoji;
    nameDisplay.textContent = currentItem.name;
    
    // Reset background color from previous flashes
    displayCard.style.background = 'var(--bg-surface)';
  }

  function handleGuess(guessedMoreSour) {
    if (!isPlaying) return;
    
    // More Sour = pH is LOWER than 7.0
    const isActuallyMoreSour = currentItem.ph < BASE_PH;
    const isActuallyLessSour = currentItem.ph > BASE_PH;
    
    let isCorrect = false;
    if (guessedMoreSour && isActuallyMoreSour) isCorrect = true;
    if (!guessedMoreSour && isActuallyLessSour) isCorrect = true;

    if (isCorrect) {
      score += 100;
      // Green flash
      displayCard.style.background = 'rgba(58, 206, 112, 0.4)';
      
      // Coordinate dynamic taste response spectrum!
      if (window.piko && window.piko.react) {
        if (currentItem.ph < 3.0) {
          window.piko.react('extreme-sour', 1500); // 🍋 Puckers intensely
        } else if (currentItem.ph < 7.0) {
          window.piko.react('sour', 1500); // 🥒 General sour wink/shudder
        } else if (currentItem.ph > 7.0) {
          window.piko.react('opposite-sour', 1500); // 🫧 Soapy alkaline bubbles
        } else {
          window.piko.react('success', 1500);
        }
      }
    } else {
      score = Math.max(0, score - 50); // Penalty
      // Red flash + Shake
      displayCard.style.background = 'rgba(255, 107, 107, 0.4)';
      displayCard.classList.add('shake-anim');
      setTimeout(() => displayCard.classList.remove('shake-anim'), 400);
      
      if (window.piko && window.piko.react) {
        window.piko.react('fail', 1500);
      }
    }
    
    scoreDisplay.textContent = score;

    // Instantly load next item after a tiny visual delay to let the flash register
    setTimeout(() => {
      nextItem();
    }, 150);
  }

  function startTutorialLoop() {
    if (tutorialInterval) clearInterval(tutorialInterval);

    // Dock Piko on game tutorial shelf
    if (window.piko && window.piko.setContext) {
      window.piko.setContext('game-tutorial');
    }

    const pikoEl = document.getElementById('piko-reaction-container');
    const spot = document.getElementById('piko-blitz-spot');
    if (pikoEl && spot && pikoEl.parentNode !== spot) {
      spot.appendChild(pikoEl);
      pikoEl.style.position = 'relative';
    }

    const pointer = document.getElementById('ph-scale-pointer');
    const labelAcid = document.getElementById('ph-label-acid');
    const labelNeutral = document.getElementById('ph-label-neutral');
    const labelAlk = document.getElementById('ph-label-alk');
    const feedbackText = document.getElementById('ph-scale-feedback-text');
    function runStep() {
      if (isPlaying) return;
      
      if (tutorialStep === 0) {
        // Step 1: Acidic (pH 1-6) - puckers and wiggles left
        if (pointer) pointer.style.left = '15%';
        if (feedbackText) {
          feedbackText.textContent = '🍋 pH 3.0: Pucker Power! Very Sour!';
          feedbackText.style.color = 'var(--rust)';
        }
        if (labelAcid) {
          labelAcid.style.transform = 'scale(1.15) rotate(-3deg)';
          labelAcid.style.fontWeight = '900';
        }
        if (labelNeutral) {
          labelNeutral.style.transform = '';
          labelNeutral.style.fontWeight = '';
        }
        if (labelAlk) {
          labelAlk.style.transform = '';
          labelAlk.style.fontWeight = '';
        }
        if (window.piko && window.piko.react) {
          window.piko.react('extreme-sour', 2200);
        }
        tutorialStep = 1;
      } else if (tutorialStep === 1) {
        // Step 2: Alkaline (pH 8-14) - soapy bitter right
        if (pointer) pointer.style.left = '85%';
        if (feedbackText) {
          feedbackText.textContent = '🫧 pH 9.5: Soapy & Bitter! Opposite-Sour!';
          feedbackText.style.color = '#5f4bff';
        }
        if (labelAlk) {
          labelAlk.style.transform = 'scale(1.15) rotate(3deg)';
          labelAlk.style.fontWeight = '900';
        }
        if (labelAcid) {
          labelAcid.style.transform = '';
          labelAcid.style.fontWeight = '';
        }
        if (labelNeutral) {
          labelNeutral.style.transform = '';
          labelNeutral.style.fontWeight = '';
        }
        if (window.piko && window.piko.react) {
          window.piko.react('opposite-sour', 2200);
        }
        tutorialStep = 2;
      } else {
        // Step 3: Neutral (pH 7.0) - calm water center
        if (pointer) pointer.style.left = '50%';
        if (feedbackText) {
          feedbackText.textContent = '💧 pH 7.0: Pure Water. Calm & Neutral.';
          feedbackText.style.color = 'var(--relish)';
        }
        if (labelNeutral) {
          labelNeutral.style.transform = 'scale(1.15)';
          labelNeutral.style.fontWeight = '900';
        }
        if (labelAcid) {
          labelAcid.style.transform = '';
          labelAcid.style.fontWeight = '';
        }
        if (labelAlk) {
          labelAlk.style.transform = '';
          labelAlk.style.fontWeight = '';
        }
        if (window.piko && window.piko.react) {
          window.piko.react('idle', 2200);
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
    // Clean up temporary coordinate overrides and tasting labels
    const pointer = document.getElementById('ph-scale-pointer');
    if (pointer) pointer.style.left = '50%';
    const labelAcid = document.getElementById('ph-label-acid');
    const labelNeutral = document.getElementById('ph-label-neutral');
    const labelAlk = document.getElementById('ph-label-alk');
    const feedbackText = document.getElementById('ph-scale-feedback-text');
    if (labelAcid) {
      labelAcid.style.transform = '';
      labelAcid.style.fontWeight = '';
    }
    if (labelNeutral) {
      labelNeutral.style.transform = '';
      labelNeutral.style.fontWeight = '';
    }
    if (labelAlk) {
      labelAlk.style.transform = '';
      labelAlk.style.fontWeight = '';
    }
    if (feedbackText) {
      feedbackText.textContent = window.i18n.t('ph.tasting_spectra');
      feedbackText.style.color = '';
    }
  }

  function handlePageChange() {
    if (window.walkthroughActive) return;
    const hash = window.location.hash.replace('#', '') || 'home';
    if (hash === 'ph-scale') {
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

  /* ── EVENT LISTENERS ────────────────────────────────────── */
  btnStart.addEventListener('click', startBlitz);
  btnMoreSour.addEventListener('click', () => handleGuess(true));
  btnLessSour.addEventListener('click', () => handleGuess(false));
  
  if (btnShowGuide) {
    btnShowGuide.addEventListener('click', startInteractiveTutorial);
  }
  if (btnExitBlitzArcade) {
    btnExitBlitzArcade.addEventListener('click', exitArcadeMode);
  }
  
  if (btnRefreshLdb) {
    btnRefreshLdb.addEventListener('click', updateLeaderboardUI);
  }
  
  if (btnSubmit) {
    btnSubmit.addEventListener('click', async () => {
      const name = arcadeInput.value.trim();
      if (name.length < 1) return;
      
      btnSubmit.textContent = window.i18n.t('ph.saving');
      btnSubmit.disabled = true;
      
      await window.db.submitScore(name, score);
      
      arcadeEntry.style.display = 'none';
      btnStart.style.display = 'block';
      btnStart.textContent = window.i18n.t('ph.play_again');
      if (btnShowGuide) btnShowGuide.style.display = 'block';
      if (btnExitBlitzArcade) btnExitBlitzArcade.style.display = 'block';
      btnSubmit.textContent = window.i18n.t('ph.submit_score');
      btnSubmit.disabled = false;
      
      updateLeaderboardUI();
    });
  }

  // Active page change listeners for dynamic attract-mode activation
  window.addEventListener('hashchange', handlePageChange);
  window.addEventListener('load', handlePageChange);

  // Init state
  btnMoreSour.disabled = true;
  btnLessSour.disabled = true;
  
  // Wait a tiny bit for DB to initialize then fetch leaderboard & trigger tutorial check
  setTimeout(() => {
    updateLeaderboardUI();
    handlePageChange();
  }, 1000);

})();
