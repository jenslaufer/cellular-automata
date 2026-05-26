<script setup>
import { computed, ref } from "vue";
import MandelbrotControls from "../components/fractals/MandelbrotControls.vue";
import SierpinskiControls from "../components/fractals/SierpinskiControls.vue";
import KochControls from "../components/fractals/KochControls.vue";

const fractals = [
  { id: "mandelbrot", label: "Mandelbrot", component: MandelbrotControls },
  { id: "sierpinski", label: "Sierpinski (chaos game)", component: SierpinskiControls },
  { id: "koch", label: "Koch snowflake", component: KochControls },
];

const active = ref("mandelbrot");
const activeComponent = computed(() => fractals.find((f) => f.id === active.value)?.component);
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight">Fractals</h1>
      <p class="text-neutral-400 mt-1 text-sm">
        Classical fractals rendered deterministically on Canvas 2D.
      </p>
    </header>

    <div class="mb-6">
      <label class="block text-sm text-neutral-400 mb-2">Fractal</label>
      <select
        v-model="active"
        class="bg-neutral-900 border border-neutral-700 rounded px-3 py-1 text-sm"
      >
        <option v-for="f in fractals" :key="f.id" :value="f.id">{{ f.label }}</option>
      </select>
    </div>

    <component :is="activeComponent" />
  </div>
</template>
