<script setup>
const props = defineProps({
  params: { type: Object, required: true },
  presets: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:params"]);

function update(key, value) {
  emit("update:params", { ...props.params, [key]: value });
}
</script>

<template>
  <div class="space-y-4 text-sm">
    <div>
      <label class="block text-neutral-400 mb-1">Depth — {{ params.depth }}</label>
      <input
        type="range"
        min="1"
        max="6"
        step="1"
        :value="params.depth"
        @input="update('depth', Number($event.target.value))"
        class="w-full"
      />
      <div class="flex justify-between text-xs text-neutral-500 mt-1">
        <span>1</span>
        <span>6</span>
      </div>
    </div>
  </div>
</template>
