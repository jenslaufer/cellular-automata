// D2Q9 lattice Boltzmann (BGK collision) — pure JS, single-thread.
//
// Velocity vectors e_i, weights w_i and the speed-of-sound² cs2 follow the
// indexing fixed in the spec (e_0 .. e_8). Internal storage uses typed arrays
// laid out direction-major: f[k*N + idx] with idx = y*nx + x. Macroscopic and
// distribution buffers use Float64 to satisfy the mass-conservation tolerance
// (1e-6 over 100 steps), which is not reachable in single precision.

export const E = [
  [0, 0],
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
  [1, 1],
  [-1, 1],
  [-1, -1],
  [1, -1],
];

export const W = [4 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 36, 1 / 36, 1 / 36, 1 / 36];
export const OPP = [0, 3, 4, 1, 2, 7, 8, 5, 6];
export const CS2 = 1 / 3;

const PAIRS = [
  [1, 3],
  [2, 4],
  [5, 7],
  [6, 8],
];

export function equilibrium(rho, ux, uy) {
  const usq = ux * ux + uy * uy;
  const out = new Array(9);
  for (let i = 0; i < 9; i++) {
    const eu = E[i][0] * ux + E[i][1] * uy;
    out[i] = W[i] * rho * (1 + eu / CS2 + (eu * eu) / (2 * CS2 * CS2) - usq / (2 * CS2));
  }
  return out;
}

// Wet-node bounce-back: at every cellType !== 0 cell, swap opposing pair
// distributions in place (1↔3, 2↔4, 5↔7, 6↔8). f is laid out f[k*N + idx].
export function bounceBack(f, cellType, N) {
  for (let idx = 0; idx < N; idx++) {
    if (cellType[idx] === 0) continue;
    for (let p = 0; p < 4; p++) {
      const a = PAIRS[p][0];
      const b = PAIRS[p][1];
      const ta = f[a * N + idx];
      f[a * N + idx] = f[b * N + idx];
      f[b * N + idx] = ta;
    }
  }
}

const PRESETS = {
  karman: {
    periodicX: false,
    periodicY: false,
    inflow: true,
    outflow: true,
    u_in: 0.1,
    rho_in: 1.0,
    obstacleFn: (x, y, nx, ny) => {
      if (y === 0 || y === ny - 1) return 1;
      const cx = nx / 4;
      const cy = ny / 2;
      const r = 8;
      const dx = x - cx;
      const dy = y - cy;
      return dx * dx + dy * dy <= r * r ? 1 : 0;
    },
    initFn: () => ({ rho: 1.0, ux: 0.1, uy: 0.0 }),
  },
  cavity: {
    periodicX: false,
    periodicY: false,
    inflow: false,
    outflow: false,
    u_lid: 0.1,
    obstacleFn: (x, y, nx, ny) => {
      if (y === 0) return 2; // moving lid (top in array order)
      if (y === ny - 1 || x === 0 || x === nx - 1) return 1;
      return 0;
    },
    initFn: () => ({ rho: 1.0, ux: 0.0, uy: 0.0 }),
  },
  kelvin: {
    periodicX: true,
    periodicY: true,
    inflow: false,
    outflow: false,
    obstacleFn: () => 0,
    initFn: (nx, ny, x, y) => {
      const ux = y < ny / 2 ? 0.1 : -0.1;
      const uy = 0.005 * Math.sin((2 * Math.PI * x) / nx);
      return { rho: 1.0, ux, uy };
    },
  },
};

