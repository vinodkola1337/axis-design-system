import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { AlertTriangle, Check, Info } from '@lucide/vue'
import primitiveTokens from '../../../../tokens/tokens/primitive.json'
import semanticTokens from '../../../../tokens/tokens/semantic.json'
import Icon from '../../components/icon/Icon.vue'

type TokenValue = string | number

type TokenNode = {
  $value?: TokenValue
  $type?: string
  [key: string]: unknown
}

type ColorToken = {
  name: string
  cssVar: string
  value: string
  group: string
}

const tokenGridStyle = `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: var(--axis-spacing-3);
  width: 100%;
`

const tokenGroupStyle = `
  display: grid;
  gap: var(--axis-spacing-3);
  width: 100%;
`

const tokenRowStyle = `
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: var(--axis-spacing-3);
  align-items: center;
  min-width: 0;
  padding: var(--axis-spacing-2);
  border: var(--axis-border-width-1) solid var(--axis-color-border-default);
  border-radius: var(--axis-border-radius-lg);
  background: var(--axis-color-surface-default);
`

const tokenDetailStyle = `
  display: grid;
  gap: var(--axis-spacing-1);
  min-width: 0;
  overflow-wrap: anywhere;
`

const flattenColorTokens = (
  node: TokenNode,
  path: string[] = [],
): ColorToken[] => {
  if (node.$type === 'color' && node.$value !== undefined) {
    return [
      {
        name: path.join('.'),
        cssVar: `--axis-${path.join('-')}`,
        value: String(node.$value),
        group: path[1] ?? path[0] ?? 'color',
      },
    ]
  }

  return Object.entries(node).flatMap(([key, value]) => {
    if (key.startsWith('$') || typeof value !== 'object' || value === null) {
      return []
    }

    return flattenColorTokens(value as TokenNode, [...path, key])
  })
}

const primitiveColors = flattenColorTokens((primitiveTokens as TokenNode).color as TokenNode, ['color'])
const semanticColors = flattenColorTokens((semanticTokens as TokenNode).color as TokenNode, ['color'])

const groupedPrimitiveColors = primitiveColors.reduce<Record<string, ColorToken[]>>((groups, token) => {
  groups[token.group] = [...(groups[token.group] ?? []), token]
  return groups
}, {})

const meta: Meta = {
  title: 'Styles/Colors',
  parameters: {
    docs: {
      source: {
        type: 'dynamic',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const UsageExample: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<Icon :icon="Info" style="color: var(--axis-color-interactive-primary);" />
<Icon :icon="Check" style="color: var(--axis-color-feedback-success);" />
<Icon :icon="AlertTriangle" style="color: var(--axis-color-feedback-warning);" />`,
      },
    },
  },
  render: () => ({
    components: { Icon },
    setup: () => ({
      AlertTriangle,
      Check,
      Info,
    }),
    template: `
      <div
        class="axis-color-token-docs"
        style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: var(--axis-spacing-3); width: 100%;"
      >
        <div style="display: flex; align-items: center; gap: var(--axis-spacing-3); padding: var(--axis-spacing-4); border: var(--axis-border-width-1) solid var(--axis-color-border-default); border-radius: var(--axis-border-radius-lg); background: var(--axis-color-surface-default); color: var(--axis-color-text-primary);">
          <Icon :icon="Info" size="lg" style="color: var(--axis-color-interactive-primary);" />
          <span style="display: grid; gap: var(--axis-spacing-1);">
            <strong style="font-size: var(--axis-font-size-sm);">Interactive</strong>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">--axis-color-interactive-primary</code>
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: var(--axis-spacing-3); padding: var(--axis-spacing-4); border: var(--axis-border-width-1) solid var(--axis-color-border-default); border-radius: var(--axis-border-radius-lg); background: var(--axis-color-feedback-success-subtle); color: var(--axis-color-text-primary);">
          <Icon :icon="Check" size="lg" style="color: var(--axis-color-feedback-success);" />
          <span style="display: grid; gap: var(--axis-spacing-1);">
            <strong style="font-size: var(--axis-font-size-sm);">Success</strong>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">--axis-color-feedback-success</code>
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: var(--axis-spacing-3); padding: var(--axis-spacing-4); border: var(--axis-border-width-1) solid var(--axis-color-border-default); border-radius: var(--axis-border-radius-lg); background: var(--axis-color-feedback-warning-subtle); color: var(--axis-color-text-primary);">
          <Icon :icon="AlertTriangle" size="lg" style="color: var(--axis-color-feedback-warning);" />
          <span style="display: grid; gap: var(--axis-spacing-1);">
            <strong style="font-size: var(--axis-font-size-sm);">Warning</strong>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">--axis-color-feedback-warning</code>
          </span>
        </div>
      </div>
    `,
  }),
}

export const PrimitivePalette: Story = {
  tags: ['!dev'],
  render: () => ({
    setup: () => ({
      groupedPrimitiveColors,
      tokenDetailStyle,
      tokenGridStyle,
      tokenGroupStyle,
      tokenRowStyle,
    }),
    template: `
      <div class="axis-color-token-docs" style="display: grid; gap: var(--axis-spacing-6); width: 100%;">
        <section v-for="(tokens, group) in groupedPrimitiveColors" :key="group" :style="tokenGroupStyle">
          <h3 style="margin: 0; color: var(--axis-color-text-primary); font-size: var(--axis-font-size-lg); text-transform: capitalize;">{{ group }}</h3>
          <div :style="tokenGridStyle">
            <div
              v-for="token in tokens"
              :key="token.cssVar"
              :style="tokenRowStyle"
            >
              <span
                aria-hidden="true"
                :style="{ width: '40px', height: '40px', borderRadius: 'var(--axis-border-radius-md)', border: 'var(--axis-border-width-1) solid var(--axis-color-border-default)', background: \`var(\${token.cssVar})\` }"
              />
              <span :style="tokenDetailStyle">
                <strong style="color: var(--axis-color-text-primary); font-size: var(--axis-font-size-sm);">{{ token.name }}</strong>
                <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ token.cssVar }}</code>
                <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ token.value }}</code>
              </span>
            </div>
          </div>
        </section>
      </div>
    `,
  }),
}

export const SemanticTokenList: Story = {
  tags: ['!dev'],
  render: () => ({
    setup: () => ({
      semanticColors,
      tokenDetailStyle,
      tokenGridStyle,
      tokenRowStyle,
    }),
    template: `
      <div class="axis-color-token-docs" :style="tokenGridStyle">
        <div
          v-for="token in semanticColors"
          :key="token.cssVar"
          :style="tokenRowStyle"
        >
          <span
            aria-hidden="true"
            :style="{ width: '40px', height: '40px', borderRadius: 'var(--axis-border-radius-md)', border: 'var(--axis-border-width-1) solid var(--axis-color-border-default)', background: \`var(\${token.cssVar})\` }"
          />
          <span :style="tokenDetailStyle">
            <strong style="color: var(--axis-color-text-primary); font-size: var(--axis-font-size-sm);">{{ token.name }}</strong>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ token.cssVar }}</code>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ token.value }}</code>
          </span>
        </div>
      </div>
    `,
  }),
}
