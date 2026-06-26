<template>
  <div
    v-bind="$attrs"
    class="axis-number-input"
    :class="{
      [`axis-number-input--${size}`]: true,
      'axis-number-input--fluid': fluid,
      'axis-number-input--float-label': usesFloatLabel,
      'axis-number-input--invalid': isInvalid,
      'axis-number-input--disabled': disabled,
    }"
  >
    <div class="axis-number-input__field">
      <AxisLabel
        v-if="hasLabel"
        class="axis-number-input__label"
        :for="inputId"
        :required="required"
        :disabled="disabled"
      >
        <slot name="label">{{ label }}</slot>
      </AxisLabel>

      <input
        v-bind="inputAttrs"
        :id="inputId"
        ref="inputRef"
        v-model="displayValue"
        class="axis-number-input__control"
        :name="name"
        type="text"
        inputmode="decimal"
        role="spinbutton"
        :placeholder="computedPlaceholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :aria-invalid="isInvalid || undefined"
        :aria-describedby="describedBy"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="ariaValueNow"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
    </div>

    <p v-if="hasErrorMessage" :id="errorId" class="axis-number-input__error">
      <slot name="error">{{ error }}</slot>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch, watchEffect } from 'vue'
import AxisLabel from '../label/Label.vue'

defineOptions({
  name: 'AxisNumberInput',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    id?: string
    name?: string
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
    locale?: string
    min?: number
    max?: number
    step?: number
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    useGrouping?: boolean
  }>(),
  {
    size: 'md',
    fluid: true,
    floatLabel: false,
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    step: 1,
    useGrouping: true,
  },
)

