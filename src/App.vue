<script setup>
import { computed, ref } from "vue";
import AutomataView from "./views/AutomataView.vue";
import FractalsView from "./views/FractalsView.vue";
import FluidFlowView from "./views/FluidFlowView.vue";

const tabs = [
  { id: "automata", label: "Cellular Automata", component: AutomataView },
  { id: "fractals", label: "Fractals", component: FractalsView },
  { id: "fluid", label: "Fluid Flow", component: FluidFlowView },
];

const activeTab = ref("automata");
const activeComponent = computed(() => tabs.find((t) => t.id === activeTab.value)?.component);
</script>

<template>
  <div class="min-h-screen px-6 py-8 max-w-6xl mx-auto">
    <nav class="flex flex-wrap gap-2 mb-8">
      <button
        v-for="t in tabs"
        :key="t.id"
        @click="activeTab = t.id"
        class="text-xs px-3 py-1 rounded border transition"
        :class="
          activeTab === t.id
            ? 'bg-white text-black border-white'
            : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'
        "
      >
        {{ t.label }}
      </button>
    </nav>

    <component :is="activeComponent" />
  </div>
</template>
