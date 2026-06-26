<template>
  <Teleport to="body">
    <Transition name="axis-dialog">
      <div
        v-if="modelValue"
        class="axis-dialog__portal"
        :aria-hidden="modelValue ? undefined : 'true'"
        @keydown.esc="handleEscape"
        @keydown.tab="handleTab"
      >
        <div class="axis-dialog__scrim" @click="handleScrimClick" />
        <section
          ref="dialogRef"
          :class="classes"
          :role="role"
          aria-modal="true"
          :aria-labelledby="labelledById"
          :aria-describedby="describedById"
          tabindex="-1"
        >
          <header v-if="hasHeader" class="axis-dialog__header">
            <div class="axis-dialog__heading">
              <h2 v-if="title || slots.title" :id="titleId" class="axis-dialog__title">
                <slot name="title">{{ title }}</slot>
              </h2>
              <p v-if="description || slots.description" :id="descriptionId" class="axis-dialog__description">
                <slot name="description">{{ description }}</slot>
              </p>
            </div>
            <button
              v-if="showCloseButton"
              class="axis-dialog__close"
              type="button"
              :aria-label="closeLabel"
              @click="requestClose('close-button')"
            >
              <AxisIcon :icon="X" size="sm" />
            </button>
          </header>

          <div class="axis-dialog__body">
            <slot />
          </div>

          <footer v-if="slots.footer" class="axis-dialog__footer">
            <slot name="footer" />
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from '@lucide/vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AxisIcon from '../icon/Icon.vue'

defineOptions({
  name: 'AxisDialog',
})

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    description?: string
    role?: 'dialog' | 'alertdialog'
    size?: 'sm' | 'md' | 'lg'
    padding?: 'sm' | 'md' | 'lg'
    closeOnEscape?: boolean
    closeOnScrim?: boolean
    showCloseButton?: boolean
    closeLabel?: string
    initialFocus?: string
  }>(),
  {
    role: 'dialog',
    size: 'md',
    padding: 'md',
    closeOnEscape: true,
    closeOnScrim: true,
    showCloseButton: true,
    closeLabel: 'Close dialog',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: [reason: 'escape' | 'scrim' | 'close-button' | 'programmatic']
  open: []
}>()

const slots = defineSlots<{
  /** Dialog title content. Prefer the title prop for standard text headings. */
  title?: () => unknown
  /** Supporting text rendered below the title. Prefer the description prop for standard text. */
  description?: () => unknown
  /** Main dialog content. */
  default?: () => unknown
  /** Footer actions, usually aligned to the end. */
  footer?: () => unknown
}>()

const dialogRef = ref<HTMLElement | null>(null)
const previousActiveElement = ref<HTMLElement | null>(null)
const previousBodyOverflow = ref('')
const pendingCloseReason = ref<'escape' | 'scrim' | 'close-button' | undefined>()
const titleId = `axis-dialog-title-${Math.random().toString(36).slice(2)}`
const descriptionId = `axis-dialog-description-${Math.random().toString(36).slice(2)}`

const hasHeader = computed(() =>
  Boolean(props.title || props.description || slots.title || slots.description || props.showCloseButton),
)

const classes = computed(() => [
  'axis-dialog',
  `axis-dialog--${props.size}`,
  `axis-dialog--padding-${props.padding}`,
])

const labelledById = computed(() => (props.title || slots.title ? titleId : undefined))
const describedById = computed(() => (props.description || slots.description ? descriptionId : undefined))

onMounted(async () => {
  if (props.modelValue) {
    openDialog()
    emit('open')
    await nextTick()
    focusInitialElement()
  }
})

watch(
  () => props.modelValue,
  async (isOpen, wasOpen) => {
    if (isOpen) {
      openDialog()
      emit('open')
      await nextTick()
      focusInitialElement()
      return
    }

    if (wasOpen) {
      restoreBodyOverflow()
      restoreFocus()
      emit('close', pendingCloseReason.value ?? 'programmatic')
      pendingCloseReason.value = undefined
    }
  },
)

onBeforeUnmount(() => {
  restoreBodyOverflow()
})

function requestClose(reason: 'escape' | 'scrim' | 'close-button') {
  pendingCloseReason.value = reason
  emit('update:modelValue', false)
}

function handleEscape() {
  if (props.closeOnEscape) {
    requestClose('escape')
  }
}

function handleScrimClick() {
  if (props.closeOnScrim) {
    requestClose('scrim')
  }
}

