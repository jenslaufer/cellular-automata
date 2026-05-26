import { reactive } from "vue";

export function chaosGameStep(point, vertex) {
  return [(point[0] + vertex[0]) / 2, (point[1] + vertex[1]) / 2];
}

export function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TRIANGLE_VERTICES = [
  [0.5, 0.05],
  [0.05, 0.95],
  [0.95, 0.95],
];

const CARPET_VERTICES = [
  [0.05, 0.05],
  [0.5, 0.05],
  [0.95, 0.05],
  [0.05, 0.5],
  [0.95, 0.5],
  [0.05, 0.95],
  [0.5, 0.95],
  [0.95, 0.95],
];

const VICSEK_VERTICES = [
  [0.05, 0.05],
  [0.95, 0.05],
  [0.5, 0.5],
  [0.05, 0.95],
  [0.95, 0.95],
];

export const VARIANTS = {
  triangle: { ratio: 0.5, vertices: TRIANGLE_VERTICES },
  carpet: { ratio: 2 / 3, vertices: CARPET_VERTICES },
  vicsek: { ratio: 2 / 3, vertices: VICSEK_VERTICES },
};

export function runChaosGame(seed, n, variant = "triangle") {
  const rng = mulberry32(seed);
  const { ratio, vertices } = VARIANTS[variant] ?? VARIANTS.triangle;
  const points = new Float32Array(n * 2);
  let x = 0.5;
  let y = 0.5;
  for (let i = 0; i < n; i++) {
    const v = vertices[Math.floor(rng() * vertices.length)];
    x = x + (v[0] - x) * (1 - ratio);
    y = y + (v[1] - y) * (1 - ratio);
    points[i * 2] = x;
    points[i * 2 + 1] = y;
  }
  return points;
}

export const presets = [
  { name: "Triangle", variant: "triangle" },
  { name: "Carpet variant", variant: "carpet" },
  { name: "Vicsek", variant: "vicsek" },
];

export function useSierpinskiChaos() {
  const params = reactive({
    points: 50000,
    seed: 42,
    variant: "triangle",
    width: 600,
    height: 600,
  });

  function compute() {
    return runChaosGame(params.seed, params.points, params.variant);
  }

  return { params, compute, presets };
}