export function useLatticeBoltzmann(opts = {}) {
  const nx = opts.nx ?? 200;
  const ny = opts.ny ?? 80;
  const tau = opts.tau ?? 0.6;
  const N = nx * ny;
  const omega = 1 / tau;

  let f = new Float64Array(N * 9);
  let next = new Float64Array(N * 9);
  const rho = new Float64Array(N);
  const ux = new Float64Array(N);
  const uy = new Float64Array(N);
  const cellType = new Uint8Array(N); // 0 fluid, 1 solid, 2 moving wall

  let preset = null;
  let presetName = null;
  let stepCount = 0;

  const idx = (x, y) => y * nx + x;

  function setEquilibrium(rho0, ux0, uy0, x, y) {
    const i = idx(x, y);
    rho[i] = rho0;
    ux[i] = ux0;
    uy[i] = uy0;
    const usq = ux0 * ux0 + uy0 * uy0;
    for (let k = 0; k < 9; k++) {
      const eu = E[k][0] * ux0 + E[k][1] * uy0;
      f[k * N + i] = W[k] * rho0 * (1 + eu / CS2 + (eu * eu) / (2 * CS2 * CS2) - usq / (2 * CS2));
    }
  }

  function init(name) {
    if (!(name in PRESETS)) throw new Error(`unknown preset: ${name}`);
    presetName = name;
    preset = PRESETS[name];
    stepCount = 0;
    f.fill(0);
    next.fill(0);
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        cellType[idx(x, y)] = preset.obstacleFn(x, y, nx, ny);
      }
    }
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        const c = preset.initFn(nx, ny, x, y);
        setEquilibrium(c.rho, c.ux, c.uy, x, y);
      }
    }
  }

  function reset() {
    if (presetName !== null) init(presetName);
  }

  function computeMacroscopic() {
    for (let i = 0; i < N; i++) {
      if (cellType[i] !== 0) {
        rho[i] = 1;
        ux[i] = 0;
        uy[i] = 0;
        continue;
      }
      let r = 0;
      let mx = 0;
      let my = 0;
      for (let k = 0; k < 9; k++) {
        const fk = f[k * N + i];
        r += fk;
        mx += fk * E[k][0];
        my += fk * E[k][1];
      }
      rho[i] = r;
      ux[i] = mx / r;
      uy[i] = my / r;
    }
  }

  function collide() {
    for (let i = 0; i < N; i++) {
      if (cellType[i] !== 0) continue;
      const r = rho[i];
      const u = ux[i];
      const v = uy[i];
      const usq = u * u + v * v;
      for (let k = 0; k < 9; k++) {
        const eu = E[k][0] * u + E[k][1] * v;
        const feq = W[k] * r * (1 + eu / CS2 + (eu * eu) / (2 * CS2 * CS2) - usq / (2 * CS2));
        const fi = f[k * N + i];
        f[k * N + i] = fi - (fi - feq) * omega;
      }
    }
  }

  function applyInflow() {
    if (!preset.inflow) return;
    const uIn = preset.u_in;
    for (let y = 0; y < ny; y++) {
      const i = idx(0, y);
      if (cellType[i] !== 0) continue;
      const f0 = f[0 * N + i];
      const f2 = f[2 * N + i];
      const f3 = f[3 * N + i];
      const f4 = f[4 * N + i];
      const f6 = f[6 * N + i];
      const f7 = f[7 * N + i];
      const r = (f0 + f2 + f4 + 2 * (f3 + f6 + f7)) / (1 - uIn);
      f[1 * N + i] = f3 + (2 / 3) * r * uIn;
      f[5 * N + i] = f7 - 0.5 * (f2 - f4) + (1 / 6) * r * uIn;
      f[8 * N + i] = f6 + 0.5 * (f2 - f4) + (1 / 6) * r * uIn;
      rho[i] = r;
      ux[i] = uIn;
      uy[i] = 0;
    }
  }

  function applyOutflow() {
    if (!preset.outflow) return;
    for (let y = 0; y < ny; y++) {
      const dst = idx(nx - 1, y);
      const src = idx(nx - 2, y);
      for (let k = 0; k < 9; k++) {
        f[k * N + dst] = f[k * N + src];
      }
    }
  }

  function stream() {
    next.fill(0);
    const px = preset.periodicX;
    const py = preset.periodicY;
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        const src = idx(x, y);
        for (let k = 0; k < 9; k++) {
          let xt = x + E[k][0];
          let yt = y + E[k][1];
          if (px) {
            if (xt < 0) xt += nx;
            else if (xt >= nx) xt -= nx;
          } else if (xt < 0 || xt >= nx) {
            continue;
          }
          if (py) {
            if (yt < 0) yt += ny;
            else if (yt >= ny) yt -= ny;
          } else if (yt < 0 || yt >= ny) {
            continue;
          }
          next[k * N + idx(xt, yt)] = f[k * N + src];
        }
      }
    }
    const tmp = f;
    f = next;
    next = tmp;
  }

  function applyBounceBack() {
    for (let i = 0; i < N; i++) {
      if (cellType[i] === 0) continue;
      for (let p = 0; p < 4; p++) {
        const a = PAIRS[p][0];
        const b = PAIRS[p][1];
        const ta = f[a * N + i];
        f[a * N + i] = f[b * N + i];
        f[b * N + i] = ta;
      }
      if (cellType[i] === 2) {
        // Moving wall (Ladd correction): subtract 2*w_k*rho*(e_k · u_wall)/cs2
        // from each reflected population. Approximate rho ≈ 1 at the wall.
        const uWall = preset.u_lid ?? 0;
        for (let k = 1; k < 9; k++) {
          f[k * N + i] -= (2 * W[k] * E[k][0] * uWall) / CS2;
        }
      }
    }
  }

  function step() {
    computeMacroscopic();
    collide();
    stream();
    applyBounceBack();
    applyInflow();
    applyOutflow();
    stepCount++;
  }

  function getVorticity() {
    const out = new Float64Array(N);
    for (let y = 0; y < ny; y++) {
      const yp = y + 1 >= ny ? (preset.periodicY ? 0 : y) : y + 1;
      const ym = y - 1 < 0 ? (preset.periodicY ? ny - 1 : y) : y - 1;
      for (let x = 0; x < nx; x++) {
        const xp = x + 1 >= nx ? (preset.periodicX ? 0 : x) : x + 1;
        const xm = x - 1 < 0 ? (preset.periodicX ? nx - 1 : x) : x - 1;
        out[idx(x, y)] =
          (uy[idx(xp, y)] - uy[idx(xm, y)]) / 2 - (ux[idx(x, yp)] - ux[idx(x, ym)]) / 2;
      }
    }
    return out;
  }

  return {
    nx,
    ny,
    tau,
    N,
    init,
    step,
    reset,
    getVorticity,
    bounceBack: () => applyBounceBack(),
    get f() {
      return f;
    },
    get rho() {
      return rho;
    },
    get ux() {
      return ux;
    },
    get uy() {
      return uy;
    },
    get cellType() {
      return cellType;
    },
    get stepCount() {
      return stepCount;
    },
    get presetName() {
      return presetName;
    },
  };
}
