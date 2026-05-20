import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/*.ts'],
  dts: { tsgo: true },
  exports: true,
  deps: {
    onlyBundle: ['@antfu/utils', 'compare-versions'],
    neverBundle: [
      // dts
      'webpack',
      'esbuild',
      'rollup',
      'rolldown',
      'vite',
      '@nuxt/schema',
    ],
  },
})
