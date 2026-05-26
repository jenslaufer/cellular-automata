<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  segments: { type: Array, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
});

const canvas = ref(null);

function draw() {
  const el = canvas.value;
  if (!el || !props.segments) return;

  const dpr = window.devicePixelRatio || 1;
  el.width = props.width * dpr;
  el.height = props.height * dpr;
  el.style.width = `${props.width}px`;
  el.style.height = `${props.height}px`;
  el.style.maxWidth = "100%";

  const ctx = el.getContext("2d");
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, props.width, props.height);

  if (!props.segments.length) return;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [a, b] of props.segments) {
    if (a[0] < minX) minX = a[0];
    if (b[0] < minX) minX = b[0];
    if (a[0] > maxX) maxX = a[0];
    if (b[0] > maxX) maxX = b[0];
    if (a[1] < minY) minY = a[1];
    if (b[1] < minY) minY = b[1];
    if (a[1] > maxY) maxY = a[1];
    if (b[1] > maxY) maxY = b[1];
  }
  const padding = 20;
  const sx = (props.width - 2 * padding) / (maxX - minX || 1);
  const sy = (props.height - 2 * padding) / (maxY - minY || 1);
  const s = Math.min(sx, sy);
  const offsetX = padding + (props.width - 2 * padding - s * (maxX - minX)) / 2;
  const offsetY = padding + (props.height - 2 * padding - s * (maxY - minY)) / 2;

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (const [a, b] of props.segments) {
    const ax = offsetX + (a[0] - minX) * s;
    const ay = offsetY + (a[1] - minY) * s;
    const bx = offsetX + (b[0] - minX) * s;
    const by = offsetY + (b[1] - minY) * s;
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
  }
  ctx.stroke();
}

function onResize() {
  draw();
}

onMounted(() => {
  draw();
  window.addEventListener("resize", onResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

watch(() => [props.segments, props.width, props.height], draw);
</script>

<template>
  <div class="overflow-auto max-w-full">
    <canvas ref="canvas" class="block" />
  </div>
</template>
