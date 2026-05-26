import { describe, expect, it } from "vitest";
import { generateKochSegments } from "./useKochSnowflake.js";

describe("generateKochSegments", () => {
  it("depth 0 → 3 segments (12 floats)", () => {
    const result = generateKochSegments(0);
    expect(result).toBeInstanceOf(Float32Array);
    expect(result.length).toBe(12);
  });

  it("depth 1 → 12 segments (48 floats)", () => {
    const result = generateKochSegments(1);
    expect(result).toBeInstanceOf(Float32Array);
    expect(result.length).toBe(48);
  });

  it("depth 2 → 48 segments (192 floats)", () => {
    const result = generateKochSegments(2);
    expect(result).toBeInstanceOf(Float32Array);
    expect(result.length).toBe(192);
  });

  it("each segment is a (x1,y1,x2,y2) quad — length divisible by 4", () => {
    for (const depth of [0, 1, 2, 3]) {
      const result = generateKochSegments(depth);
      expect(result.length % 4).toBe(0);
    }
  });
});
