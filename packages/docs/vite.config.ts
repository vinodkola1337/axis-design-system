import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const require = createRequire(import.meta.url)

export default defineConfig({
  plugins: [
    {
      name: 'storybook-mdx-file-url',
      enforce: 'pre',
      resolveId(source) {
        if (source.startsWith('file://')) {
          return fileURLToPath(source)
        }
      },
    },
    tailwindcss(),
    vue(),
  ],
  resolve: {
    alias: {
      '@storybook/addon-docs/blocks': require.resolve(
        '@storybook/addon-docs/blocks',
      ),
    },
  },
})
