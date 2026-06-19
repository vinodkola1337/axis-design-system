/// <reference types="vitest/config" />
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))
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
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
        }
      },
    ],
  },
})
