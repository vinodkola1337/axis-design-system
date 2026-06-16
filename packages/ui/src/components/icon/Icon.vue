<template>
  <span :class="classes">
    <component :is="icon" aria-hidden="true" focusable="false" />
  </span>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'

defineOptions({
  name: 'AxisIcon',
})

const props = withDefaults(
  defineProps<{
    icon: Component
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    stroke?: 'regular' | 'strong'
    color?:
      | 'inherit'
      | 'text'
      | 'text-secondary'
      | 'text-disabled'
      | 'text-inverse'
      | 'interactive'
      | 'link'
      | 'success'
      | 'warning'
      | 'error'
  }>(),
  {
    size: 'md',
    stroke: 'regular',
    color: 'inherit',
  },
)

const classes = computed(() => [
  'axis-icon',
  `axis-icon--${props.size}`,
  `axis-icon--stroke-${props.stroke}`,
  props.color !== 'inherit' ? `axis-icon--color-${props.color}` : undefined,
])
</script>

<style scoped>
.axis-icon {
  align-items: center;
  color: currentColor;
  display: inline-flex;
  flex: 0 0 auto;
  height: var(--axis-icon-size-md);
  justify-content: center;
  line-height: 0;
  width: var(--axis-icon-size-md);
}

.axis-icon :deep(svg) {
  display: block;
  height: 100%;
  stroke-width: var(--axis-icon-stroke-width-regular);
  width: 100%;
}

.axis-icon--xs {
  height: var(--axis-icon-size-xs);
  width: var(--axis-icon-size-xs);
}

.axis-icon--sm {
  height: var(--axis-icon-size-sm);
  width: var(--axis-icon-size-sm);
}

.axis-icon--lg {
  height: var(--axis-icon-size-lg);
  width: var(--axis-icon-size-lg);
}

.axis-icon--xl {
  height: var(--axis-icon-size-xl);
  width: var(--axis-icon-size-xl);
}

.axis-icon--stroke-strong :deep(svg) {
  stroke-width: var(--axis-icon-stroke-width-strong);
}

.axis-icon--color-text {
  color: var(--axis-color-text-primary);
}

.axis-icon--color-text-secondary {
  color: var(--axis-color-text-secondary);
}

.axis-icon--color-text-disabled {
  color: var(--axis-color-text-disabled);
}

.axis-icon--color-text-inverse {
  color: var(--axis-color-text-inverse);
}

.axis-icon--color-interactive {
  color: var(--axis-color-interactive-primary);
}

.axis-icon--color-link {
  color: var(--axis-color-text-link);
}

.axis-icon--color-success {
  color: var(--axis-color-feedback-success);
}

.axis-icon--color-warning {
  color: var(--axis-color-feedback-warning);
}

.axis-icon--color-error {
  color: var(--axis-color-feedback-error);
}
</style>
