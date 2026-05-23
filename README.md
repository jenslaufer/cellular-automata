# Cellular Automata

Interactive visualization of elementary 1D cellular automata — all 256 Wolfram rules.

Each row is one time step. Each cell's next state depends on itself and its two neighbors via the chosen rule. Edges wrap toroidally.

## Stack

Vue 3, Vite, Tailwind CSS, Canvas 2D, Vitest.

## Dev

```bash
npm install
npm run dev      # local server
npm test         # unit tests
npm run build    # production build → dist/
```

## Structure

- `src/composables/useAutomaton.js` — rule decoding + generation step (pure functions, tested)
- `src/components/AutomatonCanvas.vue` — Canvas renderer
- `src/components/RulePreview.vue` — 8-pattern lookup display for the current rule
- `src/App.vue` — controls + layout

## Presets

Rule 30 (chaos), 90 (Sierpinski), 110 (Turing-complete), 184 (traffic), 54 (class IV), 150 (XOR).

Slider covers the full 0–255 space. Initial conditions: single center cell, random row, or left-edge seed.
