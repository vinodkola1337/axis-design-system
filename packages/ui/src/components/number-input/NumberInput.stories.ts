import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import { fn } from 'storybook/test'
import NumberInput from './NumberInput.vue'

type NumberInputStoryArgs = InstanceType<typeof NumberInput>['$props'] & {
  blur?: [event: FocusEvent]
  focus?: [event: FocusEvent]
  labelSlot?: unknown
  errorSlot?: unknown
  'update:modelValue'?: [value: number | null]
  onBlur: (event: FocusEvent) => void
  onFocus: (event: FocusEvent) => void
  'onUpdate:modelValue': (value: number | null) => void
}

const localeOptions = ['en-US', 'de-DE', 'fr-FR', 'hi-IN', 'ar-EG'] as const

const meta = {
  title: 'Components/NumberInput',
  component: NumberInput,
  args: {
    autocomplete: undefined,
    describedBy: undefined,
    disabled: false,
    error: '',
    floatLabel: false,
    fluid: true,
    id: undefined,
    inputAttrs: undefined,
    invalid: false,
    label: 'Amount',
    locale: 'en-US',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    max: 100000,
    min: 0,
    modelValue: 1234.5,
    name: 'amount',
    onBlur: fn(),
    onFocus: fn(),
    'onUpdate:modelValue': fn(),
    placeholder: '1,234.50',
    readonly: false,
    required: false,
    size: 'md',
    step: 1,
    useGrouping: true,
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'Sets the input id. When omitted, NumberInput generates a stable id for the label relationship.',
      table: {
        type: { summary: 'string' },
      },
    },
    name: {
      control: 'text',
      description: 'Sets the native input name submitted with a form.',
      table: {
        type: { summary: 'string' },
      },
    },
    modelValue: {
      control: 'number',
      description: 'Current numeric value used by v-model. Empty input emits null.',
      table: {
        type: { summary: 'number | null' },
      },
    },
    size: {
      control: 'select',
      description: 'Controls the input height, text size, and horizontal padding.',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    label: {
      control: 'text',
      description: 'Visible label text. Prefer a label for every numeric field.',
      table: {
        type: { summary: 'string' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Short example value shown when the field is empty.',
      table: {
        type: { summary: 'string' },
      },
    },
    fluid: {
      control: 'boolean',
      description: 'Expands the input to fill its container width.',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    floatLabel: {
      control: 'boolean',
      description: 'Moves the label into the field until the input is focused or has a value.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction and applies disabled styling.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    readonly: {
      control: 'boolean',
      description: 'Prevents editing while keeping the input focusable and selectable.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Sets the native required attribute and shows the Axis required mark on the label.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    invalid: {
      control: 'boolean',
      description: 'Marks the input as invalid and sets aria-invalid.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: 'text',
      description: 'Error message associated with the input. Providing an error also marks the input invalid.',
      table: {
        type: { summary: 'string' },
      },
    },
    autocomplete: {
      control: 'text',
      description: 'Sets the native autocomplete attribute.',
      table: {
        type: { summary: 'string' },
      },
    },
    describedBy: {
      control: 'text',
      description: 'Adds external description ids to aria-describedby. Error text is appended automatically.',
      table: {
        type: { summary: 'string' },
      },
    },
    inputAttrs: {
      control: 'object',
      description: 'Additional attributes applied to the inner input when they cannot fall through to the root.',
      table: {
        type: { summary: 'Record<string, unknown>' },
      },
    },
    locale: {
      control: 'select',
      description: 'Locale passed to Intl.NumberFormat for parsing and display. Use a BCP 47 language tag.',
      options: localeOptions,
      table: {
        type: { summary: 'string' },
      },
    },
    min: {
      control: 'number',
      description: 'Minimum numeric value. Keyboard decrements clamp to this value, and lower typed values set native custom validity.',
      table: {
        type: { summary: 'number' },
      },
    },
    max: {
      control: 'number',
      description: 'Maximum numeric value. Keyboard increments clamp to this value, and higher typed values set native custom validity.',
      table: {
        type: { summary: 'number' },
      },
    },
    step: {
      control: 'number',
      description: 'Amount added or subtracted by ArrowUp and ArrowDown.',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    minimumFractionDigits: {
      control: 'number',
      description: 'Minimum number of fraction digits shown while formatted.',
      table: {
        type: { summary: 'number' },
      },
    },
    maximumFractionDigits: {
      control: 'number',
      description: 'Maximum number of fraction digits shown while formatted.',
      table: {
        type: { summary: 'number' },
      },
    },
    useGrouping: {
      control: 'boolean',
      description: 'Shows locale grouping separators when the input is not focused.',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    onFocus: {
      control: false,
      table: {
        disable: true,
      },
    },
    onBlur: {
      control: false,
      table: {
        disable: true,
      },
    },
    'onUpdate:modelValue': {
      control: false,
      table: {
        disable: true,
      },
    },
    focus: {
      control: false,
      description: 'Emitted when the inner input receives focus.',
      table: {
        category: 'Events',
        type: { summary: '[event: FocusEvent]' },
      },
    },
    blur: {
      control: false,
      description: 'Emitted when the inner input loses focus.',
      table: {
        category: 'Events',
        type: { summary: '[event: FocusEvent]' },
      },
    },
    'update:modelValue': {
      control: false,
      description: 'Emitted with the parsed numeric value whenever the user enters a valid number, or null when empty.',
      table: {
        category: 'Events',
        type: { summary: '[value: number | null]' },
      },
    },
    labelSlot: {
      name: 'label',
      control: false,
      description: 'Slot that replaces the label text while preserving the input-label relationship.',
      table: {
        category: 'Slots',
        type: { summary: '() => unknown' },
      },
    },
    errorSlot: {
      name: 'error',
      control: false,
      description: 'Slot that replaces the error message content associated with the input.',
      table: {
        category: 'Slots',
        type: { summary: '() => unknown' },
      },
    },
  },
  render: (args) => ({
    components: { NumberInput },
    setup: () => {
      const value = ref(args.modelValue)

      watch(
        () => args.modelValue,
        (nextValue) => {
          value.value = nextValue
        },
      )

      return { args, value }
    },
    template: `
      <div style="width: min(24rem, 80vw);">
        <NumberInput
          :id="args.id"
          :name="args.name"
          v-model="value"
          :size="args.size"
          :label="args.label"
          :placeholder="args.placeholder"
          :fluid="args.fluid"
          :float-label="args.floatLabel"
          :disabled="args.disabled"
          :readonly="args.readonly"
          :required="args.required"
          :invalid="args.invalid"
          :error="args.error"
          :autocomplete="args.autocomplete"
          :described-by="args.describedBy"
          :input-attrs="args.inputAttrs"
          :locale="args.locale"
          :min="args.min"
          :max="args.max"
          :step="args.step"
          :minimum-fraction-digits="args.minimumFractionDigits"
          :maximum-fraction-digits="args.maximumFractionDigits"
          :use-grouping="args.useGrouping"
          @focus="args.onFocus"
          @blur="args.onBlur"
          @update:model-value="args['onUpdate:modelValue']"
        />
      </div>
    `,
  }),
} satisfies Meta<NumberInputStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Formatting: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<NumberInput label="Quantity" :model-value="1234" :maximum-fraction-digits="0" />
<NumberInput label="Amount" :model-value="1234.5" :minimum-fraction-digits="2" :maximum-fraction-digits="2" />
<NumberInput label="Ungrouped code" :model-value="123456" :use-grouping="false" />`,
      },
    },
  },
  render: () => ({
    components: { NumberInput },
    template: `
      <div style="display: grid; gap: var(--axis-spacing-5); width: min(24rem, 80vw);">
        <NumberInput label="Quantity" :model-value="1234" :maximum-fraction-digits="0" />
        <NumberInput label="Amount" :model-value="1234.5" :minimum-fraction-digits="2" :maximum-fraction-digits="2" />
        <NumberInput label="Ungrouped code" :model-value="123456" :use-grouping="false" />
      </div>
    `,
  }),
}

export const Locales: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<NumberInput label="United States" locale="en-US" :model-value="1234567.89" />
<NumberInput label="Germany" locale="de-DE" :model-value="1234567.89" />
<NumberInput label="France" locale="fr-FR" :model-value="1234567.89" />
<NumberInput label="India" locale="hi-IN" :model-value="1234567.89" />`,
      },
    },
  },
  render: () => ({
    components: { NumberInput },
    template: `
      <div style="display: grid; gap: var(--axis-spacing-5); width: min(24rem, 80vw);">
        <NumberInput label="United States" locale="en-US" :model-value="1234567.89" :maximum-fraction-digits="2" />
        <NumberInput label="Germany" locale="de-DE" :model-value="1234567.89" :maximum-fraction-digits="2" />
        <NumberInput label="France" locale="fr-FR" :model-value="1234567.89" :maximum-fraction-digits="2" />
        <NumberInput label="India" locale="hi-IN" :model-value="1234567.89" :maximum-fraction-digits="2" />
      </div>
    `,
  }),
}

export const Sizes: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<NumberInput label="Small" size="sm" :fluid="false" :model-value="24" />
<NumberInput label="Medium" size="md" :fluid="false" :model-value="24" />
<NumberInput label="Large" size="lg" :fluid="false" :model-value="24" />`,
      },
    },
  },
  render: () => ({
    components: { NumberInput },
    template: `
      <div style="display: grid; gap: var(--axis-spacing-5); width: min(24rem, 80vw);">
        <NumberInput label="Small" size="sm" :fluid="false" :model-value="24" />
        <NumberInput label="Medium" size="md" :fluid="false" :model-value="24" />
        <NumberInput label="Large" size="lg" :fluid="false" :model-value="24" />
      </div>
    `,
  }),
}

export const ValidationStates: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<NumberInput label="Quantity" required />
<NumberInput label="Quantity" error="Enter a quantity between 1 and 10." :model-value="12" />
<NumberInput label="Quantity" invalid :model-value="12" />`,
      },
    },
  },
  render: () => ({
    components: { NumberInput },
    template: `
      <div style="display: grid; gap: var(--axis-spacing-5); width: min(24rem, 80vw);">
        <NumberInput label="Quantity" required />
        <NumberInput label="Quantity" error="Enter a quantity between 1 and 10." :model-value="12" />
        <NumberInput label="Quantity" invalid :model-value="12" />
      </div>
    `,
  }),
}

export const InteractionStates: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<NumberInput label="Editable" :model-value="42" />
<NumberInput label="Read-only" :model-value="42" readonly />
<NumberInput label="Disabled" :model-value="42" disabled />`,
      },
    },
  },
  render: () => ({
    components: { NumberInput },
    template: `
      <div style="display: grid; gap: var(--axis-spacing-5); width: min(24rem, 80vw);">
        <NumberInput label="Editable" :model-value="42" />
        <NumberInput label="Read-only" :model-value="42" readonly />
        <NumberInput label="Disabled" :model-value="42" disabled />
      </div>
    `,
  }),
}
