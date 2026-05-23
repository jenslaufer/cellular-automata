<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  grid: { type: Array, required: true },
  cellSize: { type: Number, default: 4 },
});

const canvas = ref(null);

function draw() {
  const el = canvas.value;
  if (!el || !props.grid.length) return;

  const rows = props.grid.length;
  const cols = props.grid[0].length;
  const size = props.cellSize;

  const dpr = window.devicePixelRatio || 1;
  el.width = cols * size * dpr;
  el.height = rows * size * dpr;
  el.style.width = `${cols * size}px`;
  el.style.height = `${rows * size}px`;

  const ctx = el.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, cols * size, rows * size);
  ctx.fillStyle = "#ffffff";

  for (let y = 0; y < rows; y++) {
    const row = props.grid[y];
    for (let x = 0; x < cols; x++) {
      if (row[x]) ctx.fillRect(x * size, y * size, size, size);
    }
  }
}

onMounted(draw);
watch(() => [props.grid, props.cellSize], draw, { deep: false });
</script>

<template>
  <div class="overflow-auto max-w-full">
    <canvas ref="canvas" class="block" />
  </div>
</template>
