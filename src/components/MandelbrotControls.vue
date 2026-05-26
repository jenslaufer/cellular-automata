<script setup>
const props = defineProps({
  params: { type: Object, required: true },
  presets: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:params"]);

function update(key, value) {
  emit("update:params", { ...props.params, [key]: value });
}

function applyPreset(preset) {
  emit("update:params", { ...props.params, ...preset.params });
}
</script>

<template>
  <div class="space-y-4 text-sm">
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div>
        <label class="block text-neutral-400 mb-1">Center X</label>
        <input
          type="number"
          step="0.01"
          :value="params.centerX"
          @input="update('centerX', Number($event.target.value))"
          class="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
        />
      </div>
      <div>
        <label class="block text-neutral-400 mb-1">Center Y</label>
        <input
          type="number"
          step="0.01"
          :value="params.centerY"
          @input="update('centerY', Number($event.target.value))"
          class="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
        />
      </div>
      <div>
        <label class="block text-neutral-400 mb-1">Zoom</label>
        <input
          type="number"
          step="1"
          min="1"
          :value="params.zoom"
          @input="update('zoom', Number($event.target.value))"
          class="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
        />
      </div>
      <div>
        <label class="block text-neutral-400 mb-1">Max iterations</label>
        <input
          type="number"
          step="10"
          min="10"
          max="2000"
          :value="params.maxIterations"
          @input="update('maxIterations', Number($event.target.value))"
          class="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
        />
      </div>
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="p in presets"
        :key="p.label"
        @click="applyPreset(p)"
        class="text-xs px-3 py-1 rounded border border-neutral-700 text-neutral-300 hover:border-neutral-500 transition"
      >
        {{ p.label }}
      </button>
    </div>
  </div>
</template>
