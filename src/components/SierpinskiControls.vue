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
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-neutral-400 mb-1">Point count</label>
        <input
          type="number"
          step="1000"
          min="100"
          max="200000"
          :value="params.pointCount"
          @input="update('pointCount', Number($event.target.value))"
          class="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
        />
      </div>
      <div>
        <label class="block text-neutral-400 mb-1">Seed</label>
        <input
          type="number"
          step="1"
          min="0"
          :value="params.seed"
          @input="update('seed', Number($event.target.value))"
          class="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
        />
      </div>
    </div>
    <div>
      <label class="block text-neutral-400 mb-1">Preset</label>
      <select
        @change="applyPreset(presets[$event.target.selectedIndex - 1])"
        class="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
      >
        <option value="">— choose preset —</option>
        <option v-for="p in presets" :key="p.label" :value="p.label">{{ p.label }}</option>
      </select>
    </div>
  </div>
</template>
