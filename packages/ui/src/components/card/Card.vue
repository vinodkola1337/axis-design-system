<template>
  <article
    v-bind="$attrs"
    :class="classes"
    :role="interactive ? 'button' : undefined"
    :tabindex="interactive && !disabled ? 0 : undefined"
    :aria-pressed="interactive && selected ? 'true' : undefined"
    :aria-disabled="interactive && disabled ? 'true' : undefined"
    @click="interactive ? handleClick($event) : undefined"
    @keydown.enter="interactive ? handleKeydown($event) : undefined"
    @keydown.space="interactive ? handleKeydown($event) : undefined"
  >
    <div v-if="hasMedia" class="axis-card__media">
      <slot name="media">
        <img v-if="mediaSrc" class="axis-card__image" :src="mediaSrc" :alt="mediaAlt" />
      </slot>
    </div>

    <div class="axis-card__content">
      <header v-if="hasHeader" class="axis-card__header">
        <slot name="header">
          <h3 v-if="title" class="axis-card__title">
            <slot name="title">{{ title }}</slot>
          </h3>
          <p v-if="subtitle" class="axis-card__subtitle">
            <slot name="subtitle">{{ subtitle }}</slot>
          </p>
        </slot>
      </header>

      <div v-if="slots.default" class="axis-card__body">
        <slot />
      </div>

      <footer v-if="slots.footer" class="axis-card__footer">
        <slot name="footer" />
      </footer>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'AxisCard',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    mediaSrc?: string
    mediaAlt?: string
    variant?: 'outlined' | 'raised'
    padding?: 'sm' | 'md' | 'lg'
    orientation?: 'vertical' | 'horizontal'
    interactive?: boolean
    selected?: boolean
    disabled?: boolean
  }>(),
  {
    mediaAlt: '',
    variant: 'outlined',
    padding: 'md',
    orientation: 'vertical',
    interactive: false,
    selected: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent]
}>()

const slots = defineSlots<{
  /** Replaces the media region. Use for images, illustrations, or status visuals. */
  media?: () => unknown
  /** Replaces the complete header region. */
  header?: () => unknown
  /** Replaces the title text while preserving the default heading element. */
  title?: () => unknown
  /** Replaces the subtitle text while preserving the default paragraph element. */
  subtitle?: () => unknown
  /** Main card content. */
  default?: () => unknown
  /** Footer content, commonly actions or compact metadata. */
  footer?: () => unknown
}>()

const hasMedia = computed(() => Boolean(props.mediaSrc || slots.media))
const hasHeader = computed(() => Boolean(props.title || props.subtitle || slots.header))

const classes = computed(() => [
  'axis-card',
  `axis-card--${props.variant}`,
  `axis-card--padding-${props.padding}`,
  `axis-card--${props.orientation}`,
  {
    'axis-card--interactive': props.interactive,
    'axis-card--selected': props.selected,
    'axis-card--disabled': props.disabled,
    'axis-card--with-media': hasMedia.value,
  },
])

function handleClick(event: MouseEvent | KeyboardEvent) {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  emit('click', event)
}

function handleKeydown(event: KeyboardEvent) {
  event.preventDefault()
  handleClick(event)
}
</script>

<style scoped>
.axis-card {
  appearance: none;
  background: var(--axis-card-color-bg);
  border-color: var(--axis-card-border-color);
  border-radius: var(--axis-card-border-radius);
  border-style: solid;
  border-width: var(--axis-card-border-width);
  color: var(--axis-card-color-text);
  display: flex;
  flex-direction: column;
  font-family: var(--axis-font-family-sans);
  min-width: 0;
  overflow: hidden;
  padding: 0;
  text-align: start;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    opacity 120ms ease;
  width: 100%;
}

.axis-card--raised {
  background: var(--axis-card-color-bg-raised);
}

.axis-card--horizontal {
  flex-direction: row;
}

.axis-card__media {
  aspect-ratio: var(--axis-card-media-aspect-ratio);
  background: var(--axis-card-media-bg);
  flex: 0 0 auto;
  overflow: hidden;
  width: 100%;
}

.axis-card--horizontal .axis-card__media {
  aspect-ratio: var(--axis-card-media-horizontal-aspect-ratio);
  width: min(40%, var(--axis-card-media-horizontal-size));
}

.axis-card__image {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.axis-card__content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--axis-card-gap);
  min-width: 0;
}

.axis-card--padding-sm .axis-card__content {
  padding: var(--axis-card-padding-sm);
}

.axis-card--padding-md .axis-card__content {
  padding: var(--axis-card-padding-md);
}

.axis-card--padding-lg .axis-card__content {
  padding: var(--axis-card-padding-lg);
}

.axis-card__header {
  display: grid;
  gap: var(--axis-card-header-gap);
  min-width: 0;
}

.axis-card__title,
.axis-card__subtitle,
.axis-card__body {
  margin: 0;
}

.axis-card__title {
  color: var(--axis-card-color-text);
  font-size: var(--axis-card-title-font-size);
  font-weight: var(--axis-card-title-font-weight);
  line-height: var(--axis-card-title-line-height);
}

.axis-card__subtitle,
.axis-card__body {
  color: var(--axis-card-color-text-secondary);
}

.axis-card__subtitle {
  font-size: var(--axis-card-subtitle-font-size);
  line-height: var(--axis-card-subtitle-line-height);
}

.axis-card__body {
  font-size: var(--axis-card-body-font-size);
  line-height: var(--axis-card-body-line-height);
}

.axis-card__footer {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--axis-card-footer-gap);
  justify-content: flex-end;
  margin-block-start: auto;
}

.axis-card--interactive {
  cursor: pointer;
}

.axis-card--interactive:hover:not(.axis-card--disabled) {
  background: var(--axis-card-color-bg-hover);
  border-color: var(--axis-card-border-color-hover);
}

.axis-card--interactive:focus {
  outline: none;
}

.axis-card--interactive:focus-visible {
  outline: var(--axis-card-focus-ring-width) solid var(--axis-card-focus-ring-color);
  outline-offset: var(--axis-card-focus-ring-offset);
}

.axis-card--selected {
  border-color: var(--axis-card-border-color-selected);
}

.axis-card--disabled {
  background: var(--axis-card-color-bg-disabled);
  color: var(--axis-card-color-disabled);
  cursor: not-allowed;
  opacity: var(--axis-card-disabled-opacity);
}

.axis-card--disabled .axis-card__title,
.axis-card--disabled .axis-card__subtitle,
.axis-card--disabled .axis-card__body {
  color: var(--axis-card-color-disabled);
}
</style>
