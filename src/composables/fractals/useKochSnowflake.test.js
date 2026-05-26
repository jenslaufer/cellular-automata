import { describe, expect, it } from "vitest";
import { kochSnowflake } from "./useKochSnowflake.js";

function segmentLength([a, b]) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

describe("kochSnowflake segment counts", () => {
  it("depth 0 → 3 segments", () => {
    expect(kochSnowflake(0).length).toBe(3);
  });

  it("depth 1 → 12 segments (3 * 4^1)", () => {
    expect(kochSnowflake(1).length).toBe(12);
  });

  it("depth 2 → 48 segments (3 * 4^2)", () => {
    expect(kochSnowflake(2).length).toBe(48);
  });
});

describe("kochSnowflake segment length scaling", () => {
  it("each iteration divides segment length by 3", () => {
    const eps = 1e-9;
    const d0 = kochSnowflake(0, 1);
    const d1 = kochSnowflake(1, 1);
    const d2 = kochSnowflake(2, 1);
    const l0 = segmentLength(d0[0]);
    const l1 = segmentLength(d1[0]);
    const l2 = segmentLength(d2[0]);
    expect(Math.abs(l1 - l0 / 3)).toBeLessThan(eps);
    expect(Math.abs(l2 - l0 / 9)).toBeLessThan(eps);
  });
});
