<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  mode: { type: String, default: "raster" }, // "raster" or "points"
  buffer: { type: Uint8ClampedArray, default: null },
  points: { type: Float32Array, default: null },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
});

const canvas = ref(null);
const container = ref(null);

function draw() {
  const el = canvas.value;
  if (!el) return;

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

  if (props.mode === "raster" && props.buffer) {
    const tmp = document.createElement("canvas");
    tmp.width = props.width;
    tmp.height = props.height;
    const tctx = tmp.getContext("2d");
    const img = new ImageData(props.buffer, props.width, props.height);
    tctx.putImageData(img, 0, 0);
    ctx.drawImage(tmp, 0, 0);
  } else if (props.mode === "points" && props.points) {
    ctx.fillStyle = "#ffffff";
    const n = props.points.length / 2;
    for (let i = 0; i < n; i++) {
      const x = props.points[i * 2] * props.width;
      const y = props.points[i * 2 + 1] * props.height;
      ctx.fillRect(x, y, 1, 1);
    }
  }
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

watch(() => [props.buffer, props.points, props.width, props.height, props.mode], draw);
</script>

<template>
  <div ref="container" class="overflow-auto max-w-full">
    <canvas ref="canvas" class="block" />
  </div>
</template>
