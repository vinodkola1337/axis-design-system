import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { AlertTriangle, Check, Info, Search } from '@lucide/vue'

const meta = {
  title: 'Styles/Icons',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const TokenStyledIcons: Story = {
  render: () => ({
    components: { AlertTriangle, Check, Info, Search },
    setup: () => ({
      items: [
        { icon: Search, label: 'Search' },
        { icon: Check, label: 'Success' },
        { icon: AlertTriangle, label: 'Warning' },
        { icon: Info, label: 'Information' },
      ],
    }),
    template: `
      <div
        style="
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: var(--axis-spacing-4);
          max-width: 40rem;
        "
      >
        <div
          v-for="item in items"
          :key="item.label"
          style="
            display: flex;
            align-items: center;
            gap: var(--axis-spacing-3);
            padding: var(--axis-spacing-4);
            border: 1px solid var(--axis-color-border-default);
            border-radius: var(--axis-border-radius-lg);
            color: var(--axis-color-text-primary);
            background: var(--axis-color-surface-default);
            font-family: var(--axis-font-family-sans);
            font-size: var(--axis-font-size-sm);
          "
        >
          <component
            :is="item.icon"
            aria-hidden="true"
            :size="20"
            :stroke-width="2"
            style="color: var(--axis-color-interactive-primary); flex: 0 0 auto;"
          />
          <span>{{ item.label }}</span>
        </div>
      </div>
    `,
  }),
}

export const IconButtonExample: Story = {
  render: () => ({
    components: { Search },
    template: `
      <button
        type="button"
        aria-label="Search"
        style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--axis-button-height-md);
          height: var(--axis-button-height-md);
          border: 1px solid var(--axis-color-border-default);
          border-radius: var(--axis-border-radius-full);
          color: var(--axis-color-text-primary);
          background: var(--axis-color-surface-default);
        "
      >
        <Search aria-hidden="true" :size="20" :stroke-width="2" />
      </button>
    `,
  }),
}
