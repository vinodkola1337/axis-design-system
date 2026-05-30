<template>
  <label
    class="axis-label"
    :class="{ 'axis-label--disabled': disabled }"
    :for="props.for"
  >
    <slot />
    <span v-if="required" class="axis-label__required" aria-hidden="true">*</span>
  </label>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AxisLabel',
})

const props = withDefaults(
  defineProps<{
    for?: string
    required?: boolean
    disabled?: boolean
  }>(),
  {
    required: false,
    disabled: false,
  },
)
</script>

<style scoped>
.axis-label {
  align-items: center;
  color: var(--axis-label-color-text);
  display: inline-flex;
  font-family: var(--axis-font-family-sans);
  font-size: var(--axis-label-font-size);
  font-weight: var(--axis-label-font-weight);
  gap: var(--axis-label-gap);
  line-height: var(--axis-label-line-height);
}

.axis-label--disabled {
  color: var(--axis-label-color-disabled);
  cursor: not-allowed;
}

.axis-label__required {
  color: var(--axis-label-color-required);
}
</style>
