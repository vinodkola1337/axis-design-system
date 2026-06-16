import type { Meta, StoryObj } from '@storybook/vue3-vite'
import primitiveTokens from '../../../../tokens/tokens/primitive.json'

type TokenValue = string | number

type TokenNode = {
  $value?: TokenValue
  $type?: string
  [key: string]: unknown
}

type ShapeToken = {
  name: string
  cssVar: string
  value: string
  usage: string
}

const primitive = primitiveTokens as TokenNode

const spacingGuidance: Record<string, string> = {
  'spacing.0': 'Remove spacing when content or surfaces need to sit flush.',
  'spacing.1': 'Tight inline spacing, metadata groups, and compact text/icon gaps.',
  'spacing.2': 'Compact paragraph rhythm, small inline groups, and fine alignment.',
  'spacing.3': 'Default prose gaps, small form groups, and compact custom UI.',
  'spacing.4': 'Common panel padding, layout gaps, form rows, and grouped content.',
  'spacing.5': 'Roomier custom panels, content spacing, and control groups.',
  'spacing.6': 'Section gaps, page blocks, larger icon rhythm, and stacked groups.',
  'spacing.8': 'Cards, toolbars, page gutters, and compact section spacing.',
  'spacing.10': 'Prominent row rhythm, layout gutters, and larger custom surfaces.',
  'spacing.12': 'Large card padding, page sections, and spacious grouped content.',
  'spacing.16': 'Large section separation and page-level rhythm.',
  'spacing.20': 'Sparse page layout separation.',
  'spacing.24': 'Major layout separation used sparingly.',
}

const radiusGuidance: Record<string, string> = {
  'border-radius.none': 'Flush layouts, dividers, tables, and square containers.',
  'border-radius.sm': 'Small details and compact nested elements.',
  'border-radius.md': 'Compact custom controls and small interactive elements.',
  'border-radius.lg': 'Cards, examples, and ordinary custom panels.',
  'border-radius.xl': 'Larger surfaces, overlays, and page panels.',
  'border-radius.2xl': 'Prominent panels and soft page containers.',
  'border-radius.full': 'Pills, circular icon surfaces, and avatars.',
}

const borderWidthGuidance: Record<string, string> = {
  'border-width.0': 'Remove borders where layout, spacing, or fill already provides separation.',
  'border-width.1': 'Default borders for fields, cards, panels, dividers, and outlined controls.',
  'border-width.2': 'Focus rings and stronger state emphasis for custom interactive UI.',
  'border-width.4': 'Rare high-emphasis indicators, not everyday outlines.',
}

const toTokenList = (
  node: TokenNode,
  path: string[],
  guidance: Record<string, string>,
): ShapeToken[] =>
  Object.entries(node).map(([key, value]) => {
    const token = value as TokenNode
    const tokenPath = [...path, key]
    const name = tokenPath.join('.')

    return {
      name,
      cssVar: `--axis-${tokenPath.join('-')}`,
      value: String(token.$value),
      usage: guidance[name] ?? 'Use when composing custom layouts or UI with Axis spacing and shape tokens.',
    }
  })

const spacingTokens = toTokenList(primitive.spacing as TokenNode, ['spacing'], spacingGuidance)
const radiusTokens = toTokenList(primitive['border-radius'] as TokenNode, ['border-radius'], radiusGuidance)
const borderWidthTokens = toTokenList(primitive['border-width'] as TokenNode, ['border-width'], borderWidthGuidance)

const tokenTableColumns = 'minmax(9rem, 0.8fr) minmax(9rem, 0.8fr) minmax(12rem, 1.2fr)'
const tokenTableMinWidth = '34rem'

const tokenListStyle = `
  display: grid;
  width: 100%;
  overflow-x: auto;
  border: var(--axis-border-width-1) solid var(--axis-color-border-default);
  border-radius: var(--axis-border-radius-lg);
  background: var(--axis-color-surface-default);
`

const tokenHeaderRowStyle = `
  display: grid;
  grid-template-columns: ${tokenTableColumns};
  gap: var(--axis-spacing-4);
  width: 100%;
  min-width: ${tokenTableMinWidth};
  padding: var(--axis-spacing-3) var(--axis-spacing-4);
  color: var(--axis-color-text-secondary);
  font-size: var(--axis-font-size-xs);
  font-weight: var(--axis-font-weight-semibold);
  line-height: var(--axis-font-line-height-tight);
  text-transform: uppercase;
`

const tokenRowStyle = `
  display: grid;
  grid-template-columns: ${tokenTableColumns};
  gap: var(--axis-spacing-4);
  align-items: center;
  width: 100%;
  min-width: ${tokenTableMinWidth};
  padding: var(--axis-spacing-4);
  border-block-start: var(--axis-border-width-1) solid var(--axis-color-border-default);
`

