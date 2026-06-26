/* ═══════════════════════════════════════════════════════════
   WISDOM.JS — Brine Wisdom Generator
   The Pickle-Metric Suite // Global Pickle Zine
═══════════════════════════════════════════════════════════ */

(function () {
  const WISDOM = {
    en: [
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
    ],
    nl: [
      "Cleopatra schreef haar schoonheid toe aan een dagelijkse portie augurken.",
      "Op de Pacifische eilanden begraaft men augurken als noodvoedsel.",
      "Amerigo Vespucci was een augurkhandelaar voordat hij ontdekkingsreiziger werd.",
      "Een augurk is pas een augurk als hij 'het zout heeft gezien.'",
      "In Connecticut moet een augurk wettelijk kunnen stuiteren om als augurk te gelden.",
      "Napoleon loofde 12.000 franc uit voor wie voedsel kon conserveren. De winnaar: de augurkenpot.",
      "De gemiddelde augurk ligt langer onder water dan de meeste relaties duren.",
      "Augurkensap is een wetenschappelijk bewezen middel tegen beenkrampen. Zoutwetenschap wint!",
      "Julius Caesar gaf augurken aan zijn legioenen omdat hij geloofde dat ze kracht gaven.",
      "Shakespeare noemde augurken. 'In de penarie zitten' komt van hem.",
      "Bij het inleggen verliest een komkommer 25% van zijn gewicht. Dit heet de Zoutbelasting.",
      "Koningin Elizabeth I was een enorme fan van augurken. De monarchie draait op pekel.",
      "Feit: Maagzuur van gieren is zo zuur dat het botten oplost (pH 1,0)!",
      "Feit: Mierengif bevat mierenzuur, superzuur (pH 3,0).",
      "Feit: Eeuwenoude eieren worden bewaard in een sterk basisch mengsel (pH 11,0)!",
      "Feit: Je bloed is licht basisch, helemaal niet zuur (pH 7,4).",
      "Feit: Pretzels krijgen hun bruine korst door een sterk basisch loogbad (pH 13,0)!",
      "Feit: Slakkenslijm is licht basisch, wat hen helpt op zure grond te glijden (pH 7,5).",
      "Feit: Honing bederft nooit omdat het erg zuur is en weinig water bevat (pH 3,9)!",
      "Feit: Hondenspeeksel is basisch, wat helpt gaatjes te voorkomen (pH 7,5).",
      "Feit: Houtas is extreem basisch (pH 11,0) en werd vroeger gebruikt om zeep te maken!",
      "Feit: Bijengif is zuur (pH 5,2), maar wespengif is basisch!"
    ]
  };

  function getWisdom() {
    const lang = window.i18n ? window.i18n.currentLang : 'en';
    return WISDOM[lang] || WISDOM.en;
  }

  // Find all wisdom buttons (hub + wisdom tab)
  const btns = document.querySelectorAll('#wisdom-btn, #wisdom-btn-hub');
  let lastIdx = -1;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const quotes = getWisdom();
      let idx;
      do { idx = Math.floor(Math.random() * quotes.length); } while (idx === lastIdx && quotes.length > 1);
      lastIdx = idx;

      if (window.piko && window.piko.showTutorialCards) {
        window.piko.showTutorialCards([{
          img: 'assets/piko/wisdom.png',
          imgSize: 200,
          imgClass: 'piko-reading',
          text: '"' + quotes[idx] + '"',
          items: [],
          btnText: (window.i18n ? window.i18n.t('wisdom.close_btn') : 'Cool!') + ' 🥒'
        }], () => {
          // Nothing to do after close
        });
      }
    });
  });
})();
