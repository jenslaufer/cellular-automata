import { describe, expect, it } from "vitest";
import { mandelbrotIterations } from "./useMandelbrot.js";

describe("mandelbrotIterations", () => {
  it("returns 0 for c=(2,2) — starting magnitude > 2", () => {
    expect(mandelbrotIterations([2, 2], 100)).toBe(0);
  });

  it("returns maxIter for c=(0,0) — fixed point, never escapes", () => {
    expect(mandelbrotIterations([0, 0], 100)).toBe(100);
  });

  it("returns maxIter for c=(-1, 0) — period-2 cycle, inside the set", () => {
    expect(mandelbrotIterations([-1, 0], 200)).toBe(200);
  });

  it("returns maxIter for c=(-0.5, 0) — main cardioid, inside the set", () => {
    expect(mandelbrotIterations([-0.5, 0], 200)).toBe(200);
  });
});
