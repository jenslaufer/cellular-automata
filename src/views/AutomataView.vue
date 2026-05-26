<script setup>
import { computed, ref, watch } from "vue";
import { useAutomaton } from "../composables/useAutomaton.js";
import { WOLFRAM_CLASSES } from "../composables/useWolframClasses.js";
import AutomatonCanvas from "../components/AutomatonCanvas.vue";
import ClassFilter from "../components/ClassFilter.vue";
import RulePreview from "../components/RulePreview.vue";

const { rule, width, generations, initialMode, compute } = useAutomaton(30, 201, 200);
const cellSize = ref(4);

const grid = ref(compute());

function regenerate() {
  grid.value = compute();
}

watch([rule, width, generations, initialMode], regenerate);

const presets = [
  { id: 30, label: "Rule 30 — Chaos" },
  { id: 90, label: "Rule 90 — Sierpinski" },
  { id: 110, label: "Rule 110 — Turing-complete" },
  { id: 184, label: "Rule 184 — Traffic" },
  { id: 54, label: "Rule 54 — Class IV" },
  { id: 150, label: "Rule 150 — XOR" },
];

const ruleInput = computed({
  get: () => rule.value,
  set: (v) => {
    const n = Number(v);
    if (Number.isFinite(n)) rule.value = Math.max(0, Math.min(255, Math.floor(n)));
  },
});

const selectedClassId = ref(null);
</script>

<template>
  <div class="space-y-8">
    <section class="grid md:grid-cols-[1fr_auto] gap-8 items-start">
      <div class="space-y-6">
        <div class="flex flex-wrap items-center gap-3">
          <label class="text-sm text-neutral-300">Rule</label>
          <input
            v-model="ruleInput"
            type="number"
            min="0"
            max="255"
            class="w-20 bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white"
          />
          <input
            v-model.number="rule"
            type="range"
            min="0"
            max="255"
            class="flex-1 min-w-[200px]"
          />
        </div>

        <ClassFilter :rule="rule" @select="selectedClassId = $event" />

        <div class="flex flex-wrap gap-2">
          <button
            v-for="p in presets"
            :key="p.id"
            @click="rule = p.id"
            class="text-xs px-3 py-1 rounded border transition"
            :class="[
              rule === p.id
                ? 'bg-white text-black border-white'
                : 'border-neutral-700 text-neutral-300 hover:border-neutral-500',
              selectedClassId !== null && !WOLFRAM_CLASSES.find(c => c.id === selectedClassId)?.rules.includes(p.id)
                ? 'opacity-50'
                : '',
            ]"
          >
            {{ p.label }}
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <label class="block text-neutral-400 mb-1">Width</label>
            <input
              v-model.number="width"
              type="number"
              min="11"
              max="801"
              step="2"
              class="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
            />
          </div>
          <div>
            <label class="block text-neutral-400 mb-1">Generations</label>
            <input
              v-model.number="generations"
              type="number"
              min="10"
              max="800"
              class="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
            />
          </div>
          <div>
            <label class="block text-neutral-400 mb-1">Cell size</label>
            <input
              v-model.number="cellSize"
              type="number"
              min="1"
              max="20"
              class="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
            />
          </div>
          <div>
            <label class="block text-neutral-400 mb-1">Initial</label>
            <select
              v-model="initialMode"
              class="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
            >
              <option value="single">Single cell</option>
              <option value="random">Random</option>
              <option value="left">Left edge</option>
            </select>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <div class="text-xs text-neutral-400 uppercase tracking-wider">
          Rule {{ rule }} pattern
        </div>
        <RulePreview :rule="rule" />
      </div>
    </section>

    <section>
      <AutomatonCanvas :grid="grid" :cell-size="cellSize" />
    </section>

    <footer class="text-xs text-neutral-500">
      Each row is one time step. Each cell's next state depends on itself and its two
      neighbors via the chosen rule (Wolfram code 0–255). Edges wrap toroidally.
    </footer>
  </div>
</template>
