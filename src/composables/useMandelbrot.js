import { ref } from "vue";

export function mandelbrotIterations(c, maxIter) {
  // Pre-check: if c itself lies outside the escape radius, iteration count is 0
  if (c.re * c.re + c.im * c.im > 4) return 0;
  let re = 0;
  let im = 0;
  let iter = 0;
  while (iter < maxIter) {
    const reNext = re * re - im * im + c.re;
    const imNext = 2 * re * im + c.im;
    re = reNext;
    im = imNext;
    iter++;
    if (re * re + im * im > 4) break;
  }
  return iter;
}

export function useMandelbrot() {
  const params = ref({
    centerX: -0.5,
    centerY: 0,
    zoom: 1,
    maxIterations: 100,
    width: 800,
    height: 600,
  });

  const presets = [
    { label: "Full view", params: { centerX: -0.5, centerY: 0, zoom: 1, maxIterations: 100 } },
    { label: "Seahorse valley", params: { centerX: -0.745, centerY: 0.113, zoom: 80, maxIterations: 256 } },
    { label: "Elephant valley", params: { centerX: 0.3, centerY: 0, zoom: 10, maxIterations: 200 } },
  ];

  function compute() {
    const { centerX, centerY, zoom, maxIterations, width, height } = params.value;
    const iterations = new Uint16Array(width * height);
    const scale = 3.5 / (zoom * width);
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const cRe = centerX + (px - width / 2) * scale;
        const cIm = centerY + (py - height / 2) * scale;
        iterations[py * width + px] = mandelbrotIterations({ re: cRe, im: cIm }, maxIterations);
      }
    }
    return { width, height, iterations };
  }

  return { params, compute, presets };
}
