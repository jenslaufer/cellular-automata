import { reactive } from "vue";

export function mandelbrotIterations(c, maxIter) {
  const [cr, ci] = c;
  let zr = cr;
  let zi = ci;
  for (let i = 0; i < maxIter; i++) {
    if (zr * zr + zi * zi > 4) return i;
    const newZr = zr * zr - zi * zi + cr;
    zi = 2 * zr * zi + ci;
    zr = newZr;
  }
  return maxIter;
}

export function computeMandelbrot({ centerX, centerY, zoom, maxIter, width, height }) {
  const buffer = new Uint8ClampedArray(width * height * 4);
  const aspect = width / height;
  const halfW = zoom * aspect;
  const halfH = zoom;
  const x0 = centerX - halfW;
  const y0 = centerY - halfH;
  const dx = (2 * halfW) / width;
  const dy = (2 * halfH) / height;

  for (let py = 0; py < height; py++) {
    const cy = y0 + py * dy;
    for (let px = 0; px < width; px++) {
      const cx = x0 + px * dx;
      const i = mandelbrotIterations([cx, cy], maxIter);
      const idx = (py * width + px) * 4;
      if (i === maxIter) {
        buffer[idx] = 0;
        buffer[idx + 1] = 0;
        buffer[idx + 2] = 0;
      } else {
        const hue = 360 * (i / maxIter);
        const [r, g, b] = hslToRgb(hue, 1, 0.5);
        buffer[idx] = r;
        buffer[idx + 1] = g;
        buffer[idx + 2] = b;
      }
      buffer[idx + 3] = 255;
    }
  }
  return buffer;
}

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

export const presets = [
  { name: "Default", centerX: -0.7, centerY: 0, zoom: 2.5, maxIter: 200 },
  { name: "Seahorse Valley", centerX: -0.75, centerY: 0.1, zoom: 0.05, maxIter: 200 },
  { name: "Elephant Valley", centerX: 0.25, centerY: 0, zoom: 0.05, maxIter: 200 },
];

export function useMandelbrot() {
  const params = reactive({
    centerX: -0.7,
    centerY: 0,
    zoom: 2.5,
    maxIter: 200,
    width: 600,
    height: 400,
  });

  function compute() {
    return computeMandelbrot(params);
  }

  return { params, compute, presets };
}
