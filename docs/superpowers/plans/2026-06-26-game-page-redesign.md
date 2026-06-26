# Game Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix both game page layouts so Piko sits in the document flow inside the start screen card, tutorial cycling works without overlap, and everything fits on one phone screen.

**Architecture:** Remove Piko's fixed-position transform-based tutorial positioning. Instead, place a dedicated Piko container div inside each game overlay. The tutorial cycle logic keeps the same emotion/highlight behavior but stops moving Piko with CSS transforms. Both game pages follow the same pattern.

**Tech Stack:** Vanilla HTML/CSS/JS, no dependencies.

---

### Task 1: Add Piko spot divs in game overlays (index.html)

**Files:**
- Modify: `.worktrees/piko-auth-improvements/index.html:171-209` (mold overlay)
- Modify: `.worktrees/piko-auth-improvements/index.html:257-299` (pH overlay)

- [ ] **Step 1: Add Piko spot div in mold overlay**

In `index.html`, inside `#mold-overlay`, add a centered Piko container between the subtitle and the tutorial showcase cards:

```html
<!-- After mold-overlay-desc paragraph, before mold-tutorial-showcase -->
<div id="piko-mold-spot" style="display:flex; justify-content:center; pointer-events:none; margin-bottom:var(--gap-xs);"></div>
```

- [ ] **Step 2: Add Piko spot div in pH overlay**

In `index.html`, inside `#game-overlay`, add a centered Piko container between the description and the pH tutorial showcase:

```html
<!-- After game-overlay-desc paragraph, before ph-tutorial-showcase -->
<div id="piko-blitz-spot" style="display:flex; justify-content:center; pointer-events:none; margin-bottom:var(--gap-xs);"></div>
```

- [ ] **Step 3: Verify in browser**

