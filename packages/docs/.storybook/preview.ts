import type { Preview } from '@storybook/vue3'
import '@vinodkola/axis-tokens/dist/tokens.css'
import '@vinodkola/axis-ui/style.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
}

export default preview
