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

## Fractals

A second tab renders three classical fractals on Canvas 2D, all deterministic snapshots (no animation loop, no GPU):

- **Mandelbrot set** — escape-time render with HSL palette (`hue = 360 · i / maxIter`), points inside the set drawn black. Presets: Default, Seahorse Valley, Elephant Valley.
- **Sierpinski (chaos game)** — seeded `mulberry32` RNG drives the chaos game for deterministic output. Variants: Triangle, Carpet, Vicsek.
- **Koch snowflake** — iterative segment expansion (axiom `F++F++F`, rule `F → F-F++F-F`, 60° angle). Depth selectable 1–6.