const tokenMetadataStyle = `
  display: grid;
  gap: var(--axis-spacing-1);
  min-width: 0;
  overflow-wrap: anywhere;
`

const tokenUsageStyle = `
  color: var(--axis-color-text-secondary);
  font-size: var(--axis-font-size-sm);
  line-height: var(--axis-font-line-height-normal);
`

const sampleTrackStyle = `
  display: flex;
  align-items: center;
  min-width: 0;
`

const tokenTableStyles = {
  sampleTrackStyle,
  tokenHeaderRowStyle,
  tokenListStyle,
  tokenMetadataStyle,
  tokenRowStyle,
  tokenUsageStyle,
}

const meta: Meta = {
  title: 'Styles/Spacing & Shape',
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

export const SpacingScale: Story = {
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
      spacingTokens,
      ...tokenTableStyles,
    }),
    template: `
      <div class="axis-spacing-shape-token-docs" :style="tokenListStyle">
        <div :style="tokenHeaderRowStyle">
          <span>Token</span>
          <span>Sample</span>
          <span>Use for</span>
        </div>
        <div
          v-for="token in spacingTokens"
          :key="token.cssVar"
          :style="tokenRowStyle"
        >
          <span :style="tokenMetadataStyle">
            <strong style="color: var(--axis-color-text-primary); font-size: var(--axis-font-size-sm);">{{ token.name }}</strong>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ token.cssVar }}</code>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ token.value }}</code>
          </span>
          <span :style="sampleTrackStyle">
            <span
              aria-hidden="true"
              :style="{ display: 'block', width: \`var(\${token.cssVar})\`, minWidth: token.value === '0px' ? '1px' : undefined, height: 'var(--axis-spacing-4)', borderRadius: 'var(--axis-border-radius-sm)', background: 'var(--axis-color-interactive-primary)' }"
            />
          </span>
          <span :style="tokenUsageStyle">{{ token.usage }}</span>
        </div>
      </div>
    `,
  }),
}

export const RadiusScale: Story = {
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
      radiusTokens,
      ...tokenTableStyles,
    }),
    template: `
      <div class="axis-spacing-shape-token-docs" :style="tokenListStyle">
        <div :style="tokenHeaderRowStyle">
          <span>Token</span>
          <span>Sample</span>
          <span>Use for</span>
        </div>
        <div
          v-for="token in radiusTokens"
          :key="token.cssVar"
          :style="tokenRowStyle"
        >
          <span :style="tokenMetadataStyle">
            <strong style="color: var(--axis-color-text-primary); font-size: var(--axis-font-size-sm);">{{ token.name }}</strong>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ token.cssVar }}</code>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ token.value }}</code>
          </span>
          <span :style="sampleTrackStyle">
            <span
              aria-hidden="true"
              :style="{ display: 'block', width: 'var(--axis-spacing-12)', height: 'var(--axis-spacing-8)', border: 'var(--axis-border-width-1) solid var(--axis-color-border-default)', borderRadius: \`var(\${token.cssVar})\`, background: 'var(--axis-color-interactive-primary-subtle)' }"
            />
          </span>
          <span :style="tokenUsageStyle">{{ token.usage }}</span>
        </div>
      </div>
    `,
  }),
}

export const BorderWidths: Story = {
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
      borderWidthTokens,
      ...tokenTableStyles,
    }),
    template: `
      <div class="axis-spacing-shape-token-docs" :style="tokenListStyle">
        <div :style="tokenHeaderRowStyle">
          <span>Token</span>
          <span>Sample</span>
          <span>Use for</span>
        </div>
        <div
          v-for="token in borderWidthTokens"
          :key="token.cssVar"
          :style="tokenRowStyle"
        >
          <span :style="tokenMetadataStyle">
            <strong style="color: var(--axis-color-text-primary); font-size: var(--axis-font-size-sm);">{{ token.name }}</strong>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ token.cssVar }}</code>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ token.value }}</code>
          </span>
          <span :style="sampleTrackStyle">
            <span
              aria-hidden="true"
              :style="{ display: 'block', width: 'var(--axis-spacing-12)', height: 'var(--axis-spacing-8)', borderStyle: 'solid', borderColor: 'var(--axis-color-border-focus)', borderWidth: \`var(\${token.cssVar})\`, borderRadius: 'var(--axis-border-radius-md)', background: 'var(--axis-color-surface-default)' }"
            />
          </span>
          <span :style="tokenUsageStyle">{{ token.usage }}</span>
        </div>
      </div>
    `,
  }),
}
