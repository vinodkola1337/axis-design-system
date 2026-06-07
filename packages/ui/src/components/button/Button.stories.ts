import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from './Button.vue'

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    default: 'Button',
    disabled: false,
    emphasis: 'filled',
    severity: 'primary',
    size: 'md',
    type: 'button',
  },
  argTypes: {
    default: {
      control: 'text',
      description: 'Button label rendered through the default slot.',
      table: {
        category: 'Slots',
        type: { summary: 'string' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction and applies disabled styling.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    emphasis: {
      control: 'select',
      description: 'Sets the button visual prominence.',
      options: ['filled', 'outlined', 'text'],
      table: {
        defaultValue: { summary: 'filled' },
      },
    },
    severity: {
      control: 'select',
      description: 'Sets the button action intent.',
      options: ['primary', 'danger'],
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      description: 'Controls the button height, text size, and horizontal padding.',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    type: {
      control: 'select',
      description: 'Sets the native button type.',
      options: ['button', 'submit', 'reset'],
      table: {
        defaultValue: { summary: 'button' },
      },
    },
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `
      <Button
        :disabled="args.disabled"
        :emphasis="args.emphasis"
        :severity="args.severity"
        :size="args.size"
        :type="args.type"
      >
        {{ args.default }}
      </Button>
    `,
  }),
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Outlined: Story = {
  args: {
    emphasis: 'outlined',
  },
}

export const Text: Story = {
  args: {
    emphasis: 'text',
  },
}

export const Danger: Story = {
  args: {
    default: 'Delete',
    severity: 'danger',
  },
}

export const Severities: Story = {
  tags: ['!dev'],
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; align-items: center; gap: var(--axis-spacing-4);">
        <Button severity="primary">Primary</Button>
        <Button severity="danger">Danger</Button>
      </div>
    `,
  }),
}

export const Emphases: Story = {
  tags: ['!dev'],
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; align-items: center; gap: var(--axis-spacing-4);">
        <Button emphasis="filled">Filled</Button>
        <Button emphasis="outlined">Outlined</Button>
        <Button emphasis="text">Text</Button>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  tags: ['!dev'],
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; align-items: center; gap: var(--axis-spacing-4);">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
