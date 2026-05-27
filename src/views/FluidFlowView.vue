<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useLatticeBoltzmann, CS2 } from "../composables/fluid/useLatticeBoltzmann.js";
import FluidCanvas from "../components/FluidCanvas.vue";

const NX = 200;
const NY = 80;
const TAU = 0.6;

const lb = useLatticeBoltzmann({ nx: NX, ny: NY, tau: TAU });

const presets = [
  { id: "karman", label: "Kármán vortex street" },
  { id: "cavity", label: "Lid-driven cavity" },
  { id: "kelvin", label: "Kelvin–Helmholtz" },
];

const presetId = ref("karman");
const playing = ref(true);
const speed = ref(1);
const tick = ref(0);

lb.init(presetId.value);
tick.value++;

let rafId = null;

function loop() {
  if (!playing.value) {
    rafId = null;
    return;
  }
  const steps = speed.value | 0;
  for (let s = 0; s < steps; s++) lb.step();
  tick.value++;
  rafId = requestAnimationFrame(loop);
}

function start() {
  if (rafId === null && playing.value) rafId = requestAnimationFrame(loop);
}

function togglePlay() {
  playing.value = !playing.value;
  if (playing.value) start();
}

function reset() {
  lb.reset();
  tick.value++;
}

watch(presetId, (id) => {
  lb.init(id);
  tick.value++;
});

onMounted(start);
onBeforeUnmount(() => {
  if (rafId !== null) cancelAnimationFrame(rafId);
  rafId = null;
  playing.value = false;
});

const nu = CS2 * (TAU - 0.5);

const reynolds = computed(() => {
  if (presetId.value === "karman") return (0.1 * 16) / nu;
  if (presetId.value === "cavity") return (0.1 * (NX - 2)) / nu;
  return (0.1 * NY) / nu;
});

const reLabel = computed(() => Math.round(reynolds.value).toString());
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight">Fluid Flow</h1>
      <p class="text-neutral-400 mt-1 text-sm">
        2D Lattice-Boltzmann (D2Q9, BGK collision). Vorticity heatmap — red counter-clockwise,
        blue clockwise.
      </p>
    </header>

    <section class="space-y-6 mb-8">
      <div class="flex flex-wrap items-center gap-4">
        <label class="text-sm text-neutral-300">
          Preset
          <select
            v-model="presetId"
            class="ml-2 bg-neutral-900 border border-neutral-700 rounded px-3 py-1 text-sm"
          >
            <option v-for="p in presets" :key="p.id" :value="p.id">{{ p.label }}</option>
          </select>
        </label>

        <button
          @click="togglePlay"
          class="text-xs px-3 py-1 rounded border transition border-neutral-700 text-neutral-200 hover:border-neutral-500"
        >
          {{ playing ? "Pause" : "Play" }}
        </button>

        <button
          @click="reset"
          class="text-xs px-3 py-1 rounded border transition border-neutral-700 text-neutral-200 hover:border-neutral-500"
        >
          Reset
        </button>

        <label class="text-sm text-neutral-300 flex items-center gap-2">
          Speed
          <select
            v-model.number="speed"
            class="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm"
          >
            <option :value="1">1×</option>
            <option :value="2">2×</option>
            <option :value="4">4×</option>
          </select>
        </label>

        <div class="text-xs text-neutral-400 ml-auto flex gap-4">
          <span>Step <span class="text-neutral-200">{{ lb.stepCount }}</span></span>
          <span>Re ≈ <span class="text-neutral-200">{{ reLabel }}</span></span>
        </div>
      </div>
    </section>

    <section>
      <FluidCanvas :lb="lb" :tick="tick" />
    </section>

    <footer class="mt-6 text-xs text-neutral-500">
      D2Q9 velocities e₀..e₈, BGK relaxation τ = {{ TAU }}, ν = cs² (τ − ½) ≈ {{ nu.toFixed(4) }}.
      Vorticity clamped to ±0.05. Single-thread JS, no WebGL.
    </footer>
  </div>
</template>
