<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  iterations: { type: Object, required: true }, // Uint16Array
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  maxIterations: { type: Number, required: true },
});

const canvas = ref(null);

function draw() {
  const el = canvas.value;
  if (!el || !props.iterations || !props.width || !props.height) return;

  const { width, height, iterations, maxIterations } = props;
  const dpr = window.devicePixelRatio || 1;

  el.width = width * dpr;
  el.height = height * dpr;
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;

  const ctx = el.getContext("2d");
  ctx.scale(dpr, dpr);

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const i = iterations[py * width + px];
      const idx = (py * width + px) * 4;
      if (i === maxIterations) {
        // Interior — black
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
        data[idx + 3] = 255;
      } else {
        // Escape — HSL coloring
        const hue = (360 * i / maxIterations) | 0;
        const [r, g, b] = hslToRgb(hue / 360, 1, 0.5);
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  const sector = Math.floor(h * 6);
  if (sector === 0) { r = c; g = x; }
  else if (sector === 1) { r = x; g = c; }
  else if (sector === 2) { g = c; b = x; }
  else if (sector === 3) { g = x; b = c; }
  else if (sector === 4) { r = x; b = c; }
  else { r = c; b = x; }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

onMounted(draw);
watch(() => [props.iterations, props.width, props.height, props.maxIterations], draw, { deep: false });
</script>

<template>
  <div class="overflow-auto max-w-full">
    <canvas ref="canvas" class="block" />
  </div>
</template>
