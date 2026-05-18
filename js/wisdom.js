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

  const btn      = document.getElementById('wisdom-btn');
  const textEl   = document.getElementById('wisdom-text');
  let lastIdx = -1;

  btn.addEventListener('click', () => {
    textEl.parentElement.classList.add('is-fading');
    setTimeout(() => {
      let idx;
      do { idx = Math.floor(Math.random() * WISDOM.length); } while (idx === lastIdx);
      lastIdx = idx;
      textEl.textContent = `"${WISDOM[idx]}"`;
      textEl.parentElement.classList.remove('is-fading');
    }, 250);
  });
})();
