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
  }>(),
  {
    size: 'md',
    stroke: 'regular',
  },
)

const classes = computed(() => [
  'axis-icon',
  `axis-icon--${props.size}`,
  `axis-icon--stroke-${props.stroke}`,
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
</style>
