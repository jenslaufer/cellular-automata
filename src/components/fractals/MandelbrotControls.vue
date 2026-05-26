<script setup>
import { computed, ref, watch } from "vue";
import { useMandelbrot } from "../../composables/fractals/useMandelbrot.js";
import FractalCanvas from "../FractalCanvas.vue";

const { params, compute, presets } = useMandelbrot();
const buffer = ref(compute());

function regenerate() {
  buffer.value = compute();
}

watch(
  () => [params.centerX, params.centerY, params.zoom, params.maxIter, params.width, params.height],
  regenerate,
);

function applyPreset(p) {
  params.centerX = p.centerX;
  params.centerY = p.centerY;
  params.zoom = p.zoom;
  params.maxIter = p.maxIter;
}

const activePreset = computed(() =>
  presets.find(
    (p) =>
      p.centerX === params.centerX &&
      p.centerY === params.centerY &&
      p.zoom === params.zoom &&
      p.maxIter === params.maxIter,
  )?.name,
);
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="p in presets"
        :key="p.name"
        @click="applyPreset(p)"
        class="text-xs px-3 py-1 rounded border transition"
        :class="
          activePreset === p.name
            ? 'bg-white text-black border-white'
            : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'
        "
      >
        {{ p.name }}
      </button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
      <div>
        <label class="block text-neutral-400 mb-1">Center X</label>
        <input
          v-model.number="params.centerX"
          type="number"
          step="0.0001"
          class="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
        />
      </div>
      <div>
        <label class="block text-neutral-400 mb-1">Center Y</label>
        <input
          v-model.number="params.centerY"
          type="number"
          step="0.0001"
          class="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
        />
      </div>
      <div>
        <label class="block text-neutral-400 mb-1">Zoom (half-height)</label>
        <input
          v-model.number="params.zoom"
          type="number"
          step="0.001"
          min="0.0001"
          class="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
        />
      </div>
      <div>
        <label class="block text-neutral-400 mb-1">Max iterations</label>
        <input
          v-model.number="params.maxIter"
          type="number"
          min="10"
          max="2000"
          class="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
        />
      </div>
      <div>
        <label class="block text-neutral-400 mb-1">Width</label>
        <input
          v-model.number="params.width"
          type="number"
          min="100"
          max="1600"
          class="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
        />
      </div>
      <div>
        <label class="block text-neutral-400 mb-1">Height</label>
        <input
          v-model.number="params.height"
          type="number"
          min="100"
          max="1200"
          class="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
        />
      </div>
    </div>

    <FractalCanvas mode="raster" :buffer="buffer" :width="params.width" :height="params.height" />
  </div>
</template>
