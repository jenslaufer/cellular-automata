<script setup>
import { ref, watch } from "vue";
import { useSierpinskiChaos } from "../../composables/fractals/useSierpinskiChaos.js";
import FractalCanvas from "../FractalCanvas.vue";

const { params, compute, presets } = useSierpinskiChaos();
const points = ref(compute());

function regenerate() {
  points.value = compute();
}

watch(
  () => [params.points, params.seed, params.variant, params.width, params.height],
  regenerate,
);
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="p in presets"
        :key="p.name"
        @click="params.variant = p.variant"
        class="text-xs px-3 py-1 rounded border transition"
        :class="
          params.variant === p.variant
            ? 'bg-white text-black border-white'
            : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'
        "
      >
        {{ p.name }}
      </button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
      <div>
        <label class="block text-neutral-400 mb-1">Points</label>
        <input
          v-model.number="params.points"
          type="number"
          min="100"
          max="500000"
          step="1000"
          class="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
        />
      </div>
      <div>
        <label class="block text-neutral-400 mb-1">Seed</label>
        <input
          v-model.number="params.seed"
          type="number"
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

    <FractalCanvas mode="points" :points="points" :width="params.width" :height="params.height" />
  </div>
</template>