const model = defineModel<number | null>()
const emit = defineEmits<{
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()
const slots = defineSlots<{
  /** Replaces the label text while preserving the input-label relationship. */
  label?: () => unknown
  /** Replaces the error message content associated with the input. */
  error?: () => unknown
}>()
const instance = getCurrentInstance()
const inputRef = ref<HTMLInputElement>()
const displayValue = ref('')
const isFocused = ref(false)

const activeLocale = computed(() => props.locale || undefined)
const formatOptions = computed<Intl.NumberFormatOptions>(() => ({
  maximumFractionDigits: props.maximumFractionDigits,
  minimumFractionDigits: props.minimumFractionDigits,
  useGrouping: props.useGrouping,
}))
const formatter = computed(() => new Intl.NumberFormat(activeLocale.value, formatOptions.value))
const editingFormatter = computed(
  () =>
    new Intl.NumberFormat(activeLocale.value, {
      maximumFractionDigits: props.maximumFractionDigits,
      minimumFractionDigits: 0,
      useGrouping: false,
    }),
)
const localeParts = computed(() => {
  const parts = new Intl.NumberFormat(activeLocale.value).formatToParts(-12345.6)
  const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.'
  const group = parts.find((part) => part.type === 'group')?.value ?? ','
  const minusSign = parts.find((part) => part.type === 'minusSign')?.value ?? '-'
  const digits = new Map<string, string>()
  const digitFormatter = new Intl.NumberFormat(activeLocale.value, {
    useGrouping: false,
  })

  for (let digit = 0; digit <= 9; digit += 1) {
    digits.set(digitFormatter.format(digit), String(digit))
  }

  return { decimal, group, minusSign, digits }
})

const inputId = computed(() => props.id ?? `axis-number-input-${instance?.uid}`)
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
const isBelowMin = computed(() => typeof props.min === 'number' && typeof model.value === 'number' && model.value < props.min)
const isAboveMax = computed(() => typeof props.max === 'number' && typeof model.value === 'number' && model.value > props.max)
const ariaValueNow = computed(() => (isBelowMin.value || isAboveMax.value ? undefined : (model.value ?? undefined)))
const validityMessage = computed(() => {
  const parsed = parseValue(displayValue.value)

  if (displayValue.value.trim() && parsed === undefined) {
    return 'Enter a number.'
  }

  if (typeof model.value === 'number') {
    if (typeof props.min === 'number' && model.value < props.min) {
      return `Value must be greater than or equal to ${formatValue(props.min)}.`
    }

    if (typeof props.max === 'number' && model.value > props.max) {
      return `Value must be less than or equal to ${formatValue(props.max)}.`
    }
  }

  return ''
})

const formatValue = (value: number | null | undefined, editing = false) =>
  typeof value === 'number' && Number.isFinite(value)
    ? (editing ? editingFormatter.value : formatter.value).format(value)
    : ''

const clampValue = (value: number) => {
  const withMin = typeof props.min === 'number' ? Math.max(value, props.min) : value
  return typeof props.max === 'number' ? Math.min(withMin, props.max) : withMin
}

const parseValue = (value: string) => {
  const { decimal, digits, group, minusSign } = localeParts.value
  let normalized = value.trim()

  digits.forEach((latinDigit, localeDigit) => {
    normalized = normalized.split(localeDigit).join(latinDigit)
  })

  normalized = normalized
    .split(group)
    .join('')
    .split(decimal)
    .join('.')
    .split(minusSign)
    .join('-')
    .replace(/\s/g, '')

  if (!normalized) {
    return null
  }

  if (normalized === '-' || normalized === '.' || normalized === '-.') {
    return undefined
  }

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : undefined
}

const commitDisplayValue = () => {
  displayValue.value = formatValue(model.value ?? null)
}

const emitValue = (value: number | null, shouldClamp = false) => {
  model.value = shouldClamp && typeof value === 'number' ? clampValue(value) : value
}

const handleInput = () => {
  const parsed = parseValue(displayValue.value)

  if (parsed !== undefined) {
    emitValue(parsed)
  }
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  displayValue.value = formatValue(model.value ?? null, true)
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  const parsed = parseValue(displayValue.value)

  if (parsed !== undefined) {
    emitValue(parsed)
  }

  commitDisplayValue()
  emit('blur', event)
}

const adjustValue = (delta: number) => {
  const base = typeof model.value === 'number' ? model.value : 0
  emitValue(base + delta, true)
  displayValue.value = formatValue(model.value ?? null, true)
  inputRef.value?.setSelectionRange(displayValue.value.length, displayValue.value.length)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled || props.readonly) {
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    adjustValue(props.step)
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    adjustValue(-props.step)
  } else if (event.key === 'PageUp') {
    event.preventDefault()
    adjustValue(props.step * 10)
  } else if (event.key === 'PageDown') {
    event.preventDefault()
    adjustValue(props.step * -10)
  } else if (event.key === 'Home' && typeof props.min === 'number') {
    event.preventDefault()
    emitValue(props.min)
    displayValue.value = formatValue(model.value ?? null, true)
  } else if (event.key === 'End' && typeof props.max === 'number') {
    event.preventDefault()
    emitValue(props.max)
    displayValue.value = formatValue(model.value ?? null, true)
  }
}

watch(
  () => [
    model.value,
    activeLocale.value,
    props.maximumFractionDigits,
    props.minimumFractionDigits,
    props.useGrouping,
  ],
  () => {
    if (!isFocused.value) {
      commitDisplayValue()
    }
  },
  { immediate: true },
)

watchEffect(() => {
  inputRef.value?.setCustomValidity(validityMessage.value)
})
</script>

<style scoped>
.axis-number-input {
  display: inline-flex;
  flex-direction: column;
  gap: var(--axis-number-input-gap);
  max-width: var(--axis-number-input-width-max);
  min-width: var(--axis-number-input-width-min);
  width: var(--axis-number-input-width-default);
}

.axis-number-input--fluid {
  max-width: none;
  width: 100%;
}

.axis-number-input__field {
  display: flex;
  flex-direction: column;
  gap: var(--axis-number-input-gap);
  min-width: 0;
  position: relative;
}

.axis-number-input__control {
  appearance: none;
  background: var(--axis-number-input-color-bg);
  border-color: var(--axis-number-input-border-color);
  border-radius: var(--axis-number-input-border-radius);
  border-style: solid;
  border-width: var(--axis-number-input-border-width);
  color: var(--axis-number-input-color-text);
  font-family: var(--axis-font-family-sans);
  font-size: var(--axis-number-input-size-md-font-size);
  height: var(--axis-number-input-size-md-height);
  line-height: 1.5;
  min-width: 0;
  padding-inline: var(--axis-number-input-size-md-padding-x);
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    color 120ms ease;
  width: auto;
}

