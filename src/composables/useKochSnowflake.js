import { ref } from "vue";

function subdivide(x1, y1, x2, y2) {
  // Divide segment into thirds
  const ax = x1 + (x2 - x1) / 3;
  const ay = y1 + (y2 - y1) / 3;
  const bx = x1 + 2 * (x2 - x1) / 3;
  const by = y1 + 2 * (y2 - y1) / 3;
  // Peak of the equilateral triangle erected on the middle third
  // Rotate (b-a) by -60° and add to a
  const dx = bx - ax;
  const dy = by - ay;
  const cos60 = 0.5;
  const sin60 = Math.sqrt(3) / 2;
  const px = ax + dx * cos60 - dy * (-sin60);
  const py = ay + dx * (-sin60) + dy * cos60;
  // Returns 4 segments: (x1,y1)→a, a→peak, peak→b, b→(x2,y2)
  return [
    x1, y1, ax, ay,
    ax, ay, px, py,
    px, py, bx, by,
    bx, by, x2, y2,
  ];
}

export function generateKochSegments(depth) {
  // Start with equilateral triangle (side length 1, centred)
  const r = 1 / Math.sqrt(3);
  const p0x = 0.5;
  const p0y = 0.5 - r;
  const p1x = 0.5 + 0.5;
  const p1y = 0.5 + r / 2;
  const p2x = 0.5 - 0.5;
  const p2y = 0.5 + r / 2;

  // Initial segments as flat array of (x1,y1,x2,y2) quads
  let segs = [
    p0x, p0y, p1x, p1y,
    p1x, p1y, p2x, p2y,
    p2x, p2y, p0x, p0y,
  ];

  for (let d = 0; d < depth; d++) {
    const next = [];
    for (let i = 0; i < segs.length; i += 4) {
      const sub = subdivide(segs[i], segs[i + 1], segs[i + 2], segs[i + 3]);
      for (const v of sub) next.push(v);
    }
    segs = next;
  }

  return new Float32Array(segs);
}

export function useKochSnowflake() {
  const params = ref({ depth: 4 });

  const presets = [
    { label: "Depth 1", params: { depth: 1 } },
    { label: "Depth 3", params: { depth: 3 } },
    { label: "Depth 5", params: { depth: 5 } },
  ];

  function compute() {
    const segments = generateKochSegments(params.value.depth);
    return { segments };
  }

  return { params, compute, presets };
}
