import { describe, expect, it } from "vitest";
import { chaosGameStep, runChaosGame } from "./useSierpinskiChaos.js";

describe("chaosGameStep", () => {
  it("returns midpoint between origin and (1,1)", () => {
    expect(chaosGameStep([0, 0], [1, 1])).toEqual([0.5, 0.5]);
  });

  it("returns midpoint between (1,1) and (3,3)", () => {
    expect(chaosGameStep([1, 1], [3, 3])).toEqual([2, 2]);
  });
});

describe("runChaosGame", () => {
  it("is deterministic for fixed seed — two runs produce identical Float32Array", () => {
    const a = runChaosGame(42, 1000);
    const b = runChaosGame(42, 1000);
    expect(a.length).toBe(b.length);
    expect(a.length).toBe(2000);
    for (let i = 0; i < a.length; i++) {
      expect(a[i]).toBe(b[i]);
    }
  });

  it("produces different output for different seeds", () => {
    const a = runChaosGame(42, 100);
    const b = runChaosGame(43, 100);
    let differ = false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        differ = true;
        break;
      }
    }
    expect(differ).toBe(true);
  });
});
