<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  segments: { type: Object, required: true }, // Float32Array of (x1,y1,x2,y2) quads
  viewBox: { type: Object, default: null },   // { minX, minY, maxX, maxY }
  canvasWidth: { type: Number, default: 800 },
  canvasHeight: { type: Number, default: 600 },
});

const canvas = ref(null);

function computeViewBox(segments) {
  if (!segments || segments.length === 0) return { minX: 0, minY: 0, maxX: 1, maxY: 1 };
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < segments.length; i += 4) {
    const x1 = segments[i], y1 = segments[i + 1], x2 = segments[i + 2], y2 = segments[i + 3];
    if (x1 < minX) minX = x1;
    if (x2 < minX) minX = x2;
    if (y1 < minY) minY = y1;
    if (y2 < minY) minY = y2;
    if (x1 > maxX) maxX = x1;
    if (x2 > maxX) maxX = x2;
    if (y1 > maxY) maxY = y1;
    if (y2 > maxY) maxY = y2;
  }
  return { minX, minY, maxX, maxY };
}

function draw() {
  const el = canvas.value;
  if (!el || !props.segments || props.segments.length === 0) return;

  const w = props.canvasWidth;
  const h = props.canvasHeight;
  const dpr = window.devicePixelRatio || 1;

  el.width = w * dpr;
  el.height = h * dpr;
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;

  const ctx = el.getContext("2d");
  ctx.scale(dpr, dpr);

  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, w, h);

  const vb = props.viewBox ?? computeViewBox(props.segments);
  const rangeX = vb.maxX - vb.minX || 1;
  const rangeY = vb.maxY - vb.minY || 1;
  const padding = 20;
  const scaleX = (w - padding * 2) / rangeX;
  const scaleY = (h - padding * 2) / rangeY;

  function toCanvasX(x) { return padding + (x - vb.minX) * scaleX; }
  function toCanvasY(y) { return padding + (y - vb.minY) * scaleY; }

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < props.segments.length; i += 4) {
    ctx.moveTo(toCanvasX(props.segments[i]), toCanvasY(props.segments[i + 1]));
    ctx.lineTo(toCanvasX(props.segments[i + 2]), toCanvasY(props.segments[i + 3]));
  }
  ctx.stroke();
}

onMounted(draw);
watch(() => [props.segments, props.viewBox, props.canvasWidth, props.canvasHeight], draw, { deep: false });
</script>

<template>
  <div class="overflow-auto max-w-full">
    <canvas ref="canvas" class="block" />
  </div>
</template>
