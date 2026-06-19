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

type OpacityToken = {
  name: string
  cssVar: string
  value: string
  usage: string
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

const disabledOpacity: OpacityToken = {
  name: 'opacity.disabled',
  cssVar: '--axis-opacity-disabled',
  value: String((((semanticTokens as TokenNode).opacity as TokenNode).disabled as TokenNode).$value),
  usage: 'Disabled visual treatment for custom UI when an Axis component is not available.',
}

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
        code: `<Icon :icon="Info" color="interactive" />
<Icon :icon="Check" color="success" />
<Icon :icon="AlertTriangle" color="warning" />`,
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
          <Icon :icon="Info" size="lg" color="interactive" />
          <span style="display: grid; gap: var(--axis-spacing-1);">
            <strong style="font-size: var(--axis-font-size-sm);">Interactive</strong>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">--axis-color-interactive-primary</code>
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: var(--axis-spacing-3); padding: var(--axis-spacing-4); border: var(--axis-border-width-1) solid var(--axis-color-border-default); border-radius: var(--axis-border-radius-lg); background: var(--axis-color-feedback-success-subtle); color: var(--axis-color-text-primary);">
          <Icon :icon="Check" size="lg" color="success" />
          <span style="display: grid; gap: var(--axis-spacing-1);">
            <strong style="font-size: var(--axis-font-size-sm);">Success</strong>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">--axis-color-feedback-success</code>
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: var(--axis-spacing-3); padding: var(--axis-spacing-4); border: var(--axis-border-width-1) solid var(--axis-color-border-default); border-radius: var(--axis-border-radius-lg); background: var(--axis-color-feedback-warning-subtle); color: var(--axis-color-text-primary);">
          <Icon :icon="AlertTriangle" size="lg" color="warning" />
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
  parameters: {
    docs: {
      canvas: {
        sourceState: 'none',
      },
    },
  },
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
  parameters: {
    docs: {
      canvas: {
        sourceState: 'none',
      },
    },
  },
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

export const DisabledOpacity: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      canvas: {
        sourceState: 'none',
      },
    },
  },
  render: () => ({
    setup: () => ({
      disabledOpacity,
    }),
    template: `
      <div class="axis-color-token-docs" style="display: grid; width: 100%; overflow-x: auto; border: var(--axis-border-width-1) solid var(--axis-color-border-default); border-radius: var(--axis-border-radius-lg); background: var(--axis-color-surface-default);">
        <div style="display: grid; grid-template-columns: minmax(9rem, 0.8fr) minmax(9rem, 0.8fr) minmax(12rem, 1.2fr); gap: var(--axis-spacing-4); width: 100%; min-width: 34rem; padding: var(--axis-spacing-3) var(--axis-spacing-4); color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs); font-weight: var(--axis-font-weight-semibold); line-height: var(--axis-font-line-height-tight); text-transform: uppercase;">
          <span>Token</span>
          <span>Sample</span>
          <span>Use for</span>
        </div>
        <div style="display: grid; grid-template-columns: minmax(9rem, 0.8fr) minmax(9rem, 0.8fr) minmax(12rem, 1.2fr); gap: var(--axis-spacing-4); align-items: center; width: 100%; min-width: 34rem; padding: var(--axis-spacing-4); border-block-start: var(--axis-border-width-1) solid var(--axis-color-border-default);">
          <span style="display: grid; gap: var(--axis-spacing-1); min-width: 0; overflow-wrap: anywhere;">
            <strong style="color: var(--axis-color-text-primary); font-size: var(--axis-font-size-sm);">{{ disabledOpacity.name }}</strong>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ disabledOpacity.cssVar }}</code>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ disabledOpacity.value }}</code>
          </span>
          <span style="display: flex; align-items: center; min-width: 0;">
            <button disabled type="button" style="display: inline-flex; align-items: center; min-height: var(--axis-button-size-md-height); padding: 0 var(--axis-spacing-4); border: var(--axis-border-width-1) solid var(--axis-color-border-default); border-radius: var(--axis-button-border-radius); background: var(--axis-color-background-subtle); color: var(--axis-color-text-primary); font-family: inherit; font-size: var(--axis-font-size-base); font-weight: var(--axis-button-font-weight); opacity: var(--axis-opacity-disabled);">
              Disabled
            </button>
          </span>
          <span style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-sm); line-height: var(--axis-font-line-height-normal);">{{ disabledOpacity.usage }}</span>
        </div>
      </div>
    `,
  }),
}
