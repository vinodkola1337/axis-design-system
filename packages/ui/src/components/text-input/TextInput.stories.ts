import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import TextInput from './TextInput.vue'

type TextInputStoryArgs = InstanceType<typeof TextInput>['$props'] & {
  blur?: [event: FocusEvent]
  focus?: [event: FocusEvent]
  labelSlot?: unknown
  errorSlot?: unknown
  'update:modelValue'?: [value: string]
  onBlur: (event: FocusEvent) => void
  onFocus: (event: FocusEvent) => void
  'onUpdate:modelValue': (value: string) => void
}

const meta = {
  title: 'Components/TextInput',
  component: TextInput,
  args: {
    autocomplete: 'email',
    describedBy: undefined,
    disabled: false,
    error: '',
    floatLabel: false,
    fluid: true,
    id: undefined,
    inputAttrs: undefined,
    invalid: false,
    label: 'Email address',
    modelValue: '',
    name: 'email',
    onBlur: fn(),
    onFocus: fn(),
    'onUpdate:modelValue': fn(),
    placeholder: 'name@example.com',
    readonly: false,
    required: false,
    size: 'md',
    type: 'email',
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'Sets the input id. When omitted, TextInput generates a stable id for the label relationship.',
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
      control: 'text',
      description: 'Current input value used by v-model.',
      table: {
        type: { summary: 'string' },
      },
    },
    type: {
      control: 'select',
      description: 'Sets the native input type.',
      options: ['text', 'email', 'password', 'search', 'tel', 'url'],
      table: {
        defaultValue: { summary: 'text' },
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
      description: 'Visible label text. Prefer a label for every form field.',
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
      description: 'Emitted with the current value whenever the user edits the input.',
      table: {
        category: 'Events',
        type: { summary: '[value: string]' },
      },
    },
    labelSlot: {
      name: 'label',
      control: false,
      description: 'Slot that replaces the label text while preserving the input-label relationship.',
      table: {
        category: 'Slots',
      },
    },
    errorSlot: {
      name: 'error',
      control: false,
      description: 'Slot that replaces the error message content associated with the input.',
      table: {
        category: 'Slots',
      },
    },
  },
  render: (args) => ({
    components: { TextInput },
    setup: () => ({ args }),
    template: `
      <div style="width: min(24rem, 80vw);">
        <TextInput
          :id="args.id"
          :name="args.name"
          :model-value="args.modelValue"
          :type="args.type"
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
          @focus="args.onFocus"
          @blur="args.onBlur"
          @update:model-value="args['onUpdate:modelValue']"
        />
      </div>
    `,
  }),
} satisfies Meta<TextInputStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const LabelStyles: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<TextInput label="Email address" placeholder="name@example.com" />
<TextInput label="Email address" float-label />`,
      },
    },
  },
  render: () => ({
    components: { TextInput },
    template: `
      <div style="display: grid; gap: var(--axis-spacing-5); width: min(24rem, 80vw);">
        <TextInput label="Email address" placeholder="name@example.com" />
        <TextInput label="Email address" float-label />
      </div>
    `,
  }),
}

export const InputTypes: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<TextInput label="Search" type="search" placeholder="Search" />
<TextInput label="Email" type="email" placeholder="name@example.com" />
<TextInput label="Password" type="password" />`,
      },
    },
  },
  render: () => ({
    components: { TextInput },
    template: `
      <div style="display: grid; gap: var(--axis-spacing-5); width: min(24rem, 80vw);">
        <TextInput label="Search" type="search" placeholder="Search" />
        <TextInput label="Email" type="email" placeholder="name@example.com" />
        <TextInput label="Password" type="password" />
      </div>
    `,
  }),
}

export const Sizes: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<TextInput label="Small" size="sm" :fluid="false" />
<TextInput label="Medium" size="md" :fluid="false" />
<TextInput label="Large" size="lg" :fluid="false" />`,
      },
    },
  },
  render: () => ({
    components: { TextInput },
    template: `
      <div style="display: grid; gap: var(--axis-spacing-5); width: min(24rem, 80vw);">
        <TextInput label="Small" size="sm" :fluid="false" />
        <TextInput label="Medium" size="md" :fluid="false" />
        <TextInput label="Large" size="lg" :fluid="false" />
      </div>
    `,
  }),
}

export const ValidationStates: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<TextInput label="Email address" required />
<TextInput label="Email address" error="Enter a valid email address." />
<TextInput label="Email address" invalid />`,
      },
    },
  },
  render: () => ({
    components: { TextInput },
    template: `
      <div style="display: grid; gap: var(--axis-spacing-5); width: min(24rem, 80vw);">
        <TextInput label="Email address" required />
        <TextInput label="Email address" error="Enter a valid email address." model-value="name" />
        <TextInput label="Email address" invalid model-value="Needs review" />
      </div>
    `,
  }),
}

export const InteractionStates: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<TextInput label="Editable" model-value="name@example.com" />
<TextInput label="Read-only" model-value="name@example.com" readonly />
<TextInput label="Disabled" model-value="name@example.com" disabled />`,
      },
    },
  },
  render: () => ({
    components: { TextInput },
    template: `
      <div style="display: grid; gap: var(--axis-spacing-5); width: min(24rem, 80vw);">
        <TextInput label="Editable" model-value="name@example.com" />
        <TextInput label="Read-only" model-value="name@example.com" readonly />
        <TextInput label="Disabled" model-value="name@example.com" disabled />
      </div>
    `,
  }),
}

export const LabelSlot: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<TextInput id="account-id">
  <template #label>Account ID</template>
</TextInput>`,
      },
    },
  },
  render: () => ({
    components: { TextInput },
    template: `
      <TextInput id="account-id" placeholder="AX-1024">
        <template #label>Account ID</template>
      </TextInput>
    `,
  }),
}
