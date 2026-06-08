import type { Meta, StoryObj } from '@storybook/vue3-vite'
import primitiveTokens from '../../../../tokens/tokens/primitive.json'

type TokenValue = string | number

type TokenNode = {
  $value?: TokenValue
  $type?: string
  [key: string]: unknown
}

type TypographyToken = {
  name: string
  cssVar: string
  value: string
  usage: string
}

type TypographyRoleExample = {
  className: string
}

const fontTokens = (primitiveTokens as TokenNode).font as TokenNode

const typographyTokenGuidance: Record<string, string> = {
  'font.family.sans': 'Default interface text, forms, navigation, and product content.',
  'font.family.mono': 'Code, token names, technical identifiers, and tabular values.',
  'font.size.xs': 'Dense metadata, captions, and secondary labels with low reading burden.',
  'font.size.sm': 'Compact labels, helper text, table cells, and secondary UI text.',
  'font.size.base': 'Default body copy, form content, and normal reading text.',
  'font.size.lg': 'Emphasized body text, short summaries, and compact section leads.',
  'font.size.xl': 'Small titles, card headings, and prominent grouped content.',
  'font.size.2xl': 'Section headings and dialog titles in focused workflows.',
  'font.size.3xl': 'Page headings and high-level product screens.',
  'font.size.4xl': 'Sparse overview headings where hierarchy needs more presence.',
  'font.size.5xl': 'Display moments used sparingly outside dense workflows.',
  'font.weight.regular': 'Default reading text and values where hierarchy comes from layout.',
  'font.weight.medium': 'Labels, controls, and low-emphasis headings.',
  'font.weight.semibold': 'Section titles, selected states, and emphasized labels.',
  'font.weight.bold': 'Strong emphasis used sparingly for critical hierarchy.',
  'font.line-height.none': 'Single-line labels, icon-aligned text, and compact controls.',
  'font.line-height.tight': 'Headings and short title text.',
  'font.line-height.snug': 'Compact multi-line titles and dense product copy.',
  'font.line-height.normal': 'Default multi-line body text and form content.',
  'font.line-height.relaxed': 'Longer reading text, help content, and documentation copy.',
  'font.line-height.loose': 'Rare spacious reading contexts where density is not the goal.',
}

const toTokenList = (node: TokenNode, path: string[]): TypographyToken[] =>
  Object.entries(node).map(([key, value]) => {
    const token = value as TokenNode
    const tokenPath = [...path, key]
    const name = tokenPath.join('.')

    return {
      name,
      cssVar: `--axis-${tokenPath.join('-')}`,
      value: String(token.$value),
      usage: typographyTokenGuidance[name] ?? 'Custom typography composition that stays aligned with Axis tokens.',
    }
  })

const fontFamilies = toTokenList(fontTokens.family as TokenNode, ['font', 'family'])
const fontSizes = toTokenList(fontTokens.size as TokenNode, ['font', 'size'])
const fontWeights = toTokenList(fontTokens.weight as TokenNode, ['font', 'weight'])
const lineHeights = toTokenList(fontTokens['line-height'] as TokenNode, ['font', 'line-height'])

const typographyRoleExamples: TypographyRoleExample[] = [
  {
    className: 'axis-type-display-sm',
  },
  {
    className: 'axis-type-headline-md',
  },
  {
    className: 'axis-type-title-md',
  },
  {
    className: 'axis-type-body-md',
  },
  {
    className: 'axis-type-code',
  },
  {
    className: 'axis-type-label-sm',
  }
]

const tokenTableColumns = 'minmax(9rem, 0.9fr) minmax(9rem, 1fr) minmax(12rem, 1.1fr)'
const tokenTableMinWidth = '34rem'

const tokenListStyle = `
  display: grid;
  width: 100%;
  overflow-x: auto;
  border: var(--axis-border-width-1) solid var(--axis-color-border-default);
  border-radius: var(--axis-border-radius-lg);
  background: var(--axis-color-surface-default);
`

