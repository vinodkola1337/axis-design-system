import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import TextInput from './TextInput.vue'

type TextInputStoryArgs = InstanceType<typeof TextInput>['$props'] & {
  blur?: [event: FocusEvent]
  focus?: [event: FocusEvent]
  'update:modelValue'?: [value: string]
}

const meta = {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  args: {
    disabled: false,
    floatLabel: false,
    fluid: true,
    invalid: false,
    label: 'Email address',
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
    'onUpdate:modelValue': {
      control: false,
      table: {
        disable: true,
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
    'update:modelValue': {
      control: false,
      description: 'Emitted with the current value whenever the user edits the input.',
      table: {
        category: 'Events',
        type: { summary: '[value: string]' },
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
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url'],
    },
  },
  render: (args) => ({
    components: { TextInput },
    setup: () => ({ args }),
    template: `
      <div style="width: min(24rem, 80vw);">
        <TextInput v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<TextInputStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FloatingLabel: Story = {
  args: {
    floatLabel: true,
    placeholder: undefined,
  },
}

export const Required: Story = {
  args: {
    required: true,
  },
}

export const Error: Story = {
  args: {
    error: 'Enter a valid email address.',
    invalid: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    modelValue: 'name@example.com',
  },
}

export const ReadOnly: Story = {
  args: {
    modelValue: 'name@example.com',
    readonly: true,
  },
}

export const Sizes: Story = {
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
