import { reactive } from "vue";

export function kochReplace(a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const p1 = a;
  const p2 = [a[0] + dx / 3, a[1] + dy / 3];
  const p4 = [a[0] + (2 * dx) / 3, a[1] + (2 * dy) / 3];
  const p5 = b;
  const vx = p4[0] - p2[0];
  const vy = p4[1] - p2[1];
  const cos60 = 0.5;
  const sin60 = Math.sqrt(3) / 2;
  const rx = vx * cos60 - vy * sin60;
  const ry = vx * sin60 + vy * cos60;
  const p3 = [p2[0] + rx, p2[1] + ry];
  return [
    [p1, p2],
    [p2, p3],
    [p3, p4],
    [p4, p5],
  ];
}

export function kochSnowflake(depth, size = 1, center = [0.5, 0.5]) {
  const h = (size * Math.sqrt(3)) / 2;
  const [cx, cy] = center;
  const v1 = [cx - size / 2, cy + h / 3];
  const v2 = [cx + size / 2, cy + h / 3];
  const v3 = [cx, cy - (2 * h) / 3];
  let segments = [
    [v1, v2],
    [v2, v3],
    [v3, v1],
  ];
  for (let d = 0; d < depth; d++) {
    const next = [];
    for (const [a, b] of segments) {
      next.push(...kochReplace(a, b));
    }
    segments = next;
  }
  return segments;
}

export const presets = [
  { name: "Depth 1", depth: 1 },
  { name: "Depth 2", depth: 2 },
  { name: "Depth 3", depth: 3 },
  { name: "Depth 4", depth: 4 },
  { name: "Depth 5", depth: 5 },
  { name: "Depth 6", depth: 6 },
];

export function useKochSnowflake() {
  const params = reactive({
    depth: 4,
    width: 600,
    height: 600,
  });

  function compute() {
    return kochSnowflake(params.depth);
  }

  return { params, compute, presets };
}