const tokenComparisonRowStyle = `
  display: grid;
  grid-template-columns: ${tokenTableColumns};
  gap: var(--axis-spacing-4);
  align-items: start;
  width: 100%;
  min-width: ${tokenTableMinWidth};
  padding: var(--axis-spacing-4);
  border-block-start: var(--axis-border-width-1) solid var(--axis-color-border-default);
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

const tokenSampleStyle = `
  max-width: 38rem;
  margin: 0;
  color: var(--axis-color-text-primary);
  font-size: var(--axis-font-size-base);
`

const tokenUsageStyle = `
  min-width: 0;
  color: var(--axis-color-text-secondary);
  font-size: var(--axis-font-size-sm);
  line-height: var(--axis-font-line-height-normal);
`

const tokenMetadataStyle = `
  display: grid;
  gap: var(--axis-spacing-1);
  min-width: 0;
  overflow-wrap: anywhere;
`

const tokenTableStyles = {
  tokenComparisonRowStyle,
  tokenHeaderRowStyle,
  tokenListStyle,
  tokenMetadataStyle,
  tokenSampleStyle,
  tokenUsageStyle,
}

const meta: Meta = {
  title: 'Styles/Typography',
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
        code: `<section aria-labelledby="typography-example-title">
  <p class="axis-type-label-md">Workspace</p>
  <h1 id="typography-example-title" class="axis-type-headline-md">Account settings</h1>
  <p class="axis-type-title-sm">Profile, security, and notification preferences</p>
  <p class="axis-type-body-md">
    Use typography roles to create clear hierarchy without choosing font size,
    weight, and line height for every text element.
  </p>
</section>`,
      },
    },
  },
  render: () => ({
    template: `
      <section aria-labelledby="typography-example-title" class="axis-typography-token-docs" style="display: grid; gap: var(--axis-spacing-3); max-width: 44rem; color: var(--axis-color-text-primary); font-family: var(--axis-font-family-sans);">
        <p class="axis-type-label-md" style="color: var(--axis-color-text-secondary);">Workspace</p>
        <h1 id="typography-example-title" class="axis-type-headline-md">Account settings</h1>
        <p class="axis-type-title-sm" style="color: var(--axis-color-text-secondary);">Profile, security, and notification preferences</p>
        <p class="axis-type-body-md" style="color: var(--axis-color-text-secondary); max-width: 36rem;">
          Use typography roles to create clear hierarchy without choosing font size,
          weight, and line height for every text element.
        </p>
      </section>
    `,
  }),
}

export const AxisTypographyClasses: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<div>
  <p class="axis-type-display-sm">axis-type-display-sm</p>
  <p class="axis-type-headline-md">axis-type-headline-md</p>  
  <p class="axis-type-title-md">axis-type-title-md</p>
  <p class="axis-type-body-md">axis-type-body-md</p>
  <p class="axis-type-code">axis-type-code</p>
  <p class="axis-type-label-sm">axis-type-label-sm</p>
</div>`,
      },
    },
  },
  render: () => ({
    setup: () => ({
      typographyRoleExamples,
    }),
    template: `
      <div class="axis-typography-token-docs" style="display: grid; gap: var(--axis-spacing-3); width: 100%; color: var(--axis-color-text-primary); font-family: var(--axis-font-family-sans);">
        <p v-for="item in typographyRoleExamples" :key="item.className" :class="item.className" style="margin: 0; overflow-wrap: anywhere;">
          {{ item.className }} 
        </p>
      </div>
    `,
  }),
}

