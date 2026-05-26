import { describe, expect, it } from "vitest";
import { mandelbrotIterations } from "./useMandelbrot.js";

describe("mandelbrotIterations", () => {
  it("c={re:2, im:2} escapes immediately → count 0", () => {
    // re²+im² = 4+4 = 8 > 4 before any iteration
    expect(mandelbrotIterations({ re: 2, im: 2 }, 100)).toBe(0);
  });

  it("c={re:0, im:0} never escapes → count === maxIter", () => {
    expect(mandelbrotIterations({ re: 0, im: 0 }, 100)).toBe(100);
  });

  it("c={re:-0.5, im:0} is interior at maxIter=100 → count === 100", () => {
    expect(mandelbrotIterations({ re: -0.5, im: 0 }, 100)).toBe(100);
  });

  it("c={re:0.5, im:0.5} escapes before maxIter=50 → count < 50", () => {
    expect(mandelbrotIterations({ re: 0.5, im: 0.5 }, 50)).toBeLessThan(50);
  });
});
