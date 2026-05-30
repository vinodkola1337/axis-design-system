<template>
  <button :class="classes" :disabled="disabled" :type="type">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'AxisButton',
})
 
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
  },
)

const classes = computed(() => [
  'axis-button',
  `axis-button--${props.variant}`,
  `axis-button--${props.size}`,
])
</script>

<style scoped>
.axis-button {
  align-items: center;
  appearance: none;
  background: var(--axis-button-primary-color-bg);
  border-color: var(--axis-button-primary-color-border);
  border-radius: var(--axis-button-border-radius);
  border-style: solid;
  border-width: var(--axis-button-border-width);
  color: var(--axis-button-primary-color-text);
  cursor: pointer;
  display: inline-flex;
  font-family: var(--axis-font-family-sans);
  font-size: var(--axis-button-size-md-font-size);
  font-weight: var(--axis-button-font-weight);
  gap: var(--axis-spacing-2);
  height: var(--axis-button-size-md-height);
  justify-content: center;
  line-height: 1;
  min-width: max-content;
  padding-inline: var(--axis-button-size-md-padding-x);
  text-decoration: none;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    color 120ms ease,
    opacity 120ms ease;
  user-select: none;
  white-space: nowrap;
}

.axis-button:hover:not(:disabled) {
  background: var(--axis-button-primary-color-bg-hover);
}

.axis-button:active:not(:disabled) {
  background: var(--axis-button-primary-color-bg-active);
}

.axis-button:focus-visible {
  outline: var(--axis-button-focus-ring-width) solid var(--axis-button-focus-ring-color);
  outline-offset: var(--axis-spacing-1);
}

.axis-button:disabled {
  cursor: not-allowed;
  opacity: var(--axis-button-disabled-opacity);
}

.axis-button--secondary {
  background: var(--axis-button-secondary-color-bg);
  border-color: var(--axis-button-secondary-color-border);
  color: var(--axis-button-secondary-color-text);
}

.axis-button--secondary:hover:not(:disabled) {
  background: var(--axis-button-secondary-color-bg-hover);
}

.axis-button--secondary:active:not(:disabled) {
  background: var(--axis-button-secondary-color-bg-active);
}

.axis-button--ghost {
  background: var(--axis-button-ghost-color-bg);
  border-color: var(--axis-button-ghost-color-border);
  color: var(--axis-button-ghost-color-text);
}

.axis-button--ghost:hover:not(:disabled) {
  background: var(--axis-button-ghost-color-bg-hover);
}

.axis-button--ghost:active:not(:disabled) {
  background: var(--axis-button-ghost-color-bg-active);
}

.axis-button--sm {
  font-size: var(--axis-button-size-sm-font-size);
  height: var(--axis-button-size-sm-height);
  padding-inline: var(--axis-button-size-sm-padding-x);
}

.axis-button--lg {
  font-size: var(--axis-button-size-lg-font-size);
  height: var(--axis-button-size-lg-height);
  padding-inline: var(--axis-button-size-lg-padding-x);
}
</style>
