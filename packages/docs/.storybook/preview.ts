import type { Preview } from '@storybook/vue3-vite'
import '@vinodkola/axis-tokens/dist/tokens.css'
import '../../ui/src/styles/main.css'
import './preview.css'

const vueFrameworkArgTypes = ['key', 'ref', 'ref_for', 'ref_key', 'class', 'style']

const preview: Preview = {
  decorators: [
    () => ({
      template: '<div class="axis-story-frame"><story /></div>',
    }),
  ],
  parameters: {
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
    controls: {
      disableSaveFromUI: true,
      exclude: vueFrameworkArgTypes,
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      sort: 'requiredFirst',
    },
    docs: {
      argTypes: {
        exclude: vueFrameworkArgTypes,
      },
      source: {
        type: 'dynamic',
      },
      toc: {
        headingSelector: 'h2, h3',
      },
    },
    layout: 'centered',
  },
}

export default preview