Reload http://localhost:8890, navigate to each game. The spot divs are empty but the layout shouldn't break.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Add Piko spot divs in game overlays for in-flow positioning"
```

---

### Task 2: Update CSS — game-tutorial context to relative positioning (components.css)

**Files:**
- Modify: `.worktrees/piko-auth-improvements/css/components.css` (piko-context-game-tutorial block)

- [ ] **Step 1: Find and replace the game-tutorial context CSS**

Find `.piko-context-game-tutorial` (currently has `position: fixed; top: 320px; left: 50%;` etc.) and replace with relative, in-flow positioning:

```css
/* 3. Game Tutorial Guide State — in-flow inside overlay */
.piko-context-game-tutorial {
  position: relative !important;
  top: auto;
  left: auto;
  bottom: auto;
  right: auto;
  width: 80px;
  height: 80px;
  overflow: visible;
  opacity: 1;
  pointer-events: none;
  filter: none;
  --piko-base-transform: none;
  transform: none;
}
```

- [ ] **Step 2: Verify Piko doesn't appear in a weird spot**

Reload, navigate to mold game. Piko may not show yet (JS still uses old positioning). That's OK — next task fixes it.

- [ ] **Step 3: Commit**

```bash
git add css/components.css
git commit -m "Update game-tutorial Piko context to relative positioning"
```

---

### Task 3: Rewrite mold game tutorial loop positioning (mold-game.js)

**Files:**
- Modify: `.worktrees/piko-auth-improvements/js/mold-game.js` — `startTutorialLoop()`, `stopTutorialLoop()`, `startInteractiveTutorial()`, `stopInteractiveTutorial()`

- [ ] **Step 1: Update `startTutorialLoop()` — move Piko into spot div**

Find `startTutorialLoop()`. At the top, after setting `piko.setContext('game-tutorial')`, add code to move Piko into the spot div:

```javascript
// Move Piko into the overlay spot
const pikoEl = document.getElementById('piko-reaction-container');
const spot = document.getElementById('piko-mold-spot');
if (pikoEl && spot && pikoEl.parentNode !== spot) {
  spot.appendChild(pikoEl);
  pikoEl.style.position = 'relative';
}
```

- [ ] **Step 2: Remove transform-based positioning from tutorial steps**

In `startTutorialLoop()`, find the `runStep()` function. Remove ALL `mascotEl.style.transform = ...` lines. The emotion cycling (`piko.react('hating-it')`, `piko.react('loving-it')`) stays. The card highlighting (border glow) stays. Just remove the transform lines:

Remove these lines:
```javascript
// DELETE: mascotEl.style.transform = 'translateX(-65px) scale(1.4)';
// DELETE: mascotEl.style.transform = 'translateX(65px) scale(1.4)';
```

- [ ] **Step 3: Update `stopTutorialLoop()` — remove transform cleanup**

In `stopTutorialLoop()`, remove the `mascotEl.style.transform = ''` line. Keep the card style resets (borderColor, boxShadow, transform on cards).

- [ ] **Step 4: Update `startInteractiveTutorial()` — remove transform lines**

Same pattern — remove `mascotEl.style.transform` lines from `runTutorialStep()`. Keep emotion reactions and card highlighting.

- [ ] **Step 5: Update `stopInteractiveTutorial()` — remove transform cleanup**

Remove `mascotEl.style.transform = ''`. Keep card resets.

- [ ] **Step 6: Verify in browser**

Reload, navigate to mold game. Piko should:
- Sit centered between subtitle and tutorial cards (80x80px)
- Cycle between hating-it and loving-it emotions
- Tutorial cards should still highlight with border glow
- No overlap with text or cards

- [ ] **Step 7: Commit**

```bash
git add js/mold-game.js
git commit -m "Fix mold game tutorial: Piko in document flow, no transform overlap"
```

---

### Task 4: Rewrite pH game tutorial loop positioning (ph-scale.js)

**Files:**
- Modify: `.worktrees/piko-auth-improvements/js/ph-scale.js` — `startTutorialLoop()`, `stopTutorialLoop()`, `startInteractiveTutorial()`, `stopInteractiveTutorial()`

- [ ] **Step 1: Update `startTutorialLoop()` — move Piko into spot div**

At the top, after `piko.setContext('game-tutorial')`:

```javascript
const pikoEl = document.getElementById('piko-reaction-container');
const spot = document.getElementById('piko-blitz-spot');
if (pikoEl && spot && pikoEl.parentNode !== spot) {
  spot.appendChild(pikoEl);
  pikoEl.style.position = 'relative';
}
```

- [ ] **Step 2: Remove transform-based positioning from tutorial steps**

In `startTutorialLoop()`, find `runStep()`. Remove ALL `mascotEl.style.transform = ...` lines across all three steps (acidic, alkaline, neutral). Keep emotion reactions and pH pointer/label animations.

Remove these lines:
```javascript
// DELETE: mascotEl.style.transform = 'translateX(-65px) scale(1.4)';
// DELETE: mascotEl.style.transform = 'translateX(65px) scale(1.4)';
// DELETE: mascotEl.style.transform = 'translateX(0px) scale(1.4)';
```

- [ ] **Step 3: Update `stopTutorialLoop()` — remove transform cleanup**

Remove `mascotEl.style.transform = ''`. Keep pointer/label/feedback resets.

- [ ] **Step 4: Update `startInteractiveTutorial()` — remove transform lines**

Same pattern — remove transform lines from tutorial steps. Keep emotion reactions and pointer/label animations.

- [ ] **Step 5: Update `stopInteractiveTutorial()` — remove transform cleanup**

Remove transform cleanup. Keep pointer/label resets.

- [ ] **Step 6: Verify in browser**

Reload, navigate to pH game. Piko should:
- Sit centered between description and pH gradient bar
- Cycle between extreme-sour, opposite-sour, idle
- pH pointer and labels still animate
- No overlap

- [ ] **Step 7: Commit**

```bash
git add js/ph-scale.js
git commit -m "Fix pH game tutorial: Piko in document flow, no transform overlap"
```

---

### Task 5: Test full game flows end-to-end

**Files:** None (testing only)

- [ ] **Step 1: Test Whack-A-Mold full flow**

1. Hub → click Whack-A-Mold card
2. Start screen: Piko cycles emotions, cards highlight, no overlap
3. Click "Start Game" → countdown → game plays
4. Score, timer work correctly
5. Game over → score display, name entry
6. Submit score → leaderboard updates
7. Play Again → back to start screen
8. ← Hub → returns to home

- [ ] **Step 2: Test Sour Blitz full flow**

1. Hub → click Sour Blitz card
2. Start screen: Piko cycles emotions, pH bar animates, no overlap
3. Click "Start Game" → game plays
4. MORE/LESS SOUR buttons work
5. Game over → score, name entry
6. Submit → leaderboard
7. Play Again → start screen
8. ← Hub → home

- [ ] **Step 3: Test on different viewport sizes**

Resize browser to:
- iPhone SE (375x667)
- iPhone 14 Pro Max (430x932)
- Small Android (360x640)

All game content should fit on one screen without scrolling.

- [ ] **Step 4: Test tab switching mid-game**

Start a game, click ← Hub mid-play. Game should stop (endGame called).

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "Game page redesign: Piko in-flow, mobile-fit layouts"
```
