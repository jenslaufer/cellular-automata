<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  lb: { type: Object, required: true },
  tick: { type: Number, required: true },
  scale: { type: Number, default: 4 },
  clamp: { type: Number, default: 0.05 },
});

const canvas = ref(null);
let offCanvas = null;
let offCtx = null;
let imageData = null;

function ensureBuffers() {
  const { nx, ny } = props.lb;
  if (offCanvas && offCanvas.width === nx && offCanvas.height === ny) return;
  offCanvas = document.createElement("canvas");
  offCanvas.width = nx;
  offCanvas.height = ny;
  offCtx = offCanvas.getContext("2d");
  imageData = offCtx.createImageData(nx, ny);
}

function draw() {
  const cv = canvas.value;
  if (!cv) return;
  ensureBuffers();
  const { lb, scale, clamp } = props;
  const { nx, ny, cellType } = lb;
  const omega = lb.getVorticity();
  const data = imageData.data;
  for (let i = 0; i < nx * ny; i++) {
    let r = 0;
    let g = 0;
    let b = 0;
    if (cellType[i] === 0) {
      let w = omega[i] / clamp;
      if (w > 1) w = 1;
      else if (w < -1) w = -1;
      if (w >= 0) r = Math.floor(w * 255);
      else b = Math.floor(-w * 255);
    }
    const p = i * 4;
    data[p] = r;
    data[p + 1] = g;
    data[p + 2] = b;
    data[p + 3] = 255;
  }
  offCtx.putImageData(imageData, 0, 0);
  const targetW = nx * scale;
  const targetH = ny * scale;
  if (cv.width !== targetW || cv.height !== targetH) {
    cv.width = targetW;
    cv.height = targetH;
    cv.style.width = `${targetW}px`;
    cv.style.height = `${targetH}px`;
  }
  const ctx = cv.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(offCanvas, 0, 0, targetW, targetH);
}

onMounted(draw);
watch(() => props.tick, draw);
onBeforeUnmount(() => {
  offCanvas = null;
  offCtx = null;
  imageData = null;
});
</script>

<template>
  <div class="overflow-auto max-w-full">
    <canvas ref="canvas" class="block bg-black" />
  </div>
</template>
