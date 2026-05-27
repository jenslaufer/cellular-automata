import { describe, it, expect } from "vitest";
import {
  E,
  W,
  OPP,
  CS2,
  equilibrium,
  bounceBack,
  useLatticeBoltzmann,
} from "./useLatticeBoltzmann.js";

describe("D2Q9 lattice Boltzmann", () => {
  it("conserves total mass in a periodic box without inflow (≤1e-6 over 100 steps)", () => {
    const lb = useLatticeBoltzmann({ nx: 30, ny: 30 });
    lb.init("kelvin");
    const sumF = () => {
      let s = 0;
      for (let i = 0; i < lb.f.length; i++) s += lb.f[i];
      return s;
    };
    const before = sumF();
    for (let s = 0; s < 100; s++) lb.step();
    const after = sumF();
    expect(Math.abs(after - before)).toBeLessThan(1e-6);
  });

  it("keeps an initial f_eq at zero velocity stable for 50 steps (≤1e-8)", () => {
    const lb = useLatticeBoltzmann({ nx: 16, ny: 16 });
    lb.init("kelvin");
    // Overwrite with uniform equilibrium at rho=1, u=0.
    const feq0 = equilibrium(1, 0, 0);
    for (let i = 0; i < lb.N; i++) {
      for (let k = 0; k < 9; k++) lb.f[k * lb.N + i] = feq0[k];
    }
    const snapshot = new Float64Array(lb.f);
    for (let s = 0; s < 50; s++) lb.step();
    let maxDiff = 0;
    for (let i = 0; i < lb.f.length; i++) {
      const d = Math.abs(lb.f[i] - snapshot[i]);
      if (d > maxDiff) maxDiff = d;
    }
    expect(maxDiff).toBeLessThan(1e-8);
  });

  it("satisfies D2Q9 weight/velocity moment symmetries", () => {
    let sw = 0;
    let sx = 0;
    let sy = 0;
    let sxx = 0;
    let syy = 0;
    for (let i = 0; i < 9; i++) {
      sw += W[i];
      sx += W[i] * E[i][0];
      sy += W[i] * E[i][1];
      sxx += W[i] * E[i][0] * E[i][0];
      syy += W[i] * E[i][1] * E[i][1];
    }
    expect(Math.abs(sw - 1)).toBeLessThan(1e-12);
    expect(Math.abs(sx)).toBeLessThan(1e-12);
    expect(Math.abs(sy)).toBeLessThan(1e-12);
    expect(Math.abs(sxx - CS2)).toBeLessThan(1e-12);
    expect(Math.abs(syy - CS2)).toBeLessThan(1e-12);
    // Opposite-pair sanity.
    expect(OPP[1]).toBe(3);
    expect(OPP[2]).toBe(4);
    expect(OPP[5]).toBe(7);
    expect(OPP[6]).toBe(8);
  });

  it("bounce-back step reverses f_1 into f_3 at an isolated obstacle cell", () => {
    const N = 1;
    const f = new Float64Array(9 * N);
    const cellType = new Uint8Array(N);
    cellType[0] = 1;
    f[1 * N + 0] = 1;
    bounceBack(f, cellType, N);
    expect(f[3 * N + 0]).toBe(1);
    expect(f[1 * N + 0]).toBe(0);
    // All other distributions stay zero.
    for (const k of [0, 2, 4, 5, 6, 7, 8]) {
      expect(f[k * N + 0]).toBe(0);
    }
  });

  it("Karman preset develops a wake (max|uy|>0.01, min rho>0.5) after 200 steps", () => {
    const lb = useLatticeBoltzmann({ nx: 200, ny: 80 });
    lb.init("karman");
    for (let s = 0; s < 200; s++) lb.step();
    let maxUy = 0;
    let minRho = Infinity;
    for (let i = 0; i < lb.N; i++) {
      if (lb.cellType[i] !== 0) continue;
      const a = Math.abs(lb.uy[i]);
      if (a > maxUy) maxUy = a;
      if (lb.rho[i] < minRho) minRho = lb.rho[i];
    }
    expect(maxUy).toBeGreaterThan(0.01);
    expect(minRho).toBeGreaterThan(0.5);
  });
});
