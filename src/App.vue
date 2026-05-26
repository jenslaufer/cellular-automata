<script setup>
import { ref } from "vue";
import AutomataView from "./views/AutomataView.vue";
import FractalsView from "./views/FractalsView.vue";

const activeTab = ref("automata");

const tabs = [
  { id: "automata", label: "Cellular Automata" },
  { id: "fractals", label: "Fractals" },
];
</script>

<template>
  <div class="min-h-screen px-6 py-8 max-w-6xl mx-auto">
    <header class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight">Mathematical Visualisations</h1>
      <nav class="flex gap-1 mt-4 border-b border-neutral-800">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 text-sm transition border-b-2 -mb-px"
          :class="activeTab === tab.id
            ? 'border-white text-white'
            : 'border-transparent text-neutral-400 hover:text-neutral-200'"
        >
          {{ tab.label }}
        </button>
      </nav>
    </header>

    <AutomataView v-if="activeTab === 'automata'" />
    <FractalsView v-if="activeTab === 'fractals'" />
  </div>
</template>
