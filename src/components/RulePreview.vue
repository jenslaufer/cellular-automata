<script setup>
import { computed } from "vue";
import { ruleToBits } from "../composables/useAutomaton.js";

const props = defineProps({
  rule: { type: Number, required: true },
});

const patterns = computed(() => {
  const bits = ruleToBits(props.rule);
  // index 7..0 → triplets 111..000 (canonical Wolfram order: left to right = 7..0)
  const out = [];
  for (let i = 7; i >= 0; i--) {
    out.push({
      triplet: [(i >> 2) & 1, (i >> 1) & 1, i & 1],
      result: bits[i],
    });
  }
  return out;
});
</script>

<template>
  <div class="flex gap-3 flex-wrap">
    <div
      v-for="(p, idx) in patterns"
      :key="idx"
      class="flex flex-col items-center gap-1"
    >
      <div class="flex">
        <span
          v-for="(c, i) in p.triplet"
          :key="i"
          class="w-4 h-4 border border-neutral-700"
          :class="c ? 'bg-white' : 'bg-neutral-900'"
        />
      </div>
      <div
        class="w-4 h-4 border border-neutral-700"
        :class="p.result ? 'bg-white' : 'bg-neutral-900'"
      />
    </div>
  </div>
</template>
