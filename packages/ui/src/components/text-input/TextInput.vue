<template>
  <div
    v-bind="$attrs"
    class="axis-text-input"
    :class="{
      [`axis-text-input--${size}`]: true,
      'axis-text-input--fluid': fluid,
      'axis-text-input--float-label': usesFloatLabel,
      'axis-text-input--invalid': isInvalid,
      'axis-text-input--disabled': disabled,
    }"
  >
    <div class="axis-text-input__field">
      <AxisLabel
        v-if="hasLabel"
        class="axis-text-input__label"
        :for="inputId"
        :required="required"
        :disabled="disabled"
      >
        <slot name="label">{{ label }}</slot>
      </AxisLabel>

      <input
        v-bind="inputAttrs"
        :id="inputId"
        v-model="model"
        class="axis-text-input__control"
        :name="name"
        :type="type"
        :placeholder="computedPlaceholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :aria-invalid="isInvalid || undefined"
        :aria-describedby="describedBy"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />
    </div>

    <p v-if="hasErrorMessage" :id="errorId" class="axis-text-input__error">
      <slot name="error">{{ error }}</slot>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, useSlots } from 'vue'
import AxisLabel from '../label/Label.vue'

defineOptions({
  name: 'AxisTextInput',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    id?: string
    name?: string
    type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url'
    size?: 'sm' | 'md' | 'lg'
    label?: string
    placeholder?: string
    fluid?: boolean
    floatLabel?: boolean
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    invalid?: boolean
    error?: string
    autocomplete?: string
    describedBy?: string
    inputAttrs?: Record<string, unknown>
  }>(),
  {
    type: 'text',
    size: 'md',
    fluid: true,
    floatLabel: false,
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
  },
)

