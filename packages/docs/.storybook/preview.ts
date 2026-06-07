import type { Preview } from '@storybook/vue3-vite'
import '@vinodkola/axis-tokens/dist/tokens.css'
import '@vinodkola/axis-ui/style.css'

const preview: Preview = {
  parameters: {
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
    controls: {
      disableSaveFromUI: true,
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      sort: 'requiredFirst',
    },
    docs: {
      source: {
        type: 'dynamic',
      },
    },
    layout: 'centered',
  },
}

export default preview
