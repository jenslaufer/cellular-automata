<script setup>
import { ref, watch } from "vue";
import { useKochSnowflake } from "../../composables/fractals/useKochSnowflake.js";
import FractalLineCanvas from "../FractalLineCanvas.vue";

const { params, compute, presets } = useKochSnowflake();
const segments = ref(compute());

function regenerate() {
  segments.value = compute();
}

watch(() => [params.depth, params.width, params.height], regenerate);
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="p in presets"
        :key="p.name"
        @click="params.depth = p.depth"
        class="text-xs px-3 py-1 rounded border transition"
        :class="
          params.depth === p.depth
            ? 'bg-white text-black border-white'
            : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'
        "
      >
        {{ p.name }}
      </button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
      <div>
        <label class="block text-neutral-400 mb-1">Depth</label>
        <input
          v-model.number="params.depth"
          type="number"
          min="0"
          max="7"
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

    <FractalLineCanvas :segments="segments" :width="params.width" :height="params.height" />
  </div>
</template>