function handleTab(event: KeyboardEvent) {
  const focusableElements = getFocusableElements()

  if (focusableElements.length === 0) {
    event.preventDefault()
    dialogRef.value?.focus()
    return
  }

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

function focusInitialElement() {
  if (typeof document === 'undefined') {
    return
  }

  const preferredElement = props.initialFocus
    ? dialogRef.value?.querySelector<HTMLElement>(props.initialFocus)
    : null

  preferredElement?.focus()

  if (document.activeElement === preferredElement) {
    return
  }

  getFocusableElements()[0]?.focus()

  if (!dialogRef.value?.contains(document.activeElement)) {
    dialogRef.value?.focus()
  }
}

function getFocusableElements() {
  if (!dialogRef.value) {
    return []
  }

  return Array.from(
    dialogRef.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute('disabled') && element.offsetParent !== null)
}

function openDialog() {
  if (typeof document === 'undefined') {
    return
  }

  previousActiveElement.value = document.activeElement instanceof HTMLElement ? document.activeElement : null
  previousBodyOverflow.value = document.body.style.overflow
  document.body.style.overflow = 'hidden'
}

function restoreFocus() {
  if (typeof document === 'undefined') {
    return
  }

  previousActiveElement.value?.focus()
  previousActiveElement.value = null
}

function restoreBodyOverflow() {
  if (typeof document === 'undefined') {
    return
  }

  document.body.style.overflow = previousBodyOverflow.value
}
</script>

<style scoped>
.axis-dialog__portal {
  align-items: center;
  display: grid;
  inset: 0;
  justify-items: center;
  padding: var(--axis-dialog-viewport-padding);
  position: fixed;
  z-index: 1000;
}

.axis-dialog__scrim {
  background: var(--axis-dialog-scrim-color);
  inset: 0;
  position: fixed;
}

.axis-dialog {
  background: var(--axis-dialog-surface-color);
  border-color: var(--axis-dialog-border-color);
  border-radius: var(--axis-dialog-border-radius);
  border-style: solid;
  border-width: var(--axis-dialog-border-width);
  color: var(--axis-dialog-color-text);
  display: flex;
  flex-direction: column;
  font-family: var(--axis-font-family-sans);
  gap: var(--axis-dialog-gap);
  max-height: var(--axis-dialog-max-height);
  min-width: 0;
  overflow: hidden;
  position: relative;
  width: min(100%, var(--axis-dialog-width-md));
}

.axis-dialog:focus {
  outline: none;
}

.axis-dialog:focus-visible {
  outline: var(--axis-dialog-focus-ring-width) solid var(--axis-dialog-focus-ring-color);
  outline-offset: var(--axis-spacing-1);
}

.axis-dialog--sm {
  width: min(100%, var(--axis-dialog-width-sm));
}

.axis-dialog--lg {
  width: min(100%, var(--axis-dialog-width-lg));
}

.axis-dialog--padding-sm {
  padding: var(--axis-dialog-padding-sm);
}

.axis-dialog--padding-md {
  padding: var(--axis-dialog-padding-md);
}

.axis-dialog--padding-lg {
  padding: var(--axis-dialog-padding-lg);
}

.axis-dialog__header {
  align-items: start;
  display: flex;
  gap: var(--axis-dialog-gap);
  justify-content: space-between;
}

.axis-dialog__heading {
  display: grid;
  gap: var(--axis-dialog-header-gap);
  min-width: 0;
}

.axis-dialog__title,
.axis-dialog__description,
.axis-dialog__body {
  margin: 0;
}

.axis-dialog__title {
  color: var(--axis-dialog-color-text);
  font-size: var(--axis-dialog-title-font-size);
  font-weight: var(--axis-dialog-title-font-weight);
  line-height: var(--axis-dialog-title-line-height);
}

.axis-dialog__description,
.axis-dialog__body {
  color: var(--axis-dialog-color-text-secondary);
}

.axis-dialog__description {
  font-size: var(--axis-dialog-description-font-size);
  line-height: var(--axis-dialog-description-line-height);
}

.axis-dialog__body {
  font-size: var(--axis-dialog-body-font-size);
  line-height: var(--axis-dialog-body-line-height);
  overflow: auto;
}

.axis-dialog__footer {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--axis-dialog-footer-gap);
  justify-content: flex-end;
}

.axis-dialog__close {
  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: var(--axis-dialog-close-border-radius);
  color: var(--axis-dialog-close-color);
  cursor: pointer;
  display: inline-flex;
  flex: 0 0 auto;
  height: var(--axis-dialog-close-size);
  justify-content: center;
  padding: 0;
  width: var(--axis-dialog-close-size);
}

.axis-dialog__close:hover {
  background: var(--axis-dialog-close-bg-hover);
  color: var(--axis-dialog-close-color-hover);
}

.axis-dialog__close:focus {
  outline: none;
}

.axis-dialog__close:focus-visible {
  outline: var(--axis-dialog-focus-ring-width) solid var(--axis-dialog-focus-ring-color);
  outline-offset: var(--axis-spacing-1);
}

.axis-dialog-enter-active,
.axis-dialog-leave-active {
  transition: opacity 120ms ease;
}

.axis-dialog-enter-from,
.axis-dialog-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .axis-dialog__portal {
    align-items: end;
    padding: var(--axis-spacing-2);
  }

  .axis-dialog {
    border-radius: var(--axis-dialog-border-radius) var(--axis-dialog-border-radius) 0 0;
    max-height: calc(100dvh - var(--axis-spacing-2));
  }
}
</style>
