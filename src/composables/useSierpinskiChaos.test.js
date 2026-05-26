import { describe, expect, it } from "vitest";
import { chaosGameStep, createRng } from "./useSierpinskiChaos.js";

describe("createRng", () => {
  it("returns deterministic sequence for the same seed", () => {
    const rng1 = createRng(42);
    const rng2 = createRng(42);
    const seq1 = [rng1.next(), rng1.next(), rng1.next(), rng1.next(), rng1.next()];
    const seq2 = [rng2.next(), rng2.next(), rng2.next(), rng2.next(), rng2.next()];
    expect(seq1).toEqual(seq2);
  });

  it("yields floats in [0, 1)", () => {
    const rng = createRng(1);
    for (let i = 0; i < 20; i++) {
      const v = rng.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("chaosGameStep", () => {
  it("returns midpoint between point and vertex", () => {
    const result = chaosGameStep({ x: 0, y: 0 }, { x: 1, y: 1 });
    expect(result.x).toBeCloseTo(0.5);
    expect(result.y).toBeCloseTo(0.5);
  });

  it("midpoint between (2,4) and (6,8) is (4,6)", () => {
    const result = chaosGameStep({ x: 2, y: 4 }, { x: 6, y: 8 });
    expect(result.x).toBeCloseTo(4);
    expect(result.y).toBeCloseTo(6);
  });
});

describe("useSierpinskiChaos compute", () => {
  it("same seed produces identical Float32Array", async () => {
    const { useSierpinskiChaos } = await import("./useSierpinskiChaos.js");
    const { params, compute } = useSierpinskiChaos();
    params.value.pointCount = 500;
    params.value.seed = 7;
    const r1 = compute();
    const r2 = compute();
    expect(r1.points).toEqual(r2.points);
  });

  it("Float32Array length === pointCount * 2", async () => {
    const { useSierpinskiChaos } = await import("./useSierpinskiChaos.js");
    const { params, compute } = useSierpinskiChaos();
    params.value.pointCount = 300;
    params.value.seed = 1;
    const result = compute();
    expect(result.points).toBeInstanceOf(Float32Array);
    expect(result.points.length).toBe(300 * 2);
  });
});