export const FontFamilies: Story = {
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
      fontFamilies,
      ...tokenTableStyles,
    }),
    template: `
      <div class="axis-typography-token-docs" :style="tokenListStyle">
        <div :style="tokenHeaderRowStyle">
          <span>Token</span>
          <span>Sample</span>
          <span>Use for</span>
        </div>
        <div
          v-for="token in fontFamilies"
          :key="token.cssVar"
          :style="tokenComparisonRowStyle"
        >
          <span :style="tokenMetadataStyle">
            <strong style="color: var(--axis-color-text-primary); font-size: var(--axis-font-size-sm);">{{ token.name }}</strong>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ token.cssVar }}</code>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ token.value }}</code>
          </span>
          <p :style="[tokenSampleStyle, { fontFamily: \`var(\${token.cssVar})\`, fontSize: 'var(--axis-font-size-xl)', lineHeight: 'var(--axis-font-line-height-snug)' }]">
            The quick brown fox
          </p>
          <span :style="tokenUsageStyle">{{ token.usage }}</span>
        </div>
      </div>
    `,
  }),
}

export const TypeScale: Story = {
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
      fontSizes,
      ...tokenTableStyles,
    }),
    template: `
      <div class="axis-typography-token-docs" :style="tokenListStyle">
        <div :style="tokenHeaderRowStyle">
          <span>Token</span>
          <span>Sample</span>
          <span>Use for</span>
        </div>
        <div
          v-for="token in fontSizes"
          :key="token.cssVar"
          :style="tokenComparisonRowStyle"
        >
          <span :style="tokenMetadataStyle">
            <strong style="color: var(--axis-color-text-primary); font-size: var(--axis-font-size-sm);">{{ token.name }}</strong>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ token.cssVar }}</code>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ token.value }}</code>
          </span>
          <p :style="[tokenSampleStyle, { fontSize: \`var(\${token.cssVar})\`, fontWeight: 'var(--axis-font-weight-semibold)', lineHeight: 'var(--axis-font-line-height-tight)' }]">
            Interface text
          </p>
          <span :style="tokenUsageStyle">{{ token.usage }}</span>
        </div>
      </div>
    `,
  }),
}

export const FontWeights: Story = {
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
      fontWeights,
      ...tokenTableStyles,
    }),
    template: `
      <div class="axis-typography-token-docs" :style="tokenListStyle">
        <div :style="tokenHeaderRowStyle">
          <span>Token</span>
          <span>Sample</span>
          <span>Use for</span>
        </div>
        <div
          v-for="token in fontWeights"
          :key="token.cssVar"
          :style="tokenComparisonRowStyle"
        >
          <span :style="tokenMetadataStyle">
            <strong style="color: var(--axis-color-text-primary); font-size: var(--axis-font-size-sm);">{{ token.name }}</strong>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ token.cssVar }}</code>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ token.value }}</code>
          </span>
          <p :style="[tokenSampleStyle, { fontSize: 'var(--axis-font-size-xl)', fontWeight: \`var(\${token.cssVar})\`, lineHeight: 'var(--axis-font-line-height-snug)' }]">
            Interface text
          </p>
          <span :style="tokenUsageStyle">{{ token.usage }}</span>
        </div>
      </div>
    `,
  }),
}

export const LineHeights: Story = {
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
      lineHeights,
      ...tokenTableStyles,
    }),
    template: `
      <div class="axis-typography-token-docs" :style="tokenListStyle">
        <div :style="tokenHeaderRowStyle">
          <span>Token</span>
          <span>Sample</span>
          <span>Use for</span>
        </div>
        <div
          v-for="token in lineHeights"
          :key="token.cssVar"
          :style="tokenComparisonRowStyle"
        >
          <span :style="tokenMetadataStyle">
            <strong style="color: var(--axis-color-text-primary); font-size: var(--axis-font-size-sm);">{{ token.name }}</strong>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ token.cssVar }}</code>
            <code style="color: var(--axis-color-text-secondary); font-size: var(--axis-font-size-xs);">{{ token.value }}</code>
          </span>
          <p :style="[tokenSampleStyle, { lineHeight: \`var(\${token.cssVar})\` }]">
            Typography should make dense product interfaces easier to scan, compare, and read across different screen sizes.
          </p>
          <span :style="tokenUsageStyle">{{ token.usage }}</span>
        </div>
      </div>
    `,
  }),
}
