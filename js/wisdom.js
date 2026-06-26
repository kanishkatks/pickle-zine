/* ═══════════════════════════════════════════════════════════
   WISDOM.JS — Brine Wisdom Generator
   The Pickle-Metric Suite // Global Pickle Zine
═══════════════════════════════════════════════════════════ */

(function () {
  const WISDOM = [
    "Cleopatra attributed her beauty to a steady diet of pickles.",
    "In the Pacific Islands, burying pickles in the ground is a traditional way to store food for emergencies.",
    "Amerigo Vespucci was a 'pickle merchant' before he became an explorer.",
    "A pickle is only a pickle once it has 'seen the salt.'",
    "In Connecticut, a pickle must legally bounce to be considered a pickle.",
    "Napoleon offered 12,000 francs to whoever could invent a method to preserve food for his army. The winner: the pickle jar.",
    "The average pickle has been submerged for longer than most relationships last.",
    "Pickle juice is a scientifically validated cure for leg cramps. Salt-science wins again.",
    "Julius Caesar fed pickles to his legions, believing they gave soldiers physical and spiritual strength.",
    "Shakespeare mentioned pickles. 'In a pickle' is a phrase he helped popularise.",
    "The pickling of a cucumber causes it to lose 25% of its weight. This is called the Salt Tax.",
    "Queen Elizabeth I was reportedly a huge fan of pickles. The monarchy runs on brine.",
    "Fact: Vulture stomach acid is so sour it can dissolve bones (pH 1.0)!",
    "Fact: Ant venom contains formic acid, making it super sour (pH 3.0).",
    "Fact: Century Eggs are preserved in a highly basic mixture (pH 11.0)!",
    "Fact: Your blood is slightly basic, not sour at all (pH 7.4).",
    "Fact: Pretzels get their brown crust from a highly basic lye bath (pH 13.0)!",
    "Fact: Snail slime is slightly basic, which helps them slide on acidic soil (pH 7.5).",
    "Fact: Honey never spoils because it is highly acidic and has very little water (pH 3.9)!",
    "Fact: Dog saliva is actually basic, which helps prevent cavities (pH 7.5).",
    "Fact: Wood ash is extremely basic (pH 11.0) and was historically used to make soap!",
    "Fact: Bee venom is acidic (pH 5.2), but wasp venom is basic!"
  ];

  const btn = document.getElementById('wisdom-btn');
  let lastIdx = -1;
  let previousContext = 'home';

  // 1. Dynamically build and inject the zine-style glassmorphic modal overlay
  let overlay = document.getElementById('wisdom-overlay');
  let speechBubble = null;
  let closeBtn = null;

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'wisdom-overlay';
    overlay.className = 'wisdom-modal-overlay';
    
    overlay.innerHTML = `
      <div class="wisdom-modal-card">
        <div id="wisdom-speech-bubble" class="piko-speech-bubble">
          "Cleopatra attributed her beauty to a steady diet of pickles."
        </div>
        <button class="bttn-jelly bttn-md custom-btn-relish neo-btn-shadow" id="wisdom-close-btn" style="margin: 0 auto; width: 145px; pointer-events: auto;">
          Cool! 🥒
        </button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    speechBubble = document.getElementById('wisdom-speech-bubble');
    closeBtn = document.getElementById('wisdom-close-btn');
  } else {
    speechBubble = document.getElementById('wisdom-speech-bubble');
    closeBtn = document.getElementById('wisdom-close-btn');
  }

  // 2. Click Handler: Open full-screen cinematic overlay modal
  if (btn) {
    btn.addEventListener('click', () => {
      // Pick random fact
      let idx;
      do { idx = Math.floor(Math.random() * WISDOM.length); } while (idx === lastIdx);
      lastIdx = idx;

      // Update text in speech bubble
      if (speechBubble) {
        speechBubble.textContent = `"${WISDOM[idx]}"`;
      }

      // Record previous Piko context so we return perfectly
      const activeTab = window.location.hash.replace('#', '') || 'home';
      previousContext = activeTab === 'home' ? 'home' : 'game-idle';

      // 3. Coordinate Piko: Glide to center, scale up, wear reading glasses!
      if (window.piko && window.piko.setContext) {
        window.piko.setContext('wisdom');
        window.piko.react('wisdom', Infinity);
      }

      // 4. Fade in the glassmorphic background overlay
      overlay.classList.add('is-active');
    });
  }

  // 3. Close Handler: Return smoothly
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      // Fade out overlay modal
      overlay.classList.remove('is-active');

      // Coordinate Piko: Glide back to active tab context, return to idle
      if (window.piko && window.piko.setContext) {
        window.piko.setContext(previousContext);
        window.piko.react('idle', Infinity);
      }
    });
  }
})();
