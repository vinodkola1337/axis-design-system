<template>
  <button :class="classes" :disabled="disabled" :type="type">
    <AxisIcon v-if="icon && iconPosition === 'start'" :icon="icon" :size="iconSize" />
    <span v-if="label">{{ label }}</span>
    <slot v-else />
    <AxisIcon v-if="icon && iconPosition === 'end'" :icon="icon" :size="iconSize" />
  </button>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'
import AxisIcon from '../icon/Icon.vue'

defineOptions({
  name: 'AxisButton',
})

const props = withDefaults(
  defineProps<{
    label?: string
    icon?: Component
    iconPosition?: 'start' | 'end'
    emphasis?: 'filled' | 'outlined' | 'text'
    severity?: 'primary' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    iconPosition: 'start',
    emphasis: 'filled',
    severity: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
  },
)

const slots = defineSlots<{
  /** Custom button content rendered when the label prop is not provided. */
  default(): unknown
}>()

const hasVisibleLabel = computed(() => Boolean(props.label || slots.default))
const isIconOnly = computed(() => Boolean(props.icon && !hasVisibleLabel.value))
const iconSize = computed(() => props.size)

const classes = computed(() => [
  'axis-button',
  `axis-button--${props.emphasis}`,
  `axis-button--${props.severity}`,
  `axis-button--${props.size}`,
  {
    'axis-button--icon-only': isIconOnly.value,
  },
])
</script>

<style scoped>
.axis-button {
  align-items: center;
  appearance: none;
  background: var(--axis-button-emphasis-filled-primary-color-bg);
  border-color: var(--axis-button-emphasis-filled-primary-color-border);
  border-radius: var(--axis-button-border-radius);
  border-style: solid;
  border-width: var(--axis-button-border-width);
  color: var(--axis-button-emphasis-filled-primary-color-text);
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
  background: var(--axis-button-emphasis-filled-primary-color-bg-hover);
}

.axis-button:active:not(:disabled) {
  background: var(--axis-button-emphasis-filled-primary-color-bg-active);
}

.axis-button:focus-visible {
  outline: var(--axis-button-focus-ring-width) solid var(--axis-button-focus-ring-color);
  outline-offset: var(--axis-spacing-1);
}

.axis-button:disabled {
  cursor: not-allowed;
  opacity: var(--axis-button-disabled-opacity);
}

.axis-button--danger {
  background: var(--axis-button-emphasis-filled-danger-color-bg);
  border-color: var(--axis-button-emphasis-filled-danger-color-border);
  color: var(--axis-button-emphasis-filled-danger-color-text);
}

.axis-button--danger:hover:not(:disabled) {
  background: var(--axis-button-emphasis-filled-danger-color-bg-hover);
}

.axis-button--danger:active:not(:disabled) {
  background: var(--axis-button-emphasis-filled-danger-color-bg-active);
}

.axis-button--outlined {
  background: var(--axis-button-emphasis-outlined-primary-color-bg);
  border-color: var(--axis-button-emphasis-outlined-primary-color-border);
  color: var(--axis-button-emphasis-outlined-primary-color-text);
}

.axis-button--outlined:hover:not(:disabled) {
  background: var(--axis-button-emphasis-outlined-primary-color-bg-hover);
}

.axis-button--outlined:active:not(:disabled) {
  background: var(--axis-button-emphasis-outlined-primary-color-bg-active);
}

.axis-button--text {
  background: var(--axis-button-emphasis-text-primary-color-bg);
  border-color: var(--axis-button-emphasis-text-primary-color-border);
  color: var(--axis-button-emphasis-text-primary-color-text);
}

.axis-button--text:hover:not(:disabled) {
  background: var(--axis-button-emphasis-text-primary-color-bg-hover);
}

.axis-button--text:active:not(:disabled) {
  background: var(--axis-button-emphasis-text-primary-color-bg-active);
}

.axis-button--outlined.axis-button--danger {
  background: var(--axis-button-emphasis-outlined-danger-color-bg);
  border-color: var(--axis-button-emphasis-outlined-danger-color-border);
  color: var(--axis-button-emphasis-outlined-danger-color-text);
}

.axis-button--outlined.axis-button--danger:hover:not(:disabled) {
  background: var(--axis-button-emphasis-outlined-danger-color-bg-hover);
}

.axis-button--outlined.axis-button--danger:active:not(:disabled) {
  background: var(--axis-button-emphasis-outlined-danger-color-bg-active);
}

.axis-button--text.axis-button--danger {
  background: var(--axis-button-emphasis-text-danger-color-bg);
  border-color: var(--axis-button-emphasis-text-danger-color-border);
  color: var(--axis-button-emphasis-text-danger-color-text);
}

.axis-button--text.axis-button--danger:hover:not(:disabled) {
  background: var(--axis-button-emphasis-text-danger-color-bg-hover);
}

.axis-button--text.axis-button--danger:active:not(:disabled) {
  background: var(--axis-button-emphasis-text-danger-color-bg-active);
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

.axis-button--icon-only {
  min-width: 0;
  padding-inline: 0;
  width: var(--axis-button-size-md-height);
}

.axis-button--icon-only.axis-button--sm {
  width: var(--axis-button-size-sm-height);
}

.axis-button--icon-only.axis-button--lg {
  width: var(--axis-button-size-lg-height);
}
</style>
