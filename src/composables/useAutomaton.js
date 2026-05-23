import { computed, ref } from "vue";

export function ruleToBits(rule) {
  const bits = new Uint8Array(8);
  for (let i = 0; i < 8; i++) bits[i] = (rule >> i) & 1;
  return bits;
}

export function nextGeneration(prev, bits) {
  const n = prev.length;
  const next = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const left = prev[(i - 1 + n) % n];
    const center = prev[i];
    const right = prev[(i + 1) % n];
    const index = (left << 2) | (center << 1) | right;
    next[i] = bits[index];
  }
  return next;
}

export function makeInitial(width, mode) {
  const row = new Uint8Array(width);
  if (mode === "single") {
    row[Math.floor(width / 2)] = 1;
  } else if (mode === "random") {
    for (let i = 0; i < width; i++) row[i] = Math.random() < 0.5 ? 1 : 0;
  } else if (mode === "left") {
    row[0] = 1;
  }
  return row;
}

export function useAutomaton(initialRule = 30, initialWidth = 201, initialGenerations = 200) {
  const rule = ref(initialRule);
  const width = ref(initialWidth);
  const generations = ref(initialGenerations);
  const initialMode = ref("single");

  const bits = computed(() => ruleToBits(rule.value));

  function compute() {
    const w = width.value;
    const gen = generations.value;
    const b = bits.value;
    const grid = new Array(gen);
    grid[0] = makeInitial(w, initialMode.value);
    for (let i = 1; i < gen; i++) {
      grid[i] = nextGeneration(grid[i - 1], b);
    }
    return grid;
  }

  return {
    rule,
    width,
    generations,
    initialMode,
    bits,
    compute,
  };
}
