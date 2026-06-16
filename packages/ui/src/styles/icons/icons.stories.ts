import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { AlertTriangle, Check, Info, Search } from '@lucide/vue'
import Icon from '../../components/icon/Icon.vue'
import Button from '../../components/button/Button.vue'

const meta: Meta = {
  title: 'Styles/Icons',
  component: Icon,
}

export default meta
type Story = StoryObj<typeof meta>

export const OverviewExample: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<Icon :icon="Search" />
<Icon :icon="Check" color="success" />
<Icon :icon="Info" size="lg" />
<Icon :icon="AlertTriangle" stroke="strong" />`,
      },
    },
  },
  render: () => ({
    components: { Icon },
    setup: () => ({ AlertTriangle, Check, Info, Search }),
    template: `
      <div style="display: flex; flex-wrap: wrap; align-items: end; gap: var(--axis-spacing-6); color: var(--axis-color-text-primary);">
        <span style="display: grid; justify-items: center; gap: var(--axis-spacing-2);">
          <Icon :icon="Search" size="md" />
          <span style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">Default</span>
        </span>
        <span style="display: grid; justify-items: center; gap: var(--axis-spacing-2);">
          <Icon :icon="Check" size="md" color="success" />
          <span style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">Semantic color</span>
        </span>
        <span style="display: grid; justify-items: center; gap: var(--axis-spacing-2);">
          <Icon :icon="Info" size="xl" />
          <span style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">Larger size</span>
        </span>
        <span style="display: grid; justify-items: center; gap: var(--axis-spacing-2);">
          <Icon :icon="AlertTriangle" size="xl" stroke="strong" />
          <span style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">Strong stroke</span>
        </span>
      </div>
    `,
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
<Icon :icon="Check" role="img" aria-label="Success" color="success" />
<Icon :icon="AlertTriangle" role="img" aria-label="Warning" color="warning" />
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
        <Icon :icon="Check" role="img" aria-label="Success" color="success" />
        <Icon :icon="AlertTriangle" role="img" aria-label="Warning" color="warning" />
        <Icon :icon="Info" role="img" aria-label="Information" style="color: var(--axis-color-interactive-primary);" />
      </div>
    `,
  }),
}
