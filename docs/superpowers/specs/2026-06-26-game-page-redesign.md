# Game Page Redesign Spec

## Problem
Both game pages (Whack-A-Mold and Sour Blitz) have layout issues on mobile:
- Piko overlaps text and tutorial cards (positioned with `position: fixed` + `translateX(±65px) scale(1.4)`)
- Content doesn't fit on one phone screen without scrolling
- Old heading blocks with "Game 1"/"Game 2" tags waste space
- Tutorial attract loop animations fight with the card layout

## Design Decision
**Compact Card layout** — everything in one card, Piko in document flow (not fixed positioned), tutorial cycle still works with card/bar highlighting.

## Layout: Whack-A-Mold Start Screen

```
← Hub
🦠 Whack-A-Mold
┌─────────────────────────┐
│  Protect the Jar!        │
│  Tap the mold, avoid...  │
│                          │
│      [Piko ~80px]        │
│   cycles: hating-it →    │
│   loving-it → idle       │
│                          │
│  [BAD 🦠]  [GOOD 🧫]    │
│   card highlights sync   │
│   with Piko emotion      │
│                          │
│  [  START GAME  ]        │
│  [ PLAY TUTORIAL ]       │
└─────────────────────────┘
```

## Layout: Sour Blitz Start Screen

```
← Hub
🍋 Sour Blitz
┌─────────────────────────┐
│  Sour Blitz!             │
│  Guess MORE or LESS sour │
│  than Pure Water         │
│                          │
│      [Piko ~80px]        │
│   cycles: extreme-sour → │
│   opposite-sour → idle   │
│                          │
│  [==pH gradient bar===]  │
│  ACIDIC  NEUTRAL  ALKAL  │
│  feedback text animates  │
│                          │
│  [  START GAME  ]        │
│  [ PLAY TUTORIAL ]       │
└─────────────────────────┘
```

## Changes Required

### HTML (index.html)

**Both game pages:**
- Add a `<div id="piko-mold-spot">` / `<div id="piko-blitz-spot">` between title/subtitle and tutorial elements inside the overlay
- These divs center Piko in the document flow: `display:flex; justify-content:center; pointer-events:none;`

### JS — Piko Positioning (mold-game.js, ph-scale.js)

**Remove fixed-position transforms.** Currently:
```javascript
mascotEl.style.transform = 'translateX(-65px) scale(1.4)';
```

**Replace with:** Move Piko container into the spot div, use relative positioning. The emotion cycling and card highlighting stay — just remove the transform-based positioning.

**mold-game.js `startTutorialLoop()`:**
- Move `piko-reaction-container` into `#piko-mold-spot`
- Set `container.style.position = 'relative'`
- Remove `mascotEl.style.transform` lines
- Keep: `piko.react('hating-it')`, `piko.react('loving-it')` cycling
- Keep: bad/good card highlight glow logic

**ph-scale.js `startTutorialLoop()`:**
- Move `piko-reaction-container` into `#piko-blitz-spot`
- Set `container.style.position = 'relative'`
- Remove `mascotEl.style.transform` lines
- Keep: `piko.react('extreme-sour')`, `piko.react('opposite-sour')`, `piko.react('idle')` cycling
- Keep: pH pointer/label animation logic

**Both `stopTutorialLoop()` functions:**
- Remove `mascotEl.style.transform = ''` cleanup (no longer needed)
- Keep card/label style resets

### CSS (components.css)

**New context: `piko-context-game-tutorial` update:**
- Remove fixed positioning (top: 320px, left: 50%)
- Add: `position: relative; width: 80px; height: 80px;`
- No transforms needed

**Piko in-flow styling:**
```css
.piko-context-game-tutorial {
  position: relative !important;
  width: 80px;
  height: 80px;
  overflow: visible;
  opacity: 1;
  pointer-events: none;
  filter: none;
  transform: none;
}
```

### Game Over Overlay

Same card structure — when game ends, the overlay shows:
```
┌─────────────────────────┐
│  Jar Saved! / Time's Up! │
│  Final Score: 420        │
│                          │
│  [Name Entry] [Submit]   │
│                          │
│  [  PLAY AGAIN  ]       │
│  [ PLAY TUTORIAL ]       │
└─────────────────────────┘
```
Piko reacts (win/fail) in the corner during game over — no need to be in the overlay.

### Arcade Mode

When game starts (fullscreen takeover):
- Piko moves to `game-active` context (top-right corner, small)
- No changes needed to arcade mode layout
- Exit button stays top-right

## Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Add Piko spot divs in both overlays |
| `js/mold-game.js` | Remove transform positioning in tutorial loop, use spot div |
| `js/ph-scale.js` | Same as mold-game |
| `css/components.css` | Update `.piko-context-game-tutorial` to relative positioning |

## Verification

1. Load mold game → Piko cycles emotions inside card, cards highlight, no overlap
2. Load blitz game → Same pattern with pH bar
3. Start game → Piko moves to corner, arcade mode works
4. Game over → score shows, name entry works
5. Exit → returns to start screen with tutorial loop
6. Resize to iPhone SE (375px) → everything fits on one screen
7. Resize to iPhone 14 Pro Max (430px) → no empty space
