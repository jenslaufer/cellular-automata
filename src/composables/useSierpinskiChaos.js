import { ref } from "vue";

// Linear Congruential Generator — deterministic, no Math.random()
// Parameters from Numerical Recipes: m=2^32, a=1664525, c=1013904223
export function createRng(seed) {
  let state = seed >>> 0;
  return {
    next() {
      state = ((Math.imul(1664525, state) + 1013904223) >>> 0);
      return state / 4294967296;
    },
  };
}

export function chaosGameStep(point, vertex) {
  return {
    x: (point.x + vertex.x) / 2,
    y: (point.y + vertex.y) / 2,
  };
}

export function useSierpinskiChaos() {
  const params = ref({
    pointCount: 10000,
    seed: 42,
  });

  const presets = [
    { label: "10 000 points", params: { pointCount: 10000, seed: 42 } },
    { label: "50 000 points", params: { pointCount: 50000, seed: 42 } },
    { label: "Custom seed", params: { pointCount: 10000, seed: 1337 } },
  ];

  // Equilateral triangle vertices normalised to [0,1]
  const vertices = [
    { x: 0.5, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ];

  function compute() {
    const { pointCount, seed } = params.value;
    const rng = createRng(seed);
    const points = new Float32Array(pointCount * 2);
    let current = { x: 0.5, y: 0.5 };
    for (let i = 0; i < pointCount; i++) {
      const vertexIndex = Math.floor(rng.next() * 3);
      current = chaosGameStep(current, vertices[vertexIndex]);
      points[i * 2] = current.x;
      points[i * 2 + 1] = current.y;
    }
    return { points };
  }

  return { params, compute, presets };
}