.axis-number-input--fluid .axis-number-input__field,
.axis-number-input--fluid .axis-number-input__control {
  width: 100%;
}

.axis-number-input--sm .axis-number-input__control {
  font-size: var(--axis-number-input-size-sm-font-size);
  height: var(--axis-number-input-size-sm-height);
  padding-inline: var(--axis-number-input-size-sm-padding-x);
}

.axis-number-input--lg .axis-number-input__control {
  font-size: var(--axis-number-input-size-lg-font-size);
  height: var(--axis-number-input-size-lg-height);
  padding-inline: var(--axis-number-input-size-lg-padding-x);
}

.axis-number-input__control::placeholder {
  color: var(--axis-number-input-color-placeholder);
}

.axis-number-input__control:hover:not(:disabled):not(:read-only) {
  border-color: var(--axis-number-input-border-color-hover);
}

.axis-number-input__control:read-only:not(:disabled) {
  background: var(--axis-number-input-color-bg-readonly);
}

.axis-number-input__control:focus {
  outline: none;
}

.axis-number-input__control:focus-visible {
  border-color: var(--axis-number-input-border-color-focus);
  box-shadow: 0 0 0 var(--axis-number-input-focus-ring-width) var(--axis-number-input-border-color-focus);
}

.axis-number-input__control:disabled {
  background: var(--axis-number-input-color-bg-disabled);
  color: var(--axis-number-input-color-disabled);
  cursor: not-allowed;
}

.axis-number-input__control:disabled::placeholder {
  color: var(--axis-number-input-color-disabled);
}

.axis-number-input--invalid .axis-number-input__control {
  border-color: var(--axis-number-input-border-color-error);
}

.axis-number-input--invalid .axis-number-input__control:focus-visible {
  border-color: var(--axis-number-input-border-color-error);
  box-shadow: 0 0 0 var(--axis-number-input-focus-ring-width) var(--axis-number-input-border-color-error);
}

.axis-number-input--float-label .axis-number-input__control {
  padding-block-start: var(--axis-number-input-float-label-offset-y);
}

.axis-number-input--float-label .axis-number-input__control::placeholder {
  color: transparent;
}

.axis-number-input--float-label .axis-number-input__label {
  background: var(--axis-number-input-color-bg);
  inset-block-start: 50%;
  inset-inline-start: var(--axis-number-input-size-md-padding-x);
  max-width: calc(100% - (var(--axis-number-input-size-md-padding-x) * 2));
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

.axis-number-input--float-label
  .axis-number-input__field:has(.axis-number-input__control:read-only)
  .axis-number-input__label {
  background: var(--axis-number-input-color-bg-readonly);
}

.axis-number-input--float-label.axis-number-input--sm .axis-number-input__label {
  inset-inline-start: var(--axis-number-input-size-sm-padding-x);
  max-width: calc(100% - (var(--axis-number-input-size-sm-padding-x) * 2));
}

.axis-number-input--float-label.axis-number-input--lg .axis-number-input__label {
  inset-inline-start: var(--axis-number-input-size-lg-padding-x);
  max-width: calc(100% - (var(--axis-number-input-size-lg-padding-x) * 2));
}

.axis-number-input--float-label .axis-number-input__field:has(.axis-number-input__control:focus) .axis-number-input__label,
.axis-number-input--float-label
  .axis-number-input__field:has(.axis-number-input__control:not(:placeholder-shown))
  .axis-number-input__label {
  color: var(--axis-number-input-border-color-focus);
  font-size: var(--axis-number-input-error-font-size);
  inset-block-start: 0;
  transform: translateY(-50%);
}

.axis-number-input--float-label.axis-number-input--invalid
  .axis-number-input__field:has(.axis-number-input__control:focus)
  .axis-number-input__label,
.axis-number-input--float-label.axis-number-input--invalid
  .axis-number-input__field:has(.axis-number-input__control:not(:placeholder-shown))
  .axis-number-input__label {
  color: var(--axis-number-input-color-error);
}

.axis-number-input__error {
  color: var(--axis-number-input-color-error);
  font-family: var(--axis-font-family-sans);
  font-size: var(--axis-number-input-error-font-size);
  line-height: 1.25;
  margin: 0;
}
</style>
