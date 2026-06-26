/* ===================================================================
   TRANSLATIONS.JS -- i18n for The Pickle Arcade (EN + NL)
   Must load BEFORE all other JS files.
   =================================================================== */

(function () {
  const TRANSLATIONS = {
    en: {
      // ── Auth Gate ──────────────────────────────────────────
      'auth.title':        'Zine Access Only',
      'auth.desc':         'Enter the Secret Access Code printed inside your physical copy of The Global Pickle Zine.',
      'auth.secret_code':  'Secret Code',
      'auth.placeholder':  'Enter code here...',
      'auth.unlock_btn':   'Unlock App',
      'auth.incorrect':    'Incorrect code. Try again!',
      'auth.wrong_code':   'Wrong code! Check the zine!',
      'auth.hint':         'Find the password in the zine!',
      'auth.panic':        'Are you sure you have the zine??',
      'auth.retry_1':      'Try again!',
      'auth.retry_2':      'You got this!',
      'auth.retry_3':      'One more try!',
      'auth.focus_1':      "Psst! What's the code?",
      'auth.focus_2':      'Check your zine!',
      'auth.focus_3':      'I believe in you!',
      'auth.focus_4':      'Type it in!',
      'auth.granted':      'ACCESS GRANTED!',

      // ── Walkthrough ────────────────────────────────────────
      'walkthrough.step1_text': "Hey! I'm Piko! I need your help with a few things...",
      'walkthrough.step1_btn':  'What do you need?',
      'walkthrough.step2_text': 'My jar is under attack! Help me whack the mold before it spreads!',
      'walkthrough.step2_btn':  'I got you!',
      'walkthrough.step3_text': "I need to find my comfort zone on the sourness scale. What's sour and what's not?",
      'walkthrough.step3_btn':  'Easy!',
      'walkthrough.step4_text': 'Oh and I know EVERYTHING about pickles. Hit the Brine Wisdom button anytime for fun facts!',
      'walkthrough.step4_btn':  "Let's go!",
      'walkthrough.tap_continue': 'Tap to continue',
      'walkthrough.skip':       'Skip',

      // ── Wisdom ─────────────────────────────────────────────
      'wisdom.reveal_btn': 'Reveal Brine Wisdom',
      'wisdom.close_btn':  'Cool!',

      // ── Mold Game ──────────────────────────────────────────
      'mold.title':          'Protect the Jar!',
      'mold.desc':           'Tap the mold but NEVER tap the good bacteria. Ready?',
      'mold.start':          'Start Game!',
      'mold.tutorial':       'Play Tutorial!',
      'mold.game_over':      'Jar Saved!',
      'mold.final_score':    'Final Score:',
      'mold.play_again':     'Play Again',
      'mold.get_ready':      'Get Ready!',
      'mold.exit':           'Exit Arcade',
      'mold.tut_bad':        'TAPPING MOLD EARNS POINTS! GO FAST!',
      'mold.tut_good':       'BUT AVOID GOOD BACTERIA! IT COSTS A LIFE!',
      'mold.got_it':         'Got it!',
      'mold.start_game_tut': 'Start Game!',
      'mold.enter_initials': 'ENTER INITIALS (3 LETTERS):',
      'mold.submit':         'Submit',
      'mold.submitting':     'Submitting...',
      'mold.submitted':      'Submitted!',
      'mold.initials_error': 'Please enter 3 initials!',
      'mold.error':          'Error',

      // ── pH / Sour Blitz ───────────────────────────────────
      'ph.title':         'Sour Blitz!',
      'ph.desc':          'You have 30 seconds to guess if funky items are MORE or LESS sour than Pure Water. Go fast!',
      'ph.start':         'Start Game!',
      'ph.tutorial':      'Play Tutorial!',
      'ph.times_up':      "Time's Up!",
      'ph.final_score':   'Your final Sour Blitz score is:',
      'ph.play_again':    'Play Again!',
      'ph.question':      'Is this item MORE SOUR or LESS SOUR than Pure Water (pH 7.0)?',
      'ph.more_sour':     'MORE SOUR',
      'ph.less_sour':     'LESS SOUR',
      'ph.lower_ph':      '(Lower pH)',
      'ph.higher_ph':     '(Higher pH)',
      'ph.game_over':     'Game Over',
      'ph.leaderboard':   'Global Leaderboard',
      'ph.refresh':       'Refresh',
      'ph.loading':       'Loading scores...',
      'ph.no_scores':     'No scores yet! Be the first!',
      'ph.tut_acid':      'LOW pH ITEMS (1-6) ARE MORE SOUR THAN PURE WATER!',
      'ph.tut_alkaline':  'HIGH pH ITEMS (8-14) ARE LESS SOUR! GUESS FAST!',
      'ph.start_blitz':   'Start Blitz!',
      'ph.saving':        'Saving...',
      'ph.submit_score':  'Submit Score',
      'ph.enter_initials':'Enter your initials (3 letters):',
      'ph.tasting_spectra':'TASTING SPECTRA...',

      // ── HTML / Layout ──────────────────────────────────────
      'html.start_here':  'Start Here',
      'html.pick_game':   'Pick a Game!',
      'html.pick_desc':   'Choose one of our fun pickle activities below to get started.',
      'html.mold_name':   'Whack-A-Mold',
      'html.mold_desc':   'Protect the jar! Tap the fuzzy mold before it spreads!',
      'html.blitz_name':  'Sour Blitz',
      'html.blitz_desc':  'How fast can you spot the sour? Hit the leaderboard!',
      'html.wisdom_btn':  'Reveal Brine Wisdom',
      'html.game_1':      'Game 1',
      'html.game_2':      'Game 2',
      'html.tab_hub':     'Hub',
      'html.tab_mold':    'Mold',
      'html.tab_blitz':   'Blitz',
      'html.jar_zone':    'Jar Protection Zone',
      'html.game_board':  'Game Board',
    },

    nl: {
      // ── Auth Gate ──────────────────────────────────────────
      'auth.title':        'Alleen met Zine Toegang',
      'auth.desc':         'Voer de geheime toegangscode in die in je exemplaar van The Global Pickle Zine staat.',
      'auth.secret_code':  'Geheime Code',
      'auth.placeholder':  'Voer code in...',
      'auth.unlock_btn':   'App Ontgrendelen',
      'auth.incorrect':    'Verkeerde code. Probeer opnieuw!',
      'auth.wrong_code':   'Verkeerde code! Kijk in de zine!',
      'auth.hint':         'Zoek het wachtwoord in de zine!',
      'auth.panic':        'Heb je de zine wel??',
      'auth.retry_1':      'Probeer opnieuw!',
      'auth.retry_2':      'Dat lukt je wel!',
      'auth.retry_3':      'Nog een keer!',
      'auth.focus_1':      'Psst! Wat is de code?',
      'auth.focus_2':      'Kijk in je zine!',
      'auth.focus_3':      'Ik geloof in je!',
      'auth.focus_4':      'Typ het in!',
      'auth.granted':      'TOEGANG VERLEEND!',

      // ── Walkthrough ────────────────────────────────────────
      'walkthrough.step1_text': "Hoi! Ik ben Piko! Ik heb je hulp nodig met een paar dingen...",
      'walkthrough.step1_btn':  'Wat kan ik doen?',
      'walkthrough.step2_text': 'Mijn pot wordt aangevallen! Help me de schimmel weg te meppen!',
      'walkthrough.step2_btn':  'Ik help je!',
      'walkthrough.step3_text': 'Ik moet mijn comfortzone vinden op de zuurschaal. Wat is zuur en wat niet?',
      'walkthrough.step3_btn':  'Makkelijk!',
      'walkthrough.step4_text': 'Oh, en ik weet ALLES over augurken. Druk op de Pekelwijsheid-knop voor leuke weetjes!',
      'walkthrough.step4_btn':  'Laten we gaan!',
      'walkthrough.tap_continue': 'Tik om door te gaan',
      'walkthrough.skip':       'Overslaan',

      // ── Wisdom ─────────────────────────────────────────────
      'wisdom.reveal_btn': 'Onthul Pekelwijsheid',
      'wisdom.close_btn':  'Gaaf!',

      // ── Mold Game ──────────────────────────────────────────
      'mold.title':          'Bescherm de Pot!',
      'mold.desc':           'Tik op de schimmel maar raak NOOIT de goede bacterien. Klaar?',
      'mold.start':          'Start Spel!',
      'mold.tutorial':       'Bekijk Uitleg!',
      'mold.game_over':      'Pot Gered!',
      'mold.final_score':    'Eindscore:',
      'mold.play_again':     'Opnieuw Spelen',
      'mold.get_ready':      'Maak je klaar!',
      'mold.exit':           'Stop Arcade',
      'mold.tut_bad':        'TIK OP SCHIMMEL VOOR PUNTEN! SNEL!',
      'mold.tut_good':       'MAAR VERMIJD GOEDE BACTERIEN! DAT KOST EEN LEVEN!',
      'mold.got_it':         'Begrepen!',
      'mold.start_game_tut': 'Start Spel!',
      'mold.enter_initials': 'VOER INITIALEN IN (3 LETTERS):',
      'mold.submit':         'Verstuur',
      'mold.submitting':     'Versturen...',
      'mold.submitted':      'Verstuurd!',
      'mold.initials_error': 'Voer 3 initialen in!',
      'mold.error':          'Fout',

      // ── pH / Sour Blitz ───────────────────────────────────
      'ph.title':         'Zuurtest Blitz!',
      'ph.desc':          'Je hebt 30 seconden om te raden of gekke items ZUURDER of MINDER ZUUR zijn dan puur water. Snel!',
      'ph.start':         'Start Spel!',
      'ph.tutorial':      'Bekijk Uitleg!',
      'ph.times_up':      'Tijd is om!',
      'ph.final_score':   'Je Zuurtest Blitz eindscore is:',
      'ph.play_again':    'Opnieuw Spelen!',
      'ph.question':      'Is dit item ZUURDER of MINDER ZUUR dan puur water (pH 7.0)?',
      'ph.more_sour':     'ZUURDER',
      'ph.less_sour':     'MINDER ZUUR',
      'ph.lower_ph':      '(Lagere pH)',
      'ph.higher_ph':     '(Hogere pH)',
      'ph.game_over':     'Einde Spel',
      'ph.leaderboard':   'Wereldranglijst',
      'ph.refresh':       'Vernieuwen',
      'ph.loading':       'Scores laden...',
      'ph.no_scores':     'Nog geen scores! Wees de eerste!',
      'ph.tut_acid':      'LAGE pH ITEMS (1-6) ZIJN ZUURDER DAN PUUR WATER!',
      'ph.tut_alkaline':  'HOGE pH ITEMS (8-14) ZIJN MINDER ZUUR! RAAD SNEL!',
      'ph.start_blitz':   'Start Blitz!',
      'ph.saving':        'Opslaan...',
      'ph.submit_score':  'Score Versturen',
      'ph.enter_initials':'Voer je initialen in (3 letters):',
      'ph.tasting_spectra':'PROEFSPECTRUM...',

      // ── HTML / Layout ──────────────────────────────────────
      'html.start_here':  'Begin Hier',
      'html.pick_game':   'Kies een Spel!',
      'html.pick_desc':   'Kies hieronder een van onze leuke augurk-activiteiten.',
      'html.mold_name':   'Mep de Schimmel',
      'html.mold_desc':   'Bescherm de pot! Tik op de schimmel voordat het zich verspreidt!',
      'html.blitz_name':  'Zuurtest Blitz',
      'html.blitz_desc':  'Hoe snel herken jij het zure? Haal de ranglijst!',
      'html.wisdom_btn':  'Onthul Pekelwijsheid',
      'html.game_1':      'Spel 1',
      'html.game_2':      'Spel 2',
      'html.tab_hub':     'Hub',
      'html.tab_mold':    'Schimmel',
      'html.tab_blitz':   'Blitz',
      'html.jar_zone':    'Pot Beschermzone',
      'html.game_board':  'Spelbord',
    }
  };

  // Read stored language preference, default to English
  let currentLang = localStorage.getItem('zine-lang') || 'en';
  if (!TRANSLATIONS[currentLang]) currentLang = 'en';

  /**
   * Return the translated string for the given key.
   * Falls back to English if the key is missing in the active language.
   */
  function t(key) {
    const lang = TRANSLATIONS[currentLang];
    if (lang && lang[key] !== undefined) return lang[key];
    // Fallback to English
    if (TRANSLATIONS.en[key] !== undefined) return TRANSLATIONS.en[key];
    // If key not found at all, return the key itself for debugging
    return key;
  }

  /**
   * Switch language, persist choice, and reload the page so every
   * script picks up the new strings on boot.
   */
  function setLang(lang) {
    if (!TRANSLATIONS[lang]) return;
    localStorage.setItem('zine-lang', lang);
    currentLang = lang;
    window.location.reload();
  }

  /**
   * Walk all elements with a data-i18n attribute and set their
   * textContent to the translated value.
   */
  function applyDOMTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translated = t(key);
      if (translated !== key) {
        el.textContent = translated;
      }
    });
    // Also handle placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translated = t(key);
      if (translated !== key) {
        el.placeholder = translated;
      }
    });
  }

  // Apply DOM translations as soon as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDOMTranslations);
  } else {
    applyDOMTranslations();
  }

  // Expose the public API
  window.i18n = {
    t: t,
    setLang: setLang,
    get currentLang() { return currentLang; }
  };
})();