const model = defineModel<string>()
const emit = defineEmits<{
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()
const instance = getCurrentInstance()
const slots = useSlots()

const inputId = computed(() => props.id ?? `axis-text-input-${instance?.uid}`)
const errorId = computed(() => `${inputId.value}-error`)
const hasLabel = computed(() => Boolean(props.label || slots.label))
const usesFloatLabel = computed(() => props.floatLabel && hasLabel.value)
const computedPlaceholder = computed(() => (usesFloatLabel.value ? ' ' : props.placeholder))
const hasErrorMessage = computed(() => Boolean(props.error || slots.error))
const isInvalid = computed(() => props.invalid || hasErrorMessage.value)
const externalDescribedBy = computed(
  () => props.describedBy ?? (props.inputAttrs?.['aria-describedby'] as string | undefined),
)
const describedBy = computed(() =>
  [externalDescribedBy.value, hasErrorMessage.value ? errorId.value : undefined].filter(Boolean).join(' ') ||
  undefined,
)
</script>

<style scoped>
.axis-text-input {
  display: inline-flex;
  flex-direction: column;
  gap: var(--axis-text-input-gap);
  max-width: var(--axis-text-input-width-max);
  min-width: var(--axis-text-input-width-min);
  width: var(--axis-text-input-width-default);
}

.axis-text-input--fluid {
  max-width: none;
  width: 100%;
}

.axis-text-input__field {
  display: flex;
  flex-direction: column;
  gap: var(--axis-text-input-gap);
  min-width: 0;
  position: relative;
}

.axis-text-input__control {
  appearance: none;
  background: var(--axis-text-input-color-bg);
  border-color: var(--axis-text-input-border-color);
  border-radius: var(--axis-text-input-border-radius);
  border-style: solid;
  border-width: var(--axis-text-input-border-width);
  color: var(--axis-text-input-color-text);
  font-family: var(--axis-font-family-sans);
  font-size: var(--axis-text-input-size-md-font-size);
  height: var(--axis-text-input-size-md-height);
  line-height: 1.5;
  min-width: 0;
  padding-inline: var(--axis-text-input-size-md-padding-x);
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    color 120ms ease;
  width: auto;
}

.axis-text-input--fluid .axis-text-input__field,
.axis-text-input--fluid .axis-text-input__control {
  width: 100%;
}

.axis-text-input--sm .axis-text-input__control {
  font-size: var(--axis-text-input-size-sm-font-size);
  height: var(--axis-text-input-size-sm-height);
  padding-inline: var(--axis-text-input-size-sm-padding-x);
}

.axis-text-input--lg .axis-text-input__control {
  font-size: var(--axis-text-input-size-lg-font-size);
  height: var(--axis-text-input-size-lg-height);
  padding-inline: var(--axis-text-input-size-lg-padding-x);
}

.axis-text-input__control::placeholder {
  color: var(--axis-text-input-color-placeholder);
}

.axis-text-input__control:hover:not(:disabled):not(:read-only) {
  border-color: var(--axis-text-input-border-color-hover);
}

.axis-text-input__control:focus {
  outline: none;
}

.axis-text-input__control:focus-visible {
  border-color: var(--axis-text-input-border-color-focus);
  box-shadow: 0 0 0 var(--axis-text-input-focus-ring-width) var(--axis-text-input-border-color-focus);
}

.axis-text-input__control:disabled {
  background: var(--axis-text-input-color-bg-disabled);
  color: var(--axis-text-input-color-disabled);
  cursor: not-allowed;
}

.axis-text-input__control:disabled::placeholder {
  color: var(--axis-text-input-color-disabled);
}

.axis-text-input--invalid .axis-text-input__control {
  border-color: var(--axis-text-input-border-color-error);
}

.axis-text-input--invalid .axis-text-input__control:focus-visible {
  border-color: var(--axis-text-input-border-color-error);
  box-shadow: 0 0 0 var(--axis-text-input-focus-ring-width) var(--axis-text-input-border-color-error);
}

.axis-text-input--float-label .axis-text-input__control {
  padding-block-start: var(--axis-text-input-float-label-offset-y);
}

.axis-text-input--float-label .axis-text-input__control::placeholder {
  color: transparent;
}

.axis-text-input--float-label .axis-text-input__label {
  background: var(--axis-text-input-color-bg);
  inset-block-start: 50%;
  inset-inline-start: var(--axis-text-input-size-md-padding-x);
  max-width: calc(100% - (var(--axis-text-input-size-md-padding-x) * 2));
  overflow: hidden;
  padding-inline: 2px;
  pointer-events: none;
  position: absolute;
  text-overflow: ellipsis;
  transform: translateY(-50%);
  transition:
    color 120ms ease,
    font-size 120ms ease,
    inset-block-start 120ms ease,
    transform 120ms ease;
  white-space: nowrap;
}

.axis-text-input--float-label.axis-text-input--sm .axis-text-input__label {
  inset-inline-start: var(--axis-text-input-size-sm-padding-x);
  max-width: calc(100% - (var(--axis-text-input-size-sm-padding-x) * 2));
}

.axis-text-input--float-label.axis-text-input--lg .axis-text-input__label {
  inset-inline-start: var(--axis-text-input-size-lg-padding-x);
  max-width: calc(100% - (var(--axis-text-input-size-lg-padding-x) * 2));
}

.axis-text-input--float-label .axis-text-input__field:has(.axis-text-input__control:focus) .axis-text-input__label,
.axis-text-input--float-label
  .axis-text-input__field:has(.axis-text-input__control:not(:placeholder-shown))
  .axis-text-input__label {
  color: var(--axis-text-input-border-color-focus);
  font-size: var(--axis-text-input-error-font-size);
  inset-block-start: 0;
  transform: translateY(-50%);
}

.axis-text-input--float-label.axis-text-input--invalid
  .axis-text-input__field:has(.axis-text-input__control:focus)
  .axis-text-input__label,
.axis-text-input--float-label.axis-text-input--invalid
  .axis-text-input__field:has(.axis-text-input__control:not(:placeholder-shown))
  .axis-text-input__label {
  color: var(--axis-text-input-color-error);
}

.axis-text-input__error {
  color: var(--axis-text-input-color-error);
  font-family: var(--axis-font-family-sans);
  font-size: var(--axis-text-input-error-font-size);
  line-height: 1.25;
  margin: 0;
}
</style>
