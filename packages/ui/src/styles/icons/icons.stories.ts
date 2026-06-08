import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { AlertTriangle, Check, Info, Search } from '@lucide/vue'
import * as LucideIcons from '@lucide/vue'
import type { Component } from 'vue'
import { externalLinks } from '../../constants/external-links'
import Icon from '../../components/icon/Icon.vue'
import Button from '../../components/button/Button.vue'

const lucideIconMap = LucideIcons as unknown as Record<string, Component>
const resolveLucideIcon = (name: unknown) => lucideIconMap[String(name).trim()] ?? Search

const meta: Meta = {
  title: 'Styles/Icons',
  component: Icon,
  args: {
    icon: 'Search',
    size: 'md',
    stroke: 'regular',
  },
  argTypes: {
    icon: {
      control: 'text',
      description: `Lucide icon name for the playground, such as Search or UserRoundSearch. Browse icons: ${externalLinks.lucideIcons}`,
      table: {
        type: { summary: 'Component' },
      },
    },
    size: {
      control: 'select',
      description: 'Axis size used by the icon examples.',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    stroke: {
      control: 'select',
      description: 'Axis icon stroke-width token.',
      options: ['regular', 'strong'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Icon },
    setup: () => ({
      args,
      resolveLucideIcon,
    }),
    template: '<Icon :icon="resolveLucideIcon(args.icon)" :size="args.size" :stroke="args.stroke" />',
  }),
}

export const Sizes: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<Icon :icon="Search" size="xs" />
<Icon :icon="Search" size="sm" />
<Icon :icon="Search" size="md" />
<Icon :icon="Search" size="lg" />
<Icon :icon="Search" size="xl" />`,
      },
    },
  },
  render: () => ({
    components: { Icon },
    setup: () => ({ Search }),
    template: `
      <div style="display: flex; align-items: center; gap: var(--axis-spacing-4); color: var(--axis-color-text-primary);">
        <Icon :icon="Search" size="xs" />
        <Icon :icon="Search" size="sm" />
        <Icon :icon="Search" size="md" />
        <Icon :icon="Search" size="lg" />
        <Icon :icon="Search" size="xl" />
      </div>
    `,
  }),
}

export const Strokes: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<Icon :icon="Search" size="lg" stroke="regular" />
<Icon :icon="Search" size="lg" stroke="strong" />`,
      },
    },
  },
  render: () => ({
    components: { Icon },
    setup: () => ({ Search }),
    template: `
      <div style="display: flex; align-items: center; gap: var(--axis-spacing-4); color: var(--axis-color-text-primary);">
        <Icon :icon="Search" size="lg" stroke="regular" />
        <Icon :icon="Search" size="lg" stroke="strong" />
      </div>
    `,
  }),
}

export const SemanticExamples: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<Button :icon="Search" label="Search" />
<Icon :icon="Check" role="img" aria-label="Success" style="color: var(--axis-color-feedback-success);" />
<Icon :icon="AlertTriangle" role="img" aria-label="Warning" style="color: var(--axis-color-feedback-warning);" />
<Icon :icon="Info" role="img" aria-label="Information" style="color: var(--axis-color-interactive-primary);" />`,
      },
    },
  },
  render: () => ({
    components: { Button, Icon },
    setup: () => ({ AlertTriangle, Check, Info, Search }),
    template: `
      <div style="display: flex; align-items: center; gap: var(--axis-spacing-4);">
        <Button :icon="Search" label="Search" />
        <Icon :icon="Check" role="img" aria-label="Success" style="color: var(--axis-color-feedback-success);" />
        <Icon :icon="AlertTriangle" role="img" aria-label="Warning" style="color: var(--axis-color-feedback-warning);" />
        <Icon :icon="Info" role="img" aria-label="Information" style="color: var(--axis-color-interactive-primary);" />
      </div>
    `,
  }),
}
