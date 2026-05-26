<script setup>
import { ref, watch } from "vue";
import { useMandelbrot } from "../composables/useMandelbrot.js";
import { useSierpinskiChaos } from "../composables/useSierpinskiChaos.js";
import { useKochSnowflake } from "../composables/useKochSnowflake.js";
import FractalCanvas from "../components/FractalCanvas.vue";
import FractalLineCanvas from "../components/FractalLineCanvas.vue";
import SierpinskiPointCanvas from "../components/SierpinskiPointCanvas.vue";
import MandelbrotControls from "../components/MandelbrotControls.vue";
import SierpinskiControls from "../components/SierpinskiControls.vue";
import KochControls from "../components/KochControls.vue";

const activeFractal = ref("mandelbrot");

const fractalOptions = [
  { value: "mandelbrot", label: "Mandelbrot" },
  { value: "sierpinski", label: "Sierpinski" },
  { value: "koch", label: "Koch Snowflake" },
];

// Mandelbrot
const { params: mandelbrotParams, compute: mandelbrotCompute, presets: mandelbrotPresets } = useMandelbrot();
const mandelbrotResult = ref(null);

function runMandelbrot() {
  mandelbrotResult.value = mandelbrotCompute();
}

function onMandelbrotParams(newParams) {
  mandelbrotParams.value = newParams;
}

watch(activeFractal, (v) => { if (v === "mandelbrot") runMandelbrot(); }, { immediate: false });
runMandelbrot();

// Sierpinski
const { params: sierpinskiParams, compute: sierpinskiCompute, presets: sierpinskiPresets } = useSierpinskiChaos();
const sierpinskiResult = ref(null);

function runSierpinski() {
  sierpinskiResult.value = sierpinskiCompute();
}

function onSierpinskiParams(newParams) {
  sierpinskiParams.value = newParams;
}

watch(activeFractal, (v) => { if (v === "sierpinski") runSierpinski(); }, { immediate: false });

// Koch
const { params: kochParams, compute: kochCompute, presets: kochPresets } = useKochSnowflake();
const kochResult = ref(null);

function runKoch() {
  kochResult.value = kochCompute();
}

function onKochParams(newParams) {
  kochParams.value = newParams;
}

watch(activeFractal, (v) => { if (v === "koch") runKoch(); }, { immediate: false });
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <label class="text-sm text-neutral-300">Fractal</label>
      <select
        v-model="activeFractal"
        class="bg-neutral-900 border border-neutral-700 rounded px-3 py-1 text-sm"
      >
        <option v-for="f in fractalOptions" :key="f.value" :value="f.value">{{ f.label }}</option>
      </select>
    </div>

    <!-- Mandelbrot -->
    <template v-if="activeFractal === 'mandelbrot'">
      <MandelbrotControls
        :params="mandelbrotParams"
        :presets="mandelbrotPresets"
        @update:params="onMandelbrotParams"
      />
      <button
        @click="runMandelbrot"
        class="text-xs px-4 py-1.5 rounded border border-neutral-700 text-neutral-300 hover:border-neutral-500 transition"
      >
        Render
      </button>
      <FractalCanvas
        v-if="mandelbrotResult"
        :iterations="mandelbrotResult.iterations"
        :width="mandelbrotResult.width"
        :height="mandelbrotResult.height"
        :max-iterations="mandelbrotParams.maxIterations"
      />
    </template>

    <!-- Sierpinski -->
    <template v-if="activeFractal === 'sierpinski'">
      <SierpinskiControls
        :params="sierpinskiParams"
        :presets="sierpinskiPresets"
        @update:params="onSierpinskiParams"
      />
      <button
        @click="runSierpinski"
        class="text-xs px-4 py-1.5 rounded border border-neutral-700 text-neutral-300 hover:border-neutral-500 transition"
      >
        Render
      </button>
      <SierpinskiPointCanvas
        v-if="sierpinskiResult"
        :points="sierpinskiResult.points"
      />
    </template>

    <!-- Koch Snowflake -->
    <template v-if="activeFractal === 'koch'">
      <KochControls
        :params="kochParams"
        :presets="kochPresets"
        @update:params="onKochParams"
      />
      <button
        @click="runKoch"
        class="text-xs px-4 py-1.5 rounded border border-neutral-700 text-neutral-300 hover:border-neutral-500 transition"
      >
        Render
      </button>
      <FractalLineCanvas
        v-if="kochResult"
        :segments="kochResult.segments"
        :canvas-width="800"
        :canvas-height="700"
      />
    </template>

    <footer class="text-xs text-neutral-500">
      Fractals rendered on canvas. Mandelbrot uses escape-time colouring; Sierpinski uses the
      chaos game with a seeded LCG; Koch uses recursive segment subdivision.
    </footer>
  </div>
</template>
