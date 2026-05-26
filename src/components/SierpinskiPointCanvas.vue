<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  points: { type: Object, required: true }, // Float32Array of interleaved x,y in [0,1]
  canvasWidth: { type: Number, default: 700 },
  canvasHeight: { type: Number, default: 700 },
});

const canvas = ref(null);

function draw() {
  const el = canvas.value;
  if (!el || !props.points || props.points.length === 0) return;

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

  ctx.fillStyle = "#ffffff";
  const pts = props.points;
  for (let i = 0; i < pts.length; i += 2) {
    ctx.fillRect(pts[i] * w, pts[i + 1] * h, 1, 1);
  }
}

onMounted(draw);
watch(() => [props.points, props.canvasWidth, props.canvasHeight], draw, { deep: false });
</script>

<template>
  <div class="overflow-auto max-w-full">
    <canvas ref="canvas" class="block" />
  </div>
</template>
