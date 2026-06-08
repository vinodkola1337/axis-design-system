import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    {
      name: 'axis-base-css',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'base.css',
          source: readFileSync(fileURLToPath(new URL('src/styles/base.css', import.meta.url)), 'utf8'),
        })
      },
    },
  ],
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL('src/index.ts', import.meta.url)),
        button: fileURLToPath(new URL('src/components/button/index.ts', import.meta.url)),
        icon: fileURLToPath(new URL('src/components/icon/index.ts', import.meta.url)),
        label: fileURLToPath(new URL('src/components/label/index.ts', import.meta.url)),
        'text-input': fileURLToPath(new URL('src/components/text-input/index.ts', import.meta.url)),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        assetFileNames: (assetInfo) => assetInfo.name === 'base.css' ? 'base[extname]' : 'style[extname]',
      },
    },
  },
})
