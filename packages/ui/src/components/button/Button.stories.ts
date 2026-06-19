import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Search } from '@lucide/vue'
import Button from './Button.vue'

const iconOptions = {
  none: undefined,
  search: Search,
} as const

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    disabled: false,
    emphasis: 'filled',
    icon: undefined,
    iconPosition: 'start',
    label: 'Button',
    severity: 'primary',
    size: 'md',
    type: 'button',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible button label. Prefer this prop for standard text buttons.',
      table: {
        type: { summary: 'string' },
      },
    },
    icon: {
      control: 'select',
      description: 'Icon component to render through Axis Icon. Lucide icons from @lucide/vue are recommended.',
      mapping: iconOptions,
      options: Object.keys(iconOptions),
      table: {
        type: { summary: 'Component' },
      },
    },
    iconPosition: {
      control: 'select',
      description: 'Places the icon before or after the label.',
      options: ['start', 'end'],
      table: {
        defaultValue: { summary: 'start' },
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
      description: 'Controls the button height, text size, horizontal padding, and icon size.',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction and applies disabled styling.',
      table: {
        defaultValue: { summary: 'false' },
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
        :aria-label="!args.label && args.icon ? 'Search' : undefined"
        :disabled="args.disabled"
        :emphasis="args.emphasis"
        :icon="args.icon"
        :icon-position="args.iconPosition"
        :label="args.label"
        :severity="args.severity"
        :size="args.size"
        :type="args.type"
      />
    `,
  }),
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const IconExamples: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<Button :icon="Search" label="Start icon" />
<Button :icon="Search" icon-position="end" label="End icon" />
<Button :icon="Search" aria-label="Search" />`,
      },
    },
  },
  render: () => ({
    components: { Button },
    setup: () => ({ Search }),
    template: `
      <div style="display: flex; align-items: center; gap: var(--axis-spacing-4);">
        <Button :icon="Search" label="Start icon" />
        <Button :icon="Search" icon-position="end" label="End icon" />
        <Button :icon="Search" aria-label="Search" />
      </div>
    `,
  }),
}

export const IconOnly: Story = {
  args: {
    icon: Search,
    label: '',
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `
      <Button
        aria-label="Search"
        :icon="args.icon"
        :size="args.size"
        :type="args.type"
      />
    `,
  }),
}

export const Severities: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<Button label="Primary" severity="primary" />
<Button label="Danger" severity="danger" />`,
      },
    },
  },
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; align-items: center; gap: var(--axis-spacing-4);">
        <Button label="Primary" severity="primary" />
        <Button label="Danger" severity="danger" />
      </div>
    `,
  }),
}

export const Emphases: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<Button label="Filled" emphasis="filled" />
<Button label="Outlined" emphasis="outlined" />
<Button label="Text" emphasis="text" />`,
      },
    },
  },
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; align-items: center; gap: var(--axis-spacing-4);">
        <Button label="Filled" emphasis="filled" />
        <Button label="Outlined" emphasis="outlined" />
        <Button label="Text" emphasis="text" />
      </div>
    `,
  }),
}

export const Sizes: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<Button label="Small" size="sm" />
<Button label="Medium" size="md" />
<Button label="Large" size="lg" />`,
      },
    },
  },
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; align-items: center; gap: var(--axis-spacing-4);">
        <Button label="Small" size="sm" />
        <Button label="Medium" size="md" />
        <Button label="Large" size="lg" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  tags: ['!dev'],
  args: {
    disabled: true,
  },
}
