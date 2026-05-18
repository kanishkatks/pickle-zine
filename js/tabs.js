/* ═══════════════════════════════════════════════════════════
   TABS.JS — SPA-style tab switching with hash support
   The Pickle-Metric Suite // Global Pickle Zine
═══════════════════════════════════════════════════════════ */

(function () {
  const tabBtns = document.querySelectorAll('.tab-nav__btn');
  const pages   = document.querySelectorAll('.page');
  const DEFAULT = 'home';

  function getHash() {
    const h = window.location.hash.replace('#', '');
    // Only accept valid tab ids
    const valid = Array.from(tabBtns).map(b => b.dataset.tab);
    return valid.includes(h) ? h : DEFAULT;
  }

  function activateTab(id, instant) {
    tabBtns.forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.tab === id);
      btn.setAttribute('aria-selected', btn.dataset.tab === id ? 'true' : 'false');
    });

    pages.forEach(page => {
      const isTarget = page.dataset.page === id;
      if (isTarget) {
        page.classList.add('is-active');
        if (instant) {
          // No animation on very first load (avoids FOUC)
          page.classList.add('is-visible');
        } else {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => page.classList.add('is-visible'));
          });
        }
      } else {
        page.classList.remove('is-active', 'is-visible');
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.hash = btn.dataset.tab;
    });
  });

  window.addEventListener('hashchange', () => activateTab(getHash(), false));

  // Initial load — instant (no animation flash)
  activateTab(getHash(), true);
})();
