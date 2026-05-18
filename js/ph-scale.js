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

  /* ── DOM REFS ───────────────────────────────────────────── */
  const scoreDisplay  = document.getElementById('game-score');
  const timerDisplay  = document.getElementById('game-timer');
  const emojiDisplay  = document.getElementById('game-item-emoji');
  const nameDisplay   = document.getElementById('game-item-name');
  const displayCard   = document.getElementById('game-item-display');
  
  const btnMoreSour   = document.getElementById('btn-more-sour');
  const btnLessSour   = document.getElementById('btn-less-sour');
  const btnStart      = document.getElementById('btn-start-game');
  
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
    leaderboardList.innerHTML = '<div style="text-align:center; color:var(--ink-muted);">Loading scores...</div>';
    if (!window.db) return;
    
    const scores = await window.db.fetchLeaderboard();
    if (scores.length === 0) {
      leaderboardList.innerHTML = '<div style="text-align:center; color:var(--ink-muted);">No scores yet! Be the first!</div>';
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

  function startBlitz() {
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
    btnStart.style.display = 'block';
    btnStart.textContent = "Start Blitz!";
    btnMoreSour.disabled = false;
    btnLessSour.disabled = false;

    // Start Timer
    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft + 's';
      if (timeLeft <= 0) endGame();
    }, 1000);

    // Load first item
    nextItem();
  }

  function endGame() {
    isPlaying = false;
    clearInterval(timerInterval);
    
    // Disable buttons
    btnMoreSour.disabled = true;
    btnLessSour.disabled = true;

    // Show Overlay with Final Score
    overlay.style.display = 'flex';
    overlayTitle.textContent = "Time's Up!";
    overlayDesc.textContent = "Your final Sour Blitz score is:";
    overlayScore.style.display = 'block';
    overlayScore.textContent = score;
    
    if (score > 0) {
      arcadeEntry.style.display = 'block';
      btnStart.style.display = 'none';
      arcadeInput.value = '';
      arcadeInput.focus();
      window.piko.react('win', 5000);
    } else {
      btnStart.textContent = "Play Again!";
      window.piko.react('fail', 3000);
    }
    
    emojiDisplay.textContent = "🏁";
    nameDisplay.textContent = "Game Over";
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
      window.piko.react('success', 1000);
    } else {
      score = Math.max(0, score - 50); // Penalty
      // Red flash + Shake
      displayCard.style.background = 'rgba(255, 107, 107, 0.4)';
      displayCard.classList.add('shake-anim');
      setTimeout(() => displayCard.classList.remove('shake-anim'), 400);
      window.piko.react('fail', 2000);
    }
    
    scoreDisplay.textContent = score;

    // Instantly load next item after a tiny visual delay to let the flash register
    setTimeout(() => {
      nextItem();
    }, 150);
  }

  /* ── EVENT LISTENERS ────────────────────────────────────── */
  btnStart.addEventListener('click', startBlitz);
  btnMoreSour.addEventListener('click', () => handleGuess(true));
  btnLessSour.addEventListener('click', () => handleGuess(false));
  
  if (btnRefreshLdb) {
    btnRefreshLdb.addEventListener('click', updateLeaderboardUI);
  }
  
  if (btnSubmit) {
    btnSubmit.addEventListener('click', async () => {
      const name = arcadeInput.value.trim();
      if (name.length < 1) return;
      
      btnSubmit.textContent = "Saving...";
      btnSubmit.disabled = true;
      
      await window.db.submitScore(name, score);
      
      arcadeEntry.style.display = 'none';
      btnStart.style.display = 'block';
      btnStart.textContent = "Play Again!";
      btnSubmit.textContent = "Submit Score";
      btnSubmit.disabled = false;
      
      updateLeaderboardUI();
    });
  }

  // Init state
  btnMoreSour.disabled = true;
  btnLessSour.disabled = true;
  
  // Wait a tiny bit for DB to initialize then fetch leaderboard
  setTimeout(updateLeaderboardUI, 1000);

})();
