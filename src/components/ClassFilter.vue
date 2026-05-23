<script setup>
import { computed, ref, watch } from "vue";
import { WOLFRAM_CLASSES, classForRule } from "../composables/useWolframClasses.js";

const props = defineProps({
  rule: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["select"]);

const selectedClassId = ref(null);

const currentRuleClass = computed(() => classForRule(props.rule));

const selectedClass = computed(() =>
  WOLFRAM_CLASSES.find((c) => c.id === selectedClassId.value) ?? null
);

function toggleClass(classId) {
  selectedClassId.value = selectedClassId.value === classId ? null : classId;
  emit("select", selectedClassId.value);
}

watch(
  () => props.rule,
  () => {
    // Keep selection when rule changes; user must explicitly deselect
  }
);
</script>

<template>
  <div class="space-y-2">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="cls in WOLFRAM_CLASSES"
        :key="cls.id"
        :title="cls.name"
        @click="toggleClass(cls.id)"
        class="text-xs px-3 py-1 rounded border transition"
        :class="
          selectedClassId === cls.id
            ? 'bg-blue-600 text-white border-blue-600'
            : currentRuleClass === cls.id
            ? 'border-blue-400 text-blue-300 ring-1 ring-blue-400 hover:border-blue-300'
            : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'
        "
      >
        {{ cls.label }}
      </button>
    </div>
    <div style="min-height: 3rem">
      <div
        v-if="selectedClass"
        class="text-sm text-neutral-300 rounded border border-neutral-700 px-3 py-2"
      >
        <span class="font-medium text-white">{{ selectedClass.name }}:</span>
        {{ selectedClass.description }}
      </div>
    </div>
  </div>
</template>
